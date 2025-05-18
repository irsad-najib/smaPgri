import Image from 'next/image';

export default function sambutan() {
    return (
        <div className="bg-amber-50 mx-auto px-4 py-16 scroll-mt-20 text-black">
            <div className="container mx-auto max-w-4xl bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
                <Image
                    src="/logo_yayasan.png"
                    alt="Sambutan Kepala Sekolah"
                    width={500}
                    height={300}
                    className="w-3/4 h-auto object-cover rounded-lg my-12"
                />
                <div>
                    <h1 className="text-4xl font-bold mb-12 text-center">Sambutan Kepala Sekolah</h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed whitespace-pre-line text-justify">
                        Assalamualaikum warahmatullahi wabarakatuh{"\n\n"}
                        Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa atas limpahan rahmat dan karunia-Nya sehingga Website Resmi SMA PGRI 1 Gombong ini dapat hadir sebagai media informasi, komunikasi, dan publikasi sekolah kepada seluruh masyarakat.
                        {"\n\n"}
                        Website ini merupakan sarana untuk memperkenalkan profil sekolah, visi dan misi, kegiatan akademik dan non-akademik, serta prestasi yang telah diraih oleh peserta didik dan civitas akademika SMA PGRI 1 Gombong. Harapan kami, keberadaan website ini mampu memberikan manfaat nyata, baik bagi siswa, guru, orang tua, maupun masyarakat umum dalam menjalin hubungan yang lebih erat dan transparan.
                        {"\n\n"}
                        Sebagai lembaga pendidikan, SMA PGRI 1 Gombong berkomitmen untuk terus berinovasi dalam mewujudkan pendidikan yang bermutu, berkarakter, dan berbasis teknologi. Semoga dengan dukungan semua pihak, website ini dapat berkembang secara dinamis sesuai kebutuhan zaman dan menjadi media pembelajaran serta inspirasi bagi semua pihak yang mengaksesnya.
                        {"\n\n"}
                        Akhir kata, kami mengucapkan terima kasih kepada seluruh tim pengelola website dan semua pihak yang telah berkontribusi. Saran dan kritik yang membangun sangat kami harapkan demi perbaikan dan kemajuan bersama.
                        {"\n\n"}
                        Wassalamu’alaikum warahmatullahi wabarakatuh.{"\n\n"}
                    </p>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed whitespace-pre-line text-left">
                        Kepala Sekolah SMA PGRI 1 Gombong {"\n\n\n\n"}
                        Dwi Suheni, S.Pd.
                    </p>
                </div>
            </div>
        </div>
    );
}