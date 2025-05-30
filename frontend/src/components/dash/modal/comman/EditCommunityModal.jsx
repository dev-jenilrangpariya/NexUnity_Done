import { Dialog, Transition } from "@headlessui/react";
import { Pencil } from "lucide-react";
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

const EditCommunityModal = ({
  editCommunityModalOpen,
  seteditCommunityModalOpen,
  editCommunity,
  setsuccessModalOpen
}) => {
  let toastId;
  const userData = useSelector(selectUserData);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();


  // console.log("edit community >>>",editCommunity);
  const defaultValue = {
    id:editCommunity._id,
    name: editCommunity.name,
    description: editCommunity.description,
    isPublic: true,
  };
  const [newEditedCommunity, setnewEditedCommunity] = useState(defaultValue);
  const [frontImagePreview, setfrontImagePreview] = useState(null);
  const [backImagePreview, setbackImagePreview] = useState(null);

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

  //community edit api
  const { mutateAsync: editCommunityApi } = useMutation(
    async (data) => {
      console.log("data in axios >>>", data);
      return await axiosPrivate.put(COMMUNITY_API_URL.update, data, {
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
        queryClient.invalidateQueries(["getCommunityCreatedByUser", userData._id]);
        queryClient.invalidateQueries(["community", editCommunity._id]);
        handleClose()
        setsuccessModalOpen(true)
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
        newEditedCommunity.name.trim() === "" ||
        newEditedCommunity.description.trim() === ""
      ) {
        toast.error("All fields are required");
      } else {
        toastId = toast.loading("Processing, Please wait...");
        const formData = new FormData();
        formData.append("id", newEditedCommunity.id);
        formData.append("name", newEditedCommunity.name);
        formData.append("description", newEditedCommunity.description);
        formData.append("isPublic", newEditedCommunity.isPublic);
        frontImagePreview && formData.append("frontImage", frontImagePreview)
        backImagePreview && formData.append("backImage", backImagePreview)
        console.log("edited community  addeddd >>>", formData);

        await editCommunityApi(formData);
      }
    } catch (error) {
      console.log("ERRROR> >>", error);
    }
  };

  const handleClose = () => {
    setfrontImagePreview("");
    setbackImagePreview("");
    setnewEditedCommunity(defaultValue);
    seteditCommunityModalOpen(false);
  };
  return (
    <Transition appear show={editCommunityModalOpen} as={Fragment}>
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
                          <Pencil className="h-6 w-6" /> Edit Community
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
                              value={newEditedCommunity.name}
                              onChange={(e) =>
                                setnewEditedCommunity({
                                  ...newEditedCommunity,
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
                              value={newEditedCommunity.description}
                              onChange={(e) =>
                                setnewEditedCommunity({
                                  ...newEditedCommunity,
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
                                  className="h-full w-full object-cover object-center"  onError={(e) => {
                                    e.target.src = 'https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png';
                                  }}
                                />
                              ) : 
                              (
                                <img
                                  src={`${process.env.REACT_APP_SERVER_IMAGE_PATH}${editCommunity.frontImage}`}
                                  alt="Front Image Preview"
                                  width={247}
                                  height={247}
                                  className="h-full w-full object-cover object-center"  onError={(e) => {
                                    e.target.src = 'https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png';
                                  }}
                                />
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
                                <img
                                  src={`${process.env.REACT_APP_SERVER_IMAGE_PATH}${editCommunity.backImage}`}
                                  alt="Front Image Preview"
                                  width={247}
                                  height={247}
                                  className="h-full w-full object-cover object-center"  onError={(e) => {
                                    e.target.src = 'https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png';
                                  }}
                                />
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
                          Edit Community
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

export default EditCommunityModal;
