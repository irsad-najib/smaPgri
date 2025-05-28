"use client";
import Image from 'next/image';
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
    hidden: { opacity: 0, scale: 0.9 },
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

const textReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

export default function Sambutan() {
    // Intersection Observer hooks
    const [containerRef, containerInView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });
    const [imageRef, imageInView] = useInView({
        threshold: 0.3,
        triggerOnce: true
    });
    const [contentRef, contentInView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <motion.div
            className="bg-amber-50 mx-auto px-4 py-16 scroll-mt-20 text-black items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div
                className="container mx-auto max-w-4xl bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center"
                ref={containerRef}
                variants={scaleIn}
                initial="hidden"
                animate={containerInView ? "visible" : "hidden"}
                whileHover={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    y: -5
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Image Section */}
                <motion.div
                    ref={imageRef}
                    variants={fadeInDown}
                    initial="hidden"
                    animate={imageInView ? "visible" : "hidden"}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex justify-center items-center"
                >
                    <Image
                        src="/kepala_sekolah.jpg"
                        alt="Sambutan Kepala Sekolah"
                        width={500}
                        height={300}
                        className="w-2/6 h-auto object-cover rounded-lg my-12 shadow-lg"
                    />
                </motion.div>

                {/* Content Section */}
                <motion.div
                    ref={contentRef}
                    variants={staggerContainer}
                    initial="hidden"
                    animate={contentInView ? "visible" : "hidden"}
                    className="w-full"
                >
                    {/* Title */}
                    <motion.h1
                        className="text-4xl font-bold mb-12 text-center"
                        variants={textReveal}
                    >
                        Sambutan Kepala Sekolah
                    </motion.h1>

                    {/* Main Content */}
                    <motion.div
                        variants={textReveal}
                        className="space-y-6"
                    >
                        <motion.p
                            className="text-lg text-gray-600 leading-relaxed text-justify"
                            variants={textReveal}
                        >
                            Assalamualaikum warahmatullahi wabarakatuh
                        </motion.p>

                        <motion.p
                            className="text-lg text-gray-600 leading-relaxed text-justify"
                            variants={textReveal}
                        >
                            Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa atas limpahan rahmat dan karunia-Nya sehingga Website Resmi SMA PGRI 1 Gombong ini dapat hadir sebagai media informasi, komunikasi, dan publikasi sekolah kepada seluruh masyarakat.
                        </motion.p>

                        <motion.p
                            className="text-lg text-gray-600 leading-relaxed text-justify"
                            variants={textReveal}
                        >
                            Website ini merupakan sarana untuk memperkenalkan profil sekolah, visi dan misi, kegiatan akademik dan non-akademik, serta prestasi yang telah diraih oleh peserta didik dan civitas akademika SMA PGRI 1 Gombong. Harapan kami, keberadaan website ini mampu memberikan manfaat nyata, baik bagi siswa, guru, orang tua, maupun masyarakat umum dalam menjalin hubungan yang lebih erat dan transparan.
                        </motion.p>

                        <motion.p
                            className="text-lg text-gray-600 leading-relaxed text-justify"
                            variants={textReveal}
                        >
                            Sebagai lembaga pendidikan, SMA PGRI 1 Gombong berkomitmen untuk terus berinovasi dalam mewujudkan pendidikan yang bermutu, berkarakter, dan berbasis teknologi. Semoga dengan dukungan semua pihak, website ini dapat berkembang secara dinamis sesuai kebutuhan zaman dan menjadi media pembelajaran serta inspirasi bagi semua pihak yang mengaksesnya.
                        </motion.p>

                        <motion.p
                            className="text-lg text-gray-600 leading-relaxed text-justify"
                            variants={textReveal}
                        >
                            Akhir kata, kami mengucapkan terima kasih kepada seluruh tim pengelola website dan semua pihak yang telah berkontribusi. Saran dan kritik yang membangun sangat kami harapkan demi perbaikan dan kemajuan bersama.
                        </motion.p>

                        <motion.p
                            className="text-lg text-gray-600 leading-relaxed text-justify"
                            variants={textReveal}
                        >
                            Wassalamu'alaikum warahmatullahi wabarakatuh.
                        </motion.p>
                    </motion.div>

                    {/* Signature Section */}
                    <motion.div
                        className="mt-12 pt-8 border-t border-gray-200"
                        variants={textReveal}
                    >
                        <motion.p
                            className="text-lg text-gray-600 leading-relaxed text-left"
                            variants={fadeInUp}
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            Kepala Sekolah SMA PGRI 1 Gombong
                        </motion.p>

                        <motion.div
                            className="mt-8"
                            variants={fadeInUp}
                        >
                            <motion.p
                                className="text-lg font-semibold text-gray-800"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                Dwi Suheni, S.Pd.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}