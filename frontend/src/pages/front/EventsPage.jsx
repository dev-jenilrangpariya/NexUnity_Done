import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import DataLoadingCompo from "../../components/common/DataLoadingCompo";
import PastEventSlider from "../../components/front/PastEventSlider";
import TodayEventSlider from "../../components/front/TodayEventSlider";
import UpcommingEventSlider from "../../components/front/UpcommingEventSlider";
import { EVENT_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import "./css/EventPage.css";

const EventsPage = () => {


  const [loading, setloading] = useState(false)
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

  // const todayEvents = events?.filter((event) => {
  //   const eventDate = new Date(event.time);
  //   return (
  //     eventDate.getDate() === currentDate.getDate() &&
  //     eventDate.getMonth() === currentDate.getMonth() &&
  //     eventDate.getFullYear() === currentDate.getFullYear()
  //   );
  // });

  // const upcomingEvents = events?.filter((event) => {
  //   const eventDate = new Date(event.time);
  //   return eventDate > currentDate;
  // });

  // const pastEvents = events?.filter((event) => {
  //   const eventDate = new Date(event.time);
  //   return eventDate < currentDate;
  // });
  const todayEvents = [];
  const upcomingEvents = [];
  const pastEvents = [];
  
  const now = new Date(); // Current date and time
  
  events?.forEach(event => {
    const eventDate = new Date(event.time);
    // Remove time component for comparison
    const eventDateWithoutTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const currentDateWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
    if (eventDateWithoutTime.getTime() === currentDateWithoutTime.getTime()) {
      todayEvents.push(event);
    } else if (eventDateWithoutTime > currentDateWithoutTime) {
      upcomingEvents.push(event);
    } else {
      pastEvents.push(event);
    }
  });


  if(isError){
    return <DataLoadingCompo/>
  }

  // console.log("events >>> ",events)
  // console.log("today events >>> ",todayEvents)
  // console.log("upcoming events >>> ",upcomingEvents)
  // console.log("past events >>> ",pastEvents)
  return (
    <>
     {(isLoading) && <DataLoadingCompo/>}
      <TodayEventSlider todayEvents={todayEvents}/>
      <UpcommingEventSlider upcomingEvents={upcomingEvents}/>
      <PastEventSlider  pastEvents={pastEvents}/>
    </>
  );
};

export default EventsPage;
