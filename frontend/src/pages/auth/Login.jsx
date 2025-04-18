import {
  Eye, EyeOff,
  Lock,
  User2Icon
} from "lucide-react";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ForgotPasswordModal from "../../components/dash/modal/forgotPasswordModalflow/ForgotPasswordModal";
import {
  login,
  selectRole,
  selectUserData
} from "../../reducers/authSlice";
import { AUTH_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import "./css/Login.css";

const Login = () => {
  let id;
  const [IsshowPassword, setIsshowPassword] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });
  const [ForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const role = useSelector(selectRole);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  // const showPassword = false
  const { mutateAsync: loginApi } = useMutation(
    async (data) => {
      return await axiosPrivate.post(AUTH_API_URL.login, JSON.stringify(data));
    },
    {
      onSuccess: (res) => {
        toast.update(id, {
          render: res.data.message,
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: 2000,
        });
        // toast.success(res.data.message); // Adjust based on your API response structure
        let user = res.data.data.user;
        let token = res.data.data.token;
        dispatch(login({ user: user, token: token }));
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", JSON.stringify(token));
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("token", JSON.stringify(token));
        setTimeout(() => {
          if (user.role === 1) {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }, 3000);
      },
      onError: (error) => {
        toast.dismiss(id);
        // console.error("Error:", error);
        // if (error.response) {
        //   toast.update(id, {
        //     render: error.response.data.message,
        //     type: toast.TYPE.ERROR,
        //     isLoading: false,
        //     autoClose:2000,
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

  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(user);
    if (!user.email || !user.password) {
      toast.warning("fill all the fields", { hideProgressBar: true });
      return;
    }

    try {
      id = toast.loading("Please wait...");
      await loginApi(user);
    } catch (error) { }

    // authenticate(user);
    // console.log("session >>> ",JSON.parse(sessionStorage.getItem("user")))
  };

  // console.log("userdata >>>>> ", userData);
  // console.log("token >>>>> ", token);
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* <div className="w-full bg-backgroundv2 text-textPrimary grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="w-full hidden lg:flex md:justify-center md:items-center col-span-1">
          <div className="image_wrapper h-full w-full overflow-hidden">
            <img src={img} className="object-cover h-full w-full" alt="Logo" />
          </div>
        </div>
        <div className="login_wrapper flex items-center justify-center mx-2">
          <div className="bg-backgroundv1 text-textPrimary px-2 md:px-5 py-5 md:py-8 rounded-2xl w-full max-w-md shadow">
            <div className="flex flex-col w-full gap-y-2 justify-center items-center">
              <h1 className="text-center font-semibold uppercase text-3xl">
                Login
              </h1>
            </div>
            <div className="p-3 pt-0">
              <form
                action="login"
                method="post"
                className="login_form "
                onSubmit={handleLogin}
              >
                <div className="form-group mt-5">
                  <Input
                    lable={"Email "}
                    type={"text"}
                    name={"email"}
                    placeholder={"Enter Email"}
                    value={user.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative form-group mt-5">
                  <Input
                    lable={"Password"}
                    type={IsshowPassword ? "text" : "password"}
                    name={"password"}
                    placeholder={"Enter Password"}
                    value={user.password}
                    onChange={handleChange}
                  />
                  <span
                    className="absolute top-12 end-3"
                    onClick={() => setIsshowPassword(!IsshowPassword)}
                  >
                    {IsshowPassword ? (
                      <IcnCloseEye className="h-5 w-5 text-gray-500" />
                    ) : (
                      <IcnOpenEye className="h-5 w-5 text-gray-500" />
                    )}
                  </span>
                </div>
                <span className="flex justify-end text-sm">
                  <Link
                    to={"/forgot-password"}
                  >
                    Forgot password?
                  </Link>
                </span>
                <Button
                  variant={"blue"}
                  className={"my-5 rounded-none"}
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </form>
              <div className="text-center">
                <span className="text-gray-500">You Have No account? </span>
                <Link to={"/register"}>Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="login-container">
        <div className="forms-container">
          <div className="signin-signup">
            <form action="" className="sign-in-form" onSubmit={handleLogin}>
              <h2 className="sign-title ">Sign in</h2>
              <div className="input-field">
                <i className="fas fa-user">
                  <User2Icon className="mt-2 ps-1" />
                </i>
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock">
                  <Lock className="mt-2 ps-1" />
                </i>
                <div style={{ position: 'relative', display: 'inline-flex' }}>
                  <input
                    type={IsshowPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    // className="h-12 bg-backgroundv2 font-400 !text-14 !text-textPrimary focus:outline-none border border-backgroundv3 w-full rounded-lg px-5"
                    style={{ paddingRight: '2.5rem' }} // Add some padding on the right to accommodate the eye icon
                  />
                  <span style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}>
                    <i className="fas fa-lock">
                      {IsshowPassword ?<Eye className="mt-2 ps-1" onClick={() => setIsshowPassword(!IsshowPassword)} />:<EyeOff className="mt-2 ps-1" onClick={() => setIsshowPassword(!IsshowPassword)} />}
                    </i>
                  </span>
                </div>

              </div>
              <div className="w-full max-w-[380px] mt-3 flex justify-end items-end !text-end">
                <div className="!text-end cursor-pointer text-blue-800" onClick={() => setForgotPasswordOpen(true)}>Forgot Password ?</div>
              </div>
              <input type="submit" value="Login" className="btn solid" />
              {/* <p className="social-text font-semibold" >Or Sign in with social platforms</p>
              <div className="social-media">
                <Link to="#" className="social-icon">
                  <Facebook />
                </Link>
                <a href="#" className="social-icon">
                  <Twitter />
                </a>
                <a href="#" className="social-icon">
                  <FaGoogle />
                </a>
                <a href="#" className="social-icon">
                  <Linkedin />
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
              <Link to="/register">
                <button className="btn solid transparent" id="sign-up-btn">
                  Sign up
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
      <ForgotPasswordModal
        ForgotPasswordOpen={ForgotPasswordOpen}
        setForgotPasswordOpen={setForgotPasswordOpen}
      />

    </>
  );
};

export default Login;
