import { ArrowLeft, Edit3, HeartHandshake, LogOut, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import bg1 from "../../assets/images/bg-1.png";
import DataLoadingCompo from "../../components/common/DataLoadingCompo";
import CommunityPostList from "../../components/dash/CommunityPostList";
import EditCommunityModal from "../../components/dash/modal/comman/EditCommunityModal";
import FullImageShowModal from "../../components/dash/modal/comman/FullImageShowModal";
import SuccessModal from "../../components/dash/modal/comman/SuccessModal";
import { selectUserData } from "../../reducers/authSlice";
import { COMMUNITY_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";

const FrontSingleCommunityPage = () => {
  const navigate = useNavigate();
  const userData = useSelector(selectUserData);

  const [successModalOpen, setsuccessModalOpen] = useState(false);
  const [editCommunityModalOpen, seteditCommunityModalOpen] = useState(false);
  const [fullImageShowModalOpen, setfullImageShowModalOpen] = useState(false);
  const [imageUrl, setimageUrl] = useState(false);
  const { communityId } = useParams();
  // console.log("community id >> ", communityId);
  const userdata = useSelector(selectUserData);
  const userId = userData._id;
  let IsJoinedByMe;
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ["community", communityId], [communityId]);

  //get api
  const {
    data: community,
    isLoading,
    isError,
    error,
  } = useQuery(
    queryKey,
    async () => {
      if (communityId) {
        const response = await axiosPrivate.get(
          COMMUNITY_API_URL.getCommunityById.replace(":id", communityId)
        );
        return response.data.data;
      }
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  //left api
  const { mutateAsync: leftCommunity } = useMutation(
    async (data) => {
      return await axiosPrivate.post(
        COMMUNITY_API_URL.leftCommmunity,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries("communities");
        queryClient.invalidateQueries(["getUserJoinedCommunity", userData._id]);
        queryClient.invalidateQueries(["community", communityId]);
        toast.info("You Left From Community");
      },
      onError: (error) => {
        console.log("error >>> ", error);
      },
    }
  );

  //join api
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
        queryClient.invalidateQueries(["community", communityId]);
        toast.success("You Become Member Of Community");
      },
      onError: (error) => {
        console.log("error >>> ", error);
      },
    }
  );

  //delete api
  const { mutateAsync: deleteCommunity } = useMutation(
    async (data) => {
      const config = {
        data: data,
      };
      return await axiosPrivate.delete(COMMUNITY_API_URL.delete, config);
    },
    {
      onSuccess: (res) => {
        // toast.success("Community Deleted successfully");
        setsuccessModalOpen(true);
        setTimeout(() => {
          queryClient.invalidateQueries("communities");
          queryClient.invalidateQueries(["community", communityId]);
          queryClient.invalidateQueries(["getCommunityCreatedByUser", userId]);
          navigate(-1);
        }, 2500);
      },
      onError: (error) => {
        console.log("error >>> ", error);
      },
    }
  );

  if (error || isError) {
    return (
      <div className="w-full bg-lightGray h-[500px] !text-textPrimary font-popins ">
        <div className="container w-full h-full flex text-center justify-center items-center">
          <h2 className="text-20 text-textPrimary font-semibold">
            No Community Found
          </h2>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <DataLoadingCompo />;
  }

  if (community) {
    IsJoinedByMe = community.communityParticipantsDetail?.find(
      (item) => item.userId === userdata._id
    );
  }

  const handleLeftCommunity = async () => {
    try {
      await leftCommunity({ userId: userData._id, communityId: communityId });
    } catch (error) {
      console.log("error >>> ", error);
    }
  };

  const handleJoinCommunity = async () => {
    try {
      await joinCommunity({ userId: userData._id, communityId: communityId });
    } catch (error) {
      console.log("error >>> ", error);
    }
  };

  const handleDeleteCommunity = () => {
    swal({
      title: "You Really want to Delete Community ? ",
      text: "once you delete This Community You Can not get back Community members and Community again ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      try {
        if (willDelete) {
          await deleteCommunity({ id: communityId });
        }
      } catch (error) {
        console.log("error >>> ", error);
      }
    });
  };
  // console.log("commmunity dta >>>>> ", community);
  // console.log("commmunity IsJoinedByMe >>>>> ", IsJoinedByMe);
  // console.log(
  //   "commmunity image >>>>> ",
  //   `${process.env.REACT_APP_SERVER_IMAGE_PATH}${community.frontImage}`
  // );

  if (community) {
    return (
      <div className="w-full bg-lightGray h-full min-h-screen !text-textPrimary font-popins ">
        <div className="container py-5">
          <div
            className="flex items-center gap-2 !text-blueMain pb-3  container cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 text-blueMain" /> Go Back
          </div>

          <div className="py-3 container ">
            <div className="rounded-lg overflow-hidden bg-backgroundv1 p-5 relative border border-backgroundv3">
              <div className="absolute h-[200px] start-0 top-0 w-full bg-blueMain overflow-hidden">
                {community.backImage ? (
                  <img
                    src={`${process.env.REACT_APP_SERVER_IMAGE_PATH}${community.backImage}`}
                    width={247}
                    height={247}
                    alt="logo"
                    className="h-full w-full object-cover object-center"
                    onClick={() => {
                      setimageUrl(
                        `${process.env.REACT_APP_SERVER_IMAGE_PATH}${community.backImage}`
                      );
                      setfullImageShowModalOpen(true);
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
                    }}
                  />
                ) : (
                  <img
                    src={bg1}
                    alt="logo"
                    className="h-full w-full object-cover object-center "
                  />
                )}
              </div>
              <div className="flex justify-between flex-row items-end z-10 pt-28">
                <div className="logo flex flex-row gap-5 items-end md:items-end">
                  <div className=" w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] bg-black rounded-lg overflow-hidden z-10 shadow">
                    <img
                      src={
                        community.frontImage
                          ? `${process.env.REACT_APP_SERVER_IMAGE_PATH}${community.frontImage}`
                          : "/images/hero3.png"
                      }
                      width={247}
                      height={247}
                      alt="logo"
                      className="h-full w-full object-cover object-center"
                      onClick={() => {
                        setimageUrl(
                          `${process.env.REACT_APP_SERVER_IMAGE_PATH}${community.frontImage}`
                        );
                        setfullImageShowModalOpen(true);
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
                      }}
                    />
                  </div>
                  <div className="h-full flex justify-end items-end">
                    <h2 className="text-28 mb-0  lg:text-30 xl:text-32  hidden md:block flex-shrink-0 font-semibold text-textPrimary">
                      {community.name}
                      {/* Nodeflffl Co. */}
                    </h2>
                  </div>
                </div>

                <div className=" h-full justify-end items-end flex-shrink-0">
                  {community.createUserId === userData._id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => seteditCommunityModalOpen(true)}
                        className={`${"text-blue-700"} rounded-lg h-10 px-2 flex justify-center font-semibold items-center text-16 transition-all duration-300 ease-linear`}
                      >
                        <Edit3 />
                      </button>
                      <button
                        onClick={handleDeleteCommunity}
                        className={`${"text-red-700"} rounded-lg h-10 px-2 flex justify-center font-semibold items-center text-16 transition-all duration-300 ease-linear`}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ) : IsJoinedByMe ? (
                    <button
                      onClick={handleLeftCommunity}
                      className={`${"bg-red-700 flex gap-2 items-center justify-center text-white border-red-700 hover:bg-transparent hover:text-red-700"} rounded-lg h-10 px-5 gap-2 flex justify-center font-semibold items-center border text-16 transition-all duration-300 ease-linear`}
                    >
                      Left <LogOut />
                    </button>
                  ) : (
                    <button
                      onClick={handleJoinCommunity}
                      className={`${"bg-blueMain flex gap-2 items-center justify-center text-white border-blueMain hover:bg-transparent hover:text-blueMain"} rounded-lg h-10 px-5 gap-2 flex justify-center font-semibold items-center border text-16 transition-all duration-300 ease-linear`}
                    >
                      <HeartHandshake /> Join
                    </button>
                  )}
                </div>
              </div>
              <div className="my-4">
                <h2 className="text-28 block md:hidden font-semibold text-textPrimary">
                  {community.name}
                  {/* Nodeflffl Co. */}
                </h2>
                <h5 className="text-textGray text-14">
                  {community.description}{" "}
                  {/* Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      In, amet. */}
                </h5>
              </div>
              <div className="h-[1px] w-full bg-backgroundv3"></div>
              <div className="py-5">
                <div className="w-full gap-2 flex  justify-center items-center">
                  <div className="w-full max-w-md h-full -5 text-textGray text-16 flex flex-row  justify-between  gap-2">
                    <div className="flex gap-3">
                      <h3>Total Post : </h3>
                      <h3 className="text-blueMain text-18 font-semibold ">
                        {community.communityPostsCount}
                      </h3>
                    </div>
                    <div className="flex gap-3">
                      <h3>Total Members : </h3>
                      <h3 className="text-blueMain text-18 font-semibold">
                        {community.communityParticipantsCount}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-3 container">
            <CommunityPostList
              CommunityPostList={community.communityPostsDetail}
              isCommunityAdmin={community.createUserId === userData._id}
              communityId={communityId}
            />
          </div>
        </div>

        <EditCommunityModal
          editCommunityModalOpen={editCommunityModalOpen}
          seteditCommunityModalOpen={seteditCommunityModalOpen}
          setsuccessModalOpen={setsuccessModalOpen}
          editCommunity={community}
        />
        <SuccessModal
          successModalOpen={successModalOpen}
          setsuccessModalOpen={setsuccessModalOpen}
        />

        <FullImageShowModal
          fullImageShowModalOpen={fullImageShowModalOpen}
          setfullImageShowModalOpen={setfullImageShowModalOpen}
          imageUrl={imageUrl}
          setimageUrl={setimageUrl}
        />
      </div>
    );
  }
};

export default FrontSingleCommunityPage;
