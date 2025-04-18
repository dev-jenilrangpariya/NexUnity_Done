import React from "react";
import { MdOpenInNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { formatUserFriendlyTime } from "../../lib/userFriendlyTime";

const UserCommunity = ({ community, isCommunityAdmin }) => {
  const navigate = useNavigate();
  return (
    <div className="cursor-pointer hover:scale-105 transition-all duration-200 ease-linear relative w-full rounded-lg border h-[250px] border-backgroundv3 bg-backgroundv2 xxl:h-[300px] flex flex-col overflow-hidden">
      <div className="absolute top-2 end-2 flex gap-2">
        <button onClick={() => navigate(`/community/${community?._id}`)}>
          <MdOpenInNew className="h-4 w-4 text-blueMain" />
        </button>
      </div>
      <div className="h-[150px] xxl:h-[200px] w-full bg-backgroundv2 flex justify-center items-center">
        <img
          src={`${process.env.REACT_APP_SERVER_IMAGE_PATH}${community.frontImage}`}
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
      <div className="flex-shrink-0 w-full h-[100px] p-3 bg-backgroundv1">
        <h1 className="text-20  font-semibold mb-1 text-textPrimary truncate">
          {community.name}
        </h1>
        <h4 className="text-12  mb-1 text-textGray truncate">
          {community.description}
        </h4>
        <h1 className="text-14 text-textPrimary">
          {formatUserFriendlyTime(community.createdAt)}
        </h1>
      </div>
    </div>
  );
};

export default UserCommunity;
