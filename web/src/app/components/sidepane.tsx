"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MonoButton from "./monolink";
import backRequest from "../utils/backRequest";
import { app } from "../firebase";

export default function SidePane() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transferLink, setTransferLink] = useState("");
  const [isLinked, setIsLinked] = useState(false);
  const [{fullName, accountNumber, balance, bankName, currency},
    setBalance_details] = useState({fullName: '', accountNumber: '',
      balance: '', bankName: '', currency: ''
    });
    const auth = getAuth(app);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setTransferLink("/transfer")
        sessionStorage.setItem("authState", "true");
        user.getIdToken().then((token) => {
          // Store token or set default header for Axios
          sessionStorage.setItem("authToken", token);
          backRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          sessionStorage.setItem("authToken", backRequest.defaults.headers.common["Authorization"]);
          //console.log("Header Token:", backRequest.defaults.headers.common);
          fetchAccountData();
        });
      } else {
        setIsAuthenticated(false);
        setTransferLink("/login");
        sessionStorage.setItem("authState", "false");
        delete backRequest.defaults.headers.common["Authorization"];
      }
    });

    return () => unsubscribe();
    if (sessionStorage.getItem("authState") === "true") {
        backRequest.defaults.headers.common["Authorization"] 
          = sessionStorage.getItem("authToken");
        console.log("SidePane Token:", backRequest.defaults.headers.common);
    } else {
        setIsAuthenticated(false);
    }
  }, [fullName, isAuthenticated]);


  async function fetchAccountData() {
    try {
      console.log("fetchAccountData called!");
      const result = await backRequest.get("/account");
      setBalance_details(result.data);
      console.log('Account linked:', fullName);
      if (fullName) {
        setIsLinked(true);
      } else {
        setIsLinked(false);
        console.log("Data not retrieved!")
      }
    } catch(error) {
      console.error("Layout error:", error);
    }
  }

  return (
    <div className={`flex min-h-screen bg-gray-800 text-white transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="items-center justify-between p-4 border-b border-gray-600">
          <button
            className="text-gray-300 hover:text-white"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
        </div>

        <nav className="mt-4 space-y-2">
          <Link href="/invoice_code"
            className="block px-4 py-2 hover:bg-gray-700">
              <span className={`${isCollapsed ? "hidden" : "inline"}`}>Generate QR</span>
          </Link>
          <Link href={transferLink}
            className="block px-4 py-2 hover:bg-gray-700">
              <span className={`${isCollapsed ? "hidden" : "inline"}`}>Make Transer</span>
          </Link>
          {/* Add more links here */}
          {isAuthenticated && (<span className={`${isCollapsed ? "hidden" : "inline"}`}>
            {isLinked? <div className="flex flex-col px-4 py-8">
              <span>{fullName}</span>
              <span>{accountNumber}</span>
              <span>{`${balance}${currency}`}</span>
              <span>{bankName}</span>
            </div> : <MonoButton/>}
          </span>)}
        </nav>
    </div>
  );
}
