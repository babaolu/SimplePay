"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import QRCode, { QRCodeToDataURLOptions } from "qrcode";
import jsQR from "jsqr";

export default function GenerateCode() {
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [genCode, setGenCode] = useState('');
  const imgRef = useRef<HTMLImageElement>(null); // Reference for the image
  
  function generateQR(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    console.log("FormData: ", formData);
    
    const opts: QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'H',  // High error correction level
      type: 'image/png',
      margin: 2,
    };
    
    //Generate QR code
    QRCode.toDataURL(JSON.stringify(formData), opts)
      .then((url: string) => {
        console.log(url);
        setGenCode(url);  // Update state with generated QR code url
      })
      .catch((err: string) => {
        console.error(err)
      });
    setIsFormVisible(false);
  }

  function handleDecode() {
    // Obtaining canvas element for qr image decoding
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    
    if (context && imgRef.current) {
      const img = imgRef.current;
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the qr image on the canvas
      context.drawImage(img, 0, 0);
      // Collect image data
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);
      if (code) {
        console.log("Found QR code", code);
        const parsedData = JSON.parse(code.data);
        console.log("Acc No:", parsedData.number, 
          "\nBank Name:", parsedData.bankname);
      } else { console.log("No QR code found"); }
    } else { console.error("Couldn't get image ref or context"); }
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        
        {isFormVisible ? (<form action="" onSubmit={generateQR}
          className="flex gap-4 items-center flex-col">
          <div className="flex-1 px-3 py-2 border rounded-md text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <label htmlFor="number">Account number: </label>
            <input type="text" name="number" id="number" required />
          </div>
          <div className="flex-1 px-3 py-2 border rounded-md text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <label htmlFor="bankname">Bank Name: </label>
            <input type="text" name="bankname" id="bankname" required />
          </div>
          <div className="flex rounded-full bg-foreground text-background border border-solid items-center justify-center text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 hover:bg-[#770707] transition-colors max-w-18 gap-2">
            <input type="submit" value="Encode!" />
          </div>
        </form>) :
        (<div className="flex items-center gap-2 hover:underline hover:underline-offset-4">
          <Image
            ref={imgRef}
            id="qrcode"
            aria-hidden
            src={genCode}
            alt="QR Code"
            width={256}
            height={256}
            onLoad={handleDecode}
          />
        </div>)}
      </main> 
    </div>
  );
}
