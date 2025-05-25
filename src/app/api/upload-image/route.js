//api/upload-image/route.js
import { NextResponse } from "next/server";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebaseConfig";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { success: false, message: "Tidak ada file yang diunggah" },
                { status: 400 }
            );
        }

        // Buat nama file unik
        const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
        const storageRef = ref(storage, `uploads/${fileName}`);

        // Convert Blob ke ArrayBuffer supaya bisa uploadBytes
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        await uploadBytes(storageRef, uint8Array);

        // Dapatkan URL publik file
        const publicUrl = await getDownloadURL(storageRef);

        return NextResponse.json({
            success: true,
            location: publicUrl,
        });
    } catch (error) {
        console.error("Unexpected upload error:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan saat upload" },
            { status: 500 }
        );
    }
}
