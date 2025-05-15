import fs from 'fs';
import path from 'path';

// Fungsi untuk membaca data JSON
function getArticlesData() {
    const filePath = path.join(process.cwd(), 'data', 'articles.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
}

export default function handler(req, res) {
    const { slug } = req.query;

    if (req.method === 'GET') {
        // Ambil data artikel
        const data = getArticlesData();

        // Cari artikel berdasarkan slug
        const article = data.articles.find(article => article.slug === slug);

        if (!article) {
            return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        }

        res.status(200).json(article);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}