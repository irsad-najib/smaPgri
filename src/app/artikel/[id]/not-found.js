// app/artikel/[id]/not-found.js
import Link from 'next/link';

export default function ArticleNotFound() {
    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
            <p className="text-lg text-gray-600 mb-8">
                Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.
            </p>
            <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
            >
                Kembali ke Beranda
            </Link>
        </div>
    );
}