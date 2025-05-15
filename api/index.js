import fs from 'fs';
import path from 'path';

// Fungsi untuk membaca data JSON
function getArticlesData() {
    const filePath = path.join(process.cwd(), 'data', 'articles.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
}

// Fungsi untuk menulis data JSON
function writeArticlesData(data) {
    const filePath = path.join(process.cwd(), 'data', 'articles.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export default function handler(req, res) {
    if (req.method === 'GET') {
        // Ambil semua artikel
        const data = getArticlesData();
        res.status(200).json(data.articles);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}