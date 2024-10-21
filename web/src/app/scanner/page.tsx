"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Html5Qrcode, CameraDevice } from "html5-qrcode";

export default function Scanner() {
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDecodedVisible, setIsDecodedVisible] = useState(false);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [genCode, setGenCode] = useState({number: "", bankname: ""});
  const scannerRef = useRef<Html5Qrcode | null>(null);

  function selectCamera() {
    setIsScannerVisible(true);
    setIsDecodedVisible(false);
    Html5Qrcode.getCameras()
    .then((devices) => {
      setCameras(devices);
      console.log(devices);
      if (!scannerRef.current) {
        const codeReader = new Html5Qrcode("reader");
        scannerRef.current = codeReader;
      }
      setIsDropdownVisible(true);
    })
    .catch((err) => {
      console.error("Error fetching cameras: ", err);
    });
  }

  function cameraScan(cameraId: string) {
    setIsDropdownVisible(false);
    scannerRef.current?.start(
      { deviceId: { exact: cameraId } },
      {
        fps: 10,
        qrbox: { width: 512, height: 512 },
      },
      onScanSuccess,
      onScanFailure
    );
  }

  function fileScan(codeReader: Html5Qrcode) {
    if (!scannerRef.current) {
      setIsScannerVisible(true);
      const codeReader = new Html5Qrcode("reader");
      scannerRef.current = codeReader;
    }
  }

  function onScanSuccess(decodedText : string, decodedResult : object) {
    console.log(`Code matched = ${ decodedText }`, decodedResult);
    setGenCode(JSON.parse(decodedText));
    scannerRef.current?.stop();
    setIsScannerVisible(false);
    setIsDecodedVisible(true);
  }

  function onScanFailure(error: string) {
    console.warn(`Code scan error = ${ error }`);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      
        {
          (<div className="justify-center items-center justify-items-center">
            {isScannerVisible ? (
              <div className="w-full max-w-xl h-auto flex items-center"
                id="reader"></div>
            ) : isDecodedVisible && (
            <div>
              <p>Account No: {genCode.number}</p>
              <p>Bank Name: {genCode.bankname}</p>
            </div>
            )}
            <button onClick={selectCamera}
              className="flex rounded-full bg-foreground text-background border border-solid items-center justify-center text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 hover:bg-[#bd2e1e] transition-colors max-w-18 gap-2">
              Camera Scan
            </button>
            {/* Dropdown list of available cameras */}
        {isDropdownVisible && (
          <div className="bg-white border rounded p-4 mt-2">
            {cameras.map((camera) => (
            <button
              type="button"
              key={camera.id}
              onClick={() => cameraScan(camera.id)}
              className="block text-left w-full py-2 px-4 hover:bg-gray-200 cursor-pointer"
              >
              {camera.label || `Camera ${camera.id}`}
            </button>
          ))}
         </div>
        )}
            <button onClick={() => scannerRef.current && fileScan(scannerRef.current)}
              className="flex rounded-full bg-blue-600 text-background border border-solid items-center justify-center text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 hover:bg-blue-500 transition-colors max-w-18 gap-2">
              File Scan
            </button>
          </div>)
        }
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
