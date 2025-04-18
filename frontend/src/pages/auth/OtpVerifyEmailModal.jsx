import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import OtpInput from "react-otp-input";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/Button";
import { AUTH_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";

const OtpVerifyEmailModal = ({
  otpVerifyEmailModalOpen,
  otpVerifyEmailModalClose,
  emailValue,
  verifyEmailFun,
  setverifiedEmail
}) => {
  const [otp, setOtp] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const handleClose = () => {
    otpVerifyEmailModalClose();
    setOtp("");
  };
  //verifyOTP API
  const { mutateAsync: verifyOTP } = useMutation(
    async (data) => {
      return await axiosPrivate.post(
        AUTH_API_URL.verifyOtp,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (res) => {
        console.log("res >>> ", res);
        handleClose();
        setverifiedEmail(emailValue)
        verifyEmailFun();
        toast.success("Email Verify Successfully.");
      },
      onError: (error) => {
        // const message = error?.response?.data?.message;
        // if (message) {
        //   toast.error(message);
        // } else {
        //   toast.error("Something went wrong! Please try again");
        // }
      },
    }
  );

  const verifyOtpClick = async () => {
    // await mutate verifyOtp
    try {
      await verifyOTP({ email: emailValue, otp: otp });
    } catch (error) {
      console.log("errro >> ", error);
    }
  };

  return (
    <Transition appear show={otpVerifyEmailModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/20  backdrop-blur-[2px]" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6 md:p-10 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl bg-backgroundv1 border-2 border-blueMain transform overflow-hidden rounded-2xl px-6 py-16 sm:px-10 text-left align-middle shadow-xl transition-all">
                <div className="dialog-content">
                  <span
                    className="close absolute top-6 right-6 cursor-pointer"
                    onClick={handleClose}
                  >
                    <IoCloseOutline className="w-6 h-6 text-textPrimary text-dan" />
                  </span>
                  <div className="dialog-header mb-10 xl:mb-16">
                    <h3 className="text-2xl  font-600 text-center mb-2 text-textPrimary">
                      Verification Code
                    </h3>
                    <p className="text-sm font-300 text-textPrimary text-center">
                      Please check your email <b className="font-600">{emailValue}</b> for the 6 digit
                      OTP code and enter it below
                    </p>
                  </div>
                  <div className="dialog-body">
                    <form action="">
                      <div className="form-fields-wrapper mb-10">
                        <div className="form-group mb-6">
                          <OtpInput
                            value={otp}
                            onChange={setOtp}
                            containerStyle={
                              "flex items-center  gap-4  justify-center"
                            }
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
                        {/* {!resendRequest ? (
                          <CountDownTimer
                            hoursMinSecs={{ seconds: 60 }}
                            resendRequest={resendRequest}
                            setResendRequest={setResendRequest}
                          />
                        ) : (
                          <p className="text-sm font-400 text-center text-white">
                            Didn’t get the code? Resend code in{" "}
                            <span
                              onClick={resendOtp}
                              className="text-gold"
                              style={{ cursor: "pointer" }}
                            >
                              Resend
                            </span>{" "}
                          </p>
                        )} */}
                      </div>
                      {otp?.length >= 6 && (
                        <Button
                          variant={"blueV1"}
                          type="button"
                          className="w-full md:py-3.5 py-2.5 px-6 md:text-base text-sm md:px-12 "
                          onClick={verifyOtpClick}
                        >
                          Verify
                        </Button>
                      )}
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OtpVerifyEmailModal;
