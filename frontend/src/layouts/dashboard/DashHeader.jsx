import React, { useContext, useMemo, useState } from "react";
import Logo from "../../assets/images/Logo";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggler from "../../components/common/ThemeToggler";
import { BellPlusIcon, MenuIcon } from "lucide-react";
import { IconButton } from "../../components/ui/IconButton";
import profile from "../../assets/images/frontHero/home header3.jpg";
import darkLogo from "../../assets/images/darkLogo.jpeg";
import lightLogo from "../../assets/images/whiteLogo.png";
import { ThemeContext } from "../../context/ThemeContext";
import logo from "../../assets/images/loho1.png";
import { useSelector } from "react-redux";
import { selectUserData } from "../../reducers/authSlice";
import defaultimage from "../../assets/images/customeProfile.png";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import { useQuery } from "react-query";
import { FOLLOW_API_URL } from "../../security/axios";
import { Bell, Menu, Plus, Settings } from "lucide-react";

const DashHeader = ({ toggleSidebar, settoggleSidebar }) => {
  const userData = useSelector(selectUserData);
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

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

  return (
    <div className="dash_header bg-backgroundv1 border border-backgroundv3 text-textPrimary w-full fixed top-0 start-0 z-50 shadow h-[78px]">
      <div className="header_wrapper flex justify-between items-center px-5 h-full w-full">
        <div className="logo-part flex justify-center items-center md:px-5">
          <button
            className="sidebar_button block md:hidden me-4"
            onClick={() => settoggleSidebar(!toggleSidebar)}
          >
            <MenuIcon className="h-[32px] w-[32px]" />
          </button>
          <div className="img_container flex justify-center items-center  h-[70px] w-[70px]">
            <Link
              to={"/dashboard"}
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
        <div className="group of functions flex justify-center items-center gap-1 xl:gap-3">
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
          {/* <IconButton>
            <BellPlusIcon className=" h-[24px] w-[24px] xl:h-[32px] xl:w-[32px]" />
          </IconButton> */}
          <ThemeToggler />
          <button className="h-[42px] w-[42px] overflow-hidden rounded-full">
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashHeader;
