import { ArrowLeft } from "lucide-react";
import React, { useMemo } from "react";
import { useQuery } from "react-query";
import {
  useNavigate,
  useParams
} from "react-router-dom";
import DataLoadingCompo from "../../components/common/DataLoadingCompo";
import { POST_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";

const FrontSinglePostPage = () => {
  const navigate = useNavigate();

  const { postId } = useParams();
  console.log("post id >> ", postId);

  const axiosPrivate = useAxiosPrivate();

  const queryKey = useMemo(() => ["PublicAndFollowingPost", postId], [postId]);

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery(
    queryKey,
    async () => {
      if (postId) {
        const response = await axiosPrivate.get(
          POST_API_URL.getPublicAndFollowingPostByPostId.replace(":id", postId)
        );
        return response.data.data;
      }
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
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

  console.log("post dta >>>>> ", post);

  if (post) {
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
            
          </div>
        </div>
      </div>
    );
  }
};

export default FrontSinglePostPage;
