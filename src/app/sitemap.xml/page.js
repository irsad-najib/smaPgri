import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '@/app/api/lib/firebaseConfig';

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function GET() {
    const baseUrl = 'https://www.smapgrisatugombong.sch.id'; // Ganti dengan domain kamu

    // Ambil semua dokumen dari koleksi 'artikel'
    const snapshot = await getDocs(collection(db, 'artikel'));
    const artikelIds = snapshot.docs.map(doc => doc.id);

    // Halaman statis
    const staticPages = [
        '',
        '/login',
        '/Post',
        '/Post/postAdmin',
        '/Post/postArtikel',
        '/sambutan',
    ];

    // Buat URL dinamis untuk artikel
    const artikelPages = artikelIds.map(id => `/artikel/${id}`);
    const allPages = [...staticPages, ...artikelPages];

    // Buat isi sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allPages
            .map(
                (url) => `
      <url>
        <loc>${baseUrl}${url}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
    `
            )
            .join('')}
  </urlset>`;

    return new NextResponse(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
