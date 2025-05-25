'use client'

import { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import ImageUploader from 'quill-image-uploader'
Quill.register('modules/imageUploader', ImageUploader)

export default function MyEditor({ value, onEditorChange }) {
    const [editorLoaded, setEditorLoaded] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const editorRef = useRef(null)
    const quillRef = useRef(null)

    // Ensure we're on the client side
    useEffect(() => {
        setIsClient(true)
        setEditorLoaded(true)
    }, [])

    useEffect(() => {
        if (isClient && editorLoaded && editorRef.current && !quillRef.current) {
            const quillInstance = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: 'Tulis konten artikel di sini...',
                modules: {
                    toolbar: {
                        container: [
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                            [{ 'align': [] }],
                            ['link', 'image', 'video'],
                            ['blockquote', 'code-block'],
                            ['clean']
                        ],
                        handlers: {
                            image: function () {
                                const input = document.createElement('input')
                                input.setAttribute('type', 'file')
                                input.setAttribute('accept', 'image/*')
                                input.click()

                                input.onchange = async () => {
                                    const file = input.files[0]
                                    if (file) {
                                        const formData = new FormData()
                                        formData.append('file', file)

                                        try {
                                            const res = await fetch('/api/upload-image', {
                                                method: 'POST',
                                                body: formData
                                            })

                                            const data = await res.json()
                                            if (data.success) {
                                                const range = quillInstance.getSelection()
                                                quillInstance.insertEmbed(range.index, 'image', data.location)
                                            } else {
                                                alert('Gagal mengupload gambar')
                                            }
                                        } catch (err) {
                                            console.error('Upload error:', err)
                                            alert('Terjadi kesalahan saat upload gambar')
                                        }
                                    }
                                }
                            }
                        }
                    },
                    imageUploader: {
                        upload: async (file) => {
                            const formData = new FormData()
                            formData.append('file', file)

                            const res = await fetch('/api/upload-image', {
                                method: 'POST',
                                body: formData
                            })

                            const data = await res.json()
                            if (data.success) return data.location
                            throw new Error('Gagal upload')
                        }
                    }
                }
            });
            quillRef.current = quillInstance;

            quillInstance.on('text-change', () => {
                const content = quillInstance.root.innerHTML || ''
                onEditorChange(content)
            });
        }
    }, [isClient, editorLoaded, onEditorChange]);

    // Sync external value changes to editor
    useEffect(() => {
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            quillRef.current.root.innerHTML = value || ''
        }
    }, [value])

    // Don't render anything until we're on the client
    if (!isClient) {
        return (
            <div className="border border-gray-300 rounded-md p-4 text-center bg-gray-50 min-h-[400px] h-[600px] flex items-center justify-center">
                <p className="text-gray-500">Memuat editor...</p>
            </div>
        )
    }

    return (
        <>
            {editorLoaded ? (
                <div
                    ref={editorRef}
                    className="bg-white min-h-[400px] h-[600px] border border-gray-300 rounded-md"
                    style={{
                        minHeight: '400px',
                        height: '600px'
                    }}
                />
            ) : (
                <div className="border border-gray-300 rounded-md p-4 text-center bg-gray-50 min-h-[400px] h-[600px] flex items-center justify-center">
                    <p className="text-gray-500">Memuat editor...</p>
                </div>
            )}
        </>
    )
}