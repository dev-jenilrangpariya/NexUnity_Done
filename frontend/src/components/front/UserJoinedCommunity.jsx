import React, { useRef } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { FreeMode } from "swiper/modules";
import { Button } from "../ui/Button";
import JoinedCommunityCard1 from "./JoinedCommunityCard1";



const UserJoinedCommunity = ({userJoinedCommunity}) => {
  

  const swiperRef = useRef(null);

  const nextslide = () => {
    swiperRef.current?.swiper?.slidePrev();
  };
  const prevslide = () => {
    swiperRef.current?.swiper?.slideNext();
  };

  console.log("all user joined communities >>> ", userJoinedCommunity);
  
  if(userJoinedCommunity.length>0)
  {return (
    <div className="w-full container component text-textPrimary">
      <div className="mb-5 md:mb-8 rounded-xl gap-5 bg-backgroundv1 border-2 border-backgroundv3 p-5">
        <h2 className="font-500 text-22  md:text-24 lg:text-28">
          My Joined Communites
        </h2>
      </div>
      <div className="my_community_container mt-3 mb-0">
        <Swiper
          ref={swiperRef}
          // slidesPerView={1}
          // spaceBetween={20}
          freeMode={true}
          breakpoints={{
            1500: {
              slidesPerView: 4,
            },
            1100: {
              slidesPerView: 3,
            },
            550: {
              slidesPerView: 2,
            },
            200: {
              slidesPerView: 1,
            },
          }}
          modules={[FreeMode]}
          className="h-full w-full "
        >
          {userJoinedCommunity
            ?.slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((item, itemIndex) => (
            <SwiperSlide
              className="community w-full h-full overflow-hidden"
              key={itemIndex}
            >
              {/* <JoinedCommunityCard data={item} /> */}
              <JoinedCommunityCard1 data={item.communityDetails[0]} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="see__all relative w-full flex justify-between items-center ">
        {/* <Link to={"/"}>
          <Button
            className="group/btn rounded flex justify-center items-center gap-2 md:gap-3 h-10 md:h-12 lg:px-10"
            variant={"blueV1"}
          >
            See All{" "}
            <span>
              <ArrowRight className="h-6 w-6 " />
            </span>
          </Button>
        </Link> */}
        <div></div>
        <div className=" flex gap-1 md:gap-3">
          <button onClick={nextslide}>
            {" "}
            <Button
              className={`bg-backgroundv3 border border-blueMain text-blueMain rounded-full h-[38px] w-[38px] md:h-[42px] md:w-[42px] p-0 hover:bg-blueMain hover:text-white transition-all duration-300 ease-linear`}
            >
              <ArrowLeft />
            </Button>
          </button>
          <button onClick={prevslide}>
            <Button
              className={`bg-backgroundv3 border border-blueMain text-blueMain rounded-full h-[38px] w-[38px] md:h-[42px] md:w-[42px] p-0  hover:bg-blueMain hover:text-white transition-all duration-300 ease-linear`}
            >
              <ArrowRight />
            </Button>
          </button>
        </div>
      </div>
    </div>
  );}
};

export default UserJoinedCommunity;
