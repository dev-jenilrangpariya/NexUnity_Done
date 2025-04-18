import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { EVENT_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import DataLoadingCompo from "../common/DataLoadingCompo";

const HomeUpcommingEvent = () => {
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

  const currentDate = new Date();

  const upcomingEvents = events?.filter((event) => {
    const eventDate = new Date(event.time);
    return eventDate > currentDate;
  });

  if (isLoading || isError) {
    return <DataLoadingCompo />;
  }

  if (upcomingEvents?.length > 0) {
    return (
      <div className="w-full rounded-xl flex flex-col gap-3 justify-center items-center border-2 border-backgroundv3 bg-backgroundv1 text-textPrimary p-3 xl:p-5">
        <div className="flex justify-between items-center w-full">
          <h2 className="font-500 text-18 xxl:text-20">Upcomming Events</h2>
          <div className="w-[28px] h-[28px] flex justify-center items-center rounded-full bg-backgroundv3 text-12 xl:text-14">
            {upcomingEvents?.length}
          </div>
        </div>
        <hr className="border border-backgroundv3 w-full " />

        <ul className="flex flex-col gap-3 w-[100%] xl:w-[95%]">
          {upcomingEvents?.slice(0, 3)?.map((event, index) => (
            <li key={index} className="flex gap-2 items-center w-full">
              <div className="w-[50px] h-[50px] rounded flex-shrink-0 bg-backgroundv3 flex flex-col justify-center items-center">
                <h3 className="text-14 font-500 ">
                  {new Date(event.time).getDate()}
                </h3>
                <h3 className="text-10 text-textGray capitalize">
                  {new Date(event.time).toLocaleString("default", {
                    month: "short",
                  })}
                </h3>
              </div>
              <div className="flex-grow w-[calc(100%-50px)]">
                <h3 className="text-14 font-500 capitalize truncate">
                  {event.eventName}
                </h3>
                <h3 className="text-10 text-textGray truncate">
                  {event.content}
                </h3>
              </div>
            </li>
          ))}
        </ul>

        <hr className="border border-backgroundv3 w-full " />

        <div className="w-full flex justify-center items-center ">
          <Link className="text-blueMain text-14" to={"/events"}>
            See All
          </Link>
        </div>
      </div>
    );
  }
};

export default HomeUpcommingEvent;
