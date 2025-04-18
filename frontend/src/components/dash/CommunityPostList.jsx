import { Plus } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import CommunityPost from "./CommunityPost";

const CommunityPostList = ({ CommunityPostList, isCommunityAdmin,communityId }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-backgroundv1 text-textPrimary rounded-lg border p-5 font-popins border-backgroundv3">
      <div className="flex justify-between items-center">
        <h2 className="text-22 font-semibold text-textPrimary">
          Posts By Community
        </h2>
        {
            isCommunityAdmin &&
            <div>
          <Button
            onClick={() => navigate("/add-post",{ state: { postType:2,communityId } })}
            className="group/btn rounded flex justify-center items-center px-3 gap-1 h-10 hover:bg-transparent"
            variant={"blueV1"}
          >
            <span>
              <Plus className="h-6 w-6 " />
            </span>
            Add Post
          </Button>
            </div>
        }
      </div>
      <div className="h-[1px] w-full bg-backgroundv3 my-5"></div>
      <div className="py-5 grid grid-cols-1 xsm:grid-cols-2  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-5">
        {CommunityPostList?.slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((item, index) => (
            <CommunityPost key={index} post={item} isCommunityAdmin={isCommunityAdmin}/>
          ))}
      </div>
    </div>
  );
};

export default CommunityPostList;
