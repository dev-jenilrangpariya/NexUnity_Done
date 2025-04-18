import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import Lottie from "react-lottie-player";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import logoutImg from "../../../../assets/lottie/logout.json";
import { logout } from "../../../../reducers/authSlice";
import { Button } from "../../../ui/Button";

const LogoutModal = ({ logoutModalOpen, setLogoutModalOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setLogoutModalOpen(false);

    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    }, 1000);
  };

    
  // console.log("logout img >>>> ",logoutImg);
  return (
    <Transition appear show={logoutModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setLogoutModalOpen(false)}
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
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-backgroundv1 border border-blueMain shadow-xl transition-all">
                <div className="dialog-content w-full">
                  <div className="dialog-body py-6 px-5 md:px-[30px] md:py-6 w-full">
                    <div className="logout-content w-full">
                      <div className="icon w-full flex justify-center items-center" >
                        <Lottie
                          loop
                          animationData={logoutImg}
                          play
                          style={{ width: "60%", height: "60%" }}
                        />
                      </div>
                      <h5 className="mb-1 text-24 text-textPrimary text-center ">
                        Are you sure ? 
                      </h5>
                      <h5 className="mb-4 text-16 text-textGray text-center ">
                      Are you sure you want to logout from NexUnity ?
                      </h5>
                      {/* <p className='text-center text-base text-textPrimary mb-7'>Your Password has been Changed successfully.</p> */}
                      <Button
                        variant={"blueV1"}
                        className="w-full rounded-lg"
                        onClick={handleLogout}
                      >
                        Logout
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

export default LogoutModal;
