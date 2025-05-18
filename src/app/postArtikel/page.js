"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import dynamic from 'next/dynamic';


// Import TinyMCE dengan dynamic import untuk menghindari error SSR
const MyEditor = dynamic(() => import('../component/MyEditor'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
});

export default function CreateArticle() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        title: '',
        author: '',
        category: '',
        content: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [mounted, setMounted] = useState(false);

    // Gunakan useEffect untuk menandai komponen sudah di-mount di client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    // Handle content (TinyMCE editor) changes
    const handleEditorChange = (content) => {
        setFormValues(prev => ({ ...prev, content }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formValues.title || !formValues.content) {
            setMessage({ type: 'error', text: 'Judul dan konten harus diisi' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();

            // Tambahkan teks form ke FormData
            Object.keys(formValues).forEach(key => {
                formData.append(key, formValues[key]);
            });

            const response = await fetch('/api/create', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Artikel berhasil dibuat!' });

                // Reset form setelah berhasil
                setFormValues({
                    title: '',
                    author: '',
                    category: '',
                    content: ''
                });

                // Redirect ke homepage setelah 2 detik
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.message || 'Terjadi kesalahan' });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage({ type: 'error', text: 'Terjadi kesalahan saat mengirim data' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-amber-50 text-black mx-auto px-4 py-8">
            <Head>
                <title>Tambah Artikel Baru | Website Sekolah</title>
            </Head>

            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Tambah Artikel Baru</h1>

                {message.text && (
                    <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="title">
                            Judul Artikel*
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formValues.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="author">
                            Penulis
                        </label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formValues.author}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Admin Sekolah"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="category">
                            Kategori
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formValues.category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Pilih Kategori</option>
                            <option value="pengumuman">Pengumuman</option>
                            <option value="berita">Berita</option>
                            <option value="kegiatan">Kegiatan</option>
                            <option value="prestasi">Prestasi</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="content">
                            Konten Artikel*
                        </label>
                        <div className="border border-gray-300 rounded-md">
                            {mounted && (
                                <MyEditor
                                    value={formValues.content} onEditorChange={handleEditorChange}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-md text-white ${isLoading ? 'bg-yellow-400' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan Artikel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}