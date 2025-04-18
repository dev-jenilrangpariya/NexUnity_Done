import React, { useState } from "react";
import IcnCloseEye from "../../../svg/IcnCloseEye";
import IcnOpenEye from "../../../svg/IcnOpenEye";
import { Button } from "../../../ui/Button";
import Input from "../../../ui/Input";

const Step1 = ({ step, setstep, isActive }) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    conformPass: "",
  });
  const [IsshowPassword, setIsshowPassword] = useState(false);
  const [IsshowConformPass, setIsshowConformPass] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // if (!user.email || !user.password || !user.conformPass) {
    //   toast.warning("All fields are required");
    // } else if (!user.email.endsWith("gmail.com") || user.email.length < 12) {
    //   toast.error("invalid email address");
    // } else if (user.password !== user.conformPass) {
    //   toast.warning("password should be same");
    // } else {
    setstep(2);
    // }
  };
  return (
    <div className={`${isActive ? "block" : "hidden"} h-full w-full flex flex-col justify-between`}>
      <div className="">
        <div className="form-group">
          <Input
            lable={"Email"}
            type={"text"}
            name={"email"}
            placeholder={"Enter User Name and Email"}
            value={user.email}
            onChange={handleChange}
          />
        </div>
        <div className="relative form-group mt-2">
          <Input
            lable={"Password"}
            type={IsshowPassword ? "text" : "password"}
            name={"password"}
            placeholder={"Enter Password"}
            value={user.password}
            onChange={handleChange}
          />
          <span
            className="absolute top-12 end-3"
            onClick={() => setIsshowPassword(!IsshowPassword)}
          >
            {IsshowPassword ? (
              <IcnCloseEye className="h-5 w-5 text-gray-500" />
            ) : (
              <IcnOpenEye className="h-5 w-5 text-gray-500" />
            )}
          </span>
        </div>
        <div className="relative form-group mt-2">
          <Input
            lable={"Conform Password"}
            type={IsshowConformPass ? "text" : "password"}
            name={"conformPass"}
            placeholder={"Enter Password"}
            value={user.conformPass}
            onChange={handleChange}
          />
          <span
            className="absolute top-12 end-3"
            onClick={() => setIsshowConformPass(!IsshowConformPass)}
          >
            {IsshowConformPass ? (
              <IcnCloseEye className="h-5 w-5 text-gray-500" />
            ) : (
              <IcnOpenEye className="h-5 w-5 text-gray-500" />
            )}
          </span>
        </div>
      </div>
      <div className="">
        <Button variant={"blueV1"} className={"rounded-lg"} onClick={handleSubmit}>
          Verify Now
        </Button>
      </div>
    </div>
  );
};

export default Step1;
