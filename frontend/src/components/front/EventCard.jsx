import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../pages/front/css/EventPage.css";
import EventShowModal from "../dash/modal/comman/EventShowModal";

const EventCard = ({ data }) => {
  const [eventShowModalOpen, seteventShowModalOpen] = useState(false);

  const navigate = useNavigate();
  return (
    <div className="event-card-wrap overflow-hidden">
      <div className="event-card !m-0 !bg-backgroundv1 border border-backgroundv3">
        <img
          src={
            data?.eventImage
              ? `${process.env.REACT_APP_SERVER_IMAGE_PATH}${data.eventImage}`
              : "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=280&dpr=2"
          }
          title=""
          className="event-card-img !h-[150px]"
          onError={(e) => {
            e.target.src =
              "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
          }}
        />
        <div className="event-header w-full flex gap-2">
          <div className="event-date flex-shrink-0 p-2 border border-backgroundv3">
            <span className="event-month">
              {new Date(data.time).toLocaleString("default", {
                month: "short",
              })}
            </span>
            <div className="bg-gray">
              <h4 className="event-day text-20">
                {new Date(data.time).getDate()}
              </h4>
            </div>
          </div>
          <div className="h-full flex flex-col flex-grow truncate justify-center">
            <h3 className="text-textPrimary font-semibold text-24 !truncate">
              {data.eventName}
            </h3>
            <h3 className="text-textGray text-12  !truncate">{data.content}</h3>
            <h3 className="text-textPrimary text-14 font-400 truncate mt-1">
              {data.location}
            </h3>
            <h3 className="text-textPrimary text-16 font-500  mt-2">
              {new Date(data.time).toLocaleString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: false, // 24-hour format
                timeZone: "UTC",
              })}
            </h3>
          </div>
        </div>
        <div className="card-speakers">
          <div className="speaker-circle">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
              alt=""
              data-name="Calvin Graves"
              data-role="CEO"
              onError={(e) => {
                e.target.src =
                  "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
              }}
            />
          </div>

          <div className="speaker-circle">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
              alt="Jane Smith - Product Designer"
              data-name="Jane Smith"
              data-role="Product Designer"
              onError={(e) => {
                e.target.src =
                  "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
              }}
            />
          </div>
          <div className="speaker-circle">
            <p className="speaker-last"> +2 </p>
          </div>

          <div className="speaker-details">
            {/* <!-- <h3 className="speaker-name">Jane Smith</h3>
                <p className="speaker-role">Product Designer</p> --> */}
            <button
              className="!bg-blueMain"
              // onClick={() => navigate(`/events/${data.eventName}`)}
              onClick={() => seteventShowModalOpen(true)}
            >
              {" "}
              view{" "}
            </button>
          </div>
        </div>
      </div>

      <EventShowModal
        eventShow={data}
        eventShowModalOpen={eventShowModalOpen}
        seteventShowModalOpen={seteventShowModalOpen}
      />
    </div>
  );
};

export default EventCard;
