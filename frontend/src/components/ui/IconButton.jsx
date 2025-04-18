import React from "react";
import { cn } from "../../lib/utils";
import { cva } from "class-variance-authority";

const IconButtonVariants = cva(
  'rounded-sm flex items-center justify-center flex-shrink-0',
  {
    variants: {
      variant: {
        default: 'dark:bg-dark-600 bg-light border border-transparent',
        outline: 'bg-[transparent] border border-dark-950 dark:border-white'
      },
      size: {
        none:"",
        default: 'w-[40px] h-[40px]',
        54: 'w-[54px] h-[54px]',
        60: 'w-[60px] h-[60px]',
        80: 'md:w-[80px] md:h-[80px] w-[54px] h-[54px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }

  }
)

const IconButton = ({ className, icon, variant, size, children, onClick, ...props }) => {
  return (
    <button className={cn(IconButtonVariants({ variant, size,className }))} onClick={onClick} {...props}>
      {children || icon}
    </button>
  );
};

export { IconButton, IconButtonVariants }
