import React, { useState } from "react";
import img from "../../assets/images/frontHero/home header3.jpg";
import IcnGoogle from "../../components/svg/IcnGoogle";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";
import './AuthMaster.css'
import video1 from '../../assets/videos/video1.mp4'
import video2 from '../../assets/videos/video2.mp4'

const AuthMaster = () => {
  return (
    <>
      {/* <div className="w-full bg-backgroundv1 text-textPrimary grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="w-full hidden lg:flex md:justify-center md:items-center col-span-1">
          <div className="image_wrapper h-full w-full overflow-hidden">
            <img src={img} className="object-cover h-full w-full" alt="Logo" />
          </div>
        </div>

        <div className="w-full flex flex-col justify-center items-center text-center gap-8 col-span-2 md:col-span-1">
          <h1 className="capitalize text-3xl sm:text-4xl md:text-5xl">
            Happening now
          </h1>
          <h4 className="text-xl sm:text-2xl">Join today.</h4>
          <div className="w-full sm:w-3/4 md:w-1/2 lg:w-3/4 p-4 md:p-0">
            <button
              className={cn(
                Buttonvariants({ variant: "black" }),
                "bg-black dark:bg-white hover:bg-white dark:hover:bg-black gap-2 md:gap-3"
              )}
              onClick={() => console.log("sign Up with google")}
            >
              <IcnGoogle className="h-5 w-5 md:h-6 md:w-6" />
              <span className="text-base md:text-lg  text-gray-400">
                Sign Up With Google
              </span>
            </button>
            <div className="flex flex-row justify-center items-center my-3 mx-5">
              <hr className="w-full border-[1px] border-gray-500/20" />
              <span className="mx-1">or</span>
              <hr className="w-full border-[1px] border-gray-500/20" />
            </div>
            <Link
              className={cn(
                Buttonvariants({ variant: "blue" }),
                "gap-2 md:gap-3"
              )}
              to={"/register"}
            >
              <span className="text-base md:text-lg ">Create Account</span>
            </Link>
          </div>

          <div className="w-full sm:w-3/4 md:w-1/2 lg:w-3/4 p-4 md:p-0 mt-5 flex flex-col items-center sm:items-start">
            <h5 className="text-md mb-3">Already have an account ?</h5>
            <Link
              className={cn(
                Buttonvariants({ variant: "black" }),
                "bg-backgroundv1 hover:bg-slate-300 dark:hover:bg-white gap-2 md:gap-3"
              )}
              to={"/login"}
            >
              <span className="text-base md:text-lg text-blue-500">
                Sign In
              </span>
            </Link>
          </div>
        </div>
      </div> */}

      <main className="main-auth">
        <header className="video-header">
          <video
            src={video2}
            autoPlay
            loop
            playsInline
            muted
            className="auth-video"
          ></video>

          <div className="auth-header-text">
            <h1>Welcome to Our</h1>
            <span>Community Hub!</span>
            <div className="mainAuth">
              <Link to={"/login"} className="sign-in"> Sign In </Link>
              <Link to={"/register"} className="sign-up"> Sign Up </Link>
            </div>
          </div>

          <div className="description">
            <p>
              At <span>NexUnity</span>, we believe in the power of connection,
              collaboration, and community. Whether you're a longtime resident
              or a newcomer to our area, you're invited to join our vibrant
              online platform dedicated to fostering meaningful relationships,
              sharing valuable resources, and celebrating our collective
              experiences.
            </p>
          </div>
        </header>
      </main>
    </>
  );
};

export default AuthMaster;
