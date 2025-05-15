// app/api/create/route.js
import { NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { join } from 'path';

// Helper function to save uploaded file
async function saveFile(file, uploadDir) {
    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const filePath = join(uploadDir, fileName);

    // Save the file
    await writeFile(filePath, buffer);
    return `/uploads/${fileName}`;
}

export async function POST(request) {
    try {
        // In App Router, we need to use the FormData API
        const formData = await request.formData();

        // Extract form fields
        const title = formData.get('title');
        const author = formData.get('author') || 'Admin';
        const category = formData.get('category') || 'lainnya';
        const content = formData.get('content');
        const imageFile = formData.get('image');

        // Validate required fields
        if (!title || !content) {
            return NextResponse.json(
                { success: false, message: 'Judul dan konten harus diisi' },
                { status: 400 }
            );
        }

        // Process image if provided
        let imageUrl = '';
        if (imageFile && imageFile instanceof File) {
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            imageUrl = await saveFile(imageFile, uploadDir);
        }

        // Create new article object
        const newArticle = {
            id: Date.now(),
            title,
            author,
            category,
            content,
            imageUrl,
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

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}