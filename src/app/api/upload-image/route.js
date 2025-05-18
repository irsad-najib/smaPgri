import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { join } from 'path';

export async function POST(request) {
    try {
        // Get file from request
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { success: false, message: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Define upload directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // Create directory if it doesn't exist
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Create unique filename
        const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const filePath = join(uploadDir, fileName);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Return the URL for the saved image
        const imageUrl = `/uploads/${fileName}`;

        return NextResponse.json({
            success: true,
            location: imageUrl // TinyMCE expects the URL in 'location' field
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
            { success: false, message: 'Error uploading image' },
            { status: 500 }
        );
    }
}