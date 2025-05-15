// app/api/delete/[id]/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'ID artikel tidak ditemukan' },
                { status: 400 }
            );
        }

        // Path ke file articles.json
        const dataPath = path.join(process.cwd(), 'data', 'articles.json');

        // Cek apakah file ada
        if (!existsSync(dataPath)) {
            return NextResponse.json(
                { success: false, message: 'Database artikel tidak ditemukan' },
                { status: 404 }
            );
        }

        // Baca dan parse file JSON
        const fileData = await fs.readFile(dataPath, 'utf8');
        const json = JSON.parse(fileData);

        // Cari artikel yang akan dihapus
        const articleIndex = json.articles.findIndex(article => article.id.toString() === id);

        if (articleIndex === -1) {
            return NextResponse.json(
                { success: false, message: 'Artikel tidak ditemukan' },
                { status: 404 }
            );
        }

        // Cek dan hapus file gambar jika ada
        const articleToDelete = json.articles[articleIndex];
        if (articleToDelete.imageUrl && articleToDelete.imageUrl.startsWith('/uploads/')) {
            const imagePath = path.join(process.cwd(), 'public', articleToDelete.imageUrl);

            if (existsSync(imagePath)) {
                await fs.unlink(imagePath);
            }
        }

        // Hapus artikel dari array
        json.articles.splice(articleIndex, 1);

        // Tulis kembali ke file
        await fs.writeFile(dataPath, JSON.stringify(json, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting article:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}