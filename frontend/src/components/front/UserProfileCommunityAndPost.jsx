import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserData } from "../../reducers/authSlice";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import AddCommunityModal from "../dash/modal/comman/AddCommunityModal";
import SuccessModal from "../dash/modal/comman/SuccessModal";
import { Button } from "../ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import UserCommunity from "./UserCommunity";
import UserPost from "./UserPost";

const UserProfileCommunityAndPost = ({ profileDetails }) => {
  const navigate = useNavigate();
  const userData = useSelector(selectUserData);
  const currentUserId = userData._id;

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [successModalOpen, setsuccessModalOpen] = useState(false);
  const [addCommunityModalOpen, setaddCommunityModalOpen] = useState(false);

  return (
    <div className="bg-backgroundv1 text-textPrimary rounded-lg border p-5 font-popins border-backgroundv3">
      {(profileDetails?.userDetails.isPrivate &&
        profileDetails?.isYouFollowThisPerson) ||
      !profileDetails?.userDetails.isPrivate ||
      profileDetails?.userDetails._id === currentUserId ? (
        <>
          <Tabs defaultValue="posts">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger
                  value="posts"
                  className={
                    "h-12 px-3 bg-backgroundv2 text-textPrimary data-[state=active]:bg-blueMain data-[state=active]:text-white"
                  }
                >
                  <h2
                    className={`
                  text-18  font-semibold
                 `}
                  >
                    Posts
                  </h2>
                </TabsTrigger>
                <TabsTrigger
                  value="communities"
                  className={
                    "h-12 px-3 bg-backgroundv2 text-textPrimary data-[state=active]:bg-blueMain data-[state=active]:text-white"
                  }
                >
                  <h2
                    className={`
                  text-18 font-semibold
                 `}
                  >
                    Communities
                  </h2>
                </TabsTrigger>
              </TabsList>

              {profileDetails?.userDetails._id === currentUserId && (
                <>
                  <TabsContent value="posts">
                    <Button
                      onClick={() => navigate("/add-post")}
                      className="group/btn rounded flex justify-center items-center px-3 gap-1 h-10 hover:bg-transparent"
                      variant={"blueV1"}
                    >
                      <span>
                        <Plus className="h-6 w-6 " />
                      </span>
                      Add Post
                    </Button>
                  </TabsContent>
                  <TabsContent value="communities">
                    <Button
                      onClick={() => setaddCommunityModalOpen(true)}
                      className="group/btn rounded flex justify-center items-center px-3 gap-1 h-10 hover:bg-transparent"
                      variant={"blueV1"}
                    >
                      <span>
                        <Plus className="h-6 w-6 " />
                      </span>
                      Add Community
                    </Button>
                  </TabsContent>
                </>
              )}
            </div>
            <div className="h-[1px] w-full bg-backgroundv3 my-5"></div>
            <TabsContent value="posts" className="flex gap-3">
              <h3>Total Post : </h3>
              <h3 className="text-blueMain text-18 font-semibold ">
                {profileDetails?.postCount}
              </h3>
            </TabsContent>
            <TabsContent value="communities" className="flex gap-3">
              <h3>Total Created Community : </h3>
              <h3 className="text-blueMain text-18 font-semibold">
                {profileDetails?.createdCommunityCount}
              </h3>
            </TabsContent>
            <div className="">
              <TabsContent
                value="posts"
                className="pb-5 grid grid-cols-1 xsm:grid-cols-2  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-5"
              >
                {profileDetails?.postDetails?.length > 0 ? (
                  profileDetails?.postDetails
                    ?.slice()
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((post, index) => (
                      <UserPost
                        post={post}
                        isPostOwner={
                          profileDetails?.userDetails._id === currentUserId
                        }
                        key={index}
                      />
                    ))
                ) : (
                  <div className="col-span-1 xsm:col-span-2 lg:col-span-3 xl:col-span-4 3xl:col-span-5 text-center">
                    <h2>No Post </h2>
                  </div>
                )}
                {/* <UserPost/> 
           <UserPost/> 
           <UserPost/>  */}
              </TabsContent>
              <TabsContent
                value="communities"
                className="pb-5 grid grid-cols-1 xsm:grid-cols-2  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-5"
              >
                {profileDetails?.createdCommunityDetails?.length > 0 ? (
                  profileDetails?.createdCommunityDetails
                    ?.slice()
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((community, index) => (
                      <UserCommunity
                        community={community}
                        isCommunityAdmin={
                          profileDetails?.userDetails._id === currentUserId
                        }
                        key={index}
                      />
                    ))
                ) : (
                  <div className="col-span-1 xsm:col-span-2 lg:col-span-3 xl:col-span-4 3xl:col-span-5 text-center">
                    <h2>No Community </h2>
                  </div>
                )}
                {/* <UserCommunity/>
            <UserCommunity/>
            <UserCommunity/> */}
              </TabsContent>
            </div>
          </Tabs>
        </>
      ) : (
        <>
          <div>
            <h3>This account is private</h3>
            <p>Follow this account to see their posts and communities.</p>
          </div>
        </>
      )}

      <AddCommunityModal
        addCommunityModalOpen={addCommunityModalOpen}
        setaddCommunityModalOpen={setaddCommunityModalOpen}
        setsuccessModalOpen={setsuccessModalOpen}
      />
      <SuccessModal
        successModalOpen={successModalOpen}
        setsuccessModalOpen={setsuccessModalOpen}
      />
    </div>
  );
};

export default UserProfileCommunityAndPost;
