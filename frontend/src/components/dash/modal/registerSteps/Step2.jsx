import { UserPlus2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../../../ui/Button";

const Step2 = ({ step, setstep, isActive }) => {
  const [profile, setprofile] = useState(null);
  const [previewURL, setpreviewURL] = useState(null);

  console.log("profuile >> ", profile);
  console.log("preview url >> ", previewURL);
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    reader.onloadend(() => {
      setpreviewURL(reader.result);
    });
    setprofile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div
      className={`${
        isActive ? "block" : "hidden"
      } h-full w-full flex flex-col justify-between`}
    >
      <div className="personal_detail_body">
        <div className="form-group w-full flex justify-center items-center">
          <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
            <div
              {...getRootProps()}
              className="h-full w-full rounded-full overflow-hidden"
            >
              <input {...getInputProps()} accept=".jpg, .jpeg, .png, .gif" />
              {isDragActive ? (
                <div className="h-full w-full bg-black/40 border-2 rounded-full overflow-hidden border-black flex justify-center items-center text-black">
                  <UserPlus2 className="h-12 w-12" strokeWidth={1.25} />
                </div>
              ) : previewURL ? (
                <div className="h-full w-full bg-[#F5F5F5] rounded-full  overflow-hidden border-gray-500 flex justify-center items-center text-gray-500">
                  <img
                    src={previewURL}
                    alt="File Preview"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.src =
                        "https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png";
                    }}
                  />
                </div>
              ) : (
                <div className="h-full w-full bg-[#F5F5F5] rounded-full border-1 overflow-hidden border-gray-500 flex justify-center items-center text-gray-500">
                  <UserPlus2 className="h-12 w-12" strokeWidth={1.25} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="form-group">
          <input
            type={"text"}
            name={"firstname"}
            placeholder={"First Name"}
            className="w-full bg-[#F5F5F5] text-black p-3 rounded-lg my-2 outline-none"
          />
        </div>
        <div className="form-group">
          <input
            type={"text"}
            name={"middle_name"}
            placeholder={"Middle Name"}
            className="w-full bg-[#F5F5F5] text-black p-3 rounded-lg my-2 outline-none"
          />
        </div>
        <div className="form-group">
          <input
            type={"text"}
            name={"surname"}
            placeholder={"Surname"}
            className="w-full bg-[#F5F5F5] text-black p-3 rounded-lg my-2 outline-none"
          />
        </div>
      </div>
      <div className="">
        <Button
          variant={"blueV1"}
          className={"rounded-lg"}
          onClick={() => setstep(3)}
        >
          Add Details
        </Button>
      </div>
    </div>
  );
};

export default Step2;
