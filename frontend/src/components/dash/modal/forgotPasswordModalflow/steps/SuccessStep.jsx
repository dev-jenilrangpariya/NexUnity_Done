import React from "react";
import Lottie from "react-lottie-player";
import chekck from "../../../../../assets/lottie/check.json";

const SuccessStep = ({ setStep, isActiveStep, handleClose }) => {
  

  return (
    <div className={`${isActiveStep ? "block" : "hidden"}`}>
      <h5 className=" text-16 mt-4 text-textGray ">
        Your password Changed Succesfully 😄 ! ! !
      </h5>

      <div className="my-8 flex justify-center items-center">
        <Lottie
          loop
          animationData={chekck}
          play
          style={{ width: "60%", height: "60%" }}
        />
      </div>
    </div>
  );
};

export default SuccessStep;
 