"use client";
import Link from 'next/link';
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

const fadeInDown = {
    hidden: { opacity: 0, y: -40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
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
            staggerChildren: 0.3,
            delayChildren: 0.2
        }
    }
};

const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
    }
};

const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
    }
};

export default function ArticleNotFound() {
    // Intersection Observer hooks
    const [containerRef, containerInView] = useInView({
        threshold: 0.3,
        triggerOnce: true
    });

    return (
        <motion.div
            className='bg-amber-50 min-h-screen text-black scroll-mt-20'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div
                ref={containerRef}
                className="bg-amber-50 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen"
                variants={staggerContainer}
                initial="hidden"
                animate={containerInView ? "visible" : "hidden"}
            >
                {/* 404 Icon/Illustration */}
                <motion.div
                    className="mb-8"
                    variants={scaleIn}
                    animate={floatingAnimation}
                >
                    <div className="relative">
                        <motion.div
                            className="text-8xl md:text-9xl font-bold text-yellow-500/20"
                            animate={pulseAnimation}
                        >
                            404
                        </motion.div>
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <svg
                                className="w-20 h-20 md:w-24 md:h-24 text-yellow-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                                <motion.path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, delay: 0.5 }}
                                />
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    className="text-3xl md:text-4xl font-bold mb-4 text-center"
                    variants={fadeInDown}
                >
                    Artikel Tidak Ditemukan
                </motion.h1>

                {/* Description */}
                <motion.p
                    className="text-lg text-gray-600 mb-8 text-center max-w-md"
                    variants={fadeInUp}
                >
                    Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.
                </motion.p>

                {/* Additional helpful text */}
                <motion.div
                    className="mb-8 text-center"
                    variants={fadeInUp}
                >
                    <p className="text-gray-500 text-sm mb-2">
                        Mungkin artikel tersebut telah dipindahkan atau URL-nya salah?
                    </p>
                    <p className="text-gray-500 text-sm">
                        Coba kembali ke beranda untuk mencari artikel lainnya.
                    </p>
                </motion.div>

                {/* Navigation Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4"
                    variants={fadeInUp}
                >
                    {/* Home Button */}
                    <Link href="/">
                        <motion.div
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-md font-medium transition-colors inline-flex items-center justify-center"
                            whileHover={{
                                scale: 1.05,
                                y: -2,
                                boxShadow: "0 10px 25px -3px rgba(217, 119, 6, 0.3)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                whileHover={{ x: -3 }}
                                transition={{ duration: 0.2 }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </motion.svg>
                            Kembali ke Beranda
                        </motion.div>
                    </Link>

                    {/* Articles List Button */}
                    <Link href="/artikel">
                        <motion.div
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors inline-flex items-center justify-center"
                            whileHover={{
                                scale: 1.05,
                                y: -2,
                                boxShadow: "0 10px 25px -3px rgba(37, 99, 235, 0.3)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                whileHover={{ rotate: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                            </motion.svg>
                            Lihat Semua Artikel
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Decorative Elements */}
                <motion.div
                    className="mt-12 opacity-30"
                    variants={fadeInUp}
                    transition={{ delay: 1 }}
                >
                    <motion.div
                        className="flex space-x-2"
                        animate={{
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {[1, 2, 3].map((dot, index) => (
                            <motion.div
                                key={dot}
                                className="w-2 h-2 bg-yellow-500 rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: index * 0.2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>

                {/* Background Decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-20 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20"
                        animate={{
                            y: [0, -20, 0],
                            x: [0, 10, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-32 right-16 w-16 h-16 bg-blue-200 rounded-full opacity-20"
                        animate={{
                            y: [0, 15, 0],
                            x: [0, -15, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    />
                    <motion.div
                        className="absolute top-1/2 right-1/4 w-12 h-12 bg-yellow-300 rounded-full opacity-10"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                        }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}