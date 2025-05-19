// app/api/artikel/route.js
import { NextResponse } from 'next/server';
import { supabase } from '../lib/supabase';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title');
        const author = formData.get('author') || 'Admin';
        const category = formData.get('category') || 'lainnya';
        const content = formData.get('content');

        if (!title || !content) {
            return NextResponse.json(
                { success: false, message: 'Judul dan konten harus diisi' },
                { status: 400 }
            );
        }

        const { error } = await supabase.from('articles').insert({
            id: Date.now(),
            title,
            author,
            category,
            content
        });

        if (error) {
            console.error('Error inserting to Supabase:', error);
            return NextResponse.json(
                { success: false, message: 'Gagal menyimpan artikel' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Artikel berhasil disimpan ke Supabase'
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}
