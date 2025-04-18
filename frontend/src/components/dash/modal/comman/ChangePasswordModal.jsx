import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { AUTH_API_URL } from "../../../../security/axios";
import useAxiosPrivate from "../../../../security/useAxiosPrivate";
import { Button } from "../../../ui/Button";
import Input from "../../../ui/Input";

const ChangePasswordModal = ({
  changePasswordModalOpen,
  setchangePasswordModalOpen,
  ForgotPasswordOpen,
  setForgotPasswordOpen,
}) => {
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: resetPasswordApi } = useMutation(
    async (data) => {
      return await axiosPrivate.post(
        AUTH_API_URL.resetPassword,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (res) => {
        console.log("res >>>> ", res);
        toast.success("password change succesffulyy");
        setTimeout(() => {
          handleClose();
        }, 2000);
      },
      onError: (error) => {
        // if (error.response) {
        //   toast.update(toastId, {
        //     render: error.response.data.message,
        //     type: toast.TYPE.ERROR,
        //     isLoading: false,
        //     autoClose: 2000,
        //   });
        //   // toast.error(error.response.data.message || "An error occurred");
        // } else {
        //   toast.update(toastId, {
        //     render: "An unexpected error occurred",
        //     type: toast.TYPE.ERROR,
        //     isLoading: false,
        //     autoClose: 2000,
        //   });
        //   // toast.error("An unexpected error occurred");
        // }
      },
    }
  );

  const handleChangePassword = async () => {
    try {
      if (oldPassword.trim() === "" || newPassword.trim() === "") {
        toast.warning("password should not empty !!!");
      } else if (oldPassword === newPassword) {
        toast.warning("both password are same ! ! !");
      } else {
        await resetPasswordApi({
          oldPassword: oldPassword,
          newPassword: newPassword,
        });
      }
    } catch (error) {
      console.log("error >> ", error);
    }
  };
  const handleClose = () => {
    setoldPassword("");
    setnewPassword("");
    setchangePasswordModalOpen(false);
  };

  const handleForgotPassword = () => {
    handleClose();
    setTimeout(()=>{
      setForgotPasswordOpen(true);
    },1000)
  };

  return (
    <Transition appear show={changePasswordModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => handleClose}>
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
                          Change Password
                        </h5>
                      </Dialog.Title>

                      <h5 className=" text-16 mt-4 text-textGray ">
                        Change your old password with new One
                      </h5>

                      <div className="flex flex-col my-8 gap-5">
                        <Input
                          className="h-12 bg-backgroundv2 font-400 !text-14 !text-textPrimary focus:outline-none border border-backgroundv3  w-full rounded-lg px-5"
                          placeholder="old password "
                          value={oldPassword}
                          onChange={(e) => setoldPassword(e.target.value)}
                        />
                        <Input
                          className="h-12 bg-backgroundv2 font-400 !text-14 !text-textPrimary focus:outline-none border border-backgroundv3  w-full rounded-lg px-5"
                          placeholder="new password"
                          value={newPassword}
                          onChange={(e) => setnewPassword(e.target.value)}
                        />
                        <div className="flex justify-end items-end w-full">
                          <div
                            className="!text-end cursor-pointer text-blue-800"
                            onClick={handleForgotPassword}
                          >
                            Forgot Password  ?
                          </div>
                        </div>
                      </div>

                      <Button
                        variant={"blueV1"}
                        className="w-full rounded-lg"
                        onClick={handleChangePassword}
                      >
                        Change Password
                      </Button>
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

export default ChangePasswordModal;
