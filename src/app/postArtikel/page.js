"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Import TinyMCE dengan dynamic import untuk menghindari error SSR
const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), {
    ssr: false,
    loading: () => <p>Loading Editor...</p>
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
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
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

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
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

            // Tambahkan gambar jika ada
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const response = await fetch('/api/create', {
                method: 'POST',
                body: formData,
            });
            console.log('Response:', response);
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
                setSelectedImage(null);
                setPreviewImage('');

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
        <div className="container mx-auto px-4 py-8">
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

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="image">
                            Gambar Utama
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />

                        {previewImage && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                                <img src={previewImage} alt="Preview" className="max-h-40 rounded" />
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="content">
                            Konten Artikel*
                        </label>
                        <div className="border border-gray-300 rounded-md">
                            {mounted && (
                                <Editor
                                    apiKey="m0jihceo4au6gd5inc3ihbnib3e2wh9ay6iqd5s0erzn0y5h" // Dapatkan key gratis di cloud.tiny.cloud
                                    value={formValues.content}
                                    onEditorChange={handleEditorChange}
                                    init={{
                                        height: 400,
                                        menubar: false,
                                        plugins: [
                                            'advlist autolink lists link image charmap print preview anchor',
                                            'searchreplace visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount'
                                        ],
                                        toolbar:
                                            'undo redo | formatselect | bold italic backcolor | \
                                            alignleft aligncenter alignright alignjustify | \
                                            bullist numlist outdent indent | removeformat | image | help',
                                        images_upload_handler: (blobInfo, progress) => {
                                            return new Promise((resolve, reject) => {
                                                // Di sini Anda dapat menangani upload gambar ke server
                                                // dan mengembalikan URL gambar

                                                // Contoh sederhana untuk demo (tidak benar-benar mengunggah):
                                                setTimeout(() => {
                                                    // Simulasi URL gambar yang diunggah
                                                    const imageUrl = URL.createObjectURL(blobInfo.blob());
                                                    resolve(imageUrl);
                                                }, 1000);
                                            });
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-md text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan Artikel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}