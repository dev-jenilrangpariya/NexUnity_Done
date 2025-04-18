// Toggler.js

import React, { useState, useEffect, useContext } from "react";
import IcnSun from "../svg/IcnSun";
import IcnMoon from "../svg/IcnMoon";
import { IconButton } from "../ui/IconButton";
import { ThemeContext } from "../../context/ThemeContext";

const ThemeToggler = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <>
      <button
        className="text-black dark:text-white p-2 rounded-full"
        onClick={toggleTheme}
      >
        {isDarkMode ? (
          <IcnSun className="h-[24px] w-[24px] xl:h-[32px] xl:w-[32px]" />
        ) : (
          <IcnMoon className="h-[24px] w-[24px] xl:h-[32px] xl:w-[32px]" />
        )}
      </button>
      {/* <div className="theme_toggle">
        <IconButton className={"flex justify-between items-center rounded-full bg-transparent bg-black dark:bg-white transition-all ease-out  duration-300 overflow-hidden p-0"} variant={"outline"} size={'none'}>
          <button onClick={toggleToDarkMode} className="rounded-full transition-all ease-out duration-300 bg-black px-2 py-2 md:px-3 md:py-2 m-0">
            <IcnMoon className="h-6 w-6 md:h-7 md:w-7 text-white" />
          </button>
          <button onClick={toggleToLightMode} className="rounded-full transition-all ease-out duration-300 bg-white px-2 py-2 md:px-3 md:py-2 m-0">
            <IcnSun className="h-6 w-6 md:h-7 md:w-7 text-black" />
          </button>
        </IconButton>
      </div> */}
    </>
  );
};

export default ThemeToggler;
