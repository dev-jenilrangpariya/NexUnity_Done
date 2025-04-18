import React from "react";
import { useNavigate } from "react-router-dom";
import { formatUserFriendlyTime } from "../../lib/userFriendlyTime";
import "../../pages/front/css/CommunityPageCss.css";

const MyCommunityCard1 = ({ data }) => {
  const navigate = useNavigate();
  console.log("data?>>> ", data);
  console.log(
    "ggggggggg > ",
    `${process.env.REACT_APP_SERVER_IMAGE_PATH}${data.backImage}`
  );
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
            onClick={() => navigate(`/community/${data._id}`)}
            className="cursor-pointer flex rounded justify-center items-center h-full border border-blueMain bg-blueMain w-full text-white hover:text-blueMain hover:bg-transparent transition-all duration-300 ease-linear"
          >
            Manage
          </div>
          <div
            onClick={() => navigate(`/community/${data._id}`)}
            className="cursor-pointer flex rounded h-full justify-center items-center bg-transparent w-full border border-white text-white hover:text-blueMain hover:border-blueMain transition-all duration-300 ease-linear"
          >
            More Info
          </div>
        </div>
      </figcaption>
    </figure>
  );
};

export default MyCommunityCard1;
