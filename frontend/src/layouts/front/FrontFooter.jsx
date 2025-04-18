import {
  FacebookIcon,
  InstagramIcon,
  Linkedin,
  TwitterIcon,
} from "lucide-react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import darkLogo from "../../assets/images/darkLogo.jpeg";
import lightLogo from "../../assets/images/whiteLogo.png";

import { ThemeContext } from "../../context/ThemeContext";
import GoToTop from "../../components/common/GoToTop";

const FrontFooter = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <>
        <footer className="mx-auto  w-screen border-t text-textPrimary py-3 pt-6 xsm:pt-8 sm:pt-10 md:pt-12 lg:pt-16 bg-backgroundv1">
          <div className="container w-full ">
            <div className="flex-none xsm:flex justify-between items-center mb-4 gap-4 sm:gap-0">
              <div className="mb-3 md:mb-0">
                {/* {isDarkMode ? (
                  <img src={darkLogo} alt="dark logo" className="h-44 w-44" />
                ) : (
                  <img src={lightLogo} alt="light logo" className="h-44 w-44" />
                )} */}logo
              </div>
              <div className="flex gap-2 sm:justify-center">
                <div className="">
                  <Link to={"/"}>
                    <img
                      src={require("../../assets/images/play.png")}
                      alt=""
                      className="h-10 w-36"
                    />
                  </Link>
                </div>
                <div className="">
                  <Link to={"/"}>
                    <img
                      src={require("../../assets/images/AppStore.png")}
                      alt=""
                      className="h-10 w-36"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex-none md:flex justify-between items-center">
              <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between gap-3 lg:gap-5 xl:gap-8 mb-5 md:mb-0">
                <Link>Home</Link>
                <Link>About NexUnity</Link>
                <Link>Features</Link>
                <Link>Help & Support</Link>
              </div>
              <div className="md:flex gap-2 hidden">
                <span className="bg-blue-700 text-white rounded-full p-2 pt-[10px]">
                  <FacebookIcon className={"h-4 w-5"} />
                </span>
                <span className="bg-black text-white rounded-full p-2">
                  <InstagramIcon className={"h-5 w-5"} />
                </span>
                <span className="bg-black text-white rounded-full p-2">
                  <TwitterIcon className={"h-5 w-5"} />
                </span>
                <span className="bg-black text-white rounded-full p-2">
                  <Linkedin className={"h-5 w-5"} />
                </span>
              </div>
            </div>
            <hr className="mt-5 mb-5 bg-textPrimary h-[2px]" />
            <div className="xsm:flex justify-between items-center">
              <div className="mb-5 xsm:mb-0">
                <p className="text-textPrimary">
                  © NexUnity. All Rights Reserved.
                </p>
              </div>
              <div className="flex gap-x-5 md:hidden">
                <span className="bg-theme rounded-full p-2 pt-[10px]">
                  <FacebookIcon className={"h-4 w-5"} />
                </span>
                <span className="bg-blue-700 text-white rounded-full p-2">
                  <InstagramIcon className={"h-5 w-5"} />
                </span>
                <span className="bg-blue-700 text-white rounded-full p-2">
                  <TwitterIcon className={"h-5 w-5"} />
                </span>
              </div>
            </div>
          </div>
          <GoToTop />
        </footer>
    </>
  );
};

export default FrontFooter;
