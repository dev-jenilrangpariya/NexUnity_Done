import {
  Blocks,
  MapPinned
} from "lucide-react";
import React, { useMemo } from "react";
import { MdPeople } from "react-icons/md";
import {
  RiAdminLine,
  RiBriefcase2Fill,
  RiCalendarCheckFill,
  RiCalendarEventFill
} from "react-icons/ri";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import DataLoadingCompo from "../../components/common/DataLoadingCompo";
import ChartCompo from "../../components/dash/ChartCompo";
import { formatUserFriendlyCount } from "../../lib/userFriendlyCount";
import {
  ADMIN_DASHBORD_COUNTS
} from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";

const DashboardHome = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const queryKey = useMemo(() => ["AdminDashboardCounts"], []);

  //get ADMIN_DASHBORD_COUNTS api
  const {
    data: AdminDashboardCounts,
    isLoading,
    isError,
    error,
  } = useQuery(
    queryKey,
    async () => {
      const response = await axiosPrivate.get(ADMIN_DASHBORD_COUNTS);
      return response.data.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  if (isError && error) {
    return (
      <div className="w-full h-[400px] flex justify-center items-center">
        <DataLoadingCompo />
        <h2 className="text-textPrimary text-center text-26">
          Network Error !!!!
        </h2>
      </div>
    );
  }

  if (isLoading) {
    return <DataLoadingCompo />;
  }

  return (
    <div className="dash h-full min-h-screen container w-full bg-backgroundv2 p-8 transition-all duration-200 ease-in-out">
      {/* <h3 className="text-28 lg:text-32 text-textPrimary">Dashboard</h3> */}
      <div className="dash_home pb-5 lg:pb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2  3xl:grid-cols-3 gap-5">
        <div
          onClick={() => navigate("/dashboard/events")}
          className="cursor-pointer dashbord-card shadow-md group/item hover:scale-105 transition-all duration-300 ease-linear rounded-2xl bg-backgroundv1 w-full h-[200px] xxl:h-[250px] overflow-hidden  p-5 relative"
        >
          <div className="flex gap-3 items-start">
            <div className="dashbord-card-icon h-[60px] w-[60px] flex-shrink-0 xl:h-[70px] xl:w-[70px] xxl:h-[80px] xxl:w-[80px] rounded-full overflow-hidden border-2 border-[#ffc107]/30 bg-[#ffc107]/30 text-[#ffc107] flex items-center justify-center group-hover/item:bg-[#ffc107] group-hover/item:text-white transition-all duration-75 ease-linear group-hover/item:border-[#ffc107]">
              <RiCalendarEventFill className="h-8 w-8 xl:h-9 xl:w-9 xxl:h-10 xxl:w-10 group-hover/item:scale-110 transition-all duration-500 ease-linear" />
            </div>
            <div>
              <h3 className="text-24 xl:text-26 xxl:text-30 mb-1 xxl:mb-2 text-textPrimary">
                Today Events
              </h3>
              <span className="text-14 lg:text-16 xl:text-18 xxl:text-20 text-textGray">
                {formatUserFriendlyCount(AdminDashboardCounts.noOfTodayEvents)}
              </span>
            </div>
          </div>

          <div className="absolute -end-3 -bottom-4 w-[110%] h-full">
            <ChartCompo color={"#ffc107"} />
          </div>
        </div>
        <div
          onClick={() => navigate("/dashboard/users")}
          className="cursor-pointer dashbord-card shadow-md group/item hover:scale-105 transition-all duration-300 ease-linear rounded-2xl bg-backgroundv1 w-full h-[200px] xxl:h-[250px] overflow-hidden  p-5 relative"
        >
          <div className="flex gap-3 items-start">
            <div className="dashbord-card-icon h-[60px] w-[60px] flex-shrink-0 xl:h-[70px] xl:w-[70px] xxl:h-[80px] xxl:w-[80px] rounded-full overflow-hidden border-2 border-[#FF69B4]/30 bg-[#FF69B4]/30 text-[#FF69B4] flex items-center justify-center group-hover/item:bg-[#FF69B4] group-hover/item:text-white transition-all duration-75 ease-linear group-hover/item:border-[#FF69B4]">
              <MdPeople className="h-8 w-8 xl:h-9 xl:w-9 xxl:h-10 xxl:w-10 group-hover/item:scale-110 transition-all duration-500 ease-linear" />
            </div>
            <div>
              <h3 className="text-24 xl:text-26 xxl:text-30 mb-1 xxl:mb-2 text-textPrimary">
                Users
              </h3>
              <span className="text-14 lg:text-16 xl:text-18 xxl:text-20 text-textGray">
                {formatUserFriendlyCount(AdminDashboardCounts.noOfUsers)}
              </span>
            </div>
          </div>
          <div className="absolute -end-3 -bottom-4 w-[110%] h-full">
            <ChartCompo />
          </div>
        </div>
        <div
          onClick={() => navigate("/dashboard/categories")}
          className="cursor-pointer dashbord-card shadow-md group/item hover:scale-105 transition-all duration-300 ease-linear rounded-2xl bg-backgroundv1 w-full h-[200px] xxl:h-[250px] overflow-hidden  p-5 relative"
        >
          <div className="flex gap-3 items-start">
            <div className="dashbord-card-icon h-[60px] w-[60px] flex-shrink-0 xl:h-[70px] xl:w-[70px] xxl:h-[80px] xxl:w-[80px] rounded-full overflow-hidden border-2 border-[#007aff]/30 bg-[#007aff]/30 text-[#007aff] flex items-center justify-center group-hover/item:bg-[#007aff] group-hover/item:text-white transition-all duration-75 ease-linear group-hover/item:border-[#007aff]">
              <Blocks
                className="h-8 w-8 xl:h-9 xl:w-9 xxl:h-10 xxl:w-10 group-hover/item:scale-110 transition-all duration-500 ease-linear"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3 className="text-24 xl:text-26 xxl:text-30 mb-1 xxl:mb-2 text-textPrimary">
                Categories
              </h3>
              <span className="text-14 lg:text-16 xl:text-18 xxl:text-20 text-textGray">
                {formatUserFriendlyCount(AdminDashboardCounts.noOfCategories)}
              </span>
            </div>
          </div>

          <div className="absolute -end-3 -bottom-4 w-[110%] h-full">
            <ChartCompo color={"#007aff"} />
          </div>
        </div>
        <div
          onClick={() => navigate("/dashboard/community")}
          className="cursor-pointer dashbord-card shadow-md group/item hover:scale-105 transition-all duration-300 ease-linear rounded-2xl bg-backgroundv1 w-full h-[200px] xxl:h-[250px] overflow-hidden  p-5 relative"
        >
          <div className="flex gap-3 items-start">
            <div className="dashbord-card-icon h-[60px] w-[60px] flex-shrink-0 xl:h-[70px] xl:w-[70px] xxl:h-[80px] xxl:w-[80px] rounded-full overflow-hidden border-2 border-[#07bc0c]/30 bg-[#07bc0c]/30 text-[#07bc0c] flex items-center justify-center group-hover/item:bg-[#07bc0c] group-hover/item:text-white transition-all duration-75 ease-linear group-hover/item:border-[#07bc0c]">
              <RiAdminLine className="h-8 w-8 xl:h-9 xl:w-9 xxl:h-10 xxl:w-10 group-hover/item:scale-110 transition-all duration-500 ease-linear" />
            </div>
            <div>
              <h3 className="text-24 xl:text-26 xxl:text-30 mb-1 xxl:mb-2 text-textPrimary">
                Community Manager
              </h3>
              <span className="text-14 lg:text-16 xl:text-18 xxl:text-20 text-textGray">
                {formatUserFriendlyCount(AdminDashboardCounts.noOfCommunities)}
              </span>
            </div>
          </div>

          <div className="absolute -end-3 -bottom-4 w-[110%] h-full">
            <ChartCompo color={"#07bc0c"} />
          </div>
        </div>

        <div
          onClick={() => navigate("/dashboard/jobs")}
          className="cursor-pointer dashbord-card shadow-md group/item hover:scale-105 transition-all duration-300 ease-linear rounded-2xl bg-backgroundv1 w-full h-[200px] xxl:h-[250px] overflow-hidden  p-5 relative"
        >
          <div className="flex gap-3 items-start">
            <div className="dashbord-card-icon h-[60px] w-[60px] flex-shrink-0 xl:h-[70px] xl:w-[70px] xxl:h-[80px] xxl:w-[80px] rounded-full overflow-hidden border-2 border-[#bb86fc]/30 bg-[#bb86fc]/30 text-[#bb86fc] flex items-center justify-center group-hover/item:bg-[#bb86fc] group-hover/item:text-white transition-all duration-75 ease-linear group-hover/item:border-[#bb86fc]">
              <RiBriefcase2Fill className="h-8 w-8 xl:h-9 xl:w-9 xxl:h-10 xxl:w-10 group-hover/item:scale-110 transition-all duration-500 ease-linear" />
            </div>
            <div>
              <h3 className="text-24 xl:text-26 xxl:text-30 mb-1 xxl:mb-2 text-textPrimary">
                Jobs
              </h3>
              <span className="text-14 lg:text-16 xl:text-18 xxl:text-20 text-textGray">
                {formatUserFriendlyCount(AdminDashboardCounts.noOfJobs)}
              </span>
            </div>
          </div>

          <div className="absolute -end-3 -bottom-4 w-[110%] h-full">
            <ChartCompo color={"#bb86fc"} />
          </div>
        </div>
        <div
          onClick={() => navigate("/dashboard/users")}
          className="cursor-pointer dashbord-card shadow-md group/item hover:scale-105 transition-all duration-300 ease-linear rounded-2xl bg-backgroundv1 w-full h-[200px] xxl:h-[250px] overflow-hidden  p-5 relative"
        >
          <div className="flex gap-3 items-start">
            <div className="dashbord-card-icon h-[60px] w-[60px] flex-shrink-0 xl:h-[70px] xl:w-[70px] xxl:h-[80px] xxl:w-[80px] rounded-full overflow-hidden border-2 border-[#e74c3c]/30 bg-[#e74c3c]/30 text-[#e74c3c] flex items-center justify-center group-hover/item:bg-[#e74c3c] group-hover/item:text-white transition-all duration-75 ease-linear group-hover/item:border-[#e74c3c]">
              <MapPinned
                className="h-8 w-8 xl:h-9 xl:w-9 xxl:h-10 xxl:w-10 group-hover/item:scale-110 transition-all duration-500 ease-linear"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3 className="text-24 xl:text-26 xxl:text-30 mb-1 xxl:mb-2 text-textPrimary">
                Trace Requests
              </h3>
              <span className="text-14 lg:text-16 xl:text-18 xxl:text-20 text-textGray">
                {formatUserFriendlyCount(AdminDashboardCounts.noOfUsers)}
              </span>
            </div>
          </div>

          <div className="absolute -end-3 -bottom-4 w-[110%] h-full">
            <ChartCompo color={"#e74c3c"} />
          </div>
        </div>

        <div
          onClick={() => navigate("/dashboard/events")}
          className="cursor-pointer dashbord-card shadow-md group/item hover:scale-105 transition-all duration-300 ease-linear rounded-2xl bg-backgroundv1 w-full h-[200px] xxl:h-[250px] overflow-hidden  p-5 relative"
        >
          <div className="flex gap-3 items-start">
            <div className="dashbord-card-icon h-[60px] w-[60px] flex-shrink-0 xl:h-[70px] xl:w-[70px] xxl:h-[80px] xxl:w-[80px] rounded-full overflow-hidden border-2 border-[#2a7c5a]/30 bg-[#2a7c5a]/30 text-[#2a7c5a] flex items-center justify-center group-hover/item:bg-[#2a7c5a] group-hover/item:text-white transition-all duration-75 ease-linear group-hover/item:border-[#2a7c5a]">
              <RiCalendarCheckFill className="h-8 w-8 xl:h-9 xl:w-9 xxl:h-10 xxl:w-10 group-hover/item:scale-110 transition-all duration-500 ease-linear" />
            </div>
            <div>
              <h3 className="text-24 xl:text-26 xxl:text-30 mb-1 xxl:mb-2 text-textPrimary">
                Total Events
              </h3>
              <span className="text-14 lg:text-16 xl:text-18 xxl:text-20 text-textGray">
                {formatUserFriendlyCount(AdminDashboardCounts.noOfTotalEvents)}
              </span>
            </div>
          </div>

          <div className="absolute -end-3 -bottom-4 w-[110%] h-full">
            <ChartCompo color={"#2a7c5a"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
