import { useState } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function EditorPage() {
    const [title, setTitle] = useState('')
    const [kategori, setKategori] = useState('')
    const [content, setContent] = useState('')

    const modules = {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline'],
                [{ header: [1, 2, false] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['image'],
            ],
            handlers: {
                image: function () {
                    const input = document.createElement('input')
                    input.setAttribute('type', 'file')
                    input.setAttribute('accept', 'image/*')
                    input.click()
                    input.onchange = async () => {
                        const file = input.files[0]
                        const formData = new FormData()
                        formData.append('file', file)

                        const res = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                        })

                        const data = await res.json()
                        const quill = this.quill
                        const range = quill.getSelection()
                        quill.insertEmbed(range.index, 'image', data.url)
                    }
                },
            },
        },
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, kategori, content }),
        })
        const msg = await res.text()
        alert(msg)
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Buat Artikel</h2>
            <input
                type="text"
                placeholder="Judul"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
            />
            <input
                type="text"
                placeholder="Kategori (misal: Berita)"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="input"
            />
            <ReactQuill value={content} onChange={setContent} modules={modules} />
            <button onClick={handleSubmit} className="btn">Simpan</button>
        </div>
    )
}
