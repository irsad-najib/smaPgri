//api/create/route.js
import { NextResponse } from "next/server";
import { db } from "../lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const title = formData.get("title");
        const author = formData.get("author") || "Admin";
        const category = formData.get("category") || "lainnya";
        const content = formData.get("content");

        if (!title || !content) {
            return NextResponse.json(
                { success: false, message: "Judul dan konten harus diisi" },
                { status: 400 }
            );
        }

        await addDoc(collection(db, "articles"), {
            title,
            author,
            category,
            content,
            createdAt: serverTimestamp(),
        });

        return NextResponse.json({
            success: true,
            message: "Artikel berhasil disimpan ke Firestore",
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
