import React from "react";
import Icn404 from "../svg/Icn404";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = ({ className }) => {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        `flex h-screen w-screen flex-col justify-center items-center `,
        className
      )}
    >
      <Icn404 />
      <div className="text-center flex flex-col gap-2 pt-5 pb-10">
        <h2 className="text-24 lg:text-28  font-semibold">
          Oops! Why you’re here?
        </h2>
        <h4 className="text-slate-400 hidden md:block">
          We are very sorry for inconvenience. It looks like you’re try to
          access a page that either has been deleted or never existed.
        </h4>
      </div>
      <div className="flex justify-center items-center">
        <Button
          variant={"blueV1"}
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 px-5 rounded w-auto"
        >
          <ArrowLeft className="h-5 w-5" /> Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
