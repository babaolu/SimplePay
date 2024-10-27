import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import backRequest from "./utils/backRequest";

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
  title: "SimplePay",
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const authState = sessionStorage.getItem('authState'); // Alternatively, fetch from cookies
    setIsAuthenticated(authState === 'true');
    async () => {
      try {
        const result = await backRequest.get("/user");
      } catch(error) {
        console.error("Layout error:", error);
      }
    };
  }, []);

  return (
    <header className="row-start-3 flex gap-6 flex-wrap bg-[#d3e8eb]">
      <nav className="w-full flex flex-row">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          aria-label="Logo visit to Home"
          href="/home"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/logo.png"
            alt="App logo"
            width={350}
            height={80}
          />
        </Link>
        <div className="ml-auto my-auto mr-4 flex gap-4 text-[#083316] text-2xl font-bold">
          {isAuthenticated ? <>
            <Link href="/login">Login</Link>
            <Link href="/signup">SignUp</Link>
          </> : <>
            <h2>{firstName}</h2>
            <Link href="/logout">LogOut</Link>
          </>
          }
        </div>
      </nav>
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