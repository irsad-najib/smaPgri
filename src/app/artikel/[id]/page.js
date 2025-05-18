// app/artikel/[id]/page.js
import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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

// Ambil semua artikel
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

// Ambil artikel berdasarkan ID
async function getArticleById(id) {
    const articles = await getArticles();
    const article = articles.find(article => article.id.toString() === id);
    return article;
}

// Generate metadata untuk artikel
export async function generateMetadata({ params }) {
    const article = await getArticleById(params.id);

    if (!article) {
        return {
            title: 'Artikel Tidak Ditemukan',
        };
    }

    return {
        title: `${article.title} | Website Sekolah`,
        description: article.content.replace(/<[^>]+>/g, '').substring(0, 160),
    };
}

export default async function ArticleDetail({ params }) {
    const article = await getArticleById(params.id);

    if (!article) {
        notFound();
    }

    return (
        <div className="bg-amber-50 min-h-screen mx-auto px-4 py-8">
            <Link href="/Post" className="text-black hover:text-blue-800 mb-6 inline-block">
                ← Kembali ke daftar artikel
            </Link>

            <article className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md text-black">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

                    <div className="flex justify-between items-center text-gray-600 mb-4">
                        <div>
                            <span className="font-medium">{article.author}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(article.createdAt)}</span>
                        </div>

                        {article.category && (
                            <span className="bg-yellow-500 text-white text-sm px-3 py-1 rounded-full">
                                {article.category}
                            </span>
                        )}
                    </div>
                </header>

                {article.imageUrl && (
                    <div className="mb-8 relative w-full h-80">
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                )}

                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </article>
        </div>
    );
}