import React from "react";
import { cn }from '../../lib/utils'

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "bg-backgroundv3 focus:outline-none border border-textGray/40 text-textGray  text-12 flex h-9 w-full rounded-md  border-input  px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground   disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export default Input ;
