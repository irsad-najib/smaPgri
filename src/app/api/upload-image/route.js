// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/app/api/lib/supabase';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { success: false, message: 'Tidak ada file yang diunggah' },
                { status: 400 }
            );
        }

        const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Upload error:', error);
            return NextResponse.json(
                { success: false, message: 'Gagal mengunggah gambar' },
                { status: 500 }
            );
        }

        const { data: publicUrl } = supabase
            .storage
            .from('uploads')
            .getPublicUrl(fileName);

        return NextResponse.json({
            success: true,
            location: publicUrl.publicUrl // Untuk TinyMCE
        });
    } catch (error) {
        console.error('Unexpected upload error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan saat upload' },
            { status: 500 }
        );
    }
}
