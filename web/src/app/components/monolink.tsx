import { useState, useCallback } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import backRequest from "../utils/backRequest";

export default function MonoButton() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const router = useRouter();

  const openMonoWidget = useCallback(async () => {
  const MonoConnect = (await import("@mono.co/connect.js")).default;
    
  const monoInstance = new MonoConnect({
    key: process.env.NEXT_PUBLIC_MONO_KEY,
    onClose: () => console.log("Widget closed"),
    onLoad: () => setScriptLoaded(true),
    onSuccess: ({ code }: { code: string }) => {
      console.log(`Linked successfully: ${code}`);
      (async () => {
        try {
          await backRequest.post("/link_account", {
            linkcode: code 
          });

          toast.success("Account linked!", { position: "top-right" });
          sessionStorage.setItem("linked", "true");
          await getAuth(app).currentUser?.reload();
          router.push("/transfer");
        } catch(error) {
          console.error(error);
          toast.error("Link failed!", { position: "top-right" });
          router.push("/home");
        }
      })();
    },
  });
    monoInstance.setup();
    monoInstance.open();
  }, []);

  return (
    <div className="mt-10 p-4">
      <button onClick={() => {openMonoWidget()}}>
        Link a financial account
      </button>
      <ToastContainer/>
    </div>
  );
}