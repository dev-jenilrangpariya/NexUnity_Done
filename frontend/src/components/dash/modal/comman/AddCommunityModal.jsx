import { Dialog, Transition } from "@headlessui/react";
import { Image, Plus } from "lucide-react";
import React, { Fragment, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloseOutline } from "react-icons/io5";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { selectUserData } from "../../../../reducers/authSlice";
import { COMMUNITY_API_URL } from "../../../../security/axios";
import useAxiosPrivate from "../../../../security/useAxiosPrivate";
import { Button } from "../../../ui/Button";

const AddCommunityModal = ({
  addCommunityModalOpen,
  setaddCommunityModalOpen,
  setsuccessModalOpen,
}) => {
  let toastId;
  const userData = useSelector(selectUserData);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const defaultValue = {
    name: "",
    description: "",
    createUserId: userData._id,
    isPublic: true,
  };
  const [newCommunity, setnewCommunity] = useState(defaultValue);
  const [frontImagePreview, setfrontImagePreview] = useState("");
  const [backImagePreview, setbackImagePreview] = useState("");

  const onDropFront = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setfrontImagePreview(acceptedFiles[0]);
    }
  }, []);

  const onDropBack = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setbackImagePreview(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps: frontgetRootProps,
    getInputProps: frontgetInputProps,
    isDragActive: frontisDragActive,
  } = useDropzone({
    onDrop: onDropFront,
    accept: "image/*",
  });

  const {
    getRootProps: backgetRootProps,
    getInputProps: backgetInputProps,
    isDragActive: backisDragActive,
  } = useDropzone({
    onDrop: onDropBack,
    accept: "image/*",
  });

  //community add api
  const { mutateAsync: createCommunityApi } = useMutation(
    async (data) => {
      console.log("data in axios >>>", data);
      return await axiosPrivate.post(COMMUNITY_API_URL.create, data, {
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
        queryClient.invalidateQueries("communities");
        queryClient.invalidateQueries([
          "getCommunityCreatedByUser",
          userData._id,
        ]);
        queryClient.invalidateQueries([
          "profileDetails",
          userData._id,
        ]);
        setsuccessModalOpen(true);
        handleClose();
      },
      onError: (error) => {
        console.log("error >>> ", error);
        toast.dismiss(toastId);
      },
    }
  );

  const handleCommunityAdd = async () => {
    try {
      if (
        newCommunity.name.trim() === "" ||
        newCommunity.description.trim() === "" ||
        frontImagePreview === "" ||
        backImagePreview === ""
      ) {
        toast.error("All fields are required");
      } else {
        console.log("new community  addeddd >>>", newCommunity);
        toastId = toast.loading("Processing, Please wait...");
        const formData = new FormData();
        formData.append("createUserId", newCommunity.createUserId);
        formData.append("name", newCommunity.name);
        formData.append("description", newCommunity.description);
        formData.append("isPublic", newCommunity.isPublic);
        formData.append("frontImage", frontImagePreview);
        formData.append("backImage", backImagePreview);

        await createCommunityApi(formData);
      }
    } catch (error) {
      console.log("ERRROR> >>", error);
    }
  };

  const handleClose = () => {
    setfrontImagePreview("");
    setbackImagePreview("");
    setnewCommunity(defaultValue);
    setaddCommunityModalOpen(false);
  };
  return (
    <Transition appear show={addCommunityModalOpen} as={Fragment}>
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
                          <Plus className="h-6 w-6" /> Add New Community
                        </h5>
                      </Dialog.Title>

                      <div className="my-8 flex flex-col-reverse md:flex-row gap-5 gap-y-5">
                        <div className="grid grid-cols-1 gap-5 flex-grow">
                          <div className="flex flex-col gap-1">
                            <label htmlFor="" className="text-18">
                              Community Name
                            </label>
                            <input
                              name="name"
                              className="bg-backgroundv2 h-12 focus:outline-none  border border-backgroundv3 text-textPrimary  w-full rounded-lg p-3 text-14"
                              placeholder="Type Here . . ."
                              value={newCommunity.name}
                              onChange={(e) =>
                                setnewCommunity({
                                  ...newCommunity,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label htmlFor="" className="text-18">
                              Community description
                            </label>
                            <textarea
                              name="description"
                              rows={6}
                              cols={12}
                              value={newCommunity.description}
                              onChange={(e) =>
                                setnewCommunity({
                                  ...newCommunity,
                                  description: e.target.value,
                                })
                              }
                              className="bg-backgroundv2 focus:outline-none  border border-backgroundv3 text-textPrimary  w-full rounded-lg p-3 text-14"
                              placeholder="Type Here . . ."
                            ></textarea>
                          </div>
                        </div>
                        <div className="w-full md:w-[300px] flex flex-col gap-5 flex-shrink-0">
                          <div className="flex justify-center items-center">
                            <div
                              {...frontgetRootProps()}
                              className={`${
                                frontisDragActive
                                  ? "border-4 border-dashed border-blueMain"
                                  : ""
                              }${
                                !frontImagePreview && "border-2 border-blueMain"
                              } cursor-pointer w-[120px] h-[120px] flex flex-col gap-3 justify-center items-center rounded-2xl overflow-hidden z-10 shadow bg-blueMain/30`}
                            >
                              <input {...frontgetInputProps()} />

                              {frontImagePreview ? (
                                <img
                                  src={URL.createObjectURL(frontImagePreview)}
                                  alt="Front Image Preview"
                                  width={247}
                                  height={247}
                                  className="h-full w-full object-cover object-center"
                                />
                              ) : (
                                <div className="flex flex-col gap-3 justify-center items-center ">
                                  <Image
                                    className="h-6 w-6"
                                    strokeWidth={1.5}
                                  />
                                  <h5 className="mb-4 text-12 text-textPrimary">
                                    Front Image
                                  </h5>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="w-full flex justify-center md:justify-start items-center flex-col gap-5">
                            <div
                              {...backgetRootProps()}
                              className={`${
                                backisDragActive
                                  ? "border-4 border-dashed border-blueMain"
                                  : ""
                              }${
                                !backImagePreview && "border-2 border-blueMain"
                              } cursor-pointer  w-full h-[150px] flex flex-col gap-4 justify-center items-center rounded-2xl overflow-hidden z-10 shadow bg-blueMain/30`}
                            >
                              <input {...backgetInputProps()} />

                              {backImagePreview ? (
                                <img
                                  src={URL.createObjectURL(backImagePreview)}
                                  alt="back Image Preview"
                                  width={247}
                                  height={247}
                                  className="h-full w-full object-cover object-center"
                                />
                              ) : (
                                <div className="flex flex-col gap-3 justify-center items-center ">
                                  <Image
                                    className="h-[50px] w-[50px]"
                                    strokeWidth={1.5}
                                  />
                                  <h5 className="mb-4 text-16 text-textPrimary">
                                    Back Image
                                  </h5>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full flex justify-center items-center">
                        <Button
                          variant={"blueV1"}
                          className="w-full max-w-sm rounded-lg"
                          onClick={handleCommunityAdd}
                        >
                          Add Community
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

export default AddCommunityModal;
