import React from "react";
import Lottie from "react-lottie-player";
import animationData from "../../assets/lottie/DataLoadingLottie.json";

const DataLoadingCompo = () => {
  return (
    // <div className="fixed top-0 start-0 w-screen h-2 z-[9999]">
    //  <div className="load-bar">
    //     <div className="bar"></div>
    //     <div className="bar"></div>
    //     <div className="bar"></div>
    //     <div className="bar"></div>
    // </div>
    // </div>
    <div className="fixed top-0 start-0 w-screen h-screen flex bg-black/50 justify-center items-center z-[9999]">
      <div className="h-[200px] w-[400px]">
        <Lottie
          loop
          animationData={animationData}
          play
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default DataLoadingCompo;
