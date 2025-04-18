import { UploadCloud } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import customeProfile from "../../assets/images/customeProfile.png";
import ChangePasswordModal from "../../components/dash/modal/comman/ChangePasswordModal";
import ForgotPasswordModal from "../../components/dash/modal/forgotPasswordModalflow/ForgotPasswordModal";
import Input from "../../components/ui/Input";
import { selectUserData, updateUserData } from "../../reducers/authSlice";
import { AUTH_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";

const FrontSettingPage = () => {
  let id;
  const [changePasswordModalOpen, setchangePasswordModalOpen] = useState(false);
  const [ForgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const queryClient = useQueryClient();
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleSuccess = (res) => {
    toast.update(id, {
      render: res.data.message,
      type: toast.TYPE.SUCCESS,
      isLoading: false,
      autoClose: 2000,
    });
    console.log("res data >>> ", res.data);
    const newEditedUser = {
      first_name: res.data.data.first_name,
      middle_name: res.data.data.middle_name,
      surname: res.data.data.surname,
      gender: res.data.data.gender,
      isPrivate: res.data.data.isPrivate,
      profile_pic: res.data.data.profile_pic,
    };
    setTimeout(() => {
      // setpreviewURL(null);
      dispatch(updateUserData(newEditedUser));
    }, 2000);
    queryClient.invalidateQueries("users");
  };
  const handleStatusSuccess = (res) => {
    toast.update(id, {
      render: res.data.message,
      type: toast.TYPE.SUCCESS,
      isLoading: false,
      autoClose: 2000,
    });
    setTimeout(() => {
      dispatch(updateUserData({ active: !userData.active }));
    }, 3000);
    queryClient.invalidateQueries("users");
  };

  useEffect(() => {
    console.log("data in axios >>> ", userData);
    localStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("user", JSON.stringify(userData));
  }, [userData]);

  const { mutateAsync: updateProfileApi } = useMutation(
    async (data) => {
      return await axiosPrivate.put(AUTH_API_URL.updateProfile, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    {
      onSuccess: handleSuccess,
      onError: (error) => {
        console.error("Error:", error);
        toast.dismiss(id);
      },
    }
  );
  const { mutateAsync: activeStatusUpdate } = useMutation(
    async (data) => {
      return await axiosPrivate.put(
        AUTH_API_URL.userActiveStatusUpdate,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: handleStatusSuccess,
      onError: (error) => {
        console.error("Error:", error);
        toast.dismiss(id);
      },
    }
  );

  const [editUser, seteditUser] = useState({
    first_name: "",
    middle_name: "",
    surname: "",
    gender: "1",
    isPrivate: false,
  });
  const [previewURL, setpreviewURL] = useState(null);

  useEffect(() => {
    seteditUser({
      first_name: userData.first_name,
      middle_name: userData.middle_name,
      surname: userData.surname,
      gender: userData.gender,
      isPrivate: userData.isPrivate,
    });
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("edit user", editUser);
    try {
      if (
        editUser.first_name.trim() === "" ||
        editUser.middle_name.trim() === "" ||
        editUser.surname.trim() === ""
      ) {
        toast.error("all field are require");
      } else {
        id = toast.loading("Please wait...");
        const formData = new FormData();

        // Append other form fields
        // formData.append("userId", userData._id);
        formData.append("first_name", editUser.first_name.trim());
        formData.append("middle_name", editUser.middle_name.trim());
        formData.append("surname", editUser.surname.trim());
        formData.append("gender", editUser.gender);
        formData.append("isPrivate", editUser.isPrivate);
        previewURL && formData.append("profile_pic", previewURL);
        await updateProfileApi(formData);
      }
    } catch (error) {
      console.log("error >>> ", error);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setpreviewURL(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleStatus = async () => {
    try {
      if (userData.active) {
        swal({
          title: "You Really want to Deactive Your Account ? ",
          text: "once you Deactive Your Account You have to contact nexunity@gmain.com To Active again",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then(async (willDelete) => {
          if (willDelete) {
            id = toast.loading("Please wait...");
            await activeStatusUpdate({ userId: userData._id });
          }
        });
      } else {
        id = toast.loading("Please wait...");
        await activeStatusUpdate({ userId: userData._id });
      }
    } catch (error) {
      console.log("error >> ", error);
    }
  };

  const handleRemoveAcc = () => {
    try {
      swal({
        title: "Are you sure?",
        text: "You Really want to Delete your Account !!!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          swal({
            title: "Success",
            text: "Your Remove Account Request Sent to nextUnity@gmail.com ! Your Account will remove In 2 to 3 days",
            icon: "success",
            dangerMode: true,
          });
        }
      });
    } catch (error) {
      console.log("error >> ", error);
    }
  };

  const handleChangePassword = () => {
    setchangePasswordModalOpen(true);
  };

  // console.log(
  //   "userData of Store >>>> ",
  //   `${process.env.REACT_APP_SERVER_IMAGE_PATH}${userData.profile_pic}`
  // );
  // console.log("userData of Store >>>> ", userData);
  // console.log("edittttuser", editUser);
  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-y-3 container my-5">
        <div>
          <h2 className="font-500 text-22 flex-shrink-0 md:text-24 lg:text-28 text-textPrimary">
            Profile Settings
          </h2>
        </div>
      </div>
      <div className="container">
        <div className="p-5 md:p-10 border  border-backgroundv3 bg-backgroundv1 text-textPrimary rounded-lg">
          <form
            className="grid grid-cols-2 md:grid-cols-3 gap-5  "
            action=""
            onSubmit={handleSubmit}
          >
            <div className="col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2  gap-5 ">
                <div>
                  <label htmlFor="" className="text-14 md:text-16 mb-2">
                    First name
                  </label>
                  <Input
                    name="first_name"
                    value={editUser.first_name}
                    onChange={(e) =>
                      seteditUser({
                        ...editUser,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="bg-backgroundv2 focus:outline-none border border-backgroundv3 text-textGray h-10 w-full rounded-lg px-5 text-12"
                    placeholder="Type Here"
                  />
                </div>
                <div>
                  <label htmlFor="" className="text-14 md:text-16 mb-2">
                    Middle name
                  </label>
                  <Input
                    value={editUser.middle_name}
                    name={"middle_name"}
                    onChange={(e) =>
                      seteditUser({
                        ...editUser,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="bg-backgroundv2 focus:outline-none border border-backgroundv3 text-textGray h-10 w-full rounded-lg px-5 text-12"
                    placeholder="Type Here"
                  />
                </div>
                <div>
                  <label htmlFor="" className="text-14 md:text-16 mb-2">
                    Surname
                  </label>
                  <Input
                    value={editUser.surname}
                    name={"surname"}
                    onChange={(e) =>
                      seteditUser({
                        ...editUser,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="bg-backgroundv2 focus:outline-none border border-backgroundv3 text-textGray h-10 w-full rounded-lg px-5 text-12"
                    placeholder="Type Here"
                  />
                </div>

                <div className="flex justify-center items-center gap-2 col-span-1 sm:col-span-2 md:col-span-1 xl:col-span-2">
                  <div className="w-[100px] flex-shrink-0 text-14 md:text-16 mb-2">
                    Gender
                  </div>
                  <div className="flex justify-start gap-10 items-center flex-grow w-full">
                    <div className="h-full flex justify-start items-start gap-3">
                      <label htmlFor="male" className="text-12 md:text-14">
                        Male
                      </label>
                      <input
                        type="radio"
                        value={"1"}
                        id="male"
                        name="gender"
                        checked={editUser.gender === 1}
                        onChange={(e) =>
                          seteditUser({ ...editUser, gender: +e.target.value })
                        }
                        className="bg-backgroundv2 focus:outline-none border border-backgroundv3 text-blueMain h-5 rounded-lg px-5 text-12"
                        placeholder="Type Here"
                      />
                    </div>
                    <div className="h-full flex justify-start items-start gap-3">
                      <label htmlFor="female" className="text-12 md:text-14 ">
                        Female
                      </label>
                      <input
                        type="radio"
                        id="female"
                        value={"2"}
                        name="gender"
                        checked={editUser.gender === 2}
                        onChange={(e) =>
                          seteditUser({ ...editUser, gender: +e.target.value })
                        }
                        className="bg-backgroundv2 focus:outline-none border border-backgroundv3 text-blueMain h-5 rounded-lg px-5 text-12"
                        placeholder="Type Here"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center gap-2 col-span-1 sm:col-span-2 md:col-span-1 xl:col-span-2">
                  <div className="w-[100px] flex-shrink-0 text-14 md:text-16 mb-2">
                    Status
                  </div>
                  <div className="flex justify-start gap-5 items-center flex-grow w-full">
                    <div className="h-full flex justify-start items-start gap-3">
                      <label
                        htmlFor="public"
                        className={`text-14 md:text-16  py-1 px-3 rounded-full cursor-pointer  ${
                          editUser.isPrivate === false &&
                          "bg-green-600/30 text-green-700"
                        }`}
                      >
                        Public
                      </label>
                      <input
                        type="radio"
                        id="public"
                        value={"public"}
                        name="isPrivate"
                        onChange={(e) =>
                          seteditUser({ ...editUser, isPrivate: false })
                        }
                        className="bg-backgroundv2 hidden focus:outline-none border border-backgroundv3 text-blueMain h-5 rounded-lg px-5 text-12"
                        placeholder="Type Here"
                      />
                    </div>
                    <div className="h-full flex justify-start items-start gap-3">
                      <label
                        htmlFor="private"
                        className={`text-14 md:text-16 py-1 px-3 cursor-pointer rounded-full ${
                          editUser.isPrivate === true &&
                          "bg-green-600/30 text-green-700"
                        }`}
                      >
                        Private
                      </label>
                      <input
                        type="radio"
                        value={"private"}
                        id="private"
                        name="isPrivate"
                        onChange={(e) =>
                          seteditUser({ ...editUser, isPrivate: true })
                        }
                        className="bg-backgroundv2 hidden focus:outline-none border border-backgroundv3 text-blueMain h-5 rounded-lg px-5 text-12"
                        placeholder="Type Here"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-5">
                <button className="rounded bg-blueMain h-12 px-3 gap-2 flex justify-center items-center border text-16  border-blueMain text-white hover:border-blueMain hover:text-blueMain  hover:bg-backgroundv1 transition-all duration-300 ease-linear">
                  Save changes
                </button>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1 w-full flex justify-center md:justify-start items-center flex-col gap-5">
              <div
                {...getRootProps()}
                className={` ${
                  isDragActive ? "border-4 border-dashed border-blueMain" : ""
                }${
                  !previewURL && "border-2 border-blueMain"
                } w-[150px] h-[150px] rounded-full overflow-hidden z-10 shadow bg-blueMain/30`}
              >
                <input {...getInputProps()} id="profile_pic" />
                {previewURL ? (
                  <img
                    src={URL.createObjectURL(previewURL)}
                    alt="Preview not found"
                    width={247}
                    height={247}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <img
                    src={
                      userData.profile_pic !== ""
                        ? `${process.env.REACT_APP_SERVER_IMAGE_PATH}${userData.profile_pic}`
                        : customeProfile
                    }
                    alt="profile pic was not found"
                    width={247}
                    height={247}
                    className="h-full w-full object-cover object-center"
                    onError={(e) => {
                      e.target.src =
                        "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
                    }}
                  />
                )}
              </div>
              <div className="flex w-full items-center justify-center">
                <label
                  htmlFor="profile_pic"
                  className="cursor-pointer text-textPrimary border border-textGray rounded  flex gap-2 items-center py-1 px-3"
                >
                  <UploadCloud className="h-5 w-5" /> Upload
                </label>
              </div>
            </div>
          </form>

          <div className="w-full border my-5  border-backgroundv3"></div>

          <div className="grid grid-cols-1 h-auto lg:grid-cols-2 xl:grid-cols-2 gap-5 w-full text-textGray text-14 my-8">
            <div className="rounded border  border-backgroundv3 bg-backgroundv2 p-5 col-span-1 w-full block">
              <div className="w-full flex justify-between items-start">
                <div className="flex-grow w-full">
                  <h3 className="text-textPrimary text-16 font-semibold">
                    Password
                  </h3>
                  <h4>You can change your passwoerd</h4>
                </div>
                <div className=" flex-shrink-0">
                  <button
                    onClick={handleChangePassword}
                    className="text-textPrimary bg-backgroundv1 border border-textGray rounded  flex gap-2 items-center py-1 px-3 "
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded border  border-backgroundv3 bg-backgroundv2 p-5 col-span-1 w-full">
              <div className="w-full flex justify-between items-start">
                <div className="flex-grow w-full">
                  <h3 className="text-textPrimary text-16 font-semibold">
                    Account Deactive
                  </h3>
                  <h4>
                    once you Deactive Your Account You have to contact{" "}
                    <span className="text-blueMain">nexunity@gmain.com</span> To
                    Active again
                  </h4>
                </div>
                <div className=" flex-shrink-0">
                  <button
                    onClick={handleStatus}
                    className={`${
                      userData.active ? "bg-red-600" : "bg-green-600"
                    } text-white  rounded flex gap-2 items-center py-1 px-3`}
                  >
                    {userData.active ? "Deactive" : "Active"}
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded border  border-backgroundv3 bg-backgroundv2 p-5 col-span-1 md:col-span-2 xxl:col-span-1">
              <div className="w-full flex justify-between items-start">
                <div className="flex-grow w-full">
                  <h3 className="text-textPrimary text-16 font-semibold">
                    Forgot Password ??
                  </h3>
                  <h4>If You Forgot Your Password then Update your Password</h4>
                </div>
                <div className=" flex-shrink-0">
                  <button
                    onClick={() => setForgotPasswordOpen(true)}
                    className={`text-textPrimary bg-backgroundv1 border border-textGray rounded  flex gap-2 items-center py-1 px-3 `}
                  >
                    Forgot Password
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded border  border-backgroundv3 bg-backgroundv2 p-5 col-span-1 md:col-span-2 xxl:col-span-1">
              <div className="w-full flex justify-between items-start">
                <div className="flex-grow w-full">
                  <h3 className="text-textPrimary text-16 font-semibold">
                    Danger !!! Remove Account
                  </h3>
                  <h4>
                    Once you delete Account , there is no any way to going back
                    your Account
                  </h4>
                </div>
                <div className=" flex-shrink-0">
                  <button
                    onClick={handleRemoveAcc}
                    className={`bg-red-600 text-white  rounded flex gap-2 items-center py-2 px-5`}
                  >
                    Remove Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal
        changePasswordModalOpen={changePasswordModalOpen}
        setchangePasswordModalOpen={setchangePasswordModalOpen}
        ForgotPasswordOpen={ForgotPasswordOpen}
        setForgotPasswordOpen={setForgotPasswordOpen}
      />
      <ForgotPasswordModal
        ForgotPasswordOpen={ForgotPasswordOpen}
        setForgotPasswordOpen={setForgotPasswordOpen}
      />
    </div>
  );
};

export default FrontSettingPage;
