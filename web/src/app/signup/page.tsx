"use client";

import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider,
    signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { app } from "../firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backRequest from "../utils/backRequest";
import background from "../../../public/background.png";

export default function Signup() {
    const [error, setError] = useState(null);
    const [show, setShow] = useState(true);
    const [user, setUser] = useState({
      fname: "",
      lname: "",
      email: "",
      password: "",
    });
    const router = useRouter();
  
    //handle all notifications
  
    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
      setUser((prev) => {
        return { ...prev, [event.target.name]: event.target.value };
      });
    };

    // Function to check if all fields are filled
  const isFormValid = () => {
    return Object.values(user).every((field) => field.trim() !== '');
  };
  
    async function handleGoogleClick() {
      try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        const result = await signInWithPopup(auth, provider);
        const googleUser = result.user;
        console.log(googleUser);
        await backRequest.post("/create/google", {
          id: googleUser.uid,
          email: googleUser.email,
        });
  
        // Show success notification
        toast.success("Signup successful!", { position: "top-right" });

        router.replace("/signup/addition");
      } catch (err) {
        console.log("could not login with google", err);
        setError(err.response.data);
        // Show error notification
        toast.error(error || "Signup failed. Please try again.", {
          position: "top-right",
        });
      }
    };
  
    async function handleSubmit(event : React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const auth = getAuth(app);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
        // Signed in 
        const emailUser = userCredential.user;
        // Perform further actions with the user object
        console.log(emailUser);
        await backRequest.post("/create", {
          id: emailUser.uid,
          firstName: user.fname,
          lastName: user.lname,
          email: user.email,
        });
        // Show success notification
        toast.success("Signup successful!", { position: "top-right" });
        
        router.push("/home");
      } catch (err) {
        console.log("could not login", error);
        setError(err.response.data);
        // Show error notification
        toast.error(error || "Signup failed. Please try again.", {
          position: "top-right",
        });
      }
      }
  
    const handleShow = () => {
      setShow(!show);
    };
  
    return (
      // Container
      <div className="flex justify-center items-center h-screen w-full relative ">
        {/* <!-- Right: Login Form --> */}
        <div className=" w-full h-screen lg:w-2/3 flex flex-col justify-between items-center">
  
          <div className="bg-white flex-1 flex-shrink-1 max-w-sm pt-6 px-5 pb-12 inline-block max-h-max mt-14 rounded-xl">
            <h4 className="max-w-[450px] mx-auto text-[#333] text-2xl font-normal mb-6">
              Create an account
            </h4>
            {/* <!-- Google Login --> */}
            <div className="flex items-center justify-between max-w-[450px] mx-auto">
              <button type="button"
                className="font-medium bg-white shadow-bshadow border py-2 w-full rounded-xl flex justify-center items-center text-sm hover:bg-gray-100 focus:outline-none"
                onClick={handleGoogleClick}
              >
                {/* <!-- google logo svg --> */}
                <svg
                  className="mr-3"
                  viewBox="0 0 48 48"
                  width="20px"
                  height="25px"
                >
                  <title>Google Logo</title>
                  <clipPath id="g">
                    <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
                  </clipPath>
                  <g className="colors" clipPath="url(#g)">
                    <path fill="#FBBC05" d="M0 37V11l17 13z" />
                    <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                    <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                    <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
                  </g>
                </svg>
                Login with Google
              </button>
            </div>
            {/* <!-- OR Separator --> */}
  
            <div className="mt-5 mb-4 grid grid-cols-3 items-center text-gray-500 max-w-[450px] mx-auto">
              <hr className="outline-gray-400" />
              <p className="text-center text-sm">Or continue with</p>
              <hr className="outline-gray-400" />
            </div>
  
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
              <div className="max-w-[450px] mx-auto">
                <label
                  htmlFor="email"
                  className="text-[#344054] text-sm font-normal mb-1 inline-block"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input focus:outline-none focus:border-[#0e9f6e] focus-within:outline-none focus-within:border-[#0e9f6e] placeholder:text-sm placeholder:text-[#BEB5C3]"
                  placeholder="your@email.com"
                  onChange={handleChange}
                />
              </div>
              {/* <!-- Password Input --> */}
              <div className="max-w-[450px] mx-auto mt-3 leading-normal">
                <label
                  htmlFor="password"
                  className="text-[#344054] text-sm font-normal mb-1 inline-block"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={show ? "password" : "text"}
                    id="password"
                    name="password"
                    minLength={8}
                    className="input focus:outline-none focus:border-[#0e9f6e] focus-within:outline-none focus-within:border-[#0e9f6e] placeholder:text-sm placeholder:text-[#BEB5C3] "
                    placeholder="Password (min 8 characters)"
                    onChange={handleChange}
                  />
                  <div
                    className="absolute top-0 right-0 bottom-0 flex items-center justify-center w-8 cursor-pointer"
                    onClick={handleShow}
                  >
                    {show ? (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.3536 2.35355C13.5488 2.15829 13.5488 1.84171 13.3536 1.64645C13.1583 1.45118 12.8417 1.45118 12.6464 1.64645L10.6828 3.61012C9.70652 3.21671 8.63759 3 7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C0.902945 9.08812 2.02314 10.1861 3.36061 10.9323L1.64645 12.6464C1.45118 12.8417 1.45118 13.1583 1.64645 13.3536C1.84171 13.5488 2.15829 13.5488 2.35355 13.3536L4.31723 11.3899C5.29348 11.7833 6.36241 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C14.0971 5.9119 12.9769 4.81391 11.6394 4.06771L13.3536 2.35355ZM9.90428 4.38861C9.15332 4.1361 8.34759 4 7.5 4C4.80285 4 2.52952 5.37816 1.09622 7.50001C1.87284 8.6497 2.89609 9.58106 4.09974 10.1931L9.90428 4.38861ZM5.09572 10.6114L10.9003 4.80685C12.1039 5.41894 13.1272 6.35031 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11C6.65241 11 5.84668 10.8639 5.09572 10.6114Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </div>
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