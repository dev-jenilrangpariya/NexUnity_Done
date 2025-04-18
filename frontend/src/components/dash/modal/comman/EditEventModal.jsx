import { Dialog, Transition } from "@headlessui/react";
import { Image } from "lucide-react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDropzone } from "react-dropzone";
import { IoCloseOutline } from "react-icons/io5";
import { MdEditSquare } from "react-icons/md";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { selectUserData } from "../../../../reducers/authSlice";
import { EVENT_API_URL } from "../../../../security/axios";
import useAxiosPrivate from "../../../../security/useAxiosPrivate";
import { Button } from "../../../ui/Button";

const EditEventModal = ({
  editEventModalOpen,
  seteditEventModalOpen,
  editEvent,
  setsuccessModalOpen,
}) => {
  let toastId;
  const userData = useSelector(selectUserData);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  // debugger;
  const defaultValue = {
    eventName: editEvent.eventName,
    content: editEvent.content,
    location: editEvent.location,
    id: editEvent._id,
  };
  const [newEditEvent, setnewEditEvent] = useState(defaultValue);
  const [startDate, setStartDate] = useState(editEvent.time);

  useEffect(() => {
    setnewEditEvent({
      eventName: editEvent.eventName,
      content: editEvent.content,
      location: editEvent.location,
      id: editEvent._id,
    });
    // setStartDate(editEvent.time);
  }, [editEvent._id]);
  const [imagePreview, setimagePreview] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setimagePreview(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
    accept: "image/*",
  });

  //event edit api
  const { mutateAsync: editEventApi } = useMutation(
    async (data) => {
      console.log("data in axios >>>", data);
      return await axiosPrivate.put(EVENT_API_URL.update, data, {
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

  const handleEventEdit = async () => {
    try {
      if (
        newEditEvent.eventName.trim() === "" ||
        newEditEvent.content.trim() === "" ||
        newEditEvent.location.trim() === ""
      ) {
        toast.error("All fields are required");
      } else {
        console.log("edit Event  addeddd >>>", newEditEvent);
        toastId = toast.loading("Processing, Please wait...");
        const formData = new FormData();
        formData.append("id", newEditEvent.id);
        formData.append("eventName", newEditEvent.eventName);
        formData.append("content", newEditEvent.content);
        formData.append("location", newEditEvent.location);
        imagePreview && formData.append("eventImage", imagePreview);
        formData.append("time", startDate);

        await editEventApi(formData);
      }
    } catch (error) {
      console.log("ERRROR> >>", error);
    }
  };

  const handleClose = () => {
    setTimeout(() => {
      setimagePreview("");
      setnewEditEvent({
        eventName: "",
        content: "",
        location: "",
        id: "",
      });
      seteditEventModalOpen(false);
    }, 500);
  };

  // console.log("startDate >>>> ", startDate);
  // console.log("edit date >>>> ", editEvent.time);
  const isValidDate = (date) => date instanceof Date && !isNaN(date);

  return (
    <Transition appear show={editEventModalOpen} as={Fragment}>
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
                          <MdEditSquare className="h-6 w-6" /> Edit Event
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
                              value={newEditEvent.eventName}
                              onChange={(e) =>
                                setnewEditEvent({
                                  ...newEditEvent,
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
                              selected={
                                startDate ??
                                (isValidDate(startDate)
                                  ? startDate
                                  : new Date())
                              }
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
                              value={newEditEvent.content}
                              onChange={(e) =>
                                setnewEditEvent({
                                  ...newEditEvent,
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
                              value={newEditEvent.location}
                              onChange={(e) =>
                                setnewEditEvent({
                                  ...newEditEvent,
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
                                  onError={(e) => {
                                    e.target.src =
                                      "https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png";
                                  }}
                                />
                              ) : editEvent.eventImage != "" ? (
                                <img
                                  src={`${process.env.REACT_APP_SERVER_IMAGE_PATH}${editEvent.eventImage}`}
                                  alt="Front Image Preview"
                                  width={247}
                                  height={247}
                                  className="h-full w-full object-cover object-center"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png";
                                  }}
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
                          onClick={handleEventEdit}
                        >
                          Edit Event
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

export default EditEventModal;
