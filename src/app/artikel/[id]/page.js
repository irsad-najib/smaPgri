// app/artikel/[id]/page.js
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/app/api/lib/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';

// Format tanggal ke format Indonesia
function formatDate(timestamp) {
    if (!timestamp || !timestamp.toDate) return '-';

    const date = timestamp.toDate();
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function getArticleById(id) {
    const ref = doc(db, 'articles', id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
        console.error('Article not found');
        return null;
    }

    return { id: snapshot.id, ...snapshot.data() };
}

// Fungsi ini memastikan params sudah siap digunakan
async function getParams(params) {
    // Dengan melakukan await pada fungsi kosong ini, 
    // Next.js akan menunggu params tersedia sebelum menggunakannya
    await Promise.resolve();
    return params;
}

export default async function ArticlePage({ params }) {
    // Gunakan fungsi untuk memastikan params sudah tersedia
    const resolvedParams = await getParams(params);
    const id = resolvedParams.id;

    // Sekarang gunakan ID yang sudah di-resolve
    const article = await getArticleById(id);

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

                {/* Gunakan img standar sebagai alternatif jika ada masalah dengan Image */}
                {article.imageUrl && (
                    <div className="mb-8">
                        <img
                            src={article.imageUrl.startsWith('http') ? article.imageUrl : `https://${article.imageUrl}`}
                            alt={article.title}
                            className="w-full h-auto rounded-lg object-cover max-h-80"
                            onError={(e) => {
                                console.error("Image load failed");
                                e.target.style.display = "none";
                            }}
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