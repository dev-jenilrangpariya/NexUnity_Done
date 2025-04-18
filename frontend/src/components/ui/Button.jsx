import React from "react";
import { cn } from "../../lib/utils";
import { cva } from "class-variance-authority";

const Buttonvariants = cva(
  "w-full flex items-center justify-center active:scale-[0.96]",
  {
    variants: {
      variant: {
        theme: "bg-[#81D8D0] w-full hover:bg-[#81D88181] text-black rounded-lg",
        black:
          "bg-black w-full text-white hover:bg-black/60 rounded-full border-[1px] border-gray-500",
        blue: "bg-blue-800 w-full text-white hover:bg-blue-500/80 rounded-full",
        blueV1:
          "bg-blueMain w-full text-white border border-blueMain transition-all hover:bg-transparent hover:text-blueMain duration-500 ease-linear",
        blueV2:
          "bg-blue-800 w-full text-white relative overflow-hidden z-10 before:absolute before:start-0 before:h-full before:w-full before:bg-black before:-top-full before:-z-10 hover:before:top-0  before:transition-all before:duration-300 before:ease-linear",
        white: "bg-white text-black hover:bg-black rounded-full",
        outline:
          "bg-transparent border-2 border-black text-black rounded-lg hover:bg-gray-200",
        ghost:
          "relative rounded-lg border border-blue-800 bg-transparent border text-lg text-gray-500 transition-colors before:absolute before:left-0 before:top-0 before:h-full before:w-full before:-z-10 before:origin-top-left before:scale-y-0 before:bg-blue-800 before:transition-transform before:duration-300 before:content-[''] before:rounded-lg hover:text-white before:hover:scale-y-100",
      },
      size: {
        none: "",
        sm: "text-sm py-1 px-2",
        md: "text-lg py-3 px-4",
        lg: "text-2xl py-4 px-6",
      },
    },
    defaultVariants: {
      variant: "theme",
      size: "md",
    },
  }
);

const Button = ({ variant, size, className, onClick, children, ...props }) => {
  return (
    <button
      className={cn(Buttonvariants({ variant, size }), className)}
      {...props}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { Button, Buttonvariants };
