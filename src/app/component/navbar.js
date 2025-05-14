"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const NavLink = ({ href, children, className = "" }) => (
    <Link
        href={href}
        className={`hover:text-gray-200 transition-colors duration-200 ${className}`}
    >
        {children}
    </Link>
);

const navLinks = [
    { href: "#profile", label: "Profile" },
    { href: "#VISI MISI", label: "VISI MISI" },
    // { href: "#Sejarah", label: "Sejarah" },
    { href: "/Post", label: "Postingan" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const router = useRouter();


    return (
        <nav className="bg-yellow-500 py-[3%] lg:py-4 sticky top-0 z-50">
            <div className="container mx-auto flex justify-around items-center px-[4%]">
                <div className="flex items-center ">
                    <Image
                        src="/logo_yayasan.png"
                        alt="Picture of the author"
                        width={10000}
                        height={10000}
                        className=" h-auto w-[9%]"
                        priority
                    />
                    <Image
                        src="/logo_sekolah.png"
                        width={10000}
                        height={10000}
                        alt="Eqariah logo"
                        className=" h-auto w-[8%]"
                        priority
                    />
                    <NavLink
                        href="/"
                        className=" text-white text-[4vw] md:text-[4.8vw] lg:text-2xl font-bold"
                    >
                        SMA PGRI 1 GOMBONG
                    </NavLink>
                </div>

                {/* laptop section */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden text-white focus:outline-none"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6 md:h-8 md:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                        />
                    </svg>
                </button>

                <div className="hidden lg:flex items-center space-x-4">
                    <div className="flex space-x-4">
                        {navLinks.map(({ href, label }) => (
                            <NavLink
                                key={href}
                                href={href}
                                className="text-white text-lg whitespace-nowrap bg-gray-700 hover:bg-gray-600 transition-colors duration-200 px-4 py-2 rounded-xl "
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>

                    {isLogin ? (
                        <div
                            className="text-xl font-medium text-white cursor-pointer  bg-gray-700 hover:bg-gray-600 transition-colors duration-200 px-4 py-2 rounded-xl "
                            onClick={handleLogout}
                        >
                            Logout
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2 text-white  bg-gray-700 hover:bg-gray-600 transition-colors duration-200 px-4 py-2 rounded-xl ">
                            <NavLink
                                href="/login"
                                className="text-xl font-medium"
                            >
                                Login
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>

            {/* mobile section */}
            <div
                className={`lg:hidden absolute w-full bg-yellow-500 transition-all duration-500 ease-in-out 
                    ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} shadow-lg`}
            >
                <div className="px-[4%] py-[4%] space-y-[3%]">
                    {navLinks.map(({ href, label }) => (
                        <NavLink
                            key={href}
                            href={href}
                            className="block text-white text-[3vw]"
                        >
                            {label}
                        </NavLink>
                    ))}

                    {isLogin ? (
                        <div
                            className="text-white text-[3.3vw] font-medium cursor-pointer"
                            onClick={handleLogout}
                        >
                            Logout
                        </div>
                    ) : (
                        <div className="flex items-center space-x-[2%] pt-[5%] border-t border-white/20">
                            <NavLink
                                href="/login"
                                className="text-white text-[3.3vw] font-medium"
                            >
                                Login
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}