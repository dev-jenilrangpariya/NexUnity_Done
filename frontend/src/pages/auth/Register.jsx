import {
  Eye, EyeOff
} from "lucide-react";
import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import { IoIosMail } from "react-icons/io";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { selectUserData } from "../../reducers/authSlice";
import { AUTH_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import OtpVerifyEmailModal from "./OtpVerifyEmailModal";
import "./css/Login.css";
const Register = ({ setregisterModalOpen }) => {
  // const navigate = useNavigate();
  // const [IsshowPassword, setIsshowPassword] = useState(false);
  // const [IsshowConformPass, setIsshowConformPass] = useState(false);
  // const [terms, setTerms] = useState(false);
  // const [user, setUser] = useState({
  //   name: "",
  //   email: "",
  //   userName: "",
  //   password: "",
  //   confirmPass: "",
  // });

  // const onRegister = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   if (!terms) {
  //     toast.info("Accept Our Privacy policy and terms & condition", {
  //       hideProgressBar: true,
  //     });
  //     return;
  //   }

  //   if (
  //     !user.name ||
  //     !user.userName ||
  //     !user.password ||
  //     !user.email ||
  //     !user.confirmPass
  //   ) {
  //     toast.warning("fill all the fields", { hideProgressBar: true });
  //     return;
  //   }
  //   if (user.password !== user.confirmPass) {
  //     toast.warning("password are not same", {
  //       hideProgressBar: true,
  //     });
  //     return;
  //   }
  //   toast.success("succesfully registred");
  //   console.log("register user on post /register >>> ", user);
  // };

  // const handleChange = (e) => {
  //   setUser({ ...user, [e.target.name]: e.target.value });
  // };
  // const [step, setstep] = useState(1);
  const storeuserData = useSelector(selectUserData)
  console.log("store user data >>> ", storeuserData)

  const [IsshowPassword, setIsshowPassword] = useState(false);
  let toastId;
  const axiosPrivate = useAxiosPrivate();

  const [verifyEmailPopupOpen, setverifyEmailPopupOpen] = useState(false);
  const verifyEmailPopupClose = () => {
    setverifyEmailPopupOpen(false);
  };
  const [verifiedEmail, setverifiedEmail] = useState("");
  const [verifyEmailStatus, setverifyEmailStatus] = useState(false);
  const verifyEmailFun = async () => {
    try {
      setverifyEmailStatus(true);
      await registerApi({
        ...registerUserData,
        gender: +registerUserData.gender,
        active: true,
        isRoot: true,
        isPrivate: false,
        token: "",
      });
    } catch (error) {
      console.log("error while registering >> ", error);
    }
  };

  const navigate = useNavigate();
  const [registerUserData, setregisterUserData] = useState({
    first_name: "",
    middle_name: "",
    surname: "",
    gender: "1",
    email: "",
    password: "",
    profile_pic: "",
  });

  //email otp generate a[pi

  const { mutateAsync: generateOTP } = useMutation(
    async (data) => {
      toastId = toast.loading("Please wait...");
      return await axiosPrivate.post(
        AUTH_API_URL.generateOtp,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (res) => {
        console.log("res >>> ", res);
        toast.update(toastId, {
          render: res.data.message || "Register succesfully",
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: 2000,
        });
        setTimeout(() => {
          setverifyEmailPopupOpen(true);
        }, 1500);
        // toast.success("Verification code OTP sent successfully.");
      },
      onError: (error) => {
        toast.dismiss(toastId);
        // const message = error?.response?.data?.message;
        // if (message) {
        //   // toast.error(message);
        //   toast.update(toastId, {
        //     render: message,
        //     type: toast.TYPE.ERROR,
        //     isLoading: false,
        //     autoClose: 2000,
        //   });
        // } else {
        //   // toast.error("Something went wrong! Please try again");
        //   toast.update(toastId, {
        //     render: "Something went wrong! Please try again",
        //     type: toast.TYPE.ERROR,
        //     isLoading: false,
        //     autoClose: 2000,
        //   });
        // }
      },
    }
  );

  //register user API
  const { mutateAsync: registerApi } = useMutation(
    async (data) => {
      toastId = toast.loading("Please wait...");
      return await axiosPrivate.post(
        AUTH_API_URL.register,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (res) => {
        console.log("res >> ", res);
        // toast.success("Register succesfully");
        toast.update(toastId, {
          render: res.data.message || "Register succesfully",
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      },
      onError: (error) => {
        toast.dismiss(toastId);
        // const message = error?.response?.data?.message;
        // if (message) {
        //   toast.update(toastId, {
        //     render: message,
        //     type: toast.TYPE.ERROR,
        //     isLoading: false,
        //     autoClose: 2000,
        //   });
        //   // toast.error(message);
        // } else {
        //   toast.update(toastId, {
        //     render: "Something went wrong! Please try again",
        //     type: toast.TYPE.ERROR,
        //     isLoading: false,
        //     autoClose: 2000,
        //   });
        //   // toast.error("Something went wrong! Please try again");
        // }
      },
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setregisterUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      registerUserData.first_name === "" ||
      registerUserData.middle_name === "" ||
      registerUserData.surname === "" ||
      registerUserData.email === "" ||
      registerUserData.password === ""
    ) {
      toast.warning("All fields are nessasary");
    }
    // else if (!emailRegex.test(registerUserData.email)) {
    //   toast.warning("Invalid Email Address");
    // } 
    else if (registerUserData.password.length < 8) {
      toast.warning("password minimun 8 character required");
    } else {
      try {
        console.log("Form Data:", registerUserData);
        verifyEmailStatus &&
          verifiedEmail !== "" &&
          verifiedEmail === registerUserData.email
          ? verifyEmailFun()
          : await generateOTP({ email: registerUserData.email });
      } catch (error) {
        console.log("error while grerating OTP >> ", error);
      }
    }
  };

  return (
    <>
      {/* <div className="register_wrapper w-full h-screen bg-backgroundv2 text-textPrimary flex-1 flex items-center justify-center py-5">
        <div className="bg-backgroundv1 h-full flex flex-col max-h-[700px] text-textPrimary px-2 md:px-4 py-7 rounded-2xl w-full max-w-xl mx-3 my-3">
          <h1 className="text-center uppercase flex-shrink-0 text-3xl">Sign up</h1>
          <div className="sign_up_step_header flex-shrink-0 w-full flex justify-center items-center py-5">
            <ul className="w-full max-w-[600px] flex items-center justify-center">
              <li className={`flex-grow w-full ${step===1 && "active"} ${step > 1 && "done"} group relative before:absolute before:top-5 before:sm:top-6 before:start-[calc(50%+20px)] before:sm:start-[calc(50%+25px)] before:w-[calc(100%-40px)] before:sm:w-[calc(100%-50px)] before:h-[2px] ${step > 1 ? "before:bg-green-600":"before:bg-gray-300"} before:last:hidden before:transition-all before:duration-500 before:ease-in transition-all duration-500 ease-linear`} onClick={()=>setstep(1)}>
                <div className="flex flex-col justify-center items-center gap-1 w-full">
                  <div className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full border group-[.active]:text-textPrimary group-[.active]:font-semibold group-[.active]:bg-backgroundv2 group-[.active]:border-2 group-[.active]:border-textPrimary group-[.done]:border-2 group-[.done]:border-green-800 group-[.done]:bg-green-400/50 text-gray-400 flex justify-center items-center">
                    <span className="group-[.done]:hidden">1</span>
                    <span className="hidden group-[.done]:block text-green-800"><CheckCheck/></span>
                  </div>
                  <h2 className="text-gray-400 group-[.active]:text-textPrimary group-[.active]:font-semibold text-xs sm:text-sm md:text-base group-[.done]:text-green-800 group-[.done]:font-semibold">
                    Email
                  </h2>
                </div>
              </li>
              <li className={`flex-grow w-full ${step===2 && "active"} ${step > 2 && "done"} group relative before:absolute before:top-5 before:sm:top-6 before:start-[calc(50%+20px)] before:sm:start-[calc(50%+25px)] before:w-[calc(100%-40px)] before:sm:w-[calc(100%-50px)] before:h-[2px] ${step > 2 ? "before:bg-green-600":"before:bg-gray-300"} before:last:hidden before:transition-all before:duration-500 before:ease-in transition-all duration-500 ease-linear`} onClick={()=>setstep(2)}>
                <div className="flex flex-col justify-center items-center gap-1 w-full">
                  <div className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full border group-[.active]:text-textPrimary group-[.active]:font-semibold group-[.active]:bg-backgroundv2 group-[.active]:border-2 group-[.active]:border-textPrimary group-[.done]:border-2 group-[.done]:border-green-800 group-[.done]:bg-green-400/50 text-gray-400 flex justify-center items-center">
                    <span className="group-[.done]:hidden">2</span>
                    <span className="hidden group-[.done]:block text-green-800"><CheckCheck/></span>
                  </div>
                  <h2 className="text-gray-400 group-[.active]:text-textPrimary group-[.active]:font-semibold text-xs sm:text-sm md:text-base group-[.done]:text-green-800 group-[.done]:font-semibold">
                    Pesonal details
                  </h2>
                </div>
              </li>
              <li className={`flex-grow w-full ${step===3 && "active"} ${step > 3 && "done"} group relative before:absolute before:top-5 before:sm:top-6 before:start-[calc(50%+20px)] before:sm:start-[calc(50%+25px)] before:w-[calc(100%-40px)] before:sm:w-[calc(100%-50px)] before:h-[2px] ${step > 3 ? "before:bg-green-600":"before:bg-gray-300"} before:last:hidden before:transition-all before:duration-500 before:ease-in transition-all duration-500 ease-linear`} onClick={()=>setstep(3)}>
                <div className="flex flex-col justify-center items-center gap-1 w-full">
                  <div className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full border group-[.active]:text-textPrimary group-[.active]:font-semibold group-[.active]:bg-backgroundv2 group-[.active]:border-2 group-[.active]:border-textPrimary group-[.done]:border-2 group-[.done]:border-green-800 group-[.done]:bg-green-400/50 text-gray-400 flex justify-center items-center">
                    <span className="group-[.done]:hidden">3</span>
                    <span className="hidden group-[.done]:block text-green-800"><CheckCheck/></span>
                  </div>
                  <h2 className="text-gray-400 group-[.active]:text-textPrimary group-[.active]:font-semibold text-xs sm:text-sm md:text-base group-[.done]:text-green-800 group-[.done]:font-semibold">
                    Family Tree
                  </h2>
                </div>
              </li>
            </ul>
          </div>
          <div className="p-3 md:px-10 flex-grow">
            <Step1 step={step} setstep={setstep} isActive={step === 1} />
            <Step2 step={step} setstep={setstep} isActive={step === 2} />
            <Step3 step={step} setstep={setstep} isActive={step === 3} />
          </div>
        </div>
      </div> */}

      <div className="login-container">
        <div className="forms-container">
          <div className="signin-signup">
            <form action="" className="sign-in-form" onSubmit={handleSubmit}>
              <h2 className="sign-title">Sign up</h2>
              <div className="input-field">
                <i className="flex justify-center items-center h-full">
                  <HiUsers className="h-5 w-5" />{" "}
                </i>
                <input
                  type="text"
                  placeholder="first name"
                  name="first_name"
                  value={registerUserData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="input-field">
                <i className="flex justify-center items-center h-full">
                  <HiUsers className="h-5 w-5" />
                </i>
                <input
                  type="text"
                  placeholder="middle name"
                  name="middle_name"
                  value={registerUserData.middle_name}
                  onChange={handleChange}
                />
              </div>
              <div className="input-field">
                <i className="flex justify-center items-center h-full">
                  <HiUsers className="h-5 w-5" />
                </i>
                <input
                  type="text"
                  placeholder="surname"
                  name="surname"
                  value={registerUserData.surname}
                  onChange={handleChange}
                />
              </div>
              <div className="gender-container">
                <label className="gender-label"> Gender: </label>
                <div className="radio-group">
                  <input
                    type="radio"
                    className="radio-sign"
                    name="gender"
                    value={"1"}
                    checked={registerUserData.gender === "1"}
                    onChange={handleChange}
                    id="male"
                  />
                  <label htmlFor="male">Male</label>
                </div>
                <div className="radio-group">
                  <input
                    type="radio"
                    className="radio-sign"
                    id="female"
                    name="gender"
                    value={"2"}
                    checked={registerUserData.gender === "2"}
                    onChange={handleChange}
                  />
                  <label htmlFor="female">Female</label>
                </div>
                {/* <div className="radio-group">
                  <input
                    type="radio"
                    className="radio-sign"
                    id="other"
                    name="gender"
                    value={"0"}
                    checked={registerUserData.gender === "0"}
                    onChange={handleChange}
                  />
                  <label htmlFor="other">Other</label>
                </div> */}
              </div>
              <div className="input-field">
                <i className="flex justify-center items-center h-full">
                  {" "}
                  <IoIosMail className="h-5 w-5" />{" "}
                </i>
                <input
                  type="email"
                  placeholder="email"
                  name="email"
                  value={registerUserData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-field">
                <i className="flex justify-center items-center h-full">
                  {" "}
                  <FaLock className="h-5 w-5" />{" "}
                </i>
                <div style={{ position: 'relative', display: 'inline-flex' }}>
                  <input
                    type={IsshowPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={registerUserData.password}
                    onChange={handleChange}
                  />       <span style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}>
                    <i className="fas fa-lock">
                      {IsshowPassword ? <Eye className="mt-2 ps-1" onClick={() => setIsshowPassword(!IsshowPassword)} /> : <EyeOff className="mt-2 ps-1" onClick={() => setIsshowPassword(!IsshowPassword)} />}
                    </i>
                  </span>
                </div>
              </div>

              {/* <label>
                Profile Picture URL:
                <input
                  type="text"
                  name="profile_pic"
                  value={registerUserData.profile_pic}
                  onChange={handleChange}
                />
              </label> */}

              <input
                type="submit"
                value={verifyEmailStatus ? "Register" : "Send OTP"}
                className="btn solid"
              />
              {/* <p className="social-text">Or Sign in with social platforms</p>
              <div className="social-media">
                <Link to="#" className="social-icon">
                  <FaFacebook />
                </Link>
                <a href="#" className="social-icon">
                  <FaTwitter />
                </a>
                <a href="#" className="social-icon">
                  <FaGoogle />
                </a>
                <a href="#" className="social-icon">
                  <FaLinkedin />
                </a>
              </div> */}
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New to our community ?</h3>
              <p>
                Discover a world of possibilities! Join us and explore a vibrant
                community where ideas flourish and connections thrive.
              </p>
              <Link to="/login">
                <button className="btn solid transparent" id="sign-up-btn">
                  Sign in
                </button>
              </Link>
            </div>
            <img
              src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png"
              className="auth-image"
              alt=""
            />
          </div>
        </div>
      </div>

      <OtpVerifyEmailModal
        otpVerifyEmailModalOpen={verifyEmailPopupOpen}
        emailValue={registerUserData.email}
        otpVerifyEmailModalClose={verifyEmailPopupClose}
        verifyEmailFun={verifyEmailFun}
        setverifiedEmail={setverifiedEmail}
      />
    </>
  );
};

export default Register;
