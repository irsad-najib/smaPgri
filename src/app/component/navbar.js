"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiLogIn, FiLogOut } from "react-icons/fi";

const NavLink = ({ href, children, className = "", onClick }) => (
    <Link
        href={href}
        onClick={onClick}
        className={`hover:text-gray-200 transition-colors duration-200 ${className}`}
    >
        {children}
    </Link>
);

const navLinks = [
    { href: "/Post", label: "Postingan" },
];

const dashboardDropdown = [
    { id: "Home", label: "Home" },
    { id: "profile", label: "Profile" },
    { id: "VISI MISI", label: "VISI MISI" },
    { id: "ekstrakurikuler", label: "Ekstrakurikuler dan Fasilitas" },
    { id: "sambutan", label: "Sambutan Kepala Sekolah" },
    { id: "Testimoni", label: "Testimoni Alumni" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        setIsLogin(false);
        router.push("/");
    };

    const handleScrollToSection = (id) => {
        if (typeof window === "undefined") return;
        if (window.location.pathname !== "/") {
            router.push(`/#${id}`);
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <nav className="sticky bg-yellow-500 py-[3%]  w-full lg:py-2 shadow top-0 z-50">
            <div className="container mx-auto flex justify-around items-center px-[4%]">
                <div className="flex items-center">
                    <Image
                        src="/yayasan.png"
                        alt="Logo Yayasan"
                        width={10000}
                        height={10000}
                        className="h-auto w-[9%]"
                        priority
                    />
                    <Image
                        src="/sekolah.png"
                        width={10000}
                        height={10000}
                        alt="Logo Sekolah"
                        className="h-auto w-[8%]"
                        priority
                    />
                    <NavLink
                        href="/"
                        className="text-white text-[4vw] md:text-[4.8vw] lg:text-2xl font-bold"
                    >
                        SMA PGRI 1 GOMBONG
                    </NavLink>
                </div>

                {/* Toggle button mobile */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden text-white focus:outline-none"
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-6 h-6 md:h-8 md:w-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                        />
                    </svg>
                </button>

                {/* Desktop */}
                <div className="hidden lg:flex items-center space-x-4">
                    {/* Dashboard Dropdown */}
                    <div className="relative group">
                        <div className="text-white text-lg bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl cursor-pointer">
                            Beranda
                        </div>
                        <div className="absolute left-0 mt-2 w-40 bg-gray-700 rounded-xl shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 invisible group-hover:visible z-50">
                            {dashboardDropdown.map(({ id, label }) => (
                                <div
                                    key={id}
                                    onClick={() => handleScrollToSection(id)}
                                    className="block text-white text-sm text-justify px-4 py-2 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                >
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {navLinks.map(({ href, label }) => (
                        <NavLink
                            key={href}
                            href={href}
                            className="text-white text-lg whitespace-nowrap bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl"
                        >
                            {label}
                        </NavLink>
                    ))}

                    {isLogin ? (
                        <div
                            className="flex items-center space-x-2 text-white text-lg bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl cursor-pointer"
                            onClick={handleLogout}
                        >
                            <FiLogOut />
                            <span>Logout</span>
                        </div>
                    ) : (
                        <NavLink
                            href="/login"
                            className="flex items-center space-x-2 text-white text-lg bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl"
                        >
                            <FiLogIn />
                            <span>Login</span>
                        </NavLink>
                    )}
                </div>
            </div>

            {/* Mobile dropdown menu */}
            <div
                className={`lg:hidden absolute w-full bg-yellow-500 transition-all duration-500 ease-in-out 
                    ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"} shadow-lg`}
            >
                <div className="px-[4%] py-[4%] space-y-[3%]">
                    {/* Toggle dashboard submenu */}
                    <div>
                        <div
                            className="text-white text-[3.3vw] font-medium cursor-pointer"
                            onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                        >
                            Dashboard {mobileDropdownOpen ? "▲" : "▼"}
                        </div>
                        {mobileDropdownOpen && (
                            <div className="pl-4 mt-1 space-y-1">
                                {dashboardDropdown.map(({ id, label }) => (
                                    <div
                                        key={id}
                                        onClick={() => {
                                            handleScrollToSection(id);
                                            setIsOpen(false);
                                        }}
                                        className="block text-white text-[3vw] cursor-pointer"
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Nav items */}
                    {navLinks.map(({ href, label }) => (
                        <NavLink
                            key={href}
                            href={href}
                            className="block text-white text-[3vw]"
                        >
                            {label}
                        </NavLink>
                    ))}

                    {/* Auth */}
                    {isLogin ? (
                        <div
                            className="flex items-center space-x-2 text-white text-[3.3vw] font-medium pt-[5%] border-t border-white/20 cursor-pointer"
                            onClick={handleLogout}
                        >
                            <FiLogOut />
                            <span>Logout</span>
                        </div>
                    ) : (
                        <NavLink
                            href="/login"
                            className="flex items-center space-x-2 text-white text-[3.3vw] font-medium pt-[5%] border-t border-white/20"
                        >
                            <FiLogIn />
                            <span>Login</span>
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
}
