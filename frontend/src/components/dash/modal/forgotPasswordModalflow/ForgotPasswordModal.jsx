import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import FirstStep from "./steps/FirstStep";
import SecoundStep from "./steps/SecoundStep";
import SuccessStep from "./steps/SuccessStep";
import ThirdStep from "./steps/ThirdStep";

const ForgotPasswordModal = ({ ForgotPasswordOpen, setForgotPasswordOpen }) => {
  const [step, setStep] = useState(1);
  const [email, setemail] = useState("");
  const [otp, setotp] = useState("");

  const handleClose = () => {
    setForgotPasswordOpen(false);
    setTimeout(() => {
      setStep(1);
      setotp("")
      setemail("");
    }, 500);
  };

  useEffect(() => {
    if (step == 4) {
      setTimeout(() => {
        handleClose();
      }, 2500);
    }
  });
  return (
    <Transition appear show={ForgotPasswordOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black dark:bg-white dark:bg-opacity-15  bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-10">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform rounded-2xl bg-backgroundv1 border border-blueMain shadow-xl transition-all">
                <div className="dialog-content">
                  <span
                    className="close absolute top-6 right-6 cursor-pointer"
                    onClick={handleClose}
                  >
                    <IoCloseOutline className="w-6 h-6 text-textPrimary text-dan" />
                  </span>
                  <div className="dialog-body py-6 px-5 md:px-[30px] md:py-6">
                    <div className="content">
                      <Dialog.Title
                        className={"border-b-2 border-b-backgroundv3"}
                      >
                        <h5 className="mb-4 text-22 text-textPrimary flex gap-3 items-center">
                          {/* <Plus className="h-6 w-6" /> */}
                          Forgot Password
                        </h5>
                      </Dialog.Title>

                      <div className="diagol-body">
                        <FirstStep
                          step={step}
                          setStep={setStep}
                          isActiveStep={step === 1}
                          email={email}
                          setemail={setemail}
                        />

                        <SecoundStep
                          email={email}
                          step={step}
                          otp={otp}
                          setotp={setotp}
                          setStep={setStep}
                          isActiveStep={step === 2}
                        />
                        <ThirdStep
                          step={step}
                          otp={otp}
                          setotp={setotp}
                          setStep={setStep}
                          email={email}
                          isActiveStep={step === 3}
                          handleClose={handleClose}
                        />
                        <SuccessStep
                          step={step}
                          setStep={setStep}
                          isActiveStep={step === 4}
                          handleClose={handleClose}
                        />
                      </div>
                    </div>
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

export default ForgotPasswordModal;
