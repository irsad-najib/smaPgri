"use client";
import React, { useState, useEffect } from "react";
import { MapPin, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import { FeedbackForm } from './component/FeedbackFrom.js';
import emailjs from '@emailjs/browser';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { db } from './api/lib/firebaseConfig';
import { collection, getDocs, orderBy, query, where, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from "next/link";

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

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
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
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

function formatDate(timestamp) {
  if (!timestamp) return '-';

  // Handle different timestamp formats
  let date;
  if (timestamp.toDate) {
    date = timestamp.toDate();
  } else if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return '-';
  }

  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function extractFirstImageSrc(content) {
  if (!content) return null;

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
  if (!content) return '';
  const plainText = content.replace(/<[^>]+>/g, '');
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
}

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Intersection Observer hooks for different sections
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [newsRef, newsInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [profileRef, profileInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [visionRef, visionInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [facilitiesRef, facilitiesInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [principalRef, principalInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [testimoniRef, testimoniInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [contactRef, contactInView] = useInView({ threshold: 0.2, triggerOnce: true });

  const GoogleMapEmbed = () => (
    <div className="w-full h-64">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4691.090390946916!2d109.5035156757479!3d-7.604525275164585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e654b8e15b77139%3A0x6ed0a41091a13920!2sSMA%20PGRI%201%20Gombong!5e1!3m2!1sid!2sid!4v1747057153036!5m2!1sid!2sid"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );

  const emailjsConfig = {
    serviceId: 'service_azx64n8',
    templateId: 'template_gq2pg5p',
    publicKey: 'NG7D69F5FkLzXpMsR'
  };

  // Initialize EmailJS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      emailjs.init(emailjsConfig.publicKey);
    }
  }, []);

  const facilitiesImages = [
    { id: 1, src: "/fasilitas/lab_komputer.jpg", name: "Laboratorium Komputer" },
    { id: 2, src: "/fasilitas/Laboratorium-IPA.jpg", name: "Laboratorium IPA" },
    { id: 3, src: "/fasilitas/Perpustakaan.jpg", name: "Perpustakaan" },
  ];

  const extracurricularImages = [
    { id: 1, src: "/ekstrakurikuler/Futsal.jpg", name: "Futsal" },
    { id: 2, src: "/ekstrakurikuler/Pramuka.jpg", name: "Pramuka" },
    { id: 3, src: "/ekstrakurikuler/Komputer.jpg", name: "Komputer" },
    { id: 4, src: "/ekstrakurikuler/seni-musik.jpg", name: "Seni Musik" },
    { id: 5, src: "/ekstrakurikuler/stir-mobil.jpg", name: "Stir Mobil" },
    { id: 6, src: "/ekstrakurikuler/Tata Boga.jpg", name: "Tata Boga" },
  ];

  const getFeaturedArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create the query with proper error handling
      const articlesRef = collection(db, 'articles');

      // Try to get featured articles first
      let q;
      try {
        q = query(
          articlesRef,
          where('isFeatured', '==', true),
          orderBy('createdAt', 'desc'),
          limit(6) // Limit to prevent too many results
        );
      } catch (indexError) {
        console.warn('Index not available for featured articles, falling back to simple query:', indexError);
        // Fallback to simple query without orderBy if index doesn't exist
        q = query(
          articlesRef,
          where('isFeatured', '==', true),
          limit(6)
        );
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log('No featured articles found, trying to get recent articles instead');
        // If no featured articles, get recent articles
        try {
          q = query(
            articlesRef,
            orderBy('createdAt', 'desc'),
            limit(6)
          );
          const recentSnapshot = await getDocs(q);
          const articlesData = recentSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setFeaturedArticles(articlesData);
        } catch (recentError) {
          console.warn('Could not fetch recent articles:', recentError);
          setFeaturedArticles([]);
        }
      } else {
        const articlesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFeaturedArticles(articlesData);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Gagal memuat artikel. Silakan coba lagi nanti.');
      setFeaturedArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeaturedArticles();
  }, []);

  const renderArticleSection = () => {
    if (loading) {
      return (
        <motion.div
          className="flex items-center justify-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            ></motion.div>
            <p className="mt-4 text-gray-600">Memuat artikel...</p>
          </div>
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div
          className="flex items-center justify-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={getFeaturedArticles}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Coba Lagi
            </button>
          </div>
        </motion.div>
      );
    }

    if (featuredArticles.length === 0) {
      return (
        <motion.div
          className="flex items-center justify-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gray-600">Belum ada artikel yang tersedia.</p>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="space-y-12"
        initial={{ opacity: 1 }} // Ubah dari 0 ke 1
        animate={{ opacity: 1 }}  // Pastikan selalu terlihat
        transition={{ duration: 0.6 }}
      >
        {featuredArticles.map((article, index) => {
          const isImageLeft = index % 2 === 0;
          return (
            <motion.div
              key={article.id}
              className={`flex flex-col md:flex-row items-center gap-8 ${isImageLeft ? '' : 'md:flex-row-reverse'}`}
              initial={{ opacity: 0, y: 50 }}
              animate={newsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Gambar */}
              <motion.div
                className="md:w-1/2 w-full h-64 relative"
                initial={{ opacity: 0, x: isImageLeft ? -50 : 50 }}
                animate={newsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isImageLeft ? -50 : 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={extractFirstImageSrc(article.content) || '/logo_sekolah.jpg'}
                  alt={article.title || 'Article image'}
                  className="object-cover rounded-lg shadow w-full h-full"
                />
              </motion.div>

              {/* Teks */}
              <motion.div
                className="md:w-1/2 w-full space-y-4 text-justify"
                initial={{ opacity: 0, x: isImageLeft ? 50 : -50 }}
                animate={newsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isImageLeft ? 50 : -50 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
              >
                <h2 className="text-2xl font-bold">{article.title || 'Untitled'}</h2>
                <p className="text-sm text-gray-500">{formatDate(article.createdAt)}</p>
                <p className="text-gray-700">{truncateContent(article.content)}</p>
                <Link
                  href={`/artikel/${article.id}`}
                  className="inline-block text-blue-500 hover:underline transition-colors duration-300"
                >
                  Baca Selengkapnya
                </Link>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  const SwiperCarousel = ({ images, title }) => (
    <motion.div
      className="relative w-full mx-auto group flex flex-col items"
      variants={scaleIn}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-center text-2xl font-bold my-4">{title}</h2>
      <div className="relative w-64 mx-auto flex flex-col items-center">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            nextEl: `.swiper-button-next-${title.toLowerCase().replace(' ', '-')}`,
            prevEl: `.swiper-button-prev-${title.toLowerCase().replace(' ', '-')}`,
          }}
          pagination={{
            clickable: true,
            el: `.swiper-pagination-${title.toLowerCase().replace(' ', '-')}`,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="w-full h-auto rounded-lg"
        >
          {images.map((image) => (
            <SwiperSlide key={image.id}>
              <div className="relative w-full h-64">
                <Image
                  src={image.src}
                  alt={image.name}
                  fill
                  className="object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <h3 className="text-center text-lg font-semibold mt-2">{image.name}</h3>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Left Navigation Button */}
        <button
          className={`swiper-button-prev-${title.toLowerCase().replace(' ', '-')} 
          absolute left-0 top-32 transform -translate-y-1/2 -translate-x-1/2 z-20
          w-12 h-12 bg-white/90 hover:bg-white backdrop-blur-sm 
          rounded-full text-gray-800 transition-all duration-300
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          shadow-lg hover:shadow-xl border border-gray-200`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="sr-only">Previous</span>
        </button>

        {/* Right Navigation Button */}
        <button
          className={`swiper-button-next-${title.toLowerCase().replace(' ', '-')} 
          absolute right-0 top-32 transform -translate-y-1/2 translate-x-1/2 z-20
          w-12 h-12 bg-white/90 hover:bg-white backdrop-blur-sm 
          rounded-full text-gray-800 transition-all duration-300
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          shadow-lg hover:shadow-xl border border-gray-200`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="sr-only">Next</span>
        </button>

        {/* Pagination Dots */}
        <div className={`swiper-pagination-${title.toLowerCase().replace(' ', '-')}` +
          " mt-4 flex justify-center"}>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Hero Section */}
      <motion.section
        id="Home"
        className="flex flex-col relative items-center justify-center"
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: heroInView ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <div className="relative w-full h-screen">
          <Image
            src="/gambar_sekolah1.JPG"
            alt="SMA PGRI 1 Gombong"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/20'>
            <motion.div
              className="flex items-center gap-2 justify-center"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="relative w-16 h-16 md:w-20 md:h-20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/yayasan.png"
                  alt="Logo Yayasan"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
              <motion.div
                className="relative w-14 h-14 md:w-18 md:h-18"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/sekolah.png"
                  alt="Logo Sekolah"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
              <motion.h1
                className="text-2xl md:text-4xl lg:text-6xl font-bold text-white text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                SMA PGRI 1 GOMBONG
              </motion.h1>
            </motion.div>
            <motion.p
              className="text-lg md:text-2xl lg:text-3xl font-bold text-white text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Terakreditasi A (Unggul)
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* News Section */}
      <section id="Berita" className="bg-amber-50 py-16 text-black scroll-mt-20" ref={newsRef}>
        <div className="container mx-auto px-4">
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12"
            variants={fadeInUp}
            initial="hidden"
            animate={newsInView ? "visible" : "hidden"}
          >
            Berita Terbaru
          </motion.h1>
          <div className="min-h-[400px]">
            {renderArticleSection()}
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section id="profile" className="bg-amber-50 py-16 text-black flex flex-col md:flex-row gap-8 scroll-mt-20" ref={profileRef}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <motion.div
            className="md:w-1/3 flex justify-center"
            variants={fadeInLeft}
            initial="hidden"
            animate={profileInView ? "visible" : "hidden"}
          >
            <motion.div
              className="relative w-64 h-64 lg:w-80 lg:h-80"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/sekolah.png"
                alt="Logo Sekolah"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
          <motion.div
            className="md:w-2/3"
            variants={fadeInRight}
            initial="hidden"
            animate={profileInView ? "visible" : "hidden"}
          >
            <h1 className="text-center md:text-left text-3xl font-bold mb-6">Profil Sekolah</h1>
            <div className="text-lg leading-relaxed text-justify space-y-4">
              <p>
                SMA PGRI 1 Gombong merupakan sekolah menengah atas yang berdiri sejak tahun 1981 oleh Drs. Slamet PA dan H. Sukotjo BcHk. Awalnya menumpang di SMA Negeri 1 Gombong, kemudian pindah ke KWN Wonokriyo pada tahun 1985. Pada tahun 1990, SMA PGRI 1 Gombong berhasil membangun gedung sendiri di atas lahan seluas 5.679 m² dan saat ini beralamat di Jalan Potongan No. 292, Gombong.
              </p>
              <p>
                Dengan akreditasi A (Unggul), sekolah ini telah melahirkan banyak alumni sukses di bidang militer, industri, dan luar negeri. Kepala sekolah pertama adalah Manginar, SM.BA yang menjabat dari tahun 1981 hingga 2006. SMA PGRI 1 Gombong berkomitmen mencetak generasi yang berkarakter Pancasila, unggul, terampil, dan berbudaya.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision Mission Section */}
      <section id="VISI MISI" className="bg-amber-50 py-16 text-black scroll-mt-20" ref={visionRef}>
        <div className="container mx-auto px-4">
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12"
            variants={fadeInUp}
            initial="hidden"
            animate={visionInView ? "visible" : "hidden"}
          >
            Visi Misi dan Tujuan Sekolah
          </motion.h1>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate={visionInView ? "visible" : "hidden"}
          >
            {/* Vision and Mission */}
            <motion.div
              className="bg-white shadow-lg rounded-lg p-6"
              variants={fadeInLeft}
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-center">Visi</h3>
              <p className="text-gray-700 text-lg mb-6 text-justify">
                Menjadikan generasi yang berkarakter Pancasila, Unggul, Terampil dan Berbudaya
              </p>

              <h3 className="text-2xl font-bold mb-4 text-center">Misi</h3>
              <ul className="text-gray-700 text-base space-y-3 list-disc pl-6">
                <li>Mengembangkan karakter yang mencerminkan Profil Pelajar Pancasila.</li>
                <li>Mengembangkan kegiatan pendidikan yang dapat menciptakan keunggulan sekolah dalam bidang akademik maupun non akademik.</li>
                <li>Peningkatan disiplin dan etos kerja tenaga pendidik dan kependidikan.</li>
                <li>Memberikan latihan dalam kegiatan Ekstrakurikuler yang dapat menumbuhkembangkan keterampilan hidup.</li>
                <li>Peningkatan hubungan kemitraan internal dan eksternal.</li>
                <li>Peningkatan lingkungan sekolah yang kondusif dan berwawasan wiyatamandala.</li>
              </ul>
            </motion.div>

            {/* School Objectives */}
            <motion.div
              className="bg-white shadow-lg rounded-lg p-6"
              variants={fadeInRight}
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-center">Tujuan Sekolah</h3>
              <ul className="text-gray-700 text-base space-y-3 list-disc pl-6">
                <li>Mengembangkan kegiatan pembelajaran yang berorientasi pada pengembangan dimensi Profil Pelajar Pancasila.</li>
                <li>Menciptakan pembiasaan-pembiasaan positif yang berorientasi pengembangan karakter untuk menciptakan Profil Pelajar Pancasila.</li>
                <li>Melaksanakan kegiatan intrakurikuler dan ekstrakurikuler untuk menciptakan prestasi akademik dan non akademik.</li>
                <li>Terwujudnya sarana dan prasarana yang memadai.</li>
                <li>Memiliki wawasan IPTEK dan keterampilan hidup yang tinggi.</li>
                <li>Terciptanya toleransi agama dan budaya di lingkungan sekolah.</li>
                <li>Terwujudnya moral yang tangguh dan diaplikasikan dalam kehidupan sehari-hari.</li>
                <li>Mengembangkan dan meningkatkan partisipasi seluruh warga sekolah, masyarakat dan pihak-pihak lain dengan dilandasi sikap tanggung jawab dan dedikasi yang tinggi.</li>
                <li>Terwujudnya lingkungan sekolah yang sehat, bersih, nyaman, ramah dan menyenangkan.</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Facilities and Extracurricular Section */}
      <section id="ekstrakurikuler" className="bg-amber-50 py-16 scroll-mt-20" ref={facilitiesRef}>
        <div className="container mx-auto px-4">
          <motion.h1
            className="text-center text-3xl md:text-4xl font-bold text-black mb-12"
            variants={fadeInUp}
            initial="hidden"
            animate={facilitiesInView ? "visible" : "hidden"}
          >
            Fasilitas dan Ekstrakurikuler
          </motion.h1>
          <motion.div
            className="flex flex-col lg:flex-row justify-center items-center gap-12 text-black"
            variants={staggerContainer}
            initial="hidden"
            animate={facilitiesInView ? "visible" : "hidden"}
          >
            <SwiperCarousel images={facilitiesImages} title="Fasilitas" />
            <SwiperCarousel images={extracurricularImages} title="Ekstrakurikuler" />
          </motion.div>
        </div>
      </section>

      {/* Principal's Message Section */}
      <section id="Sambutan" className="bg-gray-700 py-16 text-white scroll-mt-20" ref={principalRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate={principalInView ? "visible" : "hidden"}
          >
            <motion.div
              className="lg:w-1/3 flex justify-center"
              variants={fadeInLeft}
            >
              <motion.div
                className="relative w-64 h-64 lg:w-80 lg:h-80"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/kepala_sekolah.jpg"
                  alt="Kepala Sekolah"
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </motion.div>
            </motion.div>
            <motion.div
              className="lg:w-2/3"
              variants={fadeInRight}
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                Kepala Sekolah SMA PGRI 1 Gombong
              </h1>
              <div className="text-base md:text-lg leading-relaxed text-justify space-y-4 mb-6">
                <p>Assalamualaikum warahmatullahi wabarakatuh</p>
                <p>
                  Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa atas limpahan rahmat dan karunia-Nya sehingga Website Resmi SMA PGRI 1 Gombong ini dapat hadir sebagai media informasi, komunikasi, dan publikasi sekolah kepada seluruh masyarakat.
                </p>
                <p>
                  Website ini merupakan sarana untuk memperkenalkan profil sekolah, visi dan misi, kegiatan akademik dan non-akademik, serta prestasi yang telah diraih oleh peserta didik dan civitas akademika SMA PGRI 1 Gombong. Harapan kami, keberadaan website ini mampu memberikan manfaat nyata, baik bagi siswa, guru, orang tua, maupun masyarakat umum dalam menjalin hubungan yang lebih erat dan transparan.
                </p>
                <p>Wassalamu'alaikum warahmatullahi wabarakatuh.</p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/sambutan"
                  className="inline-block py-3 px-6 bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300 text-lg rounded-md text-white font-semibold shadow-md"
                >
                  Baca Selengkapnya
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Alumni Testimonials Section */}
      <section id="Testimoni" className="py-16 bg-amber-50 text-black scroll-mt-20" ref={testimoniRef}>
        <div className="container mx-auto px-4">
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12"
            variants={fadeInUp}
            initial="hidden"
            animate={testimoniInView ? "visible" : "hidden"}
          >
            Testimoni Alumni
          </motion.h1>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate={testimoniInView ? "visible" : "hidden"}
          >
            <motion.div
              className="text-center shadow-lg bg-white rounded-lg p-6"
              variants={scaleIn}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="relative w-32 h-32 mx-auto mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/alumni/alumni1.jpg"
                  fill
                  alt="Suharno"
                  className="rounded-full object-cover"
                />
              </motion.div>
              <h3 className="text-xl font-bold mb-4">Suharno</h3>
              <p className="text-gray-600 text-base">
                Lulus SMA PGRI 1 Gombong, lulus 2014. Lanjut pendidikan militer 2015. Pada tahun 2016 penempatan dinas di sekolah calon perwira angkatan darat di bandung sampai sekarang.
              </p>
            </motion.div>

            <motion.div
              className="text-center shadow-lg bg-white rounded-lg p-6"
              variants={scaleIn}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="relative w-32 h-32 mx-auto mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/alumni/alumni2.jpg"
                  fill
                  alt="Staff Administrasi"
                  className="rounded-full object-cover"
                />
              </motion.div>
              <h3 className="text-xl font-bold mb-4">Staff Administrasi</h3>
              <p className="text-gray-600 text-base">
                Alumni SMA PGRI 1 GOMBONG bekerja di PT GAJAH TUNGGAL Tbk. SEBAGAI STAFF ADMINISTRASI
              </p>
            </motion.div>

            <motion.div
              className="text-center shadow-lg bg-white rounded-lg p-6"
              variants={scaleIn}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="relative w-32 h-32 mx-auto mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/alumni/alumni3.jpg"
                  fill
                  alt="Melina"
                  className="rounded-full object-cover"
                />
              </motion.div>
              <h3 className="text-xl font-bold mb-4">Melina</h3>
              <p className="text-gray-600 text-base">
                Alumni SMA PGRI 1 GOMBONG tahun 2021. Saat ini saya bekerja di Jepang di PT Elna, perusahaan yang bergerak di bidang elektronik.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-amber-50 py-16 text-black" ref={contactRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
            variants={fadeInUp}
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="md:flex">
              <motion.div
                className="md:w-1/2 bg-yellow-500 text-white p-8"
                variants={fadeInLeft}
              >
                <h2 className="text-3xl font-bold mb-6">SMA PGRI 1 GOMBONG</h2>

                <div className="space-y-6">
                  <motion.div
                    className="flex items-start"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MapPin className="w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-lg mb-1">SMA PGRI 1 GOMBONG</div>
                      <div className="mb-1">Jl. Potongan No. 292 Gombong</div>
                      <div className="text-sm opacity-90">
                        (Sebelah timur Terminal Bus Gombong atau Utara Pasar Wonokriyo Gombong)
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Phone className="w-6 h-6 mr-4" />
                    <span className="text-lg">0287-472426</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Mail className="w-6 h-6 mr-4" />
                    <span className="text-lg">smapgri1gombongg@gmail.com</span>
                  </motion.div>
                </div>

                <motion.div
                  className="mt-8"
                  variants={scaleIn}
                >
                  <GoogleMapEmbed />
                </motion.div>
              </motion.div>

              <motion.div
                className="md:w-1/2 p-8"
                variants={fadeInRight}
              >
                <FeedbackForm
                  serviceId={emailjsConfig.serviceId}
                  templateId={emailjsConfig.templateId}
                  publicKey={emailjsConfig.publicKey}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}