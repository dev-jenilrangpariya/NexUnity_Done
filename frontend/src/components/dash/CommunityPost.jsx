import { Fullscreen, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import swal from "sweetalert";
import { formatUserFriendlyTime } from "../../lib/userFriendlyTime";
import { POST_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import FullImageShowModal from "./modal/comman/FullImageShowModal";
import SuccessModal from "./modal/comman/SuccessModal";

const CommunityPost = ({ post, isCommunityAdmin }) => {
  const [successModalOpen, setsuccessModalOpen] = useState(false);
  const [fullImageShowModalOpen, setfullImageShowModalOpen] = useState(false);
  const [editPostModalOpen, seteditPostModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const [imageUrl, setimageUrl] = useState(null);

  //delete api
  const { mutateAsync: deletePost } = useMutation(
    async () => {
      return await axiosPrivate.delete(
        POST_API_URL.deletePostById.replace(":postId", post._id)
      );
    },
    {
      onSuccess: (res) => {
        // toast.success("Community Deleted successfully");
        setsuccessModalOpen(true);
        setTimeout(() => {
          queryClient.invalidateQueries(["profileDetails", post.createUserId]);
          queryClient.invalidateQueries(["community", post.communityId]);
        }, 1500);
      },
      onError: (error) => {
        console.log("error >>> ", error);
      },
    }
  );

  const handleDeletePost = () => {
    swal({
      title: "Are you sure?",
      text: "You Really want to Delete This Posts !!!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      try {
        if (willDelete) {
          //deleet post
          await deletePost();
        }
      } catch (error) {
        console.log("error >> ", error);
      }
    });
  };

  return (
    <div className=" w-full rounded-lg border h-[250px] border-backgroundv3 bg-backgroundv2 xxl:h-[300px] flex flex-col overflow-hidden">
      <div className="relative h-[150px] xxl:h-[200px] w-full bg-backgroundv2 flex justify-center items-center">
        {isCommunityAdmin && (
          <div className="absolute top-2 end-2 flex gap-3">
            {/* <button>
            <Edit2 className="h-5 w-5 text-blue-700" />
          </button> */}
            <button onClick={handleDeletePost}>
              <Trash2 className="h-5 w-5 text-red-700" />
            </button>
          </div>
        )}
        <img
          src={`${process.env.REACT_APP_SERVER_IMAGE_PATH}${post.image}`}
          width={247}
          height={247}
          alt="logo"
          className="h-full w-full object-cover object-center"
          onError={(e)=>e.target.src="https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg"}
        />

        <button
          onClick={() => setfullImageShowModalOpen(true)}
          className="absolute bottom-2 end-2 w-[30px] h-[30px] flex justify-center bg-backgroundv2 items-center rounded-full"
        >
          <Fullscreen className="h-4 w-4 text-blueMain" />
        </button>
      </div>
      <div className="flex-shrink-0 w-full h-[100px] p-3 bg-backgroundv1">
        <h1 className="text-20  font-semibold mb-1 text-textPrimary truncate">
          {post.content}
        </h1>
        {/* <h4 className='text-12  mb-1 text-textGray truncate'>{post.content}</h4> */}
        <h1 className="text-14 text-textPrimary">
          {formatUserFriendlyTime(post.createdAt)}
        </h1>
      </div>
      <SuccessModal
        setsuccessModalOpen={setsuccessModalOpen}
        successModalOpen={successModalOpen}
      />
      <FullImageShowModal
        fullImageShowModalOpen={fullImageShowModalOpen}
        setfullImageShowModalOpen={setfullImageShowModalOpen}
        imageUrl={
          post?.image !== ""
            ? `${process.env.REACT_APP_SERVER_IMAGE_PATH}${post?.image}`
            : "https://images.unsplash.com/photo-1483909796554-bb0051ab60ad?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2lybCUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
        }
        setimageUrl={setimageUrl}
      />
    </div>
  );
};

export default CommunityPost;
