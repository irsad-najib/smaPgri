// app/page.js
'use client';

import { db } from '../api/lib/firebaseConfig';
import { collection, getDocs, orderBy, query, limit, startAfter, where, Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const ARTICLES_PER_PAGE = 10; // Limit artikel per halaman

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

export default function Home() {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [lastDoc, setLastDoc] = useState(null);

    // Fungsi untuk mengambil kategori unik
    const getCategories = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'articles'));
            const uniqueCategories = [...new Set(
                snapshot.docs
                    .map(doc => {
                        const category = doc.data().category;
                        // Normalisasi kategori: trim whitespace
                        return category ? category.trim() : '';
                    })
                    .filter(category => category !== '')
            )];

            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fungsi untuk mengambil artikel dengan filter dan pagination
    const getArticles = async (categoryFilter = '', isLoadMore = false) => {
        try {
            let q;

            if (categoryFilter && categoryFilter !== '') {
                // Query dengan filter kategori - gunakan normalisasi yang konsisten
                q = query(
                    collection(db, 'articles'),
                    where('category', '==', categoryFilter.trim()),
                    orderBy('createdAt', 'desc'),
                    limit(ARTICLES_PER_PAGE)
                );
            } else {
                // Query tanpa filter kategori
                q = query(
                    collection(db, 'articles'),
                    orderBy('createdAt', 'desc'),
                    limit(ARTICLES_PER_PAGE)
                );
            }

            // Jika load more, mulai setelah dokumen terakhir
            if (isLoadMore && lastDoc) {
                if (categoryFilter && categoryFilter !== '') {
                    q = query(
                        collection(db, 'articles'),
                        where('category', '==', categoryFilter.trim()),
                        orderBy('createdAt', 'desc'),
                        startAfter(lastDoc),
                        limit(ARTICLES_PER_PAGE)
                    );
                } else {
                    q = query(
                        collection(db, 'articles'),
                        orderBy('createdAt', 'desc'),
                        startAfter(lastDoc),
                        limit(ARTICLES_PER_PAGE)
                    );
                }
            }

            const snapshot = await getDocs(q);
            const newArticles = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Normalisasi kategori saat mengambil data
                    category: data.category ? data.category.trim() : ''
                };
            });

            if (isLoadMore) {
                setArticles(prev => [...prev, ...newArticles]);
            } else {
                setArticles(newArticles);
            }

            // Set dokumen terakhir untuk pagination
            if (snapshot.docs.length > 0) {
                setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            }

            // Check apakah masih ada artikel lagi
            setHasMore(snapshot.docs.length === ARTICLES_PER_PAGE);

        } catch (error) {
            console.error('Error fetching articles:', error);
            setArticles([]);
        }
    };

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await getCategories();
            await getArticles();
            setLoading(false);
        };

        loadInitialData();
    }, []);

    // Handle category filter change
    const handleCategoryChange = async (category) => {
        setSelectedCategory(category);
        setLoading(true);
        setLastDoc(null);
        setHasMore(true);
        await getArticles(category);
        setLoading(false);
    };

    // Handle load more
    const handleLoadMore = async () => {
        setLoadingMore(true);
        await getArticles(selectedCategory, true);
        setLoadingMore(false);
    };

    // Debug: Log current state
    useEffect(() => {
        console.log('Current state:', {
            selectedCategory,
            articlesCount: articles.length,
            categories
        });
    }, [selectedCategory, articles, categories]);

    if (loading) {
        return (
            <div className="bg-amber-50 min-h-screen">
                <div className="text-black mx-auto px-4 py-8">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Memuat artikel...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-amber-50 min-h-screen">
            <div className="text-black mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Artikel Terbaru</h1>
                {/* Filter Kategori */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter berdasarkan kategori:
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tampilkan info filter aktif */}
                {selectedCategory && (
                    <div className="mb-4 p-3 bg-blue-100 rounded-lg">
                        <p className="text-blue-800">
                            Menampilkan artikel untuk kategori: <strong>{selectedCategory}</strong>
                            <button
                                onClick={() => handleCategoryChange('')}
                                className="ml-2 text-blue-600 hover:text-blue-800 underline"
                            >
                                Hapus filter
                            </button>
                        </p>
                    </div>
                )}

                {articles.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">
                            {selectedCategory
                                ? `Tidak ada artikel untuk kategori "${selectedCategory}".`
                                : 'Belum ada artikel yang dipublikasikan.'
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map((article) => {
                                const imageSrc = extractFirstImageSrc(article.content);

                                return (
                                    <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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

                                            {article.category && (
                                                <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                    {article.category}
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <Link href={`/artikel/${article.id}`}>
                                                <h2 className="text-xl font-bold mb-2 hover:text-blue-500 transition line-clamp-2">
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

                                            <Link
                                                href={`/artikel/${article.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                                            >
                                                Baca selengkapnya
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                >
                                    {loadingMore ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Memuat...
                                        </span>
                                    ) : (
                                        'Muat Artikel Lainnya'
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Info total artikel yang ditampilkan */}
                        <div className="text-center mt-4 text-gray-500 text-sm">
                            Menampilkan {articles.length} artikel
                            {selectedCategory && ` untuk kategori "${selectedCategory}"`}
                            {!hasMore && articles.length > ARTICLES_PER_PAGE && ' (semua artikel telah dimuat)'}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}