import { Dialog, Transition } from "@headlessui/react";
import { Pencil } from "lucide-react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloseOutline } from "react-icons/io5";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { selectUserData } from "../../../../reducers/authSlice";
import { JOB_API_URL } from "../../../../security/axios";
import useAxiosPrivate from "../../../../security/useAxiosPrivate";
import { Button } from "../../../ui/Button";

const EditJobModal = ({
  editJobModalOpen,
  seteditJobModalOpen,
  editJob,
  setsuccessModalOpen,
}) => {
  let toastId;
  const userData = useSelector(selectUserData);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  // console.log("edit job >>>", editJob);
  const defaultValue = {
    id: editJob._id,
    title: editJob.title,
    content: editJob.content,
    companyName: editJob.companyName,
  };
  const [newEditedJob, setnewEditedJob] = useState(defaultValue);
  const [ImagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setnewEditedJob({
      id: editJob._id,
      title: editJob.title,
      content: editJob.content,
      companyName: editJob.companyName,
    });
  }, [editJob, editJob._id]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setImagePreview(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  //job edit api
  const { mutateAsync: editJobApi } = useMutation(
    async (data) => {
      console.log("data in axios >>>", data);
      return await axiosPrivate.put(JOB_API_URL.update, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
        handleClose();
        setsuccessModalOpen(true);
      },
      onError: (error) => {
        console.log("error >>> ", error);
        toast.dismiss(toastId);
      },
    }
  );

  const handleJobUpdate = async () => {
    try {
      if (
        newEditedJob.title.trim() === "" ||
        newEditedJob.content.trim() === "" ||
        newEditedJob.companyName.trim() === ""
      ) {
        toast.error("All fields are required");
      } else {
        toastId = toast.loading("Processing, Please wait...");
        const formData = new FormData();
        formData.append("id", editJob._id);
        formData.append("title", newEditedJob.title);
        formData.append("companyName", newEditedJob.companyName);
        formData.append("content", newEditedJob.content);
        ImagePreview && formData.append("jobImage", ImagePreview);

        await editJobApi(formData);
      }
    } catch (error) {
      console.log("ERRROR> >>", error);
    }
  };

  const handleClose = () => {
    setImagePreview("");
    setnewEditedJob({
      id: "",
      title: "",
      content: "",
      companyName: "",
    });
    seteditJobModalOpen(false);
  };
  return (
    <Transition appear show={editJobModalOpen} as={Fragment}>
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
                          <Pencil className="h-6 w-6" /> Edit Job
                        </h5>
                      </Dialog.Title>

                      <div className="mt-8 flex flex-col-reverse md:flex-row gap-5 gap-y-5 mb-4">
                        <div className="grid grid-cols-1 gap-3 flex-grow">
                          <div className="flex flex-col gap-1">
                            <label htmlFor="" className="text-16">
                              Job Title
                            </label>
                            <input
                              name="name"
                              className="bg-backgroundv2 h-12 focus:outline-none  border border-backgroundv3 text-textPrimary  w-full rounded-lg p-3 text-14"
                              placeholder="Type Here . . ."
                              value={newEditedJob.title}
                              onChange={(e) =>
                                setnewEditedJob({
                                  ...newEditedJob,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label htmlFor="" className="text-16">
                              Company Name
                            </label>
                            <input
                              name="name"
                              className="bg-backgroundv2 h-12 focus:outline-none  border border-backgroundv3 text-textPrimary  w-full rounded-lg p-3 text-14"
                              placeholder="Type Here . . ."
                              value={newEditedJob.companyName}
                              onChange={(e) =>
                                setnewEditedJob({
                                  ...newEditedJob,
                                  companyName: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="w-full md:w-[300px] flex flex-col gap-5 flex-shrink-0">
                          <div className="flex justify-center items-center w-full  h-full">
                            <div
                              {...getRootProps()}
                              className={`${
                                isDragActive
                                  ? "border-4 border-dashed border-blueMain"
                                  : ""
                              }${
                                !ImagePreview && "border-2 border-blueMain"
                              } cursor-pointer w-[150px] h-[150px] flex flex-col gap-3 justify-center items-center rounded-2xl overflow-hidden z-10 shadow bg-blueMain/30`}
                            >
                              <input {...getInputProps()} />

                              {ImagePreview ? (
                                <img
                                  src={URL.createObjectURL(ImagePreview)}
                                  alt="Front Image Preview"
                                  width={247}
                                  height={247}
                                  className="h-full w-full object-cover object-center"
                                />
                              ) : (
                                <img
                                  src={`${process.env.REACT_APP_SERVER_IMAGE_PATH}${editJob.jobImage}`}
                                  alt="Front Image Preview"
                                  width={247}
                                  height={247}
                                  className="h-full w-full object-cover object-center"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 w-full mb-8">
                        <label htmlFor="" className="text-16">
                          job description
                        </label>
                        <textarea
                          name="content"
                          rows={6}
                          cols={12}
                          value={newEditedJob.content}
                          onChange={(e) =>
                            setnewEditedJob({
                              ...newEditedJob,
                              content: e.target.value,
                            })
                          }
                          className="bg-backgroundv2 focus:outline-none  border border-backgroundv3 text-textPrimary  w-full rounded-lg p-3 text-14"
                          placeholder="Type Here . . ."
                        ></textarea>
                      </div>

                      <div className="w-full flex justify-center items-center">
                        <Button
                          variant={"blueV1"}
                          className="w-full max-w-sm rounded-lg"
                          onClick={handleJobUpdate}
                        >
                          Edit Job
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

export default EditJobModal;
