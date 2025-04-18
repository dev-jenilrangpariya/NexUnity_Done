import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatUserFriendlyCount } from "../../lib/userFriendlyCount";
import { selectUserData } from "../../reducers/authSlice";
import { FOLLOW_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import FullImageShowModal from "../dash/modal/comman/FullImageShowModal";

const UsersProfileCard = ({ user, status }) => {
  let toastId;
  const navigate = useNavigate("/");
  const userData = useSelector(selectUserData);
  const CurrentUserId = userData._id;
  const [fullImageShowModalOpen, setfullImageShowModalOpen] = useState(false);
  const [imageUrl, setimageUrl] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const userId = user._id;

  //   getUserFollowersApi
  const getUserFollowersQueryKey = useMemo(
    () => ["followers", userId],
    [userId]
  );
  const {
    data: followers,
    isLoading: followersIsLoading,
    isError: followersIsError,
    error: followersError,
  } = useQuery(
    getUserFollowersQueryKey,
    async () => {
      const response = await axiosPrivate.get(
        FOLLOW_API_URL.getUserFollowers.replace(":user_id", userId)
      );
      return response.data.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  //   getUserFollowing
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

  //sendRequest Api
  const { mutateAsync: sendRequest } = useMutation(
    async (data) => {
      return await axiosPrivate.post(
        FOLLOW_API_URL.sendRequest,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (res) => {
        toast.success("follow request send");
        setTimeout(() => {
          queryClient.invalidateQueries("users");
          queryClient.invalidateQueries(["requested", CurrentUserId]);
          queryClient.invalidateQueries(["profileDetails", userId]);
        }, 2000);
      },
      onError: (error) => {
        console.log("error >>. ", error);
      },
    }
  );

  if (
    followersError ||
    followingError ||
    followersIsError ||
    followingIsError
  ) {
    return console.log("followingError   , followingError");
  }

  console.log("following >> ", following);

  const handleFollow = async () => {
    if (status === "requested") {
      toast.info("you are already send folllow request");
    } else if (status === "following") {
      toast.info("you are already follow ");
    } else {
      try {
        await sendRequest({ fromUserId: CurrentUserId, toUserId: userId });
      } catch (error) {
        console.log("ERROR >>>> ", error);
      }
    }
  };
  return (
    <div className="flex w-full flex-col sm:flex-row bg-backgroundv1 p-4 rounded-lg">
      <img
        className="profile-avatar flex-shrink-0"
        src={
          user.profile_pic != ""
            ? `${process.env.REACT_APP_SERVER_IMAGE_PATH}${user.profile_pic}`
            : "https://images.unsplash.com/photo-1483909796554-bb0051ab60ad?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2lybCUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
        }
        alt="avatar"
        onClick={() => {
          setimageUrl(
            user.profile_pic != ""
              ? `${process.env.REACT_APP_SERVER_IMAGE_PATH}${user.profile_pic}`
              : "https://images.unsplash.com/photo-1483909796554-bb0051ab60ad?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2lybCUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
          );
          setfullImageShowModalOpen(true);
        }}
        onError={(e) => {
          e.target.src =
            "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
        }}
      />
      <div className="profile-info flex flex-col gap-2">
        <p className="text-32 font-semibold text-textPrimary truncate">
          {user.first_name} {user.surname}
        </p>
        <p
          id="activity"
          className="text-24 font-semibold text-textPrimary pb-4"
        >
          @{user.first_name}
        </p>
        <div id="stats" className="mt-3">
          <p className="stats-text flex gap-3 ">
            <svg viewBox="0 0 24 24">
              <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
            </svg>
            <div className="flex items-end justify-end gap-1">
              <h3 className="text-20 text-textPrimary ">
                {formatUserFriendlyCount(followers?.length)}
              </h3>
              followers
            </div>
          </p>
          <p className="stats-text flex gap-3">
            <svg viewBox="0 0 24 24">
              <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
              <path
                fill-rule="evenodd"
                d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clip-rule="evenodd"
              />
            </svg>
            <div className="flex items-end justify-end gap-1">
              <h3 className="text-20 text-textPrimary ">
                {formatUserFriendlyCount(following?.length)}
              </h3>
              following
            </div>
          </p>
        </div>
        <div className="profile-btns flex gap-3">
          <p
            onClick={handleFollow}
            className={`w-full  h-12 flex justify-center items-center text-white cursor-pointer rounded-lg ${
              status === "following"
                ? "bg-blueMain border-blueMain hover:!text-blueMain"
                : status === "requested"
                ? "bg-red-600 border-red-600 hover:!text-red-600"
                : "bg-blue-700 border-blue-700 hover:!text-blue-700"
            } hover:bg-transparent  transition-all duration-300 ease-linear border `}
          >
            {status}
          </p>
          <p
            onClick={() => navigate(`/users/${user._id}`)}
            className="w-full  h-12 flex cursor-pointer justify-center items-center text-white rounded-lg bg-blueMain hover:bg-transparent hover:!text-blueMain transition-all duration-300 ease-linear border border-blueMain"
          >
            View
          </p>
        </div>
      </div>

      <FullImageShowModal
        fullImageShowModalOpen={fullImageShowModalOpen}
        setfullImageShowModalOpen={setfullImageShowModalOpen}
        imageUrl={imageUrl}
        setimageUrl={setimageUrl}
      />
    </div>
  );
};

export default UsersProfileCard;
