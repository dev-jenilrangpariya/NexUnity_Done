import React from "react";
import { Link } from "react-router-dom";
import image from "../../assets/images/frontHero/home header3.jpg";

const CommunityCard = ({ data }) => {
  return (
    <div className="w-full hover:scale-[0.98] group/card rounded-xl border-2 border-backgroundv3 cursor-pointer shadow h-[250px] bg-backgroundv1 hover:bg-backgroundv2 overflow-hidden transition-all duration-300 ease-linear">
      <div className="h-[80px]  w-full bg-blueMain/60 group-hover/card:bg-blueMain  transition-all duration-300 ease-linear"></div>
      <div className="w-full flex justify-center items-center">
        <div className="w-[80px] h-[80px] group-hover/card:scale-105 transition-all duration-300 ease-linear  border-4 border-backgroundv1 -mt-[40px] rounded-full overflow-hidden">
          <img
            src={image}
            alt="image"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src =
                "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
            }}
          />
        </div>
      </div>
      <div className="w-full text-center h-[80px] flex flex-col gap-1 overflow-hidden px-2">
        <h2 className="font-500 text-18 flex-shrink-0">{data.name}</h2>
        <div className="flex-grow h-full w-full overflow-hidden">
          <h4 className="text-12 text-textGray w-full h-full ">
            {data.description}
          </h4>
        </div>
      </div>
      <div className="w-full h-[50px] flex flex-col justify-center items-center bg-backgroundv2 group-hover/card:bg-blueMain transition-all duration-300 ease-linear">
        <Link className="text-blueMain group-hover/card:text-white transition-all duration-300 ease-linear">
          Join
        </Link>
      </div>
    </div>
  );
};

export default CommunityCard;
