// app/page.js
import { supabase } from '../api/lib/supabase';
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

// Fungsi bantu: ambil <img src="..."> pertama dari konten artikel
function extractFirstImageSrc(content) {
    const match = content.match(/<img\s+[^>]*src=["']([^"']+)["']/);
    if (!match) return null;

    const rawSrc = match[1];
    if (rawSrc.startsWith('http') || rawSrc.startsWith('blob:') || rawSrc.startsWith('/')) {
        return rawSrc;
    }

    // kalau src dimulai dari "uploads/..." → jadi "/uploads/..."
    if (rawSrc.startsWith('uploads/')) {
        return '/' + rawSrc;
    }

    return rawSrc;
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
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching articles:', error);
        return [];
    }

    return data;
}

export default async function Home() {
    const articles = await getArticles();

    return (
        <div className="bg-amber-50 min-h-screen">
            <div className=" text-black mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Artikel Terbaru</h1>

                {articles.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">Belum ada artikel yang dipublikasikan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => {
                            // Extract the first image source for each article
                            const imageSrc = extractFirstImageSrc(article.content);

                            return (
                                <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="h-48 relative">
                                        {imageSrc ? (
                                            <Image
                                                src={imageSrc}
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
                                            <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                {article.category}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <Link href={`/artikel/${article.id}`}>
                                            <h2 className="text-xl font-bold mb-2 hover:text-blue-500 transition">{article.title}</h2>
                                        </Link>

                                        <div className="text-gray-500 text-sm mb-3">
                                            <span>{article.author}</span>
                                            <span className="mx-2">•</span>
                                            <span>{formatDate(article.created_at)}</span>
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
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}