"use client";
import React from "react";
import { MapPin, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import Navbar from './component/navbar.js'
import Footer from './component/footer.js';
import { FeedbackForm } from './component/FeedbackFrom.js';
import emailjs from '@emailjs/browser';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HomePage() {
  const GoogleMapEmbed = () => (
    <div className="w-full h-64">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4691.090390946916!2d109.5035156757479!3d-7.604525275164585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e654b8e15b77139%3A0x6ed0a41091a13920!2sSMA%20PGRI%201%20Gombong!5e1!3m2!1sid!2sid!4v1747057153036!5m2!1sid!2sid"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
  const emailjsConfig = {
    serviceId: 'service_azx64n8',  // ID dari service yang sudah dibuat di dashboard EmailJS
    templateId: 'template_gq2pg5p', // ID template yang sudah dibuat
    publicKey: 'NG7D69F5FkLzXpMsR'   // Public key dari akun EmailJS Anda
  };

  // Memastikan EmailJS diinisialisasi di level aplikasi
  React.useEffect(() => {
    // Inisialisasi EmailJS
    emailjs.init(emailjsConfig.publicKey);
  }, []);

  const image2 = [
    { id: 1, src: "/ekstrakurikuler/Futsal.jpg", name: "Futsal" },
    { id: 2, src: "/ekstrakurikuler/Pramuka.jpg", name: "Pramuka" },
    { id: 3, src: "/ekstrakurikuler/Komputer.jpg", name: "Komputer" },
    { id: 4, src: "/ekstrakurikuler/seni-musik.jpg", name: "Seni Musik" },
    { id: 5, src: "/ekstrakurikuler/stir-mobil.jpg", name: "Stir Mobil" },
    { id: 6, src: "/ekstrakurikuler/Tata Boga.jpg", name: "Tata Boga" },
  ]
  const image1 = [
    { id: 1, src: "/fasilitas/lab_komputer.jpg", name: "Laboratorium Komputer" },
    { id: 2, src: "/fasilitas/Laboratorium-IPA.jpg", name: "Laboratorium IPA" },
    { id: 3, src: "/fasilitas/Perpustakaan.jpg", name: "Perpustakaan" },
  ];
  return (
    <>
      <Navbar />
      <section id="home" className="flex flex-col relative items-center justify-center">
        <Image
          src="/gambar_sekolah1.jpg"
          alt="Picture of the author"
          width={10000}
          height={10000}
          className=" h-auto lg:h-screen w-full opacity-80"
          priority
        />
        <div className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-4 '>
          <div className="flex items-center gap-2 justify-center">

            <Image
              src="/logo_yayasan.png"
              alt="Picture of the author"
              width={10000}
              height={10000}
              className=" h-auto w-[9%]"
              priority
            />
            <Image
              src="/logo_sekolah.png"
              alt="Picture of the author"
              width={10000}
              height={10000}
              className="h-auto w-[8%]"
              priority
            />
            <h1 className="text-[4vw] font-bold text-white top-1/2 text-center">
              SMA PGRI 1 GOMBONG
            </h1>
          </div>
          <p className="text-[2vw] font-bold text-white top-1/2 text-center">Terakreditasi A (Unggul)</p>
        </div>
      </section >
      <section id="profile" className="bg-amber-50 p-[8%] lg:p-5 text-black flex flex-col md:flex-row gap-4 scroll-mt-20">
        <Image
          src="/logo_sekolah.png"
          alt="Picture of the author"
          width={10000}
          height={10000}
          className="h-auto w-1/2 mx-auto"
          priority
        />
        <div className="flex flex-col justify-center text-black">
          <h1 className="text-center text-2xl font-bold">Profil Sekolah</h1>

          <p className=" text-[3vw] mx-[10%] my-[5%] md:text-[2vw] lg:text-xl lg:p-4 text-justify mt-2">
            SMA PGRI 1 Gombong merupakan sekolah menengah atas yang berdiri sejak tahun 1981 oleh Drs. Slamet PA dan H. Sukotjo BcHk. Awalnya menumpang di SMA Negeri 1 Gombong, kemudian pindah ke KWN Wonokriyo pada tahun 1985. Pada tahun 1990, SMA PGRI 1 Gombong berhasil membangun gedung sendiri di atas lahan seluas 5.679 m² dan saat ini beralamat di Jalan Potongan No. 292, Gombong.
            <br /><br />
            Dengan akreditasi A (Unggul), sekolah ini telah melahirkan banyak alumni sukses di bidang militer, industri, dan luar negeri. Kepala sekolah pertama adalah Manginar, SM.BA yang menjabat dari tahun 1981 hingga 2006. SMA PGRI 1 Gombong berkomitmen mencetak generasi yang berkarakter Pancasila, unggul, terampil, dan berbudaya.
          </p>

        </div>
      </section>
      <section id="VISI MISI" className="bg-amber-50 p-[8%] lg:p-5 text-black scroll-mt-20">
        <h1 className="flex text-[8vw] font-bold my-[4%] md:my-5 justify-center text-center md:text-[5vw] lg:text-4xl">Visi Misi dan Tujuan sekolah</h1>
        <div className="container mx-auto px-[4%] py-[8%] lg:p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visi dan Misi */}
            <div className="text-center shadow-md bg-gray-50 py-[4%] overflow-hidden">
              <h3 className="text-[4.3vw] font-bold lg:text-2xl lg:m-4">Visi</h3>
              <p className="text-gray-600 text-[3vw] mx-[10%] my-[5%] md:text-[2vw] lg:text-xl lg:p-4 text-justify">
                Menjadikan generasi yang berkarakter Pancasila, Unggul, Terampil dan Berbudaya
              </p>
              <h3 className="text-[4.3vw] font-bold lg:text-2xl lg:m-4">Misi</h3>
              <ul className="text-gray-600 text-[3vw] mx-[10%] my-[5%] md:text-[2vw] lg:text-xl lg:p-4 text-justify list-disc space-y-2">
                <li>
                  Mengembangkan karakter yang mencerminkan Profil Pelajar Pancasila.
                </li>
                <li>
                  Mengembangkan kegiatan pendidikan yang dapat menciptakan keunggulan sekolah dalam bidang akademik maupun non akademik.
                </li>
                <li>
                  Peningkatan disiplin dan etos kerja tenaga pendidik dan kependidikan.
                </li>
                <li>
                  Memberikan latihan dalam kegiatan Ekstrakurikuler yang dapat menumbuhkembangkan keterampilan hidup.
                </li>
                <li>
                  Peningkatan hubungan kemitraan internal dan eksternal.
                </li>
                <li>
                  Peningkatan lingkungan sekolah yang kondusif dan berwawasan wiyatamandala.
                </li>
              </ul>
            </div>

            {/* Tujuan */}
            <div className="text-center shadow-md bg-gray-50 py-[4%] overflow-hidden">
              <h3 className="text-[4.3vw] font-bold lg:text-2xl lg:m-4">Tujuan Sekolah</h3>
              <ul className="text-gray-600 text-[3vw] mx-[10%] my-[5%] md:text-[2vw] lg:text-xl lg:p-4 text-justify list-disc space-y-2">
                <li>
                  Mengembangkan kegiatan pembelajaran yang berorientasi pada pengembangan dimensi Profil Pelajar Pancasila.
                </li>
                <li>
                  Menciptakan pembiasaan-pembiasaan positif yang berorientasi pengembangan karakter untuk menciptakan Profil Pelajar Pancasila.
                </li>
                <li>
                  Melaksanakan kegiatan intrakurikuler dan ekstrakurikuler untuk menciptakan prestasi akademik dan non akademik.
                </li>
                <li>
                  Terwujudnya sarana dan prasarana yang memadai.
                </li>
                <li>
                  Memiliki wawasan IPTEK dan keterampilan hidup yang tinggi.
                </li>
                <li>
                  Terciptanya toleransi agama dan budaya di lingkungan sekolah.
                </li>
                <li>
                  Terwujudnya moral yang tangguh dan diaplikasikan dalam kehidupan sehari-hari.
                </li>
                <li>
                  Mengembangkan dan meningkatkan partisipasi seluruh warga sekolah, masyarakat dan pihak-pihak lain dengan dilandasi sikap tanggung jawab dan dedikasi yang tinggi.
                </li>
                <li>
                  Terwujudnya lingkungan sekolah yang sehat, bersih, nyaman, ramah dan menyenangkan.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section id="ekstrakurikuler" className="bg-amber-50 mx-auto px-4 py-8 flex flex-col gap-4 scroll-mt-20">
        {/* <Image
          src="/logo_sekolah.png"
          alt="Picture of the author"
          width={10000}
          height={10000}
          className="h-auto w-1/2 mx-auto"
          priority
          /> */}
        <h1 className="text-center text-2xl font-bold text-black">Fasilitas dan Extrakurikuler</h1>
        <div className="flex flex-col justify-center items-center md:flex-row text-black">
          <div className="relative w-full mx-auto group">
            <h1 className="text-center text-2xl font-bold my-4">Fasilitas</h1>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination',
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
                renderBullet: function (index, className) {
                  return `<span class="${className}"></span>`;
                },
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              className="w-64 h-auto rounded-lg"
            >
              {image1.map((image1) => (
                <SwiperSlide key={image1.id}>
                  <img
                    src={image1.src}
                    alt={`Slide ${image1.id}`}
                    className='w-64 h-64 object-cover'
                  />
                  <h1 className="text-center text-2xl font-bold">{image1.name}</h1>
                </SwiperSlide>
              ))}

              {/* Custom Navigation Buttons */}
              <button className="swiper-button-prev !hidden group-hover:!flex !w-10 !h-10 !bg-black/30 hover:!bg-black/50 !backdrop-blur-sm rounded-full !text-white transition-all duration-300">
                <span className="sr-only">Previous</span>
              </button>
              <button className="swiper-button-next !hidden group-hover:!flex !w-10 !h-10 !bg-black/30 hover:!bg-black/50 !backdrop-blur-sm rounded-full !text-white transition-all duration-300">
                <span className="sr-only">Next</span>
              </button>

              {/* Custom Pagination Dots */}
              <div className="swiper-pagination !bottom-4"></div>
            </Swiper>
          </div>
          <div className="relative w-full mx-auto group">
            <h1 className="text-center text-2xl font-bold my-4">Ekstrakurikuler</h1>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination',
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
                renderBullet: function (index, className) {
                  return `<span class="${className}"></span>`;
                },
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              className="w-64 h-auto rounded-lg"
            >
              {image2.map((image2) => (
                <SwiperSlide key={image2.id}>
                  <img
                    src={image2.src}
                    alt={`Slide ${image2.id}`}
                    className='w-64 h-64 object-cover'
                  />
                  <h1 className="text-center text-2xl font-bold">{image2.name}</h1>
                </SwiperSlide>
              ))}

              {/* Custom Navigation Buttons */}
              <button className="swiper-button-prev !hidden group-hover:!flex !w-10 !h-10 !bg-black/30 hover:!bg-black/50 !backdrop-blur-sm rounded-full !text-white transition-all duration-300">
                <span className="sr-only">Previous</span>
              </button>
              <button className="swiper-button-next !hidden group-hover:!flex !w-10 !h-10 !bg-black/30 hover:!bg-black/50 !backdrop-blur-sm rounded-full !text-white transition-all duration-300">
                <span className="sr-only">Next</span>
              </button>

              {/* Custom Pagination Dots */}
              <div className="swiper-pagination !bottom-4"></div>
            </Swiper>
          </div>
        </div>
      </section>
      <section id="Testimoni" className="p-[10%] lg:p-5 bg-amber-50 text-black scroll-mt-20">
        <h1 className="flex text-[8vw] font-bold justify-center text-center md:text-[5vw] lg:text-4xl">Testimoni Alumni</h1>
        <div className="container mx-auto px-[4%] py-[20%] lg:p-4">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-20">
            <div className="text-center shadow-lg bg-gray-50">
              <div className="bg-gray-100 rounded-full p-[4%] inline-block m-[4%] lg:p-4">
                <Image
                  src="/alumni/alumni1.jpg"
                  width={120}
                  height={120}
                  alt="sementara"
                  className="w-45 h-45 object-cover"
                />
              </div>
              <h3 className="text-[4.3vw] font-bold mb-[2%] lg:text-2xl lg:m-4">Suharno</h3>
              <p className="text-gray-600 text-[3.5vw] m-[4%] md:text-[2.5vw] lg:text-xl lg:m-4">
                Lulus SMA PGRI 1 Gombong, lulus 2014. Lanjut pendidikan militer 2015. Pada tahun 2016 penempatan dinas di sekolah calon perwira angkatan darat di bandung sampai sekarang.
              </p>
            </div>
            <div className="text-center shadow-lg bg-gray-50">
              <div className="bg-gray-100 rounded-full p-[4%] inline-block m-[4%] lg:p-4">
                <Image
                  src="/alumni/alumni2.jpg"
                  width={120}
                  height={120}
                  alt="alumni"
                  className="w-45 h-45 object-cover"
                />
              </div>
              <h3 className="text-[4.3vw] font-bold mb-[2%] lg:text-2xl lg:m-4">Staff Administrasi</h3>
              <p className="text-gray-600 text-[3.5vw] m-[4%] md:text-[2.5vw] lg:text-xl lg:m-4">
                Alumni SMA PGRI 1 GOMBONG bekerja di PT GAJAH TUNGGAL Tbk. SEBAGAI STAFF ADMINISTRASI
              </p>
            </div>


            <div className="text-center shadow-lg bg-gray-50">
              <div className="bg-gray-100 rounded-full p-[4%] inline-block m-[4%] lg:p-4">
                <Image
                  src="/alumni/alumni3.jpg"
                  width={120}
                  height={120}
                  alt="sementara"
                  className="w-45 h-45 object-cover"
                />
              </div>
              <h3 className="text-[4.3vw] font-bold mb-[2%] lg:text-2xl lg:m-4">Melina</h3>
              <p className="text-gray-600 text-[3.5vw] m-[4%] md:text-[2.5vw] lg:text-xl lg:m-4">
                Alumni SMA PGRI 1 GOMBONG tahun 2021. Saat ini saya bekerja di Jepang di PT Elna, perusahaan yang bergerak di bidang elektronik.
              </p>
            </div>
          </div>
        </div>
      </section >
      <section className="bg-amber-50 p-[8%] lg:p-5 text-black">
        <div className="mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-yellow-500 text-white p-6">
                <h2 className="text-2xl font-bold mb-4">SMA PGRI 1 GOMBONG</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-9 h-9 mr-3" />
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">SMA PGRI 1 GOMBONG</span>
                      <span>Jl. Potongan No. 292 Gombong</span>
                      <span className="text-sm">(Sebelah timur Terminal Bus Gombong atau Utara Pasar Wonokriyo Gombong)</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-6 h-6 mr-3" />
                    <span>0287-472426</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-6 h-6 mr-3" />
                    <span>smapgri1gombongg@gmail.com </span>
                  </div>
                </div>

                <div className="mt-6">
                  <GoogleMapEmbed />
                </div>
              </div>
              <div className="md:w-1/2 p-6">
                <FeedbackForm
                  serviceId={emailjsConfig.serviceId}
                  templateId={emailjsConfig.templateId}
                  publicKey={emailjsConfig.publicKey}
                />
              </div>

            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
