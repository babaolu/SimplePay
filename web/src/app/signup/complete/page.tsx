"use client";

import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { app } from "../../firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backRequest from "../../utils/backRequest";
import background from "../../../../public/background.png";

export default function CompleteGoogleSignUp() {
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    fname: "",
    lname: "",
  });
  const router = useRouter();
  const auth = getAuth(app);
  
  const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };

  // Function to check if all fields are filled
  const isFormValid = () => {
    return Object.values(user).every((field) => field.trim() !== '');
  };
  
  
  async function handleSubmit(event : React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const completeUser = auth.currentUser;
      // Perform further actions with the user object
      console.log(completeUser);
      await backRequest.post("/create", {
        id: completeUser?.uid,
        firstName: user.fname,
        lastName: user.lname,
        email: completeUser?.email
      });
      // Show success notification
      toast.success("Signup successful!", { position: "top-right" });
      
      await auth.signOut();
      router.push("/home");
    } catch (err: any) {
      console.log("could not login", error);
      if (err.response) {
        setError(err.response.data);
      }
      
      // Show error notification
      toast.error(error || "Signup failed. Please try again.", {
        position: "top-right",
      });
    }
  }

  useEffect(() => {
    const handleBeforeUnload = async (event : BeforeUnloadEvent) => {
      if (!isFormValid) {
        event.preventDefault();
        await auth.currentUser?.delete();
        alert("Proper name not provided")
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormValid]);
  
    return (
      // Container
      <div className="flex overflow-y-auto justify-center items-center h-screen w-full relative font-[family-name:var(--font-geist-sans)] justify-items-center">
        <div className=" w-full h-screen lg:w-2/3 flex flex-col justify-between items-center">
  
          <div className="bg-white border-double border-8 border-stone-950 flex-auto max-w-xl pt-6 px-5 pb-12 inline-block max-h-max mt-14 rounded-xl">
            <h4 className="max-w-[450px] mx-auto text-[#333] text-2xl font-normal mb-6">
              Complete SignUp
            </h4>
  
            <form onSubmit={handleSubmit}>
              {/* <!-- First Name Input --> */}
              <div className="relative max-w-[450px] mx-auto flex sm:flex-col lg:flex-row justify-between items-center mb-3">
                <div className="w-[48%] relative">
                  <label
                    htmlFor="fname"
                    className="text-[#344054] text-sm font-normal mb-1 inline-block"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="fname"
                    name="fname"
                    className="input focus:outline-none focus:border-[#0e9f6e] focus-within:outline-none focus-within:border-[#0e9f6e] placeholder:text-sm placeholder:text-[#BEB5C3]"
                    placeholder="First name"
                    onChange={handleChange}
                  />
                </div>
                {/* <!-- Last Name Input --> */}
                <div className="w-[48%] relative">
                  <label
                    htmlFor="lname"
                    className="text-[#344054] text-sm font-normal mb-1 inline-block"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lname"
                    name="lname"
                    className="input focus:outline-none focus:border-[#0e9f6e] focus-within:outline-none focus-within:border-[#0e9f6e] placeholder:text-sm placeholder:text-[#BEB5C3]"
                    placeholder="Last name"
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* <!-- Terms checkbox --> */}
              <div className="mt-4 mb-5 max-w-[450px] mx-auto flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  className="w-3 h-3 text-blue-600"
                />
                <label htmlFor="terms" className="text-gray-600 ml-2 text-xs">
                  Yes, I agree to SimplePay's{" "}
                  <a href="" className="text-[#6941c6]">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="" className="text-[#6941c6]">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
  
              {/* <!-- Signup Button --> */}
              <div className="max-w-[450px] mx-auto mt-4">
                <button
                  type="submit"
                  className="text-white text-sm w-fit !bg-[#0E9F6E]  hover:!bg-[#046c4e] font-semibold rounded-md py-2 px-4 tracking-[0.05em]"
                  disabled={!isFormValid()}
                >
                  Signup
                </button>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                <ToastContainer/>
              </div>
            </form>
          </div>
        </div>
  
        {/* <!-- Right: Image --> */}
        <div className="w-1/3 h-screen hidden border-l-2 relative lg:flex lg:flex-col lg:justify-between">
          <div className="relative h-full">
            <Image
              aria-hidden
              src={background}
              alt="Background Image"
              className="object-cover w-full h-full max-w-full max-h-full rounded-tl-3xl"
            /> 
          </div>
        </div>
      </div>
    );
}