import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import image from "../../assets/images/customeProfile.png";
import { AUTH_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import DataLoadingCompo from "../common/DataLoadingCompo";

const HomeFollowSuggestion = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryKey = useMemo(() => ["users"], []);

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery(
    queryKey,
    async () => {
      const response = await axiosPrivate.get(AUTH_API_URL.getAllUser);
      return response.data.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  if (isError) {
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
    <div className="w-full rounded-xl flex flex-col gap-3 justify-center items-center border-2 border-backgroundv3 bg-backgroundv1 text-textPrimary p-3 xl:p-5">
      <div className="flex justify-between items-center w-full">
        <h2 className="font-500 text-18 xxl:text-20">Add People</h2>
      </div>
      <hr className="border border-backgroundv3 w-full " />
      <ul className="flex flex-col gap-3 w-[100%] xl:w-[95%]">
        {users
          ?.slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          ?.slice(0, 5)
          ?.map((user, index) => (
            <li
              className="flex  justify-between items-center w-[100%] gap-1 xl:gap-2"
              key={index}
            >
              <div className="flex items-center flex-grow overflow-hidden gap-1">
                <div className="w-[40px] h-[40px] flex-shrink-0 rounded-full overflow-hidden">
                  <img
                    src={
                      user.profile_pic !== ""
                        ? `${process.env.REACT_APP_SERVER_IMAGE_PATH}${user.profile_pic}`
                        : image
                    }
                    alt="image"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.src =
                        "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
                    }}
                  />
                </div>
                <div className="">
                  <h3 className="text-14 font-500 truncate">
                    {user.first_name} {user.surname}
                  </h3>
                  <h5 className="text-[8px] text-textGray flex gap-1 items-center truncate">
                    @{user.first_name}
                  </h5>
                </div>
              </div>
              <div className="flex-shrink-0 ">
                <button className="rounded-full py-1 px-2 border text-10 border-blueMain bg-blueMain text-white hover:text-blueMain hover:bg-backgroundv1 transition-all duration-300 ease-linear ">
                  Follow
                </button>
              </div>
            </li>
          ))}

        {/* <li className="flex  justify-between items-center w-[100%] gap-1 xl:gap-2">
          <div className="flex items-center flex-grow overflow-hidden gap-1">
            <div className="w-[40px] h-[40px] flex-shrink-0 rounded-full overflow-hidden">
              <img
                src={image}
                alt="image"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="">
              <h3 className="text-14 font-500 truncate">Lucvckd dnnandm</h3>
              <h5 className="text-[8px] text-textGray flex gap-1 items-center truncate">
                @lorem
              </h5>
            </div>
          </div>
          <div className="flex-shrink-0 ">
            <button className="rounded-full py-1 px-2 border text-10 border-blueMain bg-blueMain text-white hover:text-blueMain hover:bg-backgroundv1 transition-all duration-300 ease-linear ">
              Follow
            </button>
          </div>
        </li>
        
        <li className="flex  justify-between items-center w-[100%] gap-1 xl:gap-2">
          <div className="flex items-center flex-grow overflow-hidden gap-1">
            <div className="w-[40px] h-[40px] flex-shrink-0 rounded-full overflow-hidden">
              <img
                src={image}
                alt="image"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="">
              <h3 className="text-14 font-500 truncate">Lucvckd dnnandm</h3>
              <h5 className="text-[8px] text-textGray flex gap-1 items-center truncate">
                @lorem
              </h5>
            </div>
          </div>
          <div className="flex-shrink-0 ">
            <button className="rounded-full py-1 px-2 border text-10 border-blueMain bg-blueMain text-white hover:text-blueMain hover:bg-backgroundv1 transition-all duration-300 ease-linear ">
              Follow
            </button>
          </div>
        </li>
         */}
      </ul>
      <hr className="border border-backgroundv3 w-full " />
      <div className="w-full flex justify-center items-center ">
        <Link to={"/users"} className="text-blueMain text-14">
          See All
        </Link>
      </div>
    </div>
  );
};

export default HomeFollowSuggestion;
