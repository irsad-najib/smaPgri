"use client";
import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// Fungsi untuk menyimpan status formulir
const useFeedbackForm = (serviceId, templateId, publicKey) => {
    // State untuk menyimpan data formulir
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '', // Tambahkan field subject/judul
        message: ''
    });

    // State untuk menampilkan loading dan pesan status
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ message: '', isError: false });
    const [debugInfo, setDebugInfo] = useState(null);

    // Fungsi untuk menangani perubahan input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Fungsi untuk mengirim email menggunakan EmailJS
    const sendToEmail = async (feedbackData) => {
        try {
            // Menyiapkan parameter untuk template - sesuaikan dengan variabel di template EmailJS
            const templateParams = {
                from_name: feedbackData.name,
                from_email: feedbackData.email,
                message: feedbackData.message,
                reply_to: feedbackData.email,
                title: feedbackData.subject || "Kritik dan Saran", // Pastikan title selalu terisi
                name: feedbackData.name, // Pastikan name untuk template tersedia
                email: feedbackData.email // Pastikan email untuk template tersedia
            };

            console.log("Mengirim email dengan parameter:", templateParams);

            // Mengirim email menggunakan EmailJS
            const response = await emailjs.send(
                serviceId,
                templateId,
                templateParams
            );

            console.log('Email berhasil dikirim!', response);
            setDebugInfo({
                status: 'success',
                response: response,
                params: templateParams
            });
            return { success: true };
        } catch (error) {
            console.error('Gagal mengirim email:', error);
            setDebugInfo({
                status: 'error',
                error: error.toString(),
                errorDetails: error,
                params: {
                    serviceId,
                    templateId,
                    feedbackData
                }
            });
            return { success: false, error };
        }
    };

    // Fungsi untuk menangani pengiriman formulir
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ message: '', isError: false });
        setDebugInfo(null);

        try {
            // Validasi data
            if (!formData.name || !formData.email || !formData.message) {
                throw new Error('Mohon isi semua kolom formulir');
            }

            // Cek apakah alamat email valid
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                throw new Error('Alamat email tidak valid');
            }

            console.log("Mengirim kritik/saran:", formData);

            // Kirim email
            const result = await sendToEmail(formData);

            if (result.success) {
                setSubmitStatus({
                    message: 'Terima kasih atas pesan Anda! Email telah berhasil dikirim.',
                    isError: false
                });

                // Reset form setelah berhasil
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                throw new Error('Gagal mengirim pesan. Silakan coba lagi nanti.');
            }
        } catch (error) {
            console.error('Error:', error);
            setSubmitStatus({
                message: `Terjadi kesalahan: ${error.message || 'Silakan coba lagi.'}`,
                isError: true
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        handleChange,
        handleSubmit,
        isSubmitting,
        submitStatus,
        debugInfo
    };
};

// Komponen React untuk formulir kritik dan saran
const FeedbackForm = ({
    serviceId = 'YOUR_EMAILJS_SERVICE_ID',
    templateId = 'YOUR_EMAILJS_TEMPLATE_ID',
    publicKey = 'YOUR_EMAILJS_PUBLIC_KEY',
    showDebug = false
}) => {
    // Inisialisasi EmailJS hanya di sisi klien menggunakan useEffect
    useEffect(() => {
        // Cek apakah kode berjalan di browser (client-side)
        if (typeof window !== 'undefined') {
            emailjs.init(publicKey);
            console.log("EmailJS diinisialisasi dengan:", { serviceId, templateId, publicKey });
        }
    }, [publicKey, serviceId, templateId]);

    const {
        formData,
        handleChange,
        handleSubmit,
        isSubmitting,
        submitStatus,
        debugInfo
    } = useFeedbackForm(serviceId, templateId, publicKey);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Kritik dan Saran</h2>

            {submitStatus.message && (
                <div className={`p-3 mb-4 rounded-md ${submitStatus.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {submitStatus.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subjek</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Kritik, Saran, atau Pertanyaan"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Pesan</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    ></textarea>
                </div>

                <div>
                    <p className="text-xs text-gray-500 mb-2">*Anda tidak perlu login untuk mengisi kritik dan saran</p>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-blue-700'} text-white py-2 px-4 rounded-md transition duration-300`}
                    >
                        {isSubmitting ? 'Mengirim...' : 'Kirim'}
                    </button>
                </div>
            </form>

            {/* Debug Info - hanya tampil jika showDebug=true */}
            {showDebug && debugInfo && (
                <div className="mt-8 p-4 border rounded bg-gray-50">
                    <h3 className="font-bold mb-2">Debug Info:</h3>
                    <pre className="text-xs overflow-auto max-h-40">
                        {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export { FeedbackForm };