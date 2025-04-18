import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashHeader from "./DashHeader";
import Sidebar from "../../components/dash/Sidebar";
import GoToTop from "../../components/common/GoToTop";

const DashMaster = () => {
  const [toggleSidebar, settoggleSidebar] = useState(false);
  console.log("toggle sidebar >>> ", toggleSidebar);
  const { pathname } = useLocation();

  useEffect(() => {
    settoggleSidebar(false);
  }, [pathname]);

  return (
    <>
      <Sidebar
        toggleSidebar={toggleSidebar}
        settoggleSidebar={settoggleSidebar}
      />
      <Sidebar className={`${toggleSidebar ? "start-0" : "-start-[300px]"}`} />

      <DashHeader
        toggleSidebar={toggleSidebar}
        settoggleSidebar={settoggleSidebar}
      />
      <div className="main_layout_container transition-all duration-500 ease-linear  bg-backgroundv2 main ps-0 md:ps-[270px] xxl:ps-[300px] pt-[78px]  min-h-screen w-screen">
        <Outlet />
        <GoToTop/>
      </div>
    </>
  );
};

export default DashMaster;
