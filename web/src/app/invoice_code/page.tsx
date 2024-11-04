"use client";
import Image from "next/image";
import { useState, useRef, useEffect, use } from "react";
import QRCode, { QRCodeToDataURLOptions } from "qrcode";
import jsQR from "jsqr";
import axios from "axios";

export default function GenerateCode() {
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [genCode, setGenCode] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isDropDown, setIsDropDown] = useState(false);
  const [isAccNameVisible, setIsAccNameVisible] = useState(false);
  const [bankEntries, setBankEntries] = useState<Array<[ string, string ]>>([]);
  const [filteredBanks, setFilteredBanks] = useState<Array<[ string, string ]>>(bankEntries);
  const imgRef = useRef<HTMLImageElement>(null); // Reference for the image

  useEffect(() => {
    // Validating Bank credentials
    (async () => {
      let options = {
        method: 'GET',
        url: 'https://nubapi.com/banks',
        headers: {accept: 'application/json', 'Content-Type': 'application/json'
        }
      };
      try {
        const response = await axios.request(options);
        setBankEntries(Object.entries(response.data));
        setFilteredBanks(bankEntries);
        console.log("Accounts:\n", filteredBanks);
      } catch(error) {
        console.error(error);
      }
    
    })();
  }, []);

  useEffect(() =>{
    // Validating account credentials
    (async function handleAccValidation() {
    const bankEntry = bankEntries.find((entry) => {
      return bankName.toUpperCase() === entry[1].toUpperCase();
    })
    if (bankEntry) {
      console.log("Found!")
      let options = {
        method: 'GET',
        url: `https://nubapi.com/api/verify?account_number=${accNumber}&bank_code=${bankEntry[0]}`,
        headers: {'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NUBAPI_TOKEN}`
        }
      };
      try {
        const response = await axios.request(options);
        console.log("Account:\n", response.data);
        if (response.data) {
          setAccountName(response.data.account_name);
          setIsAccNameVisible(true);
          setIsDropDown(false);
        } else {
          setIsAccNameVisible(false);
          setIsDropDown(true);
        }
      } catch(error) {
        console.error(error);
      }
    }
  })();
  }, [bankName]);

  function filterBankNames(event: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = event.target.value;
    setBankName(inputValue);  // Update bankName state with current input value
    console.log("Responsiveness:", bankName);
    if (inputValue.length === 0) {
      setFilteredBanks(bankEntries); // Reset filtered banks
    } else {
      setFilteredBanks(bankEntries.filter((entry) => {
        return entry[1].toUpperCase().includes(inputValue.toUpperCase());
      }));
    }
    //handleAccValidation();
  }
  
  function generateQR(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    console.log("FormData: ", formData);
    if (accountName) {formData['account_name'] = accountName}
    
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

  function handleAccChange(event : React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value.length === 10) {
      setAccNumber(event.target.value);
      console.log("event value:", event.target.value);
      console.log("state update value:", accNumber);
    }
  };

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
    <div className="flex overflow-y-auto bg-gray-500/50 justify-center items-center h-screen w-full relative font-[family-name:var(--font-geist-sans)] justify-items-center">
      <main className="flex flex-col bg-white/90 rounded-xl py-40 px-16 items-center sm:items-start">
        
        {isFormVisible ? (<form action="" onSubmit={generateQR}
          className="flex gap-4 items-center flex-col">
          <div className="flex-1 px-3 py-2 border rounded-md text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <label htmlFor="number">Account number: </label>
            <input type="text" maxLength={10} inputMode="numeric" name="number"
            id="number" onChange={handleAccChange} required />
          </div>
          <div className="flex-1 px-3 py-2 border rounded-md text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <label htmlFor="bankname">Bank Name: </label>
            <input type="text" name="bankname" id="bankname" disabled={accNumber.length !== 10}
            onChange={filterBankNames}
            onFocus={() => setIsDropDown(true)} value={bankName} required />
          </div>
          {isAccNameVisible && <p className="font-sans text-blue-950 tracking-tighter">{accountName}</p>}
          {isDropDown && (
            <ul className="border border-gray-300 max-h-[150px] overflow-y-auto">
              {filteredBanks.map((bank) => (
                <li key={bank[0]}
                  className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                  onClick={() => {setBankName(bank[1]); setIsDropDown(false);}}>
                  {bank[1]}
                </li>
              ))}
            </ul>
          )}
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
            className="lg:w-80 lg:h-80"
            onLoad={handleDecode}
          />
        </div>)}
      </main> 
    </div>
  );
}
