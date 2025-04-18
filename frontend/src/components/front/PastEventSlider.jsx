import React from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import EventCard from "./EventCard";

const PastEventSlider = ({ pastEvents }) => {
  return (
    <div className="w-full text-textPrimary component container">
      <div className="mb-5 md:mb-8 rounded-xl gap-5 bg-backgroundv1 border-2 border-backgroundv3 p-5">
        <h2 className="font-500 text-22  md:text-24 lg:text-28 ">
          Past Events
        </h2>
        <h4 className="text-textGray text-18 md:text-20 lg:text-24">
          Hover over a speaker's image
        </h4>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 3xl:grid-cols-4  gap-5">
        {pastEvents?.map((item, itemIndex) => (
          <EventCard data={item} key={itemIndex} />
        ))}
      </div>
    </div>
  );
};

export default PastEventSlider;
