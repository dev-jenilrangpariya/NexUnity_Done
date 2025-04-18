import React, { useMemo } from "react";
import { useQuery } from "react-query";
import DataLoadingCompo from "../../components/common/DataLoadingCompo";
import UserTable from "../../components/dash/UserTable";
import { formatUserFriendlyCount } from "../../lib/userFriendlyCount";
import { AUTH_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";

const Users = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryKey = useMemo(() => ["users"], []);

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery(
    queryKey,
    async () => {
      const response = await axiosPrivate.get(AUTH_API_URL.getAllUser);
      return response.data.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  if (isError || error) {
    return (
      <div className="w-full h-[400px] flex justify-center items-center">
        <DataLoadingCompo />
        <h2 className="text-textPrimary text-center text-26">
          Network Error !!!!
        </h2>
      </div>
    );
  }

  if (isLoading) {
    return <DataLoadingCompo />;
  }

  return (
    <div className="dash h-full min-h-screen w-full bg-backgroundv2 transition-all duration-200 ease-in-out p-8 container">
      <h3 className="text-28 lg:text-32 text-textPrimary">Users</h3>
      {users && (
        <h5 className="text-12 lg:text-16 text-textGray">
          Total {formatUserFriendlyCount(users.length)} Users
        </h5>
      )}

      <div className="py-5 lg:py-8">
        <UserTable />
      </div>
    </div>
  );
};

export default Users;
