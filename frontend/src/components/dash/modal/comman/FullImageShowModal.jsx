import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { cn } from "../../../../lib/utils";

const FullImageShowModal = ({
  fullImageShowModalOpen,
  setfullImageShowModalOpen,
  imageUrl,
  setimageUrl,
  className,
}) => {
  return (
    <Transition appear show={fullImageShowModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[9999]"
        onClose={() => {
          setfullImageShowModalOpen(false);
          setTimeout(() => {
            setimageUrl("");
          }, 400);
        }}
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
          <div className="fixed inset-0 bg-black dark:bg-white cursor-pointer dark:bg-opacity-20  bg-opacity-35" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-10 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full  flex justify-center items-center  h-full transform rounded-2xl bg-transparent  transition-all">
                <div
                  className={cn(className)}
                  onClick={() => {
                    setfullImageShowModalOpen(false);
                    setTimeout(() => {
                      setimageUrl("");
                    }, 400);
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={"image"}
                    className={"cursor-pointer"}
                    onError={(e) => {
                      e.target.src =
                        "https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png";
                    }}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FullImageShowModal;
