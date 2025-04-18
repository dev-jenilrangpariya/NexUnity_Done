import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatUserFriendlyTime } from "../../lib/userFriendlyTime";
import "../../pages/front/css/CommunityPageCss.css";
import { selectUserData } from "../../reducers/authSlice";
import { COMMUNITY_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";

const CommunityPageCard = ({ data }) => {
  const navigate = useNavigate();

  const userData = useSelector(selectUserData);
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

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
        queryClient.invalidateQueries(["community", data._id]);
        toast.success("You Become Member Of Community");
      },
      onError: (error) => {
        console.log("error >>> ", error);
      },
    }
  );

  const handleJoin = async () => {
    try {
      await joinCommunity({ userId: userData._id, communityId: data._id });
    } catch (error) {
      console.log("error >>> ", error);
    }
  };

  // console.log(
  //   "back imahe url > ",
  //   `${process.env.REACT_APP_SERVER_IMAGE_PATH}${data.backImage}`
  // );
  return (
    <figure className="snip1336 hover:scale-[0.97] transition-all duration-200 ease-linear rounded-lg overflow-hidden">
      <img
        src={
          data.backImage
            ? `${process.env.REACT_APP_SERVER_IMAGE_PATH}${data.backImage}`
            : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sample69.jpg"
        }
        alt="sample74"
        className="!h-[200px] w-full"
        onError={(e) => {
          e.target.src =
            "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
        }}
      />
      <figcaption>
        <img
          src={
            data.frontImage
              ? `${process.env.REACT_APP_SERVER_IMAGE_PATH}${data.frontImage}`
              : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/profile-sample5.jpg"
          }
          alt="profile-sample2"
          className="profile !h-[90px] !w-[90px]"
          onError={(e) => {
            e.target.src =
              "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
          }}
        />
        <h2>
          {data?.name}
          <span>{formatUserFriendlyTime(data.createdAt)}</span>
        </h2>
        <div className="h-[50px] overflow-hidden">
          <p>{data?.description}</p>
        </div>{" "}
        <div className="flex gap-3 h-11">
          <div
            onClick={handleJoin}
            className="cursor-pointer flex rounded justify-center items-center h-full border border-blueMain bg-blueMain w-full text-white hover:text-blueMain hover:bg-transparent transition-all duration-300 ease-linear"
          >
            Join
          </div>
          <div
            onClick={() => navigate(`/community/${data._id}`)}
            className="flex rounded cursor-pointer h-full justify-center items-center bg-transparent w-full border border-white text-white hover:text-blueMain hover:border-blueMain transition-all duration-300 ease-linear"
          >
            More Info
          </div>
        </div>
      </figcaption>
    </figure>
  );
};

export default CommunityPageCard;
