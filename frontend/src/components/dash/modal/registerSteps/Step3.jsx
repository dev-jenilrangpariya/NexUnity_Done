import React from "react";
import { Button } from "../../../ui/Button";

const Step3 = ({ step, setstep, isActive }) => {
  return (
    <div
      className={`${
        isActive ? "block" : "hidden"
      } h-full w-full flex flex-col justify-between`}
    >
      <div className="family_tree_body">
        <h2>family tree</h2>
      </div>
      <div className="w-full flex gap-3">
        <Button
          variant={"outline"}
          onClick={() => setstep(2)}
        >
          Back
        </Button>
        <Button
          variant={"blueV1"}
          className={"rounded-lg"}
          onClick={() => setstep(1)}
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default Step3;
