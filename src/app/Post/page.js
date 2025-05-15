// app/page.js
import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';

// Format tanggal ke format Indonesia
function formatDate(dateString) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Fungsi untuk memotong konten artikel
function truncateContent(content, maxLength = 150) {
    // Hapus tag HTML
    const plainText = content.replace(/<[^>]+>/g, '');

    if (plainText.length <= maxLength) return plainText;

    // Potong teks dan tambahkan elipsis
    return plainText.substring(0, maxLength) + '...';
}

// Ambil data artikel dari file JSON
async function getArticles() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'articles.json');
        const data = await fs.readFile(filePath, 'utf8');
        const { articles } = JSON.parse(data);
        return articles;
    } catch (error) {
        console.error('Error reading articles:', error);
        return [];
    }
}

export default async function Home() {
    const articles = await getArticles();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Artikel Sekolah</h1>
                <Link
                    href="/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    Tambah Artikel Baru
                </Link>
            </div>

            {articles.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">Belum ada artikel yang dipublikasikan.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="h-48 relative">
                                {article.imageUrl ? (
                                    <Image
                                        src={article.imageUrl}
                                        alt={article.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <span className="text-gray-400">Tidak ada gambar</span>
                                    </div>
                                )}

                                {article.category && (
                                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                                        {article.category}
                                    </span>
                                )}
                            </div>

                            <div className="p-4">
                                <Link href={`/artikel/${article.id}`}>
                                    <h2 className="text-xl font-bold mb-2 hover:text-blue-600 transition">{article.title}</h2>
                                </Link>

                                <div className="text-gray-500 text-sm mb-3">
                                    <span>{article.author}</span>
                                    <span className="mx-2">•</span>
                                    <span>{formatDate(article.createdAt)}</span>
                                </div>

                                <div className="text-gray-600 mb-4">
                                    {truncateContent(article.content)}
                                </div>

                                <Link
                                    href={`/artikel/${article.id}`}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Baca selengkapnya →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}