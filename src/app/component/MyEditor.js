'use client'

import { useEffect, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'

export default function MyEditor({ value, onEditorChange }) {
    // Gunakan state untuk mengontrol kapan editor harus dirender
    const [editorLoaded, setEditorLoaded] = useState(false)

    useEffect(() => {
        // Editor hanya dirender di sisi klien
        setEditorLoaded(true)
    }, [])

    return (
        <>
            {editorLoaded ? (
                <Editor
                    apiKey="m0jihceo4au6gd5inc3ihbnib3e2wh9ay6iqd5s0erzn0y5h"
                    value={value}
                    onEditorChange={onEditorChange}
                    init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                            'preview', 'anchor', 'searchreplace', 'visualblocks',
                            'code', 'fullscreen', 'insertdatetime', 'media',
                            'table', 'help', 'wordcount'
                        ],
                        toolbar:
                            'undo redo | formatselect | bold italic backcolor | ' +
                            'alignleft aligncenter alignright alignjustify | ' +
                            'link image | bullist numlist outdent indent | removeformat | help',
                        placeholder: 'Tulis konten artikel di sini...',
                        image_caption: true,
                        image_advtab: true,
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        images_upload_handler: async (blobInfo, progressFn) => {
                            try {
                                progressFn(0)
                                const formData = new FormData()
                                formData.append('file', blobInfo.blob(), blobInfo.filename())

                                const response = await fetch('/api/upload-image', {
                                    method: 'POST',
                                    body: formData
                                })

                                progressFn(50)
                                const result = await response.json()

                                if (!result.success) {
                                    throw new Error(result.message || 'Gagal mengunggah gambar')
                                }

                                progressFn(100)
                                return result.location
                            } catch (error) {
                                console.error('Error uploading image:', error)
                                throw new Error('Gagal mengunggah gambar. Silakan coba lagi.')
                            }
                        }
                    }}
                />
            ) : (
                <div className="border border-gray-300 rounded-md p-4 text-center bg-gray-50 h-[500px] flex items-center justify-center">
                    <p className="text-gray-500">Memuat editor...</p>
                </div>
            )}
        </>
    )
}