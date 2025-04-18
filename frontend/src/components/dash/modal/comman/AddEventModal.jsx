import { Dialog, Transition } from "@headlessui/react";
import { Image, Plus } from "lucide-react";
import React, { Fragment, useCallback, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDropzone } from "react-dropzone";
import { IoCloseOutline } from "react-icons/io5";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { selectUserData } from "../../../../reducers/authSlice";
import { EVENT_API_URL } from "../../../../security/axios";
import useAxiosPrivate from "../../../../security/useAxiosPrivate";
import { Button } from "../../../ui/Button";

const AddEventModal = ({
  addEventModalOpen,
  setaddEventModalOpen,
  setsuccessModalOpen,
}) => {
  let toastId;
  const userData = useSelector(selectUserData);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const defaultValue = {
    eventName: "",
    content: "",
    location: "",
    createUserId: userData._id,
  };
  const [newEvent, setnewEvent] = useState(defaultValue);
  const [imagePreview, setimagePreview] = useState("");
  const [startDate, setStartDate] = useState(new Date());

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setimagePreview(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
    accept: "image/*",
  });

  //event add api
  const { mutateAsync: createEventApi } = useMutation(
    async (data) => {
      console.log("data in axios >>>", data);
      return await axiosPrivate.post(EVENT_API_URL.create, data, {
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
        queryClient.invalidateQueries("events");
        setsuccessModalOpen(true);
        handleClose();
      },
      onError: (error) => {
        console.log("error >>> ", error);
        toast.dismiss(toastId);
      },
    }
  );

  const handleEventAdd = async () => {
    try {
      if (
        newEvent.eventName.trim() === "" ||
        newEvent.content.trim() === "" ||
        newEvent.location.trim() === ""
      ) {
        toast.error("All fields are required");
      } else {
        console.log("new Event  addeddd >>>", newEvent);
        toastId = toast.loading("Processing, Please wait...");
        const formData = new FormData();
        formData.append("createUserId", newEvent.createUserId);
        formData.append("eventName", newEvent.eventName);
        formData.append("content", newEvent.content);
        formData.append("location", newEvent.location);
        formData.append("eventImage", imagePreview);
        formData.append("time", startDate);

        await createEventApi(formData);
      }
    } catch (error) {
      console.log("ERRROR> >>", error);
    }
  };

  const handleClose = () => {
    setTimeout(() => {
      setimagePreview("");
      setnewEvent(defaultValue);
      setaddEventModalOpen(false);
    }, 500);
  };
  return (
    <Transition appear show={addEventModalOpen} as={Fragment}>
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
                          <Plus className="h-6 w-6" /> Add New Event
                        </h5>
                      </Dialog.Title>

                      <div className="my-8 flex flex-col-reverse md:flex-row gap-5 gap-y-5">
                        <div className="grid grid-cols-1 gap-5 flex-grow">
                          <div className="flex flex-col gap-1">
                            <label htmlFor="" className="text-18">
                              Event Name
                            </label>
                            <input
                              name="name"
                              className="bg-backgroundv2 h-12 focus:outline-none  border border-backgroundv3 text-textPrimary  w-full rounded-lg p-3 text-14"
                              placeholder="Type Here . . ."
                              value={newEvent.eventName}
                              onChange={(e) =>
                                setnewEvent({
                                  ...newEvent,
                                  eventName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label htmlFor="" className="text-18">
                              Event Date Time
                            </label>
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => {
                                setStartDate(date);
                              }}
                              minDate={new Date()}
                              showTimeSelect // This prop enables time selection
                              dateFormat="Pp" // This prop specifies the date and time format
                              className="bg-backgroundv2 h-12 focus:outline-none  border border-backgroundv3 text-textPrimary  w-full rounded-lg p-3 text-14"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label htmlFor="" className="text-18">
                              Event content
                            </label>
                            <textarea
                              name="content"
                              rows={6}
                              cols={12}
                              value={newEvent.content}
                              onChange={(e) =>
                                setnewEvent({
                                  ...newEvent,
                                  content: e.target.value,
                                })
                              }
                              className="bg-backgroundv2 focus:outline-none  border border-backgroundv3 text-textPrimary  w-full rounded-lg p-3 text-14"
                              placeholder="Type Here . . ."
                            ></textarea>
                          </div>
                        </div>
                        <div className="w-full md:w-[300px] flex flex-col gap-5 flex-shrink-0">
                          <div className="flex flex-col gap-1">
                            <label htmlFor="" className="text-18">
                              Event Location
                            </label>
                            <textarea
                              name="location"
                              rows={6}
                              cols={12}
                              value={newEvent.location}
                              onChange={(e) =>
                                setnewEvent({
                                  ...newEvent,
                                  location: e.target.value,
                                })
                              }
                              className="bg-backgroundv2 focus:outline-none  border border-backgroundv3 text-textPrimary  w-full rounded-lg p-3 text-14"
                              placeholder="Event will held at . . ."
                            ></textarea>
                          </div>
                          <div className="flex justify-center items-center">
                            <div
                              {...getRootProps()}
                              className={`${
                                isDragActive
                                  ? "border-4 border-dashed border-blueMain"
                                  : ""
                              }${
                                !imagePreview && "border-2 border-blueMain"
                              } cursor-pointer w-full h-[200px] flex flex-col gap-3 justify-center items-center rounded-2xl overflow-hidden z-10 shadow bg-blueMain/30`}
                            >
                              <input {...getInputProps()} />

                              {imagePreview ? (
                                <img
                                  src={URL.createObjectURL(imagePreview)}
                                  alt="Front Image Preview"
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
                                    Event Image
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
                          onClick={handleEventAdd}
                        >
                          Add Event
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

export default AddEventModal;
