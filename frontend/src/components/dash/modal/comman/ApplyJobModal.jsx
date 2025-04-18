import { Dialog, Transition } from "@headlessui/react";
import { Plus } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { selectUserData } from "../../../../reducers/authSlice";
import { JOB_API_URL } from "../../../../security/axios";
import useAxiosPrivate from "../../../../security/useAxiosPrivate";
import { Button } from "../../../ui/Button";

const ApplyJobModal = ({
  applyJobModalOpen,
  setapplyJobModalOpen,
  setsuccessModalOpen,
  job,
  setJob,
}) => {
  let toastId;
  const userData = useSelector(selectUserData);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const defaultValue = {
    id: job._id,
    fullName: "",
    experience: "",
    description: "",
    email: "",
  };
  const [applyJobData, setapplyJobData] = useState(defaultValue);
  useEffect(() => {
    setapplyJobData({ ...applyJobData, id: job._id });
  }, [job, job._id]);

  console.log("apply job data >> ",applyJobData);
  console.log("apply -data >> ",job);
  //Job apply api
  const { mutateAsync: applyJobApi } = useMutation(
    async (data) => {
      console.log("data in axios >>>", data);
      return await axiosPrivate.post(JOB_API_URL.apply, JSON.stringify(data));
    },
    {
      onSuccess: (res) => {
        console.log("res >>> ", res.data.message);
        toast.update(toastId, {
          render: res.data.message,
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: 2000,
        });
        queryClient.invalidateQueries("jobs");
        setsuccessModalOpen(true);
        setJob("");
        handleClose();
      },
      onError: (error) => {
        console.log("error >>> ", error);
        toast.dismiss(toastId);
      },
    }
  );

  const handleJobApply = async () => {
    try {
      if (
        applyJobData.fullName.trim() === "" ||
        applyJobData.description.trim() === "" ||
        applyJobData.email.trim() === ""
      ) {
        toast.error("All fields are required");
      } else if (applyJobData.fullName.length < 6) {
        toast.error("full name min 6 character require");
      } else if (applyJobData.description.length < 50) {
        toast.error("description needs minimun 50 words");
      } 
      else {
        console.log("apply job  addeddd >>>", applyJobData);
        toastId = toast.loading("Processing, Please wait...");

        await applyJobApi(applyJobData);
      }
    } catch (error) {
      console.log("ERRROR> >>", error);
    }
  };

  const handleClose = () => {
    setJob("");
    setapplyJobData(defaultValue);
    setapplyJobModalOpen(false);
  };
  return (
    <Transition appear show={applyJobModalOpen} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-[800px] text-textPrimary mx-2 transform rounded-2xl bg-backgroundv1 border border-blueMain shadow-xl transition-all">
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
                          <Plus className="h-6 w-6" /> Apply For Job
                        </h5>
                      </Dialog.Title>

                      <div className="my-8 flex flex-col gap-5 gap-y-5">
                        <div className="flex flex-col gap-1 w-full">
                          <label htmlFor="" className="text-16">
                            full Name
                          </label>
                          <input
                            name="fullName"
                            className="bg-backgroundv2 h-12 focus:outline-none  border border-backgroundv3 text-textPrimary  w-full rounded-lg p-3 text-14"
                            placeholder="Type Here . . ."
                            value={applyJobData.fullName}
                            onChange={(e) =>
                              setapplyJobData({
                                ...applyJobData,
                                fullName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <label htmlFor="" className="text-16">
                            Experience
                          </label>
                          <input
                            name="experience"
                            className="bg-backgroundv2 h-12 focus:outline-none  border border-backgroundv3 text-textPrimary  w-full rounded-lg p-3 text-14"
                            placeholder="Type Here . . ."
                            value={applyJobData.experience}
                            onChange={(e) =>
                              setapplyJobData({
                                ...applyJobData,
                                experience: +e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                          <label htmlFor="" className="text-16">
                            Email
                          </label>
                          <input
                            name="email"
                            className="bg-backgroundv2 h-12 focus:outline-none  border border-backgroundv3 text-textPrimary  w-full rounded-lg p-3 text-14"
                            placeholder="Type Here . . ."
                            value={applyJobData.email}
                            onChange={(e) =>
                              setapplyJobData({
                                ...applyJobData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col gap-1 w-full ">
                          <label htmlFor="" className="text-16">
                            job description
                          </label>
                          <textarea
                            name="content"
                            rows={6}
                            cols={12}
                            value={applyJobData.description}
                            onChange={(e) =>
                              setapplyJobData({
                                ...applyJobData,
                                description: e.target.value,
                              })
                            }
                            className="bg-backgroundv2 focus:outline-none  border border-backgroundv3 text-textPrimary  w-full rounded-lg p-3 text-14"
                            placeholder="Type Here . . ."
                          ></textarea>
                        </div>
                      </div>

                      <div className="w-full flex justify-center items-center">
                        <Button
                          variant={"blueV1"}
                          className="w-full max-w-sm rounded-lg"
                          onClick={handleJobApply}
                        >
                          Apply Job
                        </Button>
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

export default ApplyJobModal;
