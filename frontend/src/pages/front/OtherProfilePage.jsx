import { ArrowLeft, Edit2 } from "lucide-react";
import React, { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import bg1 from "../../assets/images/bg-1.png";
import customProfile from "../../assets/images/customeProfile.png";
import DataLoadingCompo from "../../components/common/DataLoadingCompo";
import UserProfileCommunityAndPost from "../../components/front/UserProfileCommunityAndPost";
import { selectUserData } from "../../reducers/authSlice";
import { AUTH_API_URL, FOLLOW_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";

const OtherProfilePage = () => {
  const navigate = useNavigate();
  const userData = useSelector(selectUserData);
  const currentUserId = userData._id;
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const { userId } = useParams();
  console.log("user id >> ", userId);

  const queryKey = useMemo(() => ["profileDetails", userId], userId);
  // get profileDetails
  const {
    data: profileDetails,
    isLoading,
    isError,
    error,
  } = useQuery(
    queryKey,
    async () => {
      if (userId) {
        const response = await axiosPrivate.get(
          AUTH_API_URL.profileDetails.replace(":userId", userId)
        );
        return response.data.data;
      }
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
          queryClient.invalidateQueries(["requested", currentUserId]);
          queryClient.invalidateQueries(["profileDetails", userId]);
        }, 2000);
      },
      onError: (error) => {
        console.log("error >>. ", error);
      },
    }
  );

  const handleFollow = async () => {
    try {
      await sendRequest({ fromUserId: currentUserId, toUserId: userId });
    } catch (error) {
      console.log("ERROR >>>> ", error);
    }
  };

  if (error || isError) {
    return (
      <div className="w-full bg-lightGray h-[500px] !text-textPrimary font-popins ">
        <div className="container w-full h-full flex text-center justify-center items-center">
          <h2 className="text-20 text-textPrimary font-semibold">
            No User Found
          </h2>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <DataLoadingCompo />;
  }

  console.log("profile data >>> ", profileDetails);
  return (
    <div className="w-full bg-lightGray h-full min-h-screen !text-textPrimary font-popins ">
      <div className="container py-5">
        <div
          className="flex items-center gap-2 !text-blueMain pb-3  container cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 text-blueMain" /> Go Back
        </div>

        <div className="container py-3">
          <div className="rounded-lg overflow-hidden bg-backgroundv1 p-5 relative border border-backgroundv3">
            <div className="absolute h-[150px] md:h-[200px] start-0 top-0 w-full bg-blueMain overflow-hidden">
              <div className="h-full w-full flex justify-end items-end">
                <img
                  src={bg1}
                  alt="logo"
                  className="h-full w-full object-cover object-center "
                />
              </div>
              {/* ${process.env.REACT_APP_SERVER_IMAGE_PATH}${community.backImage}  */}
            </div>
            <div className="flex justify-between flex-row items-end z-10 pt-12 md:pt-16 lg:pt-20">
              <div className="logo flex flex-row gap-4 !items-start md:!items-end">
                <div className="w-[150px] h-[150px] md:w-[180px] md:h-[180px] flex-shrink-0 lg:w-[200px] lg:h-[200px] bg-black rounded-full border-8 border-blueMain overflow-hidden z-10 shadow">
                  <img
                    src={
                      profileDetails?.userDetails?.profile_pic
                        ? `${process.env.REACT_APP_SERVER_IMAGE_PATH}${profileDetails?.userDetails?.profile_pic}`
                        : customProfile
                    }
                    width={247}
                    height={247}
                    alt="logo"
                    className="h-full w-full object-cover object-center"
                    onError={(e) => {
                      e.target.src =
                        "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-28  xl:text-30 xxl:text-32  hidden xl:block flex-shrink-0 font-semibold text-textPrimary">
                    {profileDetails?.userDetails?.first_name}{" "}
                    {profileDetails?.userDetails?.middle_name}{" "}
                    {profileDetails?.userDetails?.surname}{" "}
                  </h2>
                </div>
              </div>

              {profileDetails?.userDetails?._id === userData._id ? (
                <button
                  onClick={() => navigate("/settings")}
                  className={`bg-blue-700 flex gap-2 items-center justify-center text-white border-blue-700 hover:bg-transparent hover:text-blue-700 rounded-lg h-12 px-5 font-semibold border text-16 transition-all duration-300 ease-linear`}
                >
                  <Edit2 className="h-5 w-5" />{" "}
                  <span className="hidden md:block">Edit Profile</span>
                </button>
              ) : (
                <div className=" h-full justify-end items-end flex-shrink-0">
                  {profileDetails?.isYouFollowThisPerson ? (
                    <button
                      className={`${"bg-blueMain flex gap-2 items-center justify-center text-white border-blueMain hover:bg-transparent hover:text-blueMain"} rounded-lg h-10 px-5 gap-2 flex justify-center font-semibold items-center border text-16 transition-all duration-300 ease-linear`}
                    >
                      following
                    </button>
                  ) : profileDetails?.isYouRequested ? (
                    <button
                      className={`${"bg-red-700 flex gap-2 items-center justify-center text-white border-red-700 hover:bg-transparent hover:text-red-700"} rounded-lg h-10 px-5 gap-2 flex justify-center font-semibold items-center border text-16 transition-all duration-300 ease-linear`}
                    >
                      requested
                    </button>
                  ) : (
                    <button
                      onClick={handleFollow}
                      className={`${"bg-blue-700 flex gap-2 items-center justify-center text-white border-blue-700 hover:bg-transparent hover:text-blue-700"} rounded-lg h-10 px-5 gap-2 flex justify-center font-semibold items-center border text-16 transition-all duration-300 ease-linear`}
                    >
                      folllow
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="my-4">
              <h2 className="text-20 sm:text-22 md:text-24 block xl:hidden font-semibold text-textPrimary">
                {profileDetails?.userDetails?.first_name}{" "}
                {profileDetails?.userDetails?.middle_name}{" "}
                {profileDetails?.userDetails?.surname}{" "}
              </h2>
            </div>
            <div className="h-[1px] w-full bg-backgroundv3"></div>
            <div className="py-5">
              <div className="w-full gap-2 flex  justify-center items-center">
                <div className="w-full max-w-md h-full -5 text-textGray text-16 flex flex-row  justify-between  gap-2">
                  <div className="flex flex-col justify-center items-center">
                    <h3 className="text-blueMain text-32 font-semibold ">
                      {profileDetails?.followerCount}
                    </h3>
                    <h3>Followers </h3>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <h3 className="text-blueMain text-32 font-semibold">
                      {profileDetails?.followingCount}
                    </h3>
                    <h3>Following</h3>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="h-[1px] w-full bg-backgroundv3"></div> */}
            {/* <div className="py-5">
              <div className="w-full gap-2 flex  justify-center items-center">
                <div className="w-full max-w-md h-full -5 text-textGray text-16 flex flex-row  justify-between  gap-2">
                  <div className="flex gap-3">
                    <h3>Total Post : </h3>
                    <h3 className="text-blueMain text-18 font-semibold ">
                      {profileDetails?.postCount}
                    </h3>
                  </div>
                  <div className="flex gap-3">
                    <h3>Total Created Community : </h3>
                    <h3 className="text-blueMain text-18 font-semibold">
                    {profileDetails?.createdCommunityCount}
                    </h3>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="py-3 container">
          <UserProfileCommunityAndPost profileDetails={profileDetails} />
        </div>
      </div>
    </div>
  );
};

export default OtherProfilePage;
