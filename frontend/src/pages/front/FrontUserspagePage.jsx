import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import DataLoadingCompo from "../../components/common/DataLoadingCompo";
import UsersProfileCard from "../../components/front/UsersProfileCard";
import { selectUserData } from "../../reducers/authSlice";
import { AUTH_API_URL, FOLLOW_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import "./css/Userspage.css";

const FrontUserspagePage = () => {
  const axiosPrivate = useAxiosPrivate();
  const userData = useSelector(selectUserData);
  const userId = userData._id;
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

  //get following
  const getUserFollowingQueryKey = useMemo(
    () => ["following", userId],
    [userId]
  );
  const {
    data: following,
    isLoading: followingIsLoading,
    isError: followingIsError,
    error: followingError,
  } = useQuery(
    getUserFollowingQueryKey,
    async () => {
      const response = await axiosPrivate.get(
        FOLLOW_API_URL.getUserFollowing.replace(":user_id", userId)
      );
      return response.data.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  //get requested
  const getUserRequestedQueryKey = useMemo(
    () => ["requested", userId],
    [userId]
  );
  const {
    data: requested,
    isLoading: requstedIsLoading,
    isError: reqstedIsError,
    error: requestedErrro,
  } = useQuery(
    getUserRequestedQueryKey,
    async () => {
      const response = await axiosPrivate.get(
        FOLLOW_API_URL.getUserRequsted.replace(":user_id", userId)
      );
      return response.data.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  if (
    isError ||
    followingIsError ||
    followingError ||
    error ||
    requestedErrro ||
    reqstedIsError
  ) {
    return (
      <div className="w-full h-[400px] flex justify-center items-center">
        <DataLoadingCompo />
        <h2 className="text-textPrimary text-center text-26">
          Network Error !!!!
        </h2>
      </div>
    );
  }

  if (isLoading || followingIsLoading || requstedIsLoading) {
    return <DataLoadingCompo />;
  }

  return (
    <div className="w-full container py-5">
      <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-10">
        {users
          ?.slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          ?.map((user, index) => {
            if (user._id === userId) {
              return null;
            }
            let status = following.find((item) => item.toUserId === user._id)
              ? "following"
              : requested.find((item) => item.toUserId === user._id)
              ? "requested"
              : "follow";
            return <UsersProfileCard user={user} key={index} status={status} />;
          })}
      </div>
    </div>
  );
};

export default FrontUserspagePage;
