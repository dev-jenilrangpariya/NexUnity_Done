import React, { useEffect } from "react";
import hero4Man from "../../assets/images/frontHero/angelica_Hot_Artist_3.2.png";
import hero1Man from "../../assets/images/frontHero/hero-tomasz-Hot-Artist.png";
import BlueLine from "../../assets/images/frontHero/home loader blue line.svg";
import LightBlueLine from "../../assets/images/frontHero/home loader light blue line.svg";
import OrangeLine from "../../assets/images/frontHero/home loader orange line.svg";
import hero2Man from "../../assets/images/frontHero/home-hero-anna.jpg";
import hero3Man from "../../assets/images/frontHero/home-robert-Hot-Artist.png";

const HeroSectionCompo = () => {
  let yscroll = window.scrollY;
  useEffect(() => {
    const handleScroll = () => {
      yscroll = window.scrollY;
      const text_container = document.getElementsByClassName("text_container");
      const pic = document.getElementsByClassName("pic");
      if (yscroll > 10) {
        text_container[0].classList.add("animate-ping");
        text_container[0].classList.replace("z-40", "-z-10");
        for (let i = 0; i < pic.length; i++) {
          // pic[i].classList.add("animate-ping");
          // pic[i].classList.add("animate-ping");
        }
        setTimeout(() => {
          for (let i = 0; i < pic.length; i++) {
            // pic[i].classList.remove("animate-ping");
          }
        }, 1000);
      } else {
        text_container[0].classList.replace("-z-10", "z-40");
        text_container[0].classList.remove("animate-ping");
        for (let i = 0; i < pic.length; i++) {
          // pic[i].classList.remove("animate-ping");
        }
        
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <div className="hero_wrraper bg-gray-300 h-screen w-hull ">
      <div className="relative h-full w-full flex justify-center items-center">
        <div className="text_container z-40 w-3/4 max-w-lg flex flex-col gap-5 items-center justify-center text-center transition-all duration-700 ease-linear">
          <h1 className="text-26 xsm:text-32 md:text-44  text-textPrimary ">
            {/* Find your work and your people */}
            Become a member of the best community Platform
          </h1>
          {/* <p className='text-sm md:text-base text-gray-500'>Become a member of the best community and and work global company.</p> */}
        </div>

        <div className="absolute start-1/2 top-0 light_blue_line_wrapper overflow-hidden">
          <img
            src={LightBlueLine}
            alt="light blue line"
            className="object-cover"
          />
        </div>
        <div className="absolute bottom-0 end-0 blue_line_wrapper overflow-hidden">
          <img src={BlueLine} alt="blue line" className="object-cover" />
        </div>
        <div className="absolute start-0 bottom-50 lg:bottom-0 orange_line_wrapper overflow-hidden">
          <img src={OrangeLine} alt="orange line" className="object-cover" />
        </div>

        <div className="absolute bottom-56 start-0 z-20">
          <div className="pic w-32 h-40 overflow-hidden transition-all duration-300 ease-linear">
            <img
              src={hero1Man}
              alt="top1"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        <div className="absolute bottom-40 end-64 z-20">
          <div className="pic w-32 h-40 overflow-hidden transition-all duration-300 ease-linear">
            <img
              src={hero1Man}
              alt="top1"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        <div className="absolute top-0 end-32 z-20">
          <div className="pic w-32 h-40 overflow-hidden transition-all duration-300 ease-linear">
            <img
              src={hero2Man}
              alt="top1"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        <div className="absolute bottom-0 end-5 z-20">
          <div className="pic w-32 h-40 overflow-hidden transition-all duration-300 ease-linear">
            <img
              src={hero3Man}
              alt="top1"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        <div className="absolute top-14 start-64 z-20">
          <div className="pic w-32 h-40 overflow-hidden transition-all duration-300 ease-linear">
            <img
              src={hero3Man}
              alt="top1"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        <div className="absolute bottom-0  start-60 z-20">
          <div className="pic w-32 h-40 overflow-hidden transition-all duration-300 ease-linear">
            <img
              src={hero4Man}
              alt="top1"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionCompo;
