import React from "react";
import OtpInput from "react-otp-input";
import { Button } from "../../../../ui/Button";

const SecoundStep = ({ otp, setotp, email, step, setStep, isActiveStep }) => {
  const handleVerifyOtp = async () => {
    setStep(3);
  };
  return (
    <div className={`${isActiveStep ? "block" : "hidden"}`}>
      <div className="mt-4">
        <p className="text-16 mt-4 text-textGray  text-center">
          {`Please check your email ${email} for the 6 digit
                      OTP code and enter it below`}
        </p>
      </div>
      <div className="form-fields-wrapper my-8 px-5">
        <div className="form-group w-full">
          <OtpInput
            value={otp}
            onChange={setotp}
            containerStyle={"flex items-center  gap-4  justify-center"}
            inputType="number"
            numInputs={6}
            renderSeparator={""}
            renderInput={({ className, ...props }) => (
              <input
                className="!w-12 h-12 md:!w-[60px] md:h-[60px] outline-none text-textPrimary bg-transparent border rounded border-textGray focus:border-blueMain"
                {...props}
              />
            )}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <Button
          variant={"blueV1"}
          type="button"
          className="w-full rounded-lg md:py-3.5 py-2.5 md:text-base text-sm border border-textPrimary hover:bg-transparent hover:text-textPrimary bg-textPrimary text-backgroundv1"
          onClick={() => {
            setStep(1);
          }}
        >
          back
        </Button>

        {otp?.length >= 6 && (
          <Button
            variant={"blueV1"}
            type="button"
            className="w-full rounded-lg md:py-3.5 py-2.5 md:text-base text-sm"
            onClick={handleVerifyOtp}
          >
            next
          </Button>
        )}
      </div>
    </div>
  );
};

export default SecoundStep;
