import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SimplePay - Home",
  description: "Home of SimplePay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}

/**
* Specifies the header layout for all pages
*/
function Header() {
  return (
    <header className="row-start-3 flex gap-6 flex-wrap bg-[#d3e8eb]">
      <nav className="w-full flex flex-row">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          aria-label="Logo visit to Home"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/logo.png"
            alt="App logo"
            width={350}
            height={80}
          />
        </a>
      <Link href="/login">Login</Link></nav>
    </header>
  );
}

/**
* Specifies the footer layout for all pages
*/
function Footer() {
  return (
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
    <p>&#xA9;2024 SimplePay</p>
    </footer>
  );
}