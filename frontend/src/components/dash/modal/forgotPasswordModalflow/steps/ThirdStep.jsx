import React, { useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { AUTH_API_URL } from "../../../../../security/axios";
import useAxiosPrivate from "../../../../../security/useAxiosPrivate";
import { Button } from "../../../../ui/Button";
import Input from "../../../../ui/Input";

const ThirdStep = ({ email,otp, setotp, setStep, isActiveStep, handleClose }) => {
  const [password, setpassword] = useState("");
  const [conPass, setconPass] = useState("");
  const axiosPrivate = useAxiosPrivate();
  let toastId;

  const { mutateAsync: forgetPassword } = useMutation(
    async (data) => {
      return await axiosPrivate.post(
        AUTH_API_URL.forgetPassword,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (res) => {
        toast.update(toastId, {
          render: res.data.message,
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: 2000,
        });
        setpassword("");
        setconPass("");
        setotp("");
        toast.success("password changed succesfully");
        handleClose();
      },
      onError: (error) => {
        toast.dismiss(toastId);
        console.log("error >. ", error);
      },
    }
  );

  const handleChanglePassword = async () => {
    try {
      if (password !== conPass) {
        toast.error("password should be same");
      } else {
        toastId = toast.loading("please wait ....");
        await forgetPassword({ otp, password ,email});
      }
    } catch (error) {
      console.log("ERROR >>> ", error);
    }
  };

  return (
    <div className={`${isActiveStep ? "block" : "hidden"}`}>
      <h5 className=" text-16 mt-4 text-textGray ">
        Change Your password with new password
      </h5>

      <div className="my-8 flex flex-col gap-3">
        <Input
          className="h-12 bg-backgroundv2 font-400 !text-14 !text-textPrimary focus:outline-none border border-backgroundv3  w-full rounded-lg px-5"
          placeholder="new password "
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <Input
          className="h-12 bg-backgroundv2 font-400 !text-14 !text-textPrimary focus:outline-none border border-backgroundv3  w-full rounded-lg px-5"
          placeholder="confiorm password"
          value={conPass}
          onChange={(e) => setconPass(e.target.value)}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <Button
          variant={"blueV1"}
          type="button"
          className="w-full rounded-lg md:py-3.5 py-2.5 md:text-base text-sm border border-textPrimary hover:bg-transparent hover:text-textPrimary bg-textPrimary text-backgroundv1"
          onClick={() => {
            setStep(2);
          }}
        >
          back
        </Button>
        <Button
          variant={"blueV1"}
          className="w-full rounded-lg"
          onClick={handleChanglePassword}
        >
          Change Password
        </Button>
      </div>
    </div>
  );
};

export default ThirdStep;
