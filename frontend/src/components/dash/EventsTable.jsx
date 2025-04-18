import React, { useEffect, useMemo, useState } from "react";
import { TbEdit, TbEditOff, TbTrash, TbTrashOff } from "react-icons/tb";
import { VscEye } from "react-icons/vsc";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { EVENT_API_URL } from "../../security/axios";
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
import TimeFilter from "./eventTableFilter/TimeFilter";
import EditEventModal from "./modal/comman/EditEventModal";
import SuccessModal from "./modal/comman/SuccessModal";
import EventShowModal from "./modal/comman/EventShowModal";

const EventsTable = () => {
  let toastId;
  const queryClient = useQueryClient();
  const [selectedStatus, setselectedStatus] = useState("All");
  const [search, setsearch] = useState("");
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const [displayEvent, setdisplayEvent] = useState([]);
  const [successModalOpen, setsuccessModalOpen] = useState(false);
  const [editEventModalOpen, seteditEventModalOpen] = useState(false);
  const [editEvent, seteditEvent] = useState({});
  const [eventShowModalOpen, seteventShowModalOpen] = useState(false);
  const [eventShow, seteventShow] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const queryKey = useMemo(() => ["events"], []);

  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery(
    queryKey,
    async () => {
      const response = await axiosPrivate.get(EVENT_API_URL.get);
      return response.data.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  // delete api
  const { mutateAsync: deleteApi } = useMutation(
    async (deleteId) => {
      return await axiosPrivate.delete(
        EVENT_API_URL.delete.replace(":id", deleteId)
      );
    },
    {
      onSuccess: (res) => {
        // toast.update(toastId, {
        //   render: res.data.message,
        //   type: toast.TYPE.SUCCESS,
        //   isLoading: false,
        //   autoClose: 2000,
        // });
        setsuccessModalOpen(true);
        setTimeout(() => {
          queryClient.invalidateQueries("events");
        }, 2000);
      },
      onError: (error) => {
        toast.dismiss(toastId);
        console.log("error >>. ", error);
      },
    }
  );

  const handleDelete = (deleteId) => {
    try {
      swal({
        title: "Are you sure?",
        text: "You Want to delete this event ? Once deleted, you will not be able to recover this !!!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          // toastId = toast.loading("Please wait...");
          await deleteApi(deleteId);
        }
      });
    } catch (error) {
      console.log("error >> ", error);
    }
  };

  const handleEdit = (event) => {
    seteditEvent(event);
    setTimeout(() => {
      seteditEventModalOpen(true);
    }, 50);
  };

  const currentDate = new Date();

  const todayEvents = events?.filter((event) => {
    const eventDate = new Date(event.time);
    return (
      eventDate.getDate() === currentDate.getDate() &&
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const upcomingEvents = events?.filter((event) => {
    const eventDate = new Date(event.time);
    return eventDate > currentDate;
  });

  const pastEvents = events?.filter((event) => {
    const eventDate = new Date(event.time);
    return eventDate < currentDate;
  });

  useEffect(() => {
    if (selectedStatus === "Today") {
      setdisplayEvent(todayEvents);
    } else if (selectedStatus === "Upcomming") {
      setdisplayEvent(upcomingEvents);
    } else if (selectedStatus === "Past") {
      setdisplayEvent(pastEvents);
    } else {
      setdisplayEvent(events);
    }
  });

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

  // console.log("events >>> ", events);
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
            <TimeFilter
              selectedStatus={selectedStatus}
              setselectedStatus={setselectedStatus}
            />
            {/* <StatusFilter selectedcategory={status} setselectedcategory={setselectedstatus}/>
                        <CategoryFilter selectedcategory={category} setselectedcategory={setselectedCategory} /> */}
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
                  Event Image
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16">
                  Name
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16 w-full flex-grow">
                  Content
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16">
                  Location
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16">
                  Time
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
              {displayEvent
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                ?.filter((item) =>
                  search.trim() === ""
                    ? item
                    : item.eventName.toLocaleLowerCase().includes(search.trim())
                )
                ?.map((event, index) => (
                  <TableRow
                    key={index}
                    className="border-y-2 border-backgroundv3 first:border-t-0"
                  >
                    <TableCell className="max-w-[100px] truncate">
                      {event._id}
                    </TableCell>
                    <TableCell>
                      <div className="image_cntainer w-[100px] h-[100px] overflow-hidden bg-textGray/50 rounded-lg">
                        {event.frontImage !== "" && (
                          <img
                            src={`${process.env.REACT_APP_SERVER_IMAGE_PATH}${event.eventImage}`}
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
                        {event.eventName}
                      </div>
                    </TableCell>
                    <TableCell className="w-full flex-grow">
                      <div className="text-start text-12 xl:text-14 text-textGray">
                        {event.content}
                      </div>
                    </TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      {`on ${new Date(event.time).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "long", day: "numeric" }
                      )} at ${new Date(event.time).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}`}
                    </TableCell>
                    <TableCell className="max-w-[100px] truncate">
                      {event.createUserId}
                    </TableCell>
                    <TableCell>
                      {new Date(event.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex w-full items-center justify-center gap-4 px-4">
                        <button
                          className="text-green-700"
                          // onClick={() => navigate(`/events/${event.eventName}`)}
                          onClick={() => {
                            seteventShow(event);
                            seteventShowModalOpen(true);
                          }}
                        >
                          <VscEye className="h-6 w-6" />
                        </button>
                        <button
                          className={`text-blue-700`}
                          disabled={new Date() > new Date(event.time)}
                          onClick={() => handleEdit(event)}
                        >
                          {new Date() > new Date(event.time) ? (
                            <TbEditOff className="h-6 w-6" />
                          ) : (
                            <TbEdit className="h-6 w-6" />
                          )}
                        </button>
                        <button
                          className={`text-red-700`}
                          onClick={() => handleDelete(event._id)}
                          disabled={new Date() > new Date(event.time)}
                        >
                          {new Date() > new Date(event.time) ? (
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
      <EditEventModal
        editEvent={editEvent}
        editEventModalOpen={editEventModalOpen}
        seteditEventModalOpen={seteditEventModalOpen}
        setsuccessModalOpen={setsuccessModalOpen}
      />
      <EventShowModal
        eventShow={eventShow}
        eventShowModalOpen={eventShowModalOpen}
        seteventShowModalOpen={seteventShowModalOpen}
      />
    </div>
  );
};

export default EventsTable;
