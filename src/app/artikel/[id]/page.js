"use client";
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/app/api/lib/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
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

const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

const slideInFromTop = {
    hidden: { opacity: 0, y: -30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

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

export default function ArticlePage({ params }) {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Intersection Observer hooks
    const [backButtonRef, backButtonInView] = useInView({ threshold: 0.5, triggerOnce: true });
    const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true });
    const [imageRef, imageInView] = useInView({ threshold: 0.2, triggerOnce: true });
    const [contentRef, contentInView] = useInView({ threshold: 0.1, triggerOnce: true });

    useEffect(() => {
        async function fetchArticle() {
            try {
                setLoading(true);

                // Handle params properly
                const resolvedParams = await Promise.resolve(params);
                const id = resolvedParams.id;

                const articleData = await getArticleById(id);

                if (!articleData) {
                    setError(true);
                    return;
                }

                setArticle(articleData);
            } catch (err) {
                console.error('Error fetching article:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchArticle();
    }, [params]);

    if (loading) {
        return (
            <motion.div
                className="bg-amber-50 min-h-screen mx-auto px-4 py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <motion.div
                            className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.p
                            className="mt-4 text-gray-600 text-lg"
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

    if (error || !article) {
        return (
            <motion.div
                className="bg-amber-50 min-h-screen mx-auto px-4 py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-center min-h-[60vh]">
                    <motion.div
                        className="text-center"
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Artikel Tidak Ditemukan</h1>
                        <p className="text-gray-600 mb-6">Maaf, artikel yang Anda cari tidak dapat ditemukan.</p>
                        <Link href="/Post">
                            <motion.button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Kembali ke Daftar Artikel
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-amber-50 min-h-screen mx-auto px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Back Button */}
            <motion.div
                ref={backButtonRef}
                variants={slideInFromTop}
                initial="hidden"
                animate={backButtonInView ? "visible" : "hidden"}
                className="mb-6"
            >
                <Link href="/Post">
                    <motion.div
                        className="text-black hover:text-blue-800 inline-flex items-center group"
                        whileHover={{ x: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.svg
                            className="w-5 h-5 mr-2 group-hover:animate-pulse"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            whileHover={{ x: -3 }}
                            transition={{ duration: 0.2 }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </motion.svg>
                        Kembali ke daftar artikel
                    </motion.div>
                </Link>
            </motion.div>

            {/* Article Container */}
            <motion.article
                className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md text-black"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                whileHover={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Header Section */}
                <motion.header
                    ref={headerRef}
                    className="mb-8"
                    variants={staggerContainer}
                    initial="hidden"
                    animate={headerInView ? "visible" : "hidden"}
                >
                    {/* Title */}
                    <motion.h1
                        className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
                        variants={fadeInUp}
                    >
                        {article.title}
                    </motion.h1>

                    {/* Meta Information */}
                    <motion.div
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-gray-600 mb-4 gap-3"
                        variants={fadeInUp}
                    >
                        <motion.div
                            variants={fadeInLeft}
                            className="flex items-center"
                        >
                            <motion.span
                                className="font-medium"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                {article.author}
                            </motion.span>
                            <span className="mx-2">•</span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                {formatDate(article.createdAt)}
                            </motion.span>
                        </motion.div>

                        {article.category && (
                            <motion.span
                                className="bg-yellow-500 text-white text-sm px-3 py-1 rounded-full w-fit"
                                variants={fadeInRight}
                                whileHover={{
                                    scale: 1.1,
                                    backgroundColor: "#f59e0b"
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                {article.category}
                            </motion.span>
                        )}
                    </motion.div>
                </motion.header>

                {/* Featured Image */}
                {article.imageUrl && (
                    <motion.div
                        ref={imageRef}
                        className="mb-8 overflow-hidden rounded-lg"
                        variants={scaleIn}
                        initial="hidden"
                        animate={imageInView ? "visible" : "hidden"}
                    >
                        <motion.img
                            src={article.imageUrl.startsWith('http') ? article.imageUrl : `https://${article.imageUrl}`}
                            alt={article.title}
                            className="w-full h-auto object-cover max-h-80 transition-transform duration-500"
                            whileHover={{ scale: 1.02 }}
                            onError={(e) => {
                                console.error("Image load failed");
                                e.target.style.display = "none";
                            }}
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        />
                    </motion.div>
                )}

                {/* Article Content */}
                <motion.div
                    ref={contentRef}
                    className="prose prose-lg max-w-none"
                    variants={fadeInUp}
                    initial="hidden"
                    animate={contentInView ? "visible" : "hidden"}
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Article Footer */}
                <motion.div
                    className="mt-12 pt-8 border-t border-gray-200"
                    variants={fadeInUp}
                    initial="hidden"
                    animate={contentInView ? "visible" : "hidden"}
                    transition={{ delay: 0.5 }}
                >
                    <motion.div
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInLeft}>
                            <p className="text-gray-500 text-sm">
                                Terakhir diperbarui: {formatDate(article.updatedAt || article.createdAt)}
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeInRight}
                            className="flex gap-3"
                        >
                            <Link href="/Post">
                                <motion.button
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Artikel Lainnya
                                </motion.button>
                            </Link>

                            <motion.button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Ke Atas
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.article>

            {/* Floating Back to Top Button */}
            <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-10"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ delay: 1, duration: 0.3 }}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </motion.button>
        </motion.div>
    );
}