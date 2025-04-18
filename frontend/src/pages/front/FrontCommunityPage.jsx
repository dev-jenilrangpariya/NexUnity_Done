import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import DataLoadingCompo from "../../components/common/DataLoadingCompo";
import AllCommunity1 from "../../components/front/AllComunity1";
import UserCreatedCommunity from "../../components/front/UserCreatedCommunity";
import UserJoinedCommunity from "../../components/front/UserJoinedCommunity";
import { selectUserData } from "../../reducers/authSlice";
import { COMMUNITY_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";

const FrontCommunityPage = () => {
  const userData = useSelector(selectUserData);
  const userId = userData._id;

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

  // console.log("community created bby user >> ",CommunityCreatedByUser);
  // console.log("community join by user >> ",userJoinedCommunity);
  // console.log("community all >> ",communities);

  let filteredCommunities = [];
  if (userJoinedCommunity && CommunityCreatedByUser && communities) {
    const userJoinedCommunityIds = userJoinedCommunity.map(
      (community) => community.communityId
    );
    const communitiesCreatedByUserIds = CommunityCreatedByUser.map(
      (community) => community._id
    );

    // Filter communities that are not joined or created by the user
    filteredCommunities = communities.filter((community) => {
      return (
        !userJoinedCommunityIds.includes(community._id) &&
        !communitiesCreatedByUserIds.includes(community._id)
      );
    });

    // console.log("userJoinedCommunityIds community >>> ", [...new Set(userJoinedCommunityIds)]);
    // console.log("communitiesCreatedByUserIds community >>> ", [...new Set(communitiesCreatedByUserIds)]);
    // console.log("filtered community >>> ", filteredCommunities);
    // console.log("Total communities", communities.length);
    // console.log("All community IDs", communities.map(community => community._id));
    // console.log("isNaN in userJoinedCommunityIds", userJoinedCommunityIds.some(id => isNaN(id)));
    // console.log("isNaN in communitiesCreatedByUserIds", communitiesCreatedByUserIds.some(id => isNaN(id)));
  }

  return (
    <>
      {/* <AllCommunity/> */}
      <UserCreatedCommunity CommunityCreatedByUser={CommunityCreatedByUser} />
      <UserJoinedCommunity userJoinedCommunity={userJoinedCommunity} />
      <AllCommunity1 communities={filteredCommunities} />
    </>
  );
};

export default FrontCommunityPage;
