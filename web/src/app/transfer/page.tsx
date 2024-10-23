"use client";
import { useState, useRef } from "react";
import { Html5Qrcode, CameraDevice } from "html5-qrcode";

export default function Scanner() {
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDecodedVisible, setIsDecodedVisible] = useState(false);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [isFileChoice, setIsFileChoice] = useState(false);
  const [genCode, setGenCode] = useState({number: "", bankname: ""});
  const scannerRef = useRef<Html5Qrcode | null>(null);

  function selectCamera() {
    setIsFileChoice(false);
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

  function selectFile() {
    setIsFileChoice(true);
    setIsScannerVisible(true);
    setIsDecodedVisible(false);
  }

  function fileScan(event : React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files?.length === 0) { return; }
    
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("reader");
    }

    scannerRef.current?.scanFile(event.target.files[0], false)
    .then(decodedText => {
    console.log(`Code matched = ${ decodedText }`);
    setGenCode(JSON.parse(decodedText));
    setIsFileChoice(false);
    setIsScannerVisible(false);
    setIsDecodedVisible(true);
    })
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
            {isDropdownVisible && (<div className="bg-white border rounded p-4 mt-2">
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
            </div>)}
            {isFileChoice && (<div>
            <label htmlFor="QRfile">Select QR File</label>
            <input id="QRfile" type="file" accept="image/*" onChange={fileScan}/>
            </div>)}
            <button onClick={selectFile}
              className="flex rounded-full bg-blue-600 text-background border border-solid items-center justify-center text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 hover:bg-blue-500 transition-colors max-w-18 gap-2">
              File Scan
            </button>
          </div>)
        }
      </main>
    </div>
  );
}
