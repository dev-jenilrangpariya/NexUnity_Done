import React, { useEffect } from "react";
import roket from "../../assets/images/rocket-go-to-top.svg";

const GoToTop = () => {
  let yscroll = window.scrollY;
  let screenH = window.screen.height;

  useEffect(() => {
    const handleScroll = () => {
      yscroll = window.scrollY;
      screenH = window.screen.height;
      const goToTop = document.getElementsByClassName("goToTop");
      if (yscroll > screenH) {
        goToTop[0].classList.replace("-bottom-16", "bottom-10");
      } else {
        goToTop[0].classList.replace("bottom-10", "-bottom-16");
      }

      // console.log("screenY", screenH);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handleGoTop = () => {

    window.scroll({ behavior: "smooth", top: 0, left: 0 });

    // const goToTop = document.getElementsByClassName("goToTop");
    // goToTop[0].classList.replace("bottom-10", "bottom-28");
    // window.scroll({ behavior: "smooth", top: 0, left: 0 });
    // setTimeout(() => {
    //   goToTop[0].classList.replace( "bottom-28","bottom-10");
    // }, 2000);

    const hoverImg = document.getElementsByClassName("hoverImg");
    hoverImg[0].classList.replace("top-[110%]", "-top-20");
    window.scroll({ behavior: "smooth", top: 0, left: 0 });
    setTimeout(() => {
      window.scroll({ behavior: "smooth", top: 0, left: 0 });
      hoverImg[0].classList.replace( "-top-20","top-[110%]");
    }, 1000);
  };


  
  return (
    <>
      <div
        onClick={handleGoTop}
        className="goToTop cursor-pointer fixed animate-bounce transition-all duration-300 ease-linear -bottom-16 end-8 h-[30px] w-[30px] z-50"
      >
        <div className="absolute -z-10 -end-1 flex justify-center items-center w-[40px] h-[40px] animate-ping border bg-green-500 rounded-full">
          <div className="flex justify-center items-center w-[20px] h-[20px] animate-ping border bg-green-600 rounded-full">
          </div>
        </div>
        <img
          src={roket}
          alt="roket"
          className=" object-cover hover:scale-150 transition-all duration-300 ease-linear z-50"
        />
      </div>
      <div className="hoverImg cursor-pointer fixed animate-bounce transition-all duration-1000 ease-linear top-[110%] end-8 h-[20px] w-[20px] z-50">
        <img
          src={roket}
          alt="roket"
          className=" object-cover transition-all duration-300 ease-linear z-50"
        />
      </div> 
    </>
  );
};

export default GoToTop;
