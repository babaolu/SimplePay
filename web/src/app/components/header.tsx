"use client";

import Link from "next/link";
import Image from "next/image";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import backRequest from "../utils/backRequest";

/**
* Specifies the header layout for all pages
*/
export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [firstName, setFirstName] = useState("");
    const auth = getAuth(app);
    const router = useRouter();
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
          sessionStorage.setItem("authState", "true");
          user.getIdToken().then((token) => {
            // Store token or set default header for Axios
            sessionStorage.setItem("authToken", token);
            backRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            sessionStorage.setItem("authToken", backRequest.defaults.headers.common["Authorization"]);
            //console.log("Header Token:", backRequest.defaults.headers.common);
            fetchUserData();
          });
        } else {
          setIsAuthenticated(false);
          sessionStorage.setItem("authState", "false");
          delete backRequest.defaults.headers.common["Authorization"];
        }
      });
  
      return () => unsubscribe();
    }, []);

    async function fetchUserData() {
      try {
        const result = await backRequest.get("/user");
        setFirstName(result.data.firstName);
        console.log(firstName);
      } catch(error) {
        console.error("Layout error:", error);
      }
    }
    
    async function handleLogOut(event : React.MouseEvent<HTMLAnchorElement>) {
      event.preventDefault(); // Prevents the link from navigating
      await auth.signOut();
      router.push("/home"); // Manually navigate to "/login" after sign-out
    }
  
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
            {!isAuthenticated ? <>
              <Link href="/login">Login</Link>
              <Link href="/signup">SignUp</Link>
            </> : <>
              <h2>{firstName}</h2>
              <Link href="#" onClick={handleLogOut}>LogOut</Link>
            </>
            }
          </div>
        </nav>
      </header>
    );
  }
  