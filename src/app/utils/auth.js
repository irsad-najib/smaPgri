"use client";

// Fungsi sederhana untuk memeriksa status login
export function isLoggedIn() {
    // Cek di client-side
    if (typeof window !== 'undefined') {
        return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
}

// Fungsi untuk menyimpan status login
export function setLoggedIn(email) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
}

// Fungsi untuk logout
export function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
}

// Fungsi untuk mendapatkan email user yang login
export function getUserEmail() {
    return localStorage.getItem('userEmail');
}