import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect } from "react";
import Lottie from "react-lottie-player";
import chekck from "../../../../assets/lottie/check.json";


const SuccessModal = ({ successModalOpen, setsuccessModalOpen }) => {
  useEffect(() => {
    setTimeout(() => {
      setsuccessModalOpen(false);
    }, 2500);
  });
  return (
    <Transition appear show={successModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setsuccessModalOpen(false)}
      >
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
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-transparent  transition-all">
                <div className="dialog-content w-full">
                  <div className="dialog-body py-6 px-5 md:px-[30px] md:py-6 w-full">
                    <div className="logout-content w-full">
                      <div className="icon w-full flex justify-center items-center">
                        <Lottie
                          loop
                          animationData={chekck}
                          play
                          style={{ width: "70%", height: "70%" }}
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

export default SuccessModal;
