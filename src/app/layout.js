import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./component/navbar";
import Footer from "./component/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SMA PGRI 1 GOMBONG",
  description: "Website SMA PGRI 1 GOMBONG",
  icons: {
    icon: "/logo_sekolah.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Navbar />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html >
  );
}
