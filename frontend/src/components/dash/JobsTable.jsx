import React, { useMemo, useState } from "react";
import { TbEdit, TbEditOff, TbTrash, TbTrashOff } from "react-icons/tb";
import { VscEye } from "react-icons/vsc";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { formatUserFriendlyCount } from "../../lib/userFriendlyCount";
import { selectUserData } from "../../reducers/authSlice";
import { JOB_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import DataLoadingCompo from "../common/DataLoadingCompo";
import Input from "../ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/Table";
import EditJobModal from "./modal/comman/EditJobModal";
import SuccessModal from "./modal/comman/SuccessModal";

const JobsTable = () => {
  const navigate = useNavigate();
  const userData = useSelector(selectUserData);
  const currentUserId = userData._id;
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [search, setsearch] = useState("");
  const [editJob, seteditJob] = useState("");
  const [editJobModalOpen, seteditJobModalOpen] = useState(false);
  const [successModalOpen, setsuccessModalOpen] = useState(false);
  const [appyJob, setappyJob] = useState("");

  const queryKey = useMemo(() => ["jobs"], []);
  //get api
  const {
    data: jobs,
    isLoading,
    isError,
    error,
  } = useQuery(
    queryKey,
    async () => {
      const response = await axiosPrivate.get(JOB_API_URL.get);
      return response.data.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  //delete api
  const { mutateAsync: deleteJob } = useMutation(
    async (id) => {
      if (id) {
        return await axiosPrivate.delete(
          JOB_API_URL.delete.replace(":jobid", id)
        );
      }
    },
    {
      onSuccess: (res) => {
        setsuccessModalOpen(true);
        setTimeout(() => {
          queryClient.invalidateQueries("jobs");
        }, 2500);
      },
      onError: (error) => {
        console.log("error >>> ", error);
      },
    }
  );

  const handleEditJob = (job) => {
    seteditJob(job);
    setTimeout(() => {
      seteditJobModalOpen(true);
    }, 50);
  };

  const handleDeleteJob = (job) => {
    swal({
      title: "You Really want to Delete Job ? ",
      text: "once you delete This Job You Can not get back again ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      try {
        if (willDelete) {
          await deleteJob(job._id);
        }
      } catch (error) {
        console.log("error >>> ", error);
      }
    });
  };

  if (error || isError) {
    return (
      <div className="w-full bg-lightGray h-[500px] !text-textPrimary font-popins ">
        <div className="container w-full h-full flex text-center justify-center items-center">
          <h2 className="text-20 text-textPrimary font-semibold">
            No Job Found
          </h2>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <DataLoadingCompo />;
  }

  console.log("jobs >>> ", jobs);

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
        </div>
        <div className="table-container p-5 xxl:p-8 text-textPrimary text-center text-12 border-t-2 border-backgroundv3">
          <Table className="border-none w-full min-w-[1000px] ">
            <TableHeader className=" bg-backgroundv2 text-textPrimary !rounded-lg h-16 xl:h-16  border-none ">
              <TableRow className="py-5 border-none">
                <TableHead className="text-start text-14 xl:text-16 max-w-[100px] truncate">
                  Id
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16">
                  Job Image
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16">
                  Company Name
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16">
                  Role
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16">
                  Content
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16">
                  Applicants
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16 max-w-[100px] truncate">
                  created By
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
              {jobs
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                ?.filter((item) =>
                  search.trim() === ""
                    ? item
                    : item.title.toLocaleLowerCase().includes(search.trim()) ||
                      item.companyName
                        .toLocaleLowerCase()
                        .includes(search.trim())
                )
                ?.map((job, index) => (
                  <TableRow
                    key={index}
                    className="border-y-2 border-backgroundv3 first:border-t-0"
                  >
                    <TableCell className="max-w-[100px] truncate">
                      {job._id}
                    </TableCell>
                    <TableCell>
                      <div className="image_cntainer w-[100px] h-[100px] overflow-hidden bg-textGray/50 rounded-lg">
                        {job.jobImage !== "" && (
                          <img
                            src={`${process.env.REACT_APP_SERVER_IMAGE_PATH}${job.jobImage}`}
                            alt="front_image"
                            className="!h-full !w-full object-cover object-center"
                            onError={(e)=>e.target.src="https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg"}
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-start text-16 xl:text-18 font-semibold text-blueMain">
                        {job.companyName}
                      </div>
                    </TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>
                      <div className="text-start text-12 xl:text-14 text-textGray">
                        {job.content}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatUserFriendlyCount(job.applicants)}
                    </TableCell>
                    <TableCell className="max-w-[100px] truncate">
                      {job.createUserId}
                    </TableCell>
                    <TableCell>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex w-full items-center justify-center gap-4 px-4">
                        <button
                          className="text-green-700"
                          onClick={() => navigate(`/jobs`)}
                        >
                          <VscEye className="h-6 w-6" />
                        </button>
                        <button
                          className={`text-blue-700`}
                          onClick={() => job.createUserId === currentUserId ?handleEditJob(job):''}
                        >
                          {job.createUserId !== currentUserId ? (
                            <TbEditOff className="h-6 w-6" />
                          ) : (
                            <TbEdit className="h-6 w-6" />
                          )}
                        </button>
                        <button
                          className={`text-red-700`}
                          onClick={() => handleDeleteJob(job)}
                        >
                          {new Date() > new Date(job.time) ? (
                            <TbTrashOff className="h-6 w-6 " />
                          ) : (
                            <TbTrash className="h-6 w-6 " />
                          )}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <SuccessModal
        setsuccessModalOpen={setsuccessModalOpen}
        successModalOpen={successModalOpen}
      />
      <EditJobModal
        editJob={editJob}
        editJobModalOpen={editJobModalOpen}
        seteditJobModalOpen={seteditJobModalOpen}
        setsuccessModalOpen={setsuccessModalOpen}
      />
    </div>
  );
};

export default JobsTable;
