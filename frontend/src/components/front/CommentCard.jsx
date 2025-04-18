import { Edit2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import swal from "sweetalert";
import customeProfile from "../../assets/images/customeProfile.png";
import { formatUserFriendlyTime } from "../../lib/userFriendlyTime";
import { selectUserData } from "../../reducers/authSlice";
import { COMMENT_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";

const CommentCard = ({ comment }) => {
  const userData = useSelector(selectUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  //edit comment api
  const { mutateAsync: editComment } = useMutation(
    async (data) => {
      return await axiosPrivate.post(
        COMMENT_API_URL.editComment,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (res) => {
        // toast.success(res.data.message);
        queryClient.invalidateQueries(["comment", comment.postId]);
      },
      onError: (error) => {
        console.log("error >>> ", error);
      },
    }
  );

  //delete comment api
  const { mutateAsync: deleteComment } = useMutation(
    async (data) => {
      const config = {
        data: data,
      };
      return await axiosPrivate.delete(COMMENT_API_URL.deleteComment, config);
    },
    {
      onSuccess: (res) => {
        toast.success(res.data.message);
        queryClient.invalidateQueries(["comment", comment.postId]);
        queryClient.invalidateQueries(["publicAndFollowingPosts"]);
      },
      onError: (error) => {
        console.log("error >>> ", error);
      },
    }
  );

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleEditComment = async (e) => {
    try {
      if (e.key === "Enter") {
        // console.log("edited comment >> ", editedContent);
        if (editedContent.trim() === "") {
          toast.warn("comment is empty");
        } else {
          setIsEditing(false);
          await editComment({ commentId: comment._id, content: editedContent });
        }
      }
    } catch (error) {
      console.log("error >> ", error);
    }
  };
  const handleDeleteComment = (e) => {
    swal({
      title: "Are you sure?",
      text: "You Really want to delete your comment !!!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await deleteComment({ commentId: comment._id });
      }
    });
  };

  return (
    <div className="flex gap-3 w-full">
      <div className="w-[30px] h-[30px] flex-shrink-0 rounded-full flex justify-center items-center overflow-hidden">
        <img
          src={
            comment?.user[0]?.profile_pic !== ""
              ? `${process.env.REACT_APP_SERVER_IMAGE_PATH}${comment?.user[0]?.profile_pic}`
              : customeProfile
          }
          alt="image"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.src =
              "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
          }}
        />
      </div>
      <div className="h-full flex w-full justify-start items-start gap-2">
        <h2 className="text-14 text-textPrimary font-500 flex-shrink-0">
          {comment?.user[0]?.first_name} :
        </h2>
        <div className="w-full">
          <div className="w-full flex justify-between items-end">
            {isEditing ? (
              <input
                type="text"
                className="text-14 text-textPrimary w-full border-b p-1 mb-1 focus:outline-none transition-all duration-300 ease-linear bg-transparent  border-textGray/40 h-full "
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={handleEditComment}
              />
            ) : (
              <div className="w-full">
                <h4 className="text-12 text-textPrimary transition-all duration-300 ease-linear">
                  {comment.content}
                </h4>
              </div>
            )}
            <div
              className={`${
                comment?.user[0]?._id === userData._id ? "block" : "hidden"
              } flex gap-3 flex-shrink-0`}
            >
              {isEditing ? (
                <button onClick={handleCancelClick}>
                  <IoCloseSharp className="h-5 w-5 text-textGray" />
                </button>
              ) : (
                <button onClick={handleEditClick}>
                  <Edit2 className="h-4 w-4 text-blue-700" />
                </button>
              )}
              <button onClick={handleDeleteComment}>
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          </div>
          <div>
            <h6 className="text-10 text-textGray">
              {formatUserFriendlyTime(comment.createdAt)}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
