import { Image, UploadCloud } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SuccessModal from "../../components/dash/modal/comman/SuccessModal";
import AddPostCategorySelect from "../../components/front/AddPostCategorySelect";
import UserCommunitySelect from "../../components/front/UserCommunitySelect";
import { selectUserData } from "../../reducers/authSlice";
import { POST_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";

const AddPostPage = () => {
  let toastId;
  const axiosPrivate = useAxiosPrivate();
  const userData = useSelector(selectUserData);
  const createPostDefaultValue = {
    createUserId: userData._id,
    content: "",
    category_id: "",
    post_type: 1,
    postImage: "",
  };
  const [selectedCategory, setselectedCategory] = useState("");
  const [selectCommunity, setselectCommunity] = useState("");
  const [createPostData, setcreatePostData] = useState(createPostDefaultValue);
  const queryClient = useQueryClient();
  const [successModalOpen, setsuccessModalOpen] = useState(false);
  const [imagePreview, setimagePreview] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setimagePreview(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  // let postType,communityId
  // useEffect(() => {
  //   const { state } = location;
  //   console.log("location >>> ",location);
  //   if (state && state.postType && state.communityId) {
  //     postType= state.postType;
  //     communityId= state.communityId;
  //     console.log('Post Type:', postType);
  //     console.log('community ID:', communityId);
  //     setcreatePostData({...createPostDefaultValue,post_type:postType})
  //     setselectCommunity(communityId)
  //   }
  // }, [location]);

  // console.log("createPostData", createPostData);
  // console.log("selected community:", selectCommunity);

  const { mutateAsync: createPostApi } = useMutation(
    async (data) => {
      console.log("data in axios >>>", data);
      return await axiosPrivate.post(POST_API_URL.createPost, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    {
      onSuccess: (res) => {
        console.log("res >>> ", res.data.message);
        toast.success("post created succesfully");
        setsuccessModalOpen(true);
        setimagePreview("");
        setselectedCategory("");
        setselectCommunity("");
        setcreatePostData(createPostDefaultValue);
        queryClient.invalidateQueries("communities");
        queryClient.invalidateQueries("publicAndFollowingPosts");
        queryClient.invalidateQueries(["profileDetails", userData._id]);
      },
      onError: (error) => {
        console.log("error >>> ", error);
        toast.dismiss(toastId);
      },
    }
  );

  const handleAddPost = async (e) => {
    e.preventDefault();
    console.log("create post detail >>>>>> ", createPostData);

    try {
      if (createPostData.post_type === 2 && selectCommunity === "") {
        toast.info("No Community Created By You Create New One");
      } else if (createPostData.content.trim() === "") {
        toast.error("content Should not be empty");
      } else if (imagePreview === "") {
        toast.error("post image is empty !!! ");
      } else {
        // toastId = toast.loading("Processing, Please wait...");
        const formData = new FormData();
        formData.append("createUserId", createPostData.createUserId);
        formData.append("content", createPostData.content);
        formData.append("category_id", createPostData.category_id);
        formData.append("post_type", createPostData.post_type);
        formData.append("postImage", imagePreview);
        createPostData.post_type === 2 &&
          formData.append("communityId", selectCommunity);
        await createPostApi(formData);
      }
    } catch (error) {
      console.log("errror  >>> ", error);
    }
  };

  // const handleImageChange = (e) => {
  //   const reader = new FileReader();
  //   const file = e.target.files[0];
  //   if (file) {
  //     reader.onloadend = () => {
  //       setimagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //     setcreatePostData({
  //       ...createPostData,
  //       [e.target.name]: file,
  //     });
  //   }
  // };

  useEffect(() => {
    setcreatePostData({ ...createPostData, category_id: selectedCategory });
  }, [selectedCategory, createPostData]);

  return (
    <div className="w-ful h-full">
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-y-3 container my-5">
        <div>
          <h2 className="font-500 text-22 flex-shrink-0 md:text-24 lg:text-28 text-textPrimary">
            Add Post
          </h2>
        </div>
      </div>
      <div className="container pb-8">
        <div className="p-5 md:p-10 border  border-backgroundv3 bg-backgroundv1 text-textPrimary rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className=" flex flex-col">
              <div className="flex justify-center gap-5 items-center flex-grow w-full pb-5">
                <div className="h-full flex justify-start items-start gap-3">
                  <label
                    htmlFor="USER"
                    className={`text-18 md:text-20 py-2 px-5 font-500 transition-all duration-100 ease-linear rounded-lg cursor-pointer  ${
                      createPostData.post_type === 1 && "bg-blueMain text-white"
                    }`}
                  >
                    My Post
                  </label>
                  <input
                    type="radio"
                    id="USER"
                    value={"1"}
                    name="post_type"
                    onChange={(e) =>
                      setcreatePostData({ ...createPostData, post_type: 1 })
                    }
                    className="bg-backgroundv2 hidden focus:outline-none border border-backgroundv3 text-blueMain h-5 rounded-lg px-5 text-12"
                    placeholder="Type Here"
                  />
                </div>
                <div className="h-full flex justify-start items-start gap-3">
                  <label
                    htmlFor="COMMUNITY"
                    className={`text-18 md:text-20 py-2 px-5 font-500 transition-all duration-100 ease-linear rounded-lg cursor-pointer ${
                      createPostData.post_type === 2 && "bg-blueMain text-white"
                    }`}
                  >
                    Community
                  </label>
                  <input
                    type="radio"
                    value={"2"}
                    id="COMMUNITY"
                    name="post_type"
                    onChange={(e) =>
                      setcreatePostData({ ...createPostData, post_type: 2 })
                    }
                    className="bg-backgroundv2 hidden focus:outline-none border border-backgroundv3 text-blueMain h-5 rounded-lg px-5 text-12"
                    placeholder="Type Here"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-20">
                  Content
                </label>
                <textarea
                  name="content"
                  rows={6}
                  cols={12}
                  className="bg-backgroundv2 focus:outline-none  border border-backgroundv3 text-textPrimary  w-full rounded-lg p-5 text-14"
                  placeholder="Type Here"
                  value={createPostData.content}
                  onChange={(e) =>
                    setcreatePostData({
                      ...createPostData,
                      content: e.target.value,
                    })
                  }
                ></textarea>
              </div>

              {createPostData.post_type === 2 && (
                <div className="pt-3">
                  <UserCommunitySelect
                    selectCommunity={selectCommunity}
                    setselectCommunity={setselectCommunity}
                  />
                </div>
              )}

              <div className="pb-5 pt-3">
                <AddPostCategorySelect
                  selectedCategory={selectedCategory}
                  setselectedCategory={setselectedCategory}
                />
              </div>
              <div className="py-5">
                <button
                  onClick={handleAddPost}
                  className="rounded bg-blueMain h-12 px-8 gap-2 flex justify-center items-center border text-18  border-blueMain text-white hover:border-blueMain hover:text-blueMain  hover:bg-backgroundv1 transition-all duration-300 ease-linear"
                >
                  Add Post
                </button>
              </div>
            </div>
            <div className="w-full flex justify-center md:justify-start items-center flex-col gap-5">
              <div className=" w-[300px] h-[200px] flex justify-center items-center rounded-lg overflow-hidden z-10 shadow bg-blueMain/30">
                <div
                  {...getRootProps()}
                  className={`${
                    isDragActive ? "border-4 border-dashed border-blueMain" : ""
                  }${
                    !imagePreview && "border-2 border-blueMain"
                  } cursor-pointer  w-full h-full flex flex-col gap-4 justify-center items-center rounded-lg overflow-hidden z-10 shadow `}
                >
                  <input {...getInputProps()} id="postImage" />

                  {imagePreview ? (
                    <img
                      src={URL.createObjectURL(imagePreview)}
                      width={247}
                      height={247}
                      alt="logo"
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <Image className="h-[100px] w-[200px]" strokeWidth={1.5} />
                  )}
                </div>

                 {/* {previewURL ? (
                  <img
                    src={previewURL}
                    width={247}
                    height={247}
                    alt="logo"
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <Image className="h-[100px] w-[200px]" strokeWidth={1.5} />
                )} */}
              </div>
              <div className="flex w-full items-center justify-center">
                <label
                  htmlFor="postImage"
                  className="cursor-pointer text-textPrimary border border-textGray rounded  flex gap-2 items-center py-1 px-3"
                >
                  <UploadCloud className="h-5 w-5" /> Upload
                </label>
                {/* <input
                  type="file"
                  id="postImage"
                  name="postImage"
                  className="hidden"
                  onChange={handleProfileChange}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        setsuccessModalOpen={setsuccessModalOpen}
        successModalOpen={successModalOpen}
      />
    </div>
  );
};

export default AddPostPage;
