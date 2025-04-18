import React, { useMemo, useState } from "react";
import "./css/JobsPage.css";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import DataLoadingCompo from "../../components/common/DataLoadingCompo";
import AddJobModal from "../../components/dash/modal/comman/AddJobModal";
import ApplyJobModal from "../../components/dash/modal/comman/ApplyJobModal";
import EditJobModal from "../../components/dash/modal/comman/EditJobModal";
import SuccessModal from "../../components/dash/modal/comman/SuccessModal";
import { selectUserData } from "../../reducers/authSlice";
import { JOB_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";

function JobsPage() {
  const navigate = useNavigate();
  const userData = useSelector(selectUserData);
  const currentUserId = userData._id;
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [addJobModalOpen, setaddJobModalOpen] = useState(false);
  const [applyJobModalOpen, setapplyJobModalOpen] = useState(false);
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

  const handleApplyJob = (job) => {
    setappyJob(job);
    setTimeout(() => {
      setapplyJobModalOpen(true);
    }, 50);
  };

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
            No User Found
          </h2>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <DataLoadingCompo />;
  }

  let myJobs = [];
  let OtherJobs = [];
  if (jobs) {
    myJobs = jobs?.filter((job) => job.createUserId === currentUserId);

    OtherJobs = jobs?.filter((job) => job.createUserId !== currentUserId);
  }

  console.log("jobs >>", jobs);
  return (
    <div className="w-full container py-10 flex justify-center items-center">
      <div className="w-full flex flex-col justify-center items-center">
        {myJobs?.length > 0 && (
          <div className="searched-jobs mb-10 ">
            <div className="searched-bar flex justify-between items-center">
              <div className="searched-show">
                <h1 className="text-20 text-textPrimary font-semibold !text-primary">
                  {" "}
                  My Jobs{" "}
                </h1>
              </div>
              <div className="">
                <button
                  className="create-job-button !bg-blueMain !font-400 !text-18"
                  onClick={() => setaddJobModalOpen(true)}
                >
                  Create Job
                </button>
              </div>
            </div>

            <div className="job-cards grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {myJobs
                ?.slice()
                ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                ?.map((job, index) => (
                  <div
                    className="job-card bg-backgroundv1 border !border-backgroundv3 text-textPrimary w-full"
                    key={index}
                  >
                    <div className="job-card-header">
                      {job?.jobImage !== "" ? (
                        <img
                          src={`${process.env.REACT_APP_SERVER_IMAGE_PATH}${job?.jobImage}`}
                          className="h-[80px] w-[80px] rounded-lg"
                          onError={(e) => {
                            e.target.src =
                              "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
                          }}
                        />
                      ) : (
                        <svg
                          className="logo"
                          viewBox="0 -13 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g fill="#feb0a5">
                            <path d="M256 92.5l127.7 91.6L512 92 383.7 0 256 91.5 128.3 0 0 92l128.3 92zm0 0M256 275.9l-127.7-91.5L0 276.4l128.3 92L256 277l127.7 91.5 128.3-92-128.3-92zm0 0" />
                            <path d="M127.7 394.1l128.4 92 128.3-92-128.3-92zm0 0" />
                          </g>
                          <path
                            d="M512 92L383.7 0 256 91.5v1l127.7 91.6zm0 0M512 276.4l-128.3-92L256 275.9v1l127.7 91.5zm0 0M256 486.1l128.4-92-128.3-92zm0 0"
                            fill="#feb0a5"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="job-card-title">
                      <h2> {job.title} </h2>
                    </div>
                    <div className="jobs-card-company">
                      <span>
                        Company Name : <strong> {job.companyName} </strong>{" "}
                      </span>
                    </div>
                    <div className="job-card-subtitle !font-400 !text-12">
                      {job.content}
                    </div>
                    <div className="job-detail-buttons">
                      <button className="search-buttons detail-button">
                        {" "}
                        {job.applicants} applicants{" "}
                      </button>
                    </div>
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={() => handleEditJob(job)}
                        className="flex gap-1 items-center justify-center text-center w-full text-12 rounded-lg text-white bg-blue-700 h-8"
                      >
                        Edit
                      </button>
                      <button
                        className="flex gap-1 items-center justify-center text-center w-full text-12 rounded-lg text-white bg-red-700 h-8 "
                        onClick={() => handleDeleteJob(job)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        <div className="searched-jobs">
          <div className="searched-bar flex justify-between items-center">
            <div className="searched-show">
              <h1 className="text-20 text-textPrimary font-semibold !text-primary">
                {" "}
                Available Jobs{" "}
              </h1>
            </div>
            {myJobs.length == 0 && (
              <div className="">
                <button
                  className="create-job-button !bg-blueMain !font-400 !text-18"
                  onClick={() => setaddJobModalOpen(true)}
                >
                  Create Job
                </button>
              </div>
            )}
          </div>

          <div className="job-cards grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {jobs
              ?.slice()
              ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              ?.map((job, index) => (
                <div
                  className="job-card bg-backgroundv1 border !border-backgroundv3 text-textPrimary w-full"
                  key={index}
                >
                  <div className="job-card-header">
                    {job?.jobImage !== "" ? (
                      <img
                        src={`${process.env.REACT_APP_SERVER_IMAGE_PATH}${job?.jobImage}`}
                        className="h-[80px] w-[80px] rounded-lg"
                        onError={(e) => {
                          e.target.src =
                            "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
                        }}
                      />
                    ) : (
                      <svg
                        className="logo"
                        viewBox="0 -13 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g fill="#feb0a5">
                          <path d="M256 92.5l127.7 91.6L512 92 383.7 0 256 91.5 128.3 0 0 92l128.3 92zm0 0M256 275.9l-127.7-91.5L0 276.4l128.3 92L256 277l127.7 91.5 128.3-92-128.3-92zm0 0" />
                          <path d="M127.7 394.1l128.4 92 128.3-92-128.3-92zm0 0" />
                        </g>
                        <path
                          d="M512 92L383.7 0 256 91.5v1l127.7 91.6zm0 0M512 276.4l-128.3-92L256 275.9v1l127.7 91.5zm0 0M256 486.1l128.4-92-128.3-92zm0 0"
                          fill="#feb0a5"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="job-card-title">
                    <h2> {job.title} </h2>
                  </div>
                  <div className="jobs-card-company">
                    <span>
                      Company Name : <strong> {job.companyName} </strong>{" "}
                    </span>
                  </div>
                  <div className="job-card-subtitle !font-400 !text-12">
                    {job.content}
                  </div>
                  <div className="job-detail-buttons">
                    <button className="search-buttons detail-button">
                      {" "}
                      {job.applicants} applicants{" "}
                    </button>
                  </div>
                  <div className="job-card-buttons">
                    <button
                      className="search-buttons card-buttons hover:!bg-backgroundv2"
                      onClick={() => handleApplyJob(job)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <AddJobModal
        addJobModalOpen={addJobModalOpen}
        setaddJobModalOpen={setaddJobModalOpen}
        setsuccessModalOpen={setsuccessModalOpen}
      />
      <ApplyJobModal
        applyJobModalOpen={applyJobModalOpen}
        setapplyJobModalOpen={setapplyJobModalOpen}
        setsuccessModalOpen={setsuccessModalOpen}
        job={appyJob}
        setJob={setappyJob}
      />
      <EditJobModal
        editJobModalOpen={editJobModalOpen}
        seteditJobModalOpen={seteditJobModalOpen}
        setsuccessModalOpen={setsuccessModalOpen}
        editJob={editJob}
      />
      <SuccessModal
        setsuccessModalOpen={setsuccessModalOpen}
        successModalOpen={successModalOpen}
      />
    </div>
  );
}

export default JobsPage;
