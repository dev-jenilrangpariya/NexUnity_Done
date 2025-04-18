import React, { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { FreeMode } from "swiper/modules";
import AddCommunityModal from "../dash/modal/comman/AddCommunityModal";
import SuccessModal from "../dash/modal/comman/SuccessModal";
import { Button } from "../ui/Button";
import MyCommunityCard1 from "./MyCommunityCard1";

const MyJoinedcommunity = [
  {
    id: 1,
    image: "",
    name: "Lorem ipsum dolor",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
  {
    id: 2,
    image: "",
    name: "Lorem  dolor",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
  {
    id: 3,
    image: "",
    name: " ipsum dolor",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
  {
    id: 4,
    image: "",
    name: "dolor",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
  {
    id: 5,
    image: "",
    name: "Lorem",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
  {
    id: 6,
    image: "",
    name: "Lorem ipsum dolor",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
  {
    id: 7,
    image: "",
    name: "Lorem  dolor",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
  {
    id: 8,
    image: "",
    name: " ipsum dolor",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
];

const UserCreatedCommunity = ({ CommunityCreatedByUser }) => {
  const swiperRef = useRef(null);
  const [addCommunityModalOpen, setaddCommunityModalOpen] = useState(false);
  const [successModalOpen, setsuccessModalOpen] = useState(false);

  const nextslide = () => {
    swiperRef.current?.swiper?.slidePrev();
  };
  const prevslide = () => {
    swiperRef.current?.swiper?.slideNext();
  };

  console.log("user created communities >>> ", CommunityCreatedByUser);

  if (CommunityCreatedByUser.length > 0) {
    return (
      <div className="w-full text-textPrimary component container">
        <div className="mb-5 md:mb-8 rounded-xl gap-5 bg-backgroundv1 border-2 border-backgroundv3 p-5 flex w-full justify-between items-center">
          <h2 className="font-500 text-22  md:text-24 lg:text-28 ">
            My Communites
          </h2>
          <div>
            <Button
              className="group/btn rounded flex justify-center items-center gap-2 px-3 h-10 md:h-12"
              variant={"blueV1"}
              onClick={() => setaddCommunityModalOpen(true)}
            >
              <span>
                <Plus className="h-6 w-6 " />
              </span>
              Add Community
            </Button>
          </div>
        </div>
        <div className="my_community_container my-3 mb-0">
          <Swiper
            ref={swiperRef}
            //   slidesPerView={1}
            //   spaceBetween={20}
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
            className="w-full  h-auto"
          >
            {CommunityCreatedByUser?.slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              ?.map((item, itemIndex) => (
                <SwiperSlide
                  className="community w-full h-auto overflow-hidden"
                  key={itemIndex}
                >
                  {/* <MyCommunityCard data={item} /> */}
                  <MyCommunityCard1 data={item} />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        <div className="see__all relative w-full flex justify-between items-center">
          {/* <Link to={"/"}>
              <Button
                className="group/btn rounded flex justify-center items-center gap-2 md:gap-3 h-10 md:h-12 lg:px-10"
                variant={"blueV1"}
              >
                See All{" "}
                <span>
                  <ArrowRight  className="h-6 w-6 "/>
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
        <AddCommunityModal
          addCommunityModalOpen={addCommunityModalOpen}
          setaddCommunityModalOpen={setaddCommunityModalOpen}
          setsuccessModalOpen={setsuccessModalOpen}
        />
        <SuccessModal
          setsuccessModalOpen={setsuccessModalOpen}
          successModalOpen={successModalOpen}
        />
      </div>
    );
  }
};

export default UserCreatedCommunity;
