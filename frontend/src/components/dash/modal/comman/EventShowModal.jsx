import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useCallback, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { MapPin } from "lucide-react";
import "../../../../pages/front/css/SingleEvent.css"


const EventShowModal = ({
  eventShow,
  eventShowModalOpen,
  seteventShowModalOpen,
}) => {
  const handleClose = () => {
    seteventShowModalOpen(false);
  };
  return (
    <Transition appear show={eventShowModalOpen} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-[900px] text-textPrimary mx-2 transform rounded-2xl bg-backgroundv1 border border-blueMain shadow-xl transition-all">
                <div className="dialog-content">
                  <span
                    className="close w-full flex justify-end items-end py-6 pe-[30px] cursor-pointer"
                    onClick={handleClose}
                  >
                    <IoCloseOutline className="w-8 h-8 text-textPrimary text-dan" />
                  </span>
                  <div className="dialog-body w-full h-full p-[30px] pt-0">
                    <div className="w-full h-full flex flex-col lg:flex-row gap-5 items-center justify-center">
                      <div className="w-full h-full overflow-hidden">
                        <img
                          src={`${process.env.REACT_APP_SERVER_IMAGE_PATH}${eventShow.eventImage}`}
                          alt="shoe image"
                          className="w-full h-full max-h-[500px] justify-center content-center"
                          onError={(e) => {
                            e.target.src =
                              "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
                          }}
                        />
                      </div>
                      <div className="w-full bg-backgroundv1 text-textPrimary">
                        <h2 className="product-title !text-blueMain">
                          {eventShow.eventName}
                        </h2>

                        <div className="product-price">
                          <p className="last-price">
                            Event Date:{" "}
                            <span>
                              {new Date(eventShow.time).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="new-price">
                            Event Time:{" "}
                            <span>
                              {" "}
                              {new Date(eventShow.time).toLocaleString()}{" "}
                            </span>
                          </p>
                        </div>

                        <div className="product-detail">
                          <h2>about this event: </h2>
                          <p>{eventShow.content}</p>
                        </div>

                        <div className="purchase-info text-20 flex gap-3">
                          <MapPin />
                          {eventShow.location}
                        </div>
                        <div className="mt-5 w-full ">
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3716.5381529794427!2d72.69061219999999!3d21.329258199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be1caa15f939469%3A0x6feeb1858d8d923e!2sShri%20Siddhnath%20Mahadev%20Temple!5e0!3m2!1sen!2sin!4v1710436075241!5m2!1sen!2sin"
                            allowfullscreen=""
                            className="w-full"
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                          ></iframe>{" "}
                        </div>
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

export default EventShowModal;
