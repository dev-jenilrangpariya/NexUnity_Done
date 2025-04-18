import React, { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import image from "../../assets/images/frontHero/home header3.jpg";
import { selectUserData } from "../../reducers/authSlice";
import { COMMUNITY_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import DataLoadingCompo from "../common/DataLoadingCompo";

const HomeCommunitySuggetion = () => {
  const userData = useSelector(selectUserData);
  const userId = userData._id;
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  //get userJoinedCommunity api
  const getUserJoinedCommunity = useMemo(
    () => ["getUserJoinedCommunity", userId],
    []
  );

  const {
    data: userJoinedCommunity,
    isLoading,
    isError,
    error,
  } = useQuery(
    getUserJoinedCommunity,
    async () => {
      if (userId) {
        const response = await axiosPrivate.get(
          COMMUNITY_API_URL.getUserJoinedCommunity.replace(":id", userId)
        );
        return response.data.data;
      }
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  //get CommunityCreatedByUser api
  const getCommunityCreatedByUserqueryKey = useMemo(
    () => ["getCommunityCreatedByUser", userId],
    []
  );

  const {
    data: CommunityCreatedByUser,
    isLoading: getCommunityCreatedByUserIsLoading,
    isError: getCommunityCreatedByUserIsError,
    error: getCommunityCreatedByUserError,
  } = useQuery(
    getCommunityCreatedByUserqueryKey,
    async () => {
      if (userId) {
        const response = await axiosPrivate.get(
          COMMUNITY_API_URL.getCommunityCreatedByUser.replace(":id", userId)
        );
        return response.data.data;
      }
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  //get all community api
  const communitiesqueryKey = useMemo(() => ["communities"], []);

  const {
    data: communities,
    isLoading: communitiesIsLoading,
    isError: communitiesIsError,
    error: communitiesError,
  } = useQuery(
    communitiesqueryKey,
    async () => {
      const response = await axiosPrivate.get(COMMUNITY_API_URL.getAll);
      return response.data.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  const { mutateAsync: joinCommunity } = useMutation(
    async (data) => {
      return await axiosPrivate.post(
        COMMUNITY_API_URL.joinCommmunity,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries("communities");
        queryClient.invalidateQueries(["getUserJoinedCommunity", userData._id]);
        toast.success("You Become Member Of Community");
      },
      onError: (error) => {
        console.log("error >>> ", error);
      },
    }
  );

  const handleJoin = async (communityId) => {
    try {
      await joinCommunity({ userId: userData._id, communityId: communityId });
    } catch (error) {
      console.log("error >>> ", error);
    }
  };

  if (error || communitiesError || getCommunityCreatedByUserError) {
    return (
      <div className="w-full h-[400px] flex justify-center items-center">
        <DataLoadingCompo />
        <h2 className="text-textPrimary text-center text-26">
          Network Error !!!!
        </h2>
      </div>
    );
  }

  if (communitiesIsLoading || getCommunityCreatedByUserIsLoading || isLoading) {
    return <DataLoadingCompo />;
  }

  let filteredCommunities = [];
  if (userJoinedCommunity && CommunityCreatedByUser && communities) {
    const userJoinedCommunityIds = userJoinedCommunity.map(
      (community) => community.communityId
    );
    const communitiesCreatedByUserIds = CommunityCreatedByUser.map(
      (community) => community._id
    );

    filteredCommunities = communities.filter((community) => {
      return (
        !userJoinedCommunityIds.includes(community._id) &&
        !communitiesCreatedByUserIds.includes(community._id)
      );
    });
  }
  console.log("community >>> ", filteredCommunities);
  return (
    <div className="w-full rounded-xl flex flex-col gap-3 justify-center items-center border-2 border-backgroundv3 bg-backgroundv1 text-textPrimary p-3 xl:p-5">
      <div className="flex justify-between items-center w-full">
        <h2 className="font-500 text-18 xxl:text-20">Community</h2>
      </div>
      <hr className="border border-backgroundv3 w-full " />

      <ul className="flex flex-col gap-3 w-[100%] xl:w-[95%]">
        {filteredCommunities &&
          filteredCommunities
            ?.slice()
            ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            ?.slice(0, 5)
            ?.map((item, index) => (
              <li
                className="flex  justify-between items-center w-[100%] gap-1 xl:gap-2"
                key={index}
              >
                <div className="flex items-center flex-grow overflow-hidden gap-1">
                  <div className="w-[40px] h-[40px] flex-shrink-0 rounded-full overflow-hidden">
                    <img
                      src={
                        item.frontImage !== ""
                          ? `${process.env.REACT_APP_SERVER_IMAGE_PATH}${item.frontImage}`
                          : image
                      }
                      alt="image"
                      className="w-full h-full object-cover object-center"
                      onError={(e) =>
                        (e.target.src =
                          "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg")
                      }
                    />
                  </div>
                  <div className="">
                    <h3 className="text-14 font-500 truncate">{item.name}</h3>
                    <h5 className="text-[8px] text-textGray flex gap-1 items-center truncate">
                      {item.description}
                    </h5>
                  </div>
                </div>
                <div className="flex-shrink-0 ">
                  <button
                    onClick={() => handleJoin(item._id)}
                    className="rounded-full py-1 px-2 border text-10 border-blueMain bg-blueMain text-white hover:text-blueMain hover:bg-backgroundv1 transition-all duration-300 ease-linear "
                  >
                    Join
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, aperiam!
              </h5>
            </div>
          </div>
          <div className="flex-shrink-0 ">
            <button className="rounded-full py-1 px-2 border text-10 border-blueMain bg-blueMain text-white hover:text-blueMain hover:bg-backgroundv1 transition-all duration-300 ease-linear ">Join</button>
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, aperiam!
              </h5>
            </div>
          </div>
          <div className="flex-shrink-0 ">
            <button className="rounded-full py-1 px-2 border text-10 border-blueMain bg-blueMain text-white hover:text-blueMain hover:bg-backgroundv1 transition-all duration-300 ease-linear ">Join</button>
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, aperiam!
              </h5>
            </div>
          </div>
          <div className="flex-shrink-0 ">
            <button className="rounded-full py-1 px-2 border text-10 border-blueMain bg-blueMain text-white hover:text-blueMain hover:bg-backgroundv1 transition-all duration-300 ease-linear ">Join</button>
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, aperiam!
              </h5>
            </div>
          </div>
          <div className="flex-shrink-0 ">
            <button className="rounded-full py-1 px-2 border text-10 border-blueMain bg-blueMain text-white hover:text-blueMain hover:bg-backgroundv1 transition-all duration-300 ease-linear ">Join</button>
          </div>
        </li> */}
      </ul>
      <hr className="border border-backgroundv3 w-full " />

      <div className="w-full flex justify-center items-center ">
        <Link to={"/community"} className="text-blueMain text-14">
          See All
        </Link>
      </div>
    </div>
  );
};

export default HomeCommunitySuggetion;
