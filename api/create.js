export const config = {
    api: {
        bodyParser: false,
    },
};

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const form = new formidable.IncomingForm({
            keepExtensions: true,
            uploadDir: path.join(process.cwd(), '/public/uploads'), // target upload
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ success: false, message: 'Parsing error' });
            }

            console.log('FIELDS:', fields);
            console.log('FILES:', files);

            let imageUrl = '';
            const uploadedFile = files.image?.[0] || files.image;

            if (uploadedFile) {
                const fileName = uploadedFile.originalFilename || uploadedFile.newFilename;
                const destPath = path.join(process.cwd(), '/public/uploads', fileName);
                await fs.promises.rename(uploadedFile.filepath, destPath);
                imageUrl = `/uploads/${fileName}`;
            }

            const newArticle = {
                id: Date.now(),
                title: fields.title,
                author: fields.author || 'Admin',
                category: fields.category || 'lainnya',
                content: fields.content,
                imageUrl,
                createdAt: new Date().toISOString(),
            };

            const dataPath = path.join(process.cwd(), '/data/articles.json');
            const fileData = await fs.promises.readFile(dataPath, 'utf8');
            const json = JSON.parse(fileData || '{"articles": []}');

            json.articles.unshift(newArticle);
            await fs.promises.writeFile(dataPath, JSON.stringify(json, null, 2));

            res.status(200).json({ success: true });
        });
    } catch (err) {
        console.error('API handler error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
