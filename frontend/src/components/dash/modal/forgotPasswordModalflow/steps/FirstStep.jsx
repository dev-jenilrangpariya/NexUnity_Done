import React, { useState } from "react";
import Input from "../../../../ui/Input";
import { Button } from "../../../../ui/Button";
import useAxiosPrivate from "../../../../../security/useAxiosPrivate";
import { useMutation } from "react-query";
import { AUTH_API_URL } from "../../../../../security/axios";
import { toast } from "react-toastify";

const FirstStep = ({ email, setemail, setStep, isActiveStep }) => {
  let toastId;
  const [loading, setloading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { mutateAsync: forgetpassTokenGenerateApi } = useMutation(
    async (data) => {
      return await axiosPrivate.post(
        AUTH_API_URL.forgetpassTokenGenerate,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (res) => {
        toast.update(toastId, {
          render: "otp sent succesfully",
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: 2000,
        });
        setloading(false);
        setStep(2);
      },
      onError: (error) => {
        toast.dismiss(toastId);
        setloading(false);
        console.log("error >. ", error);
      },
    }
  );

  const handleOTPsend = async () => {
    try {
      if (email.trim() === "") {
        toast.error("email should not empty");
      } else {
        setloading(true);
        toastId = toast.loading("please wait ....");
        await forgetpassTokenGenerateApi({ email });
      }
    } catch (error) {
      console.log("ERROR >>> ", error);
    }
  };

  return (
    <div className={`${isActiveStep ? "block" : "hidden"}`}>
      <h5 className=" text-16 mt-4 text-textGray text-center">
        Please enter your Email Address. You will receive a 6-digit code.
      </h5>

      <div className="my-8">
        <Input
          className="h-12 bg-backgroundv2 font-400 !text-14 !text-textPrimary focus:outline-none border border-backgroundv3  w-full rounded-lg px-5"
          placeholder="Enter registered email ..."
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
      </div>

      <Button
        variant={"blueV1"}
        className="w-full rounded-lg"
        onClick={handleOTPsend}
        disable={loading}
      >
        {loading ? (
          <div className="h-8 w-8 border-l-2 border-b-2 rounded-full animate-spin"></div>
        ) : (
          "Send OTP"
        )}
      </Button>
    </div>
  );
};

export default FirstStep;
