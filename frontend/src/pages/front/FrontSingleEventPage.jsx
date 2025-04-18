import { MapPin } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DataLoadingCompo from "../../components/common/DataLoadingCompo";
import { selectUserData } from "../../reducers/authSlice";
import { EVENT_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import "./css/SingleEvent.css";

const FrontSingleEventPage = () => {
  const navigate = useNavigate();
  const userData = useSelector(selectUserData);

  const [successModalOpen, setsuccessModalOpen] = useState(false);
  const { eventId } = useParams();
  console.log("event id >> ", eventId);
  const userId = userData._id;
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ["event", eventId], [eventId]);

  //get api
  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery(
    queryKey,
    async () => {
      if (eventId) {
        const response = await axiosPrivate.get(
          EVENT_API_URL.searchEvent.replace("/:id", eventId)
        );
        return response.data.data;
      }
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  if (error || isError || event?.length === 0) {
    return (
      <div className="w-full bg-lightGray h-[500px] !text-textPrimary font-popins ">
        <div className="container w-full h-full flex text-center justify-center items-center">
          <h2 className="text-20 text-textPrimary font-semibold">
            No Event Found
          </h2>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <DataLoadingCompo />;
  }

  // console.log("event >>> ", event);

  if (event) {
    return (
      <div className="container">
        <div className="card-wrapper w-full container min-h-screen ">
          <div className="card">
            {" "}
            <div className="product-imgs">
              <div className="img-display">
                <div className="img-showcase">
                  <img
                    src={`${process.env.REACT_APP_SERVER_IMAGE_PATH}${event[0].eventImage}`}
                    alt="shoe image"
                    onError={(e) => {
                      e.target.src =
                        "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="product-content bg-backgroundv1 text-textPrimary">
              <h2 className="product-title !text-blueMain">
                {event[0].eventName}
              </h2>
              {/* <a href="#" className="product-link">
                visit event
              </a> */}

              <div className="product-price">
                <p className="last-price">
                  Event Date:{" "}
                  <span>{new Date(event[0].time).toLocaleDateString()}</span>
                </p>
                <p className="new-price">
                  Event Time:{" "}
                  <span> {new Date(event[0].time).toLocaleString()} </span>
                </p>
              </div>

              <div className="product-detail">
                <h2>about this event: </h2>
                <p>{event[0].content}</p>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Consequatur, perferendis eius. Dignissimos, labore suscipit.
                  Unde.
                </p>
              </div>

              <div className="purchase-info text-20 flex gap-3">
                <MapPin />
                {event[0].location}
              </div>
              <div className="mt-5 w-full ">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3716.5381529794427!2d72.69061219999999!3d21.329258199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be1caa15f939469%3A0x6feeb1858d8d923e!2sShri%20Siddhnath%20Mahadev%20Temple!5e0!3m2!1sen!2sin!4v1710436075241!5m2!1sen!2sin"
                  allowfullscreen=""
                  className="w-full"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default FrontSingleEventPage;
