'use client';

import { db } from '../api/lib/firebaseConfig';
import { collection, getDocs, orderBy, query, limit, startAfter, where, Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ARTICLES_PER_PAGE = 10; // Limit artikel per halaman

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 50,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        y: -50,
        scale: 0.95,
        transition: { duration: 0.3 }
    }
};

const filterVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

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

    // Intersection Observer hooks
    const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true });
    const [filterRef, filterInView] = useInView({ threshold: 0.5, triggerOnce: true });
    const [articlesRef, articlesInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [loadMoreRef, loadMoreInView] = useInView({ threshold: 0.8, triggerOnce: false });

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

    // Auto load more when load more button comes into view
    useEffect(() => {
        if (loadMoreInView && hasMore && !loadingMore && !loading) {
            handleLoadMore();
        }
    }, [loadMoreInView, hasMore, loadingMore, loading]);

    if (loading) {
        return (
            <motion.div
                className="bg-amber-50 min-h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-black mx-auto px-4 py-8">
                    <div className="text-center py-20">
                        <motion.div
                            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.p
                            className="mt-4 text-gray-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Memuat artikel...
                        </motion.p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-amber-50 min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="text-black mx-auto px-4 py-8">
                {/* Header */}
                <motion.h1
                    ref={headerRef}
                    className="text-3xl font-bold mb-6"
                    variants={fadeInUp}
                    initial="hidden"
                    animate={headerInView ? "visible" : "hidden"}
                >
                    Artikel Terbaru
                </motion.h1>

                {/* Filter Kategori */}
                <motion.div
                    ref={filterRef}
                    className="mb-8"
                    variants={filterVariants}
                    initial="hidden"
                    animate={filterInView ? "visible" : "hidden"}
                >
                    <motion.label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        variants={fadeInLeft}
                    >
                        Filter berdasarkan kategori:
                    </motion.label>
                    <motion.select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        variants={fadeInLeft}
                        whileFocus={{ scale: 1.02 }}
                        whileHover={{ borderColor: "#3b82f6" }}
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </motion.select>
                </motion.div>

                {/* Tampilkan info filter aktif */}
                <AnimatePresence>
                    {selectedCategory && (
                        <motion.div
                            className="mb-4 p-3 bg-blue-100 rounded-lg"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="text-blue-800">
                                Menampilkan artikel untuk kategori: <strong>{selectedCategory}</strong>
                                <motion.button
                                    onClick={() => handleCategoryChange('')}
                                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Hapus filter
                                </motion.button>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {articles.length === 0 ? (
                    <motion.div
                        className="text-center py-10"
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className="text-gray-500 text-lg">
                            {selectedCategory
                                ? `Tidak ada artikel untuk kategori "${selectedCategory}".`
                                : 'Belum ada artikel yang dipublikasikan.'
                            }
                        </p>
                    </motion.div>
                ) : (
                    <>
                        {/* Articles Grid */}
                        <motion.div
                            ref={articlesRef}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={staggerContainer}
                            initial="hidden"
                            animate={articlesInView ? "visible" : "hidden"}
                        >
                            <AnimatePresence mode="wait">
                                {articles.map((article, index) => {
                                    const imageSrc = extractFirstImageSrc(article.content);

                                    return (
                                        <motion.div
                                            key={article.id}
                                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                            variants={cardVariants}
                                            whileHover={{
                                                y: -8,
                                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                                                transition: { duration: 0.3 }
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            layout
                                        >
                                            <motion.div
                                                className="h-48 relative overflow-hidden"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {imageSrc ? (
                                                    <img
                                                        src={imageSrc}
                                                        alt={article.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                        <span className="text-gray-400">Tidak ada gambar</span>
                                                    </div>
                                                )}

                                                {article.category && (
                                                    <motion.span
                                                        className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.5 }}
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        {article.category}
                                                    </motion.span>
                                                )}
                                            </motion.div>

                                            <div className="p-4">
                                                <Link href={`/artikel/${article.id}`}>
                                                    <motion.h2
                                                        className="text-xl font-bold mb-2 hover:text-blue-500 transition line-clamp-2"
                                                        whileHover={{ x: 5 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {article.title}
                                                    </motion.h2>
                                                </Link>

                                                <motion.div
                                                    className="text-gray-500 text-sm mb-3"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <span>{article.author}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{formatDate(article.createdAt)}</span>
                                                </motion.div>

                                                <motion.div
                                                    className="text-gray-600 mb-4"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.4 }}
                                                >
                                                    {truncateContent(article.content)}
                                                </motion.div>

                                                <Link href={`/artikel/${article.id}`}>
                                                    <motion.div
                                                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                                                        whileHover={{ x: 5 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        Baca selengkapnya
                                                        <motion.svg
                                                            className="w-4 h-4 ml-1"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            whileHover={{ x: 3 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </motion.svg>
                                                    </motion.div>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>

                        {/* Load More Button */}
                        {hasMore && (
                            <motion.div
                                ref={loadMoreRef}
                                className="text-center mt-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <motion.button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={loadingMore ? { opacity: 0.7 } : { opacity: 1 }}
                                >
                                    {loadingMore ? (
                                        <span className="flex items-center justify-center">
                                            <motion.div
                                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                            Memuat...
                                        </span>
                                    ) : (
                                        'Muat Artikel Lainnya'
                                    )}
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Info total artikel */}
                        <motion.div
                            className="text-center mt-4 text-gray-500 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            Menampilkan {articles.length} artikel
                            {selectedCategory && ` untuk kategori "${selectedCategory}"`}
                            {!hasMore && articles.length > ARTICLES_PER_PAGE && ' (semua artikel telah dimuat)'}
                        </motion.div>
                    </>
                )}
            </div>
        </motion.div>
    );
}