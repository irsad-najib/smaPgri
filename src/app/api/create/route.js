import { NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { join } from 'path';

export async function POST(request) {
    try {
        // In App Router, we need to use the FormData API
        const formData = await request.formData();

        // Extract form fields
        const title = formData.get('title');
        const author = formData.get('author') || 'Admin';
        const category = formData.get('category') || 'lainnya';
        const content = formData.get('content');

        // Validate required fields
        if (!title || !content) {
            return NextResponse.json(
                { success: false, message: 'Judul dan konten harus diisi' },
                { status: 400 }
            );
        }

        // Create new article object
        const newArticle = {
            id: Date.now(),
            title,
            author,
            category,
            content,
            createdAt: new Date().toISOString(),
        };

        // Load existing articles
        const dataPath = path.join(process.cwd(), 'data', 'articles.json');
        let json;

        try {
            // Make sure the data directory exists
            const dataDir = path.join(process.cwd(), 'data');
            if (!existsSync(dataDir)) {
                await mkdir(dataDir, { recursive: true });
            }

            // Try to read existing data file
            const fileData = await readFile(dataPath, 'utf8');
            json = JSON.parse(fileData);
        } catch (error) {
            // If file doesn't exist or is invalid, start with empty array
            json = { articles: [] };
        }

        // Add new article at the beginning
        json.articles.unshift(newArticle);

        // Save updated data
        await writeFile(dataPath, JSON.stringify(json, null, 2));

        try {
            // 1. Add file ke staging area
            await execAsync(`git add ${dataPath}`);

            // 2. Buat commit dengan pesan yang deskriptif
            const commitMessage = `Menambahkan artikel baru: ${title}`;
            await execAsync(`git commit -m "${commitMessage}"`);

            console.log('Git commit berhasil: artikel baru ditambahkan');

            // 3. Opsional: Push ke remote repository
            // Uncomment baris berikut jika ingin otomatis push
            await execAsync('git push origin main');  // Sesuaikan dengan branch yang Anda gunakan

        } catch (gitError) {
            console.error('Gagal melakukan Git commit:', gitError);
            // Kita tetap lanjutkan proses meski git commit gagal
        }

        return NextResponse.json({
            success: true,
            message: 'Artikel berhasil ditambahkan dan di-commit ke Git'
        });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}