import { Plus } from "lucide-react";
import React, {
  useEffect,
  useMemo,
  useState
} from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { selectUserData } from "../../reducers/authSlice.js";
import { COMMUNITY_API_URL } from "../../security/axios.js";
import useAxiosPrivate from "../../security/useAxiosPrivate.js";
import DataLoadingCompo from "../common/DataLoadingCompo.jsx";
import AddCommunityModal from "../dash/modal/comman/AddCommunityModal.jsx";
import SuccessModal from "../dash/modal/comman/SuccessModal.jsx";
import { Button } from "../ui/Button.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select.jsx";

const UserCommunitySelect = ({ selectCommunity, setselectCommunity }) => {
  const userData = useSelector(selectUserData);
  const userId = userData._id;
  const axiosPrivate = useAxiosPrivate();
  const queryKey = useMemo(() => ["getCommunityCreatedByUser", userId], []);

  const [addCommunityModalOpen, setaddCommunityModalOpen] = useState(false);
  const [successModalOpen, setsuccessModalOpen] = useState(false);

  const {
    data: userCreatedCommunity,
    isLoading,
    isError,
    error,
  } = useQuery(
    queryKey,
    async () => {
      if (userId) {
        const response = await axiosPrivate.get(
          COMMUNITY_API_URL.getCommunityCreatedByUser.replace(":id", userId)
        );
        return response.data.data;
      }
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  console.log("user communities", userCreatedCommunity);
  useEffect(() => {
    userCreatedCommunity?.length > 0 &&
      setselectCommunity(userCreatedCommunity[0]._id);

    userCreatedCommunity?.length > 0 && setaddCommunityModalOpen(false);
  }, [userCreatedCommunity]);

  return (
    <>
      {isLoading && <DataLoadingCompo />}
      {userCreatedCommunity?.length > 0 && (
        <Select
          onValueChange={(e) => setselectCommunity(e)}
          value={
            selectCommunity === ""
              ? userCreatedCommunity[0]?._id
              : selectCommunity
          }
        >
          <SelectTrigger className="w-full !border border-backgroundv3 focus:border focus:border-backgroundv3   text-textGray text-16 bg-backgroundv2 rounded-lg py-3 px-3 h-14 ">
            <div className="flex gap-2 items-center text-textPrimary">
              <h2>User Community : </h2>
              <SelectValue className="capitalize text-textPrimary " />
            </div>
          </SelectTrigger>
          <SelectContent className="text-12 !bg-backgroundv2">
            {userCreatedCommunity?.map((item, index) => (
              <SelectItem
                value={item._id}
                key={index}
                className="capitalize text-textGray hover:border-0 hover:outline-none focus:outline-none focus:border-none hover:bg-lightGray"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {userCreatedCommunity?.length === 0 && (
        <div>
          <Button
            className="group/btn rounded flex justify-center items-center gap-2 px-3 h-10 md:h-12"
            variant={"blueV1"}
            onClick={() => setaddCommunityModalOpen(true)}
          >
            <span>
              <Plus className="h-6 w-6 " />
            </span>
            Add Community
          </Button>
        </div>
      )}

      <AddCommunityModal
        addCommunityModalOpen={addCommunityModalOpen}
        setaddCommunityModalOpen={setaddCommunityModalOpen}
        setsuccessModalOpen={successModalOpen}
      />
      <SuccessModal
        setsuccessModalOpen={setsuccessModalOpen}
        successModalOpen={successModalOpen}
      />
    </>
  );
};

export default UserCommunitySelect;
