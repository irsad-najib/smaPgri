// app/admin/page.js (atau sesuai struktur folder Anda)
'use client';
import { useEffect, useState } from 'react';
import { db } from '../api/lib/firebaseConfig';
import { collection, getDocs, orderBy, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';

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

function extractFirstImageSrc(content) {
    const match = content.match(/<img\s+[^>]*src=["']([^"']+)["']/);
    if (!match) return null;

    const rawSrc = match[1];
    if (rawSrc.startsWith('http') || rawSrc.startsWith('blob:') || rawSrc.startsWith('/')) {
        return rawSrc;
    }

    if (rawSrc.startsWith('uploads/')) {
        return '/' + rawSrc;
    }

    return rawSrc;
}

function truncateContent(content, maxLength = 150) {
    const plainText = content.replace(/<[^>]+>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
}

export default function PostAdmin() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' atau 'desc'
    const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt', 'title', 'author'

    // Fetch articles dengan sorting
    const getArticles = async () => {
        try {
            let q;
            if (sortBy === 'createdAt') {
                q = query(collection(db, 'articles'), orderBy('createdAt', sortOrder));
            } else if (sortBy === 'title') {
                q = query(collection(db, 'articles'), orderBy('title', sortOrder));
            } else if (sortBy === 'author') {
                q = query(collection(db, 'articles'), orderBy('author', sortOrder));
            }

            const snapshot = await getDocs(q);
            const articlesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setArticles(articlesData);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    // Toggle featured status
    const handleToggleFeatured = async (articleId, currentStatus) => {
        try {
            await updateDoc(doc(db, 'articles', articleId), {
                isFeatured: !currentStatus
            });

            // Update local state
            setArticles(articles.map(article =>
                article.id === articleId
                    ? { ...article, isFeatured: !currentStatus }
                    : article
            ));

            alert(`Artikel ${!currentStatus ? 'ditambahkan ke' : 'dihapus dari'} halaman utama!`);
        } catch (error) {
            console.error('Error updating featured status:', error);
            alert('Gagal mengubah status artikel. Silakan coba lagi.');
        }
    };

    // Delete article function
    const handleDeleteArticle = async (articleId, articleTitle) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus artikel "${articleTitle}"?`)) {
            try {
                await deleteDoc(doc(db, 'articles', articleId));
                setArticles(articles.filter(article => article.id !== articleId));
                alert('Artikel berhasil dihapus!');
            } catch (error) {
                console.error('Error deleting article:', error);
                alert('Gagal menghapus artikel. Silakan coba lagi.');
            }
        }
    };

    // Handle sorting change
    const handleSortChange = (newSortBy, newSortOrder) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    useEffect(() => {
        getArticles();
    }, [sortBy, sortOrder]);

    if (loading) {
        return (
            <div className="bg-amber-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat artikel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-amber-50 min-h-screen">
            <div className="text-black mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Kelola Artikel</h1>
                    <Link
                        href="/postArtikel"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                        + Tambah Artikel
                    </Link>
                </div>

                {/* Sorting Controls */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <h3 className="text-lg font-semibold mb-3">Pengurutan Artikel</h3>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Urutkan berdasarkan:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value, sortOrder)}
                                className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="createdAt">Tanggal Dibuat</option>
                                <option value="title">Judul</option>
                                <option value="author">Penulis</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Urutan:</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => handleSortChange(sortBy, e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="desc">Terbaru ke Terlama</option>
                                <option value="asc">Terlama ke Terbaru</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700">Total Artikel</h3>
                        <p className="text-2xl font-bold text-blue-600">{articles.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700">Tampil di Beranda (Di sarankan Maksimal 3 Artikel)</h3>
                        <p className="text-2xl font-bold text-green-600">
                            {articles.filter(article => article.isFeatured).length}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700">Kategori Unik</h3>
                        <p className="text-2xl font-bold text-purple-600">
                            {[...new Set(articles.map(article => article.category).filter(Boolean))].length}
                        </p>
                    </div>
                </div>

                {articles.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">Belum ada artikel yang dipublikasikan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => {
                            const imageSrc = extractFirstImageSrc(article.content);

                            return (
                                <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="h-48 relative">
                                        {imageSrc ? (
                                            <img
                                                src={imageSrc}
                                                alt={article.title}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                <span className="text-gray-400">Tidak ada gambar</span>
                                            </div>
                                        )}

                                        {/* Featured Badge */}
                                        {article.isFeatured && (
                                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                ★ FEATURED
                                            </span>
                                        )}

                                        {article.category && (
                                            <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                {article.category}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <Link href={`/artikel/${article.id}`}>
                                            <h2 className="text-xl font-bold mb-2 hover:text-blue-500 transition cursor-pointer line-clamp-2">
                                                {article.title}
                                            </h2>
                                        </Link>

                                        <div className="text-gray-500 text-sm mb-3">
                                            <span>{article.author}</span>
                                            <span className="mx-2">•</span>
                                            <span>{formatDate(article.createdAt)}</span>
                                        </div>

                                        <div className="text-gray-600 mb-4">
                                            {truncateContent(article.content)}
                                        </div>

                                        {/* Featured Toggle */}
                                        <div className="mb-4 p-2 bg-gray-50 rounded">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={article.isFeatured || false}
                                                    onChange={() => handleToggleFeatured(article.id, article.isFeatured)}
                                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    Tampilkan di halaman utama
                                                </span>
                                            </label>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <Link
                                                href={`/artikel/${article.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Baca selengkapnya →
                                            </Link>

                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/editArtikel/${article.id}`}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteArticle(article.id, article.title)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
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