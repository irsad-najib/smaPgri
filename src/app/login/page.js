"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, setLoggedIn } from "../utils/auth";

// Define allowed users - in a real app, this would come from a secure API
const ALLOWED_USERS = [
    { email: "admin@example.com", password: "123456" },
    { email: "user@example.com", password: "123456" }
];

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const emailRef = useRef(null);

    // Redirect jika sudah login
    useEffect(() => {
        if (isLoggedIn()) {
            router.push("/postArtikel");
        }
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();

        // Check if user is in allowed users list
        const validUser = ALLOWED_USERS.find(
            user => user.email === email && user.password === password
        );

        if (validUser) {
            setError("");
            // Simpan status login
            setLoggedIn(validUser.email);
            router.push("/postArtikel");
        } else {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-amber-50">
            <div className="max-w-md w-full text-black">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            ref={emailRef}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-white p-3 rounded-md font-medium hover:bg-yellow-600 transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;