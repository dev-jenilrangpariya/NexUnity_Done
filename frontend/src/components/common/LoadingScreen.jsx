import React from "react";
import LoaderJson from "../../assets/lottie/LoaderScreen.json";
import Lottie from "react-lottie-player";

const LoadingScreen = () => {
  return (
    <center>
      <div
        role="status"
        className=" bg-black top-0 left-0 w-full h-full flex justify-center items-center !z-[999] !fixed"
      >
        <Lottie
          loop
          animationData={LoaderJson}
          play
          style={{ width: 150, height: 150 }}
        />
      </div>
    </center>
  );
};

export default LoadingScreen;
