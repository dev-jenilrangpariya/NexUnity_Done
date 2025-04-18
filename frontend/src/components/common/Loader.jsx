import React from "react";
import loader from "../../assets/lottie/loader.gif";
import darkLogo from "../../assets/images/darkLogo.jpeg";
import lightLogo from "../../assets/images/whiteLogo.png";

const Loader = () => {
  return (
    // loader1
    // <div className="w-screen h-screen fixed top-0 start-0 bg-backgroundv1 flex items-center justify-center z-50">
    //   <span className="block w-[48px] h-[48px] animate-spin rounded-full border-4 border-textPrimary border-l-0 border-b-0">

    //   </span>
    // </div>

    // loader2
    // <div className="w-screen h-screen flex justify-center items-center">
    //     <img src={loader} alt="loader" className="bg-transparent"/>
    // </div>

    // loader3
    // <div className="h-screen w-screen bg-backgroundv1 flex justify-center items-center">
    //   <div className="img_container h-44 w-56">
    //     <img
    //       src={darkLogo}
    //       alt="dark logo"
    //       width={687}
    //       height={567}
    //       className="hidden dark:block w-full h-full object-cover object-center"
    //     />
    //     <img
    //       src={lightLogo}
    //       alt="light logo"
    //       width={550}
    //       height={453}
    //       className="block dark:hidden w-full h-full object-cover object-center"
    //     />
    //   </div>
    // </div>

    // loader4
    <div className="h-screen w-screen fixed top-0 start-0 bg-transparent flex items-center justify-center z-50">
      <div className="flex justify-center items-center w-[75px] h-[75px] animate-ping border bg-gray-400 rounded-full">
        <div className="flex justify-center items-center w-[50px] h-[50px] animate-ping border bg-gray-500 rounded-full">
          <div className="flex justify-center items-center w-[25px] h-[25px] animate-ping border bg-gray-600 rounded-full">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
