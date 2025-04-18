import { Dialog, Transition } from "@headlessui/react";
import { Plus } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CATEGORY_API_URL } from "../../../security/axios";
import useAxiosPrivate from "../../../security/useAxiosPrivate";
import { Button } from "../../ui/Button";
import Input from "../../ui/Input";

const EditCategoryModal = ({
  editCategoryModalOpen,
  seteditCategoryModalOpen,
  editCategory,
  seteditCategory,
}) => {
  useEffect(() => {
    setnewCategory(editCategory?.category_name);
  }, [editCategory]);
  const [newCategory, setnewCategory] = useState("");

  let id;
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { mutateAsync: updateApi } = useMutation(
    async (data) => {
      return await axiosPrivate.put(
        CATEGORY_API_URL.update.replace(":id", editCategory._id),
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (res) => {
        toast.update(id, {
          render: res.data.message,
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: 2000,
        });
        setTimeout(() => {
          handleClose();
        }, 1000);
        queryClient.invalidateQueries("categories");
      },
      onError: (error) => {
        toast.dismiss(id)

        // if (error.response) {
        //   toast.update(id, {
        //     render:
        //       error.response.data.message || "An unexpected error occurred",
        //     type: toast.TYPE.ERROR,
        //     isLoading: false,
        //     autoClose: 2000,
        //   });
        //   // toast.error(error.response.data.message || "An error occurred");
        // } else {
        //   toast.update(id, {
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

  const handleCategoryUpdate = async () => {
    console.log("add category >>> ", newCategory);
    try {
      if (newCategory.trim() === "") {
        toast.warning("Category should not empty");
      } else {
        id = toast.loading("Please wait...");
        await updateApi({ category_name: newCategory });
      }
    } catch (error) {
      console.log("error >> ", error);
    }
  };

  const handleClose = () => {
    setnewCategory("");
    seteditCategory(null);
    seteditCategoryModalOpen(false);
  };

  return (
    <Transition appear show={editCategoryModalOpen} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-backgroundv1 border border-blueMain shadow-xl transition-all">
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
                          <Plus className="h-6 w-6" /> Update Categoty
                        </h5>
                      </Dialog.Title>

                      <div className="my-8">
                        <Input
                          className="h-12 bg-backgroundv2 font-400 !text-14 !text-textPrimary focus:outline-none border border-backgroundv3  w-full rounded-lg px-5"
                          placeholder={"Update category . . ."}
                          value={newCategory}
                          onChange={(e) => setnewCategory(e.target.value)}
                        />
                      </div>

                      <Button
                        variant={"blueV1"}
                        className="w-full rounded-lg"
                        onClick={handleCategoryUpdate}
                      >
                        Update Category
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

export default EditCategoryModal;
