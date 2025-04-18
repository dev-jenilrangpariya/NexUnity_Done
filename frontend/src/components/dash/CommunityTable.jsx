import { Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { VscEye } from "react-icons/vsc";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { COMMUNITY_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import DataLoadingCompo from "../common/DataLoadingCompo";
import Input from "../ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import StatusFilter from "./communityTableFilter/StatusFilter";

const CommunityTable = () => {
  //   const [page, setpage] = useState(1);
  //   const [totalPages, settotalPages] = useState(Math.ceil(data.length / 5));
  //   var indexOfLastItem = page * 5;
  //   const indexOfFirstItem = indexOfLastItem - 5;

  let toastId;
  const queryClient = useQueryClient();
  const [selectedStatus, setselectedStatus] = useState("All");
  const [search, setsearch] = useState("");
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);

  const axiosPrivate = useAxiosPrivate();
  const queryKey = useMemo(() => ["communities"], []);

  //get api
  const {
    data: communities,
    isLoading,
    isError,
    error,
  } = useQuery(
    queryKey,
    async () => {
      const response = await axiosPrivate.get(COMMUNITY_API_URL.getAll);
      return response.data.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  //delete api
  const { mutateAsync: deleteApi } = useMutation(
    async (data) => {
      const config = {
        data: data,
      };
      console.log("config >>> ", config);
      return await axiosPrivate.delete(COMMUNITY_API_URL.delete, config);
    },
    {
      onSuccess: (res) => {
        toast.update(toastId, {
          render: res.data.message,
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: 2000,
        });
        setTimeout(() => {
          queryClient.invalidateQueries("communities");
        }, 2000);
      },
      onError: (error) => {
        if (error.response) {
          toast.update(toastId, {
            render: error.response.data.message,
            type: toast.TYPE.ERROR,
            isLoading: false,
            autoClose: 2000,
          });
          // toast.error(error.response.data.message || "An error occurred");
        } else {
          toast.dismiss(toastId);
          // toast.update(toastId, {
          //   render: "An unexpected error occurred",
          //   type: toast.TYPE.ERROR,
          //   isLoading: false,
          //   autoClose: 2000,
          // });
          // toast.error("An unexpected error occurred");
        }
      },
    }
  );
  console.log("All Community >>", communities);

  const handleDelete = (deleteId) => {
    try {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this !!!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          toastId = toast.loading("Please wait...");
          await deleteApi({ id: deleteId });
        }
      });
    } catch (error) {
      console.log("error >> ", error);
    }
  };

  if (isError) {
    return (
      <div className="w-full h-[400px] flex justify-center items-center">
        <DataLoadingCompo />
        <h2 className="text-textPrimary text-center text-26">
          Network Error !!!!
        </h2>
      </div>
    );
  }

  if (isLoading) {
    return <DataLoadingCompo />;
  }
  return (
    <div className="w-full">
      <div className="rounded-xl w-full  text-textPrimary text-center text-12  shadow bg-backgroundv1 border-2 border-backgroundv3">
        <div className="p-5 xxl:p-8 w-full  flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="w-full">
            <Input
              className="bg-backgroundv2 focus:outline-none border border-backgroundv3 text-textGray h-10 w-full rounded-lg px-5 text-12"
              placeholder="Search ..."
              value={search}
              onChange={(e) => setsearch(e.target.value)}
            />
          </div>
          <div className="gap-5 hidden sm:flex">
            <StatusFilter
              selectedStatus={selectedStatus}
              setselectedStatus={setselectedStatus}
            />
            {/* <StatusFilter selectedcategory={status} setselectedcategory={setselectedstatus}/>
                        <CategoryFilter selectedcategory={category} setselectedcategory={setselectedCategory} /> */}
          </div>
        </div>
        <div className=" p-5 xxl:p-8 text-textPrimary text-center text-12 border-t-2 border-backgroundv3">
          <Table className="border-none w-full min-w-[800px]">
            <TableHeader className=" bg-backgroundv2 text-textPrimary !rounded-lg h-16 xl:h-16  border-none ">
              <TableRow className="py-5 border-none">
                <TableHead className="text-start text-14 xl:text-16 max-w-[100px] truncate">
                  Id
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16">
                  Front Image
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16">
                  Name
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16">
                  Description
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16">
                  Owner
                </TableHead>
                {/* <TableHead className="text-start text-14 xl:text-16">
                  Members
                </TableHead> */}
                <TableHead className="text-start text-14 xl:text-16">
                  Status
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16">
                  CreatedAt
                </TableHead>
                <TableHead className="text-center text-14 xl:text-16">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communities
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                ?.filter((item) =>
                  search.trim() === ""
                    ? item
                    : item.name.toLocaleLowerCase().includes(search.trim())
                )
                ?.filter((item) =>
                  selectedStatus === "All"
                    ? item
                    : selectedStatus === "public"
                    ? item.isPublic === true
                    : item.isPublic === false
                )
                ?.map((community, index) => (
                  <TableRow
                    key={index}
                    className="border-y-2 border-backgroundv3 first:border-t-0"
                  >
                    <TableCell className="max-w-[100px] truncate">
                      {community._id}
                    </TableCell>
                    <TableCell>
                      <div className="image_cntainer w-[70px] h-[70px] overflow-hidden bg-textGray/50 rounded-lg">
                        {community.frontImage !== "" && (
                          <img
                            src={`${process.env.REACT_APP_SERVER_IMAGE_PATH}${community.frontImage}`}
                            alt="front_image"
                            className="!h-full !w-full object-cover object-center"
                            onError={(e) =>
                              (e.target.src =
                                "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg")
                            }
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-start text-16 xl:text-18 font-semibold text-blueMain">
                        {community.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-start text-12 xl:text-14 text-textGray">
                        {community.description}
                      </div>
                    </TableCell>
                    <TableCell>{community.createUserId}</TableCell>
                    {/* <TableCell>{}no ?</TableCell> */}
                    <TableCell>
                      <div className="w-full flex items-center justify-center">
                        <div
                          className={`capitalize py-1 px-3 rounded-full
                            ${
                              community.isPublic
                                ? "bg-green-600/30 text-green-700"
                                : "bg-yellow-400/30 text-yellow-700"
                            }`}
                        >
                          {community.isPublic ? "public" : "private"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(community.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex w-full items-center justify-center gap-4 px-4">
                        <button
                          className="text-green-700"
                          onClick={() =>
                            navigate(`/community/${community._id}`)
                          }
                        >
                          <VscEye className="h-6 w-6" />
                        </button>
                        {/* <button className="text-blue-600">
                          <Pen className="h-6 w-6" />
                        </button> */}
                        <button
                          className="text-red-600"
                          onClick={() => handleDelete(community._id)}
                        >
                          <Trash2 className="h-6 w-6 " />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* <div className="pagination w-full mt-5 flex justify-between">
        <div>
          <Button
            variant={"outline"}
            className={`gap-3 text-textPrimary border transition-all duration-300 ease-linear h-10 ${
              page === 1
                ? "text-textGray hover:bg-transparent active:scale-1 border-textGray"
                : "bg-backgroundv1 hover:bg-backgroundv3  border-textPrimary "
            }`}
            onClick={() => page != 1 && setpage(page - 1)}
          >
            <ArrowLeft className="w-5 h-5" /> Privious
          </Button>
        </div>
        <div className="flex justify-center items-center gap-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              onClick={() => setpage(i + 1)}
              variant={"outline"}
              className={`text-textGray  ${
                page === i + 1
                  ? "bg-blueMain text-white hover:bg-blueMain "
                  : "hover:bg-backgroundv3 hover:text-textGray"
              } border-none h-10 transition-all duration-300 ease-linear`}
            >
              {i + 1}
            </Button>
          ))}
        </div>
        <div>
          <Button
            variant={"outline"}
            className={`gap-3 text-textPrimary border transition-all duration-300 ease-linear h-10 ${
              page === totalPages
                ? "text-textGray hover:bg-transparent active:scale-1 border-textGray"
                : "bg-backgroundv1 hover:bg-backgroundv3  border-textPrimary "
            }`}
            onClick={() => page !== totalPages && setpage(page + 1)}
          >
            Next <ArrowRight className="w-5 h-5" />{" "}
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default CommunityTable;
