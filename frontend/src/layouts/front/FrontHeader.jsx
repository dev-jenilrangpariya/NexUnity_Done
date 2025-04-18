import React, { useEffect, useMemo } from "react";
import { Link, useFetcher, useNavigate } from "react-router-dom";
import ThemeToggler from "../../components/common/ThemeToggler";
import darkLogo from "../../assets/images/darkLogo.jpeg";
import lightLogo from "../../assets/images/whiteLogo.png";
import logo from "../../assets/images/loho1.png";
import { Bell, Menu, Plus, Settings } from "lucide-react";
import profile from "../../assets/images/frontHero/home header3.jpg";
import Sidebar from "../../components/front/Sidebar";
import DataLoadingCompo from "../../components/common/DataLoadingCompo";
import defaultimage from "../../assets/images/customeProfile.png";
import { useSelector } from "react-redux";
import { selectUserData } from "../../reducers/authSlice";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import { FOLLOW_API_URL } from "../../security/axios";
import { useQuery } from "react-query";

const FrontHeader = () => {
  const navigate = useNavigate();
  // let yscroll = window.scrollY;
  // useEffect(() => {
  //   const handleScroll = () => {
  //     yscroll = window.scrollY;
  //     const header__wrapper =
  //       document.getElementsByClassName("header__wrapper");
  //     if (yscroll > 100) {
  //       header__wrapper[0].classList.replace(
  //         "bg-transparent",
  //         "bg-backgroundv1"
  //       );
  //       header__wrapper[0].classList.replace("h-[120px]", "h-[80px]");
  //       header__wrapper[0].classList.replace("shadow-none", "shadow");
  //     } else {
  //       header__wrapper[0].classList.replace(
  //         "bg-backgroundv1",
  //         "bg-transparent"
  //       );
  //       header__wrapper[0].classList.replace("h-[80px]", "h-[120px]");
  //       header__wrapper[0].classList.replace("shadow", "shadow-none");
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // });

  const userData = useSelector(selectUserData);
  const CurrentUserId = userData._id;
  const axiosPrivate = useAxiosPrivate();
  const queryKey = useMemo(() => ["get_pending_request"], []);

  const { data: pendingRequestes } = useQuery(
    queryKey,
    async () => {
      const response = await axiosPrivate.get(
        FOLLOW_API_URL.get_pending_request.replace(":user_id", CurrentUserId)
      );
      return response.data.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  // console.log("get_pending_request header>>> ",pendingRequestes)

  return (
    // <header className="header__wrapper h-[120px] bg-transparent   p-1 z-50  fixed fixed-top w-full shadow-none transition-all duration-500 ease-linear flex justify-center items-center">
    <>
      {/* <DataLoadingCompo /> */}
      <header className="header__wrapper border-b border-backgroundv3 h-[80px] bg-backgroundv1 text-textPrimary   p-1 z-50  fixed fixed-top w-full shadow-none transition-all duration-500 ease-linear flex justify-center items-center">
        <div className="flex justify-between items-center px-5 w-full h-full container">
          <div className="logo">
            <div className="img_container flex justify-center items-center  h-[70px] w-[70px]">
              <Link
                to={"/"}
                className="flex items-center gap-2 lg:gap-3 h-full w-full"
              >
                {/* <Logo /> */}

                <img
                  src={logo}
                  alt="logo"
                  width={550}
                  height={550}
                  className="w-full h-full object-cover object-center"
                />

                <h1 className="text-blueMain font-semibold !font-merienda text-2xl md:text-3xl hidden xsm:block">
                  NexUnity
                </h1>
              </Link>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3 xl:gap-4 items-center">
            <button onClick={() => navigate("/add-post")}>
              <Plus
                className="h-[24px] w-[24px] xl:h-[32px] xl:w-[32px] text-textPrimary"
                strokeWidth={1.8}
              />
            </button>
            <button
              onClick={() => navigate("/notification")}
              className="relative"
            >
              <Bell
                className="h-[24px] w-[24px] xl:h-[32px] xl:w-[32px] text-textPrimary"
                strokeWidth={1.8}
              />
              <div className="absolute -top-2 -end-2 w-5 h-5 rounded-full bg-blueMain text-white flex justify-center items-center text-10">
                {pendingRequestes?.length}
              </div>
            </button>
            <Link to={"/settings"}>
              <Settings
                className="h-[24px] w-[24px] xl:h-[32px] xl:w-[32px] text-textPrimary custom-spin"
                strokeWidth={1.8}
              />
            </Link>
            <ThemeToggler />
            <Link
              className="h-[42px] w-[42px] overflow-hidden rounded-full"
              to={"/profile"}
            >
              <img
                src={
                  userData.profile_pic !== ""
                    ? `${process.env.REACT_APP_SERVER_IMAGE_PATH}${userData.profile_pic}`
                    : defaultimage
                }
                alt="profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
                }}
              />
            </Link>
          </div>
        </div>
      </header>
      <Sidebar />
    </>
  );
};

export default FrontHeader;
