import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { COMMUNITY_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import DataLoadingCompo from "../common/DataLoadingCompo";
import { Button } from "../ui/Button";
import CommunityCard from "./CommunityCard";

const allCommunity = [
  {
    id: 1,
    image: "",
    name: "Lorem ipsum dolor",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
  {
    id: 2,
    image: "",
    name: "Lorem  dolor",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
  {
    id: 3,
    image: "",
    name: " ipsum dolor",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
  {
    id: 4,
    image: "",
    name: "dolor",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
  {
    id: 5,
    image: "",
    name: "Lorem",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
  {
    id: 6,
    image: "",
    name: "Lorem ipsum dolor",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
  {
    id: 7,
    image: "",
    name: "Lorem  dolor",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
  {
    id: 8,
    image: "",
    name: " ipsum dolor",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    members: "123",
  },
];

const AllCommunity = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryKey = useMemo(() => ["communities"], []);

  const {
    data: communities,
    isLoading,
    isError,
    error,
  } = useQuery(
    queryKey,
    async () => {
      const response = await axiosPrivate.get(COMMUNITY_API_URL.getAll);
      return response.data.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  const [search, setsearch] = useState("");
  const [page, setpage] = useState(1);
  const [totalPages, settotalPages] = useState(
    Math.ceil(allCommunity.length / 6)
  );
  const indexOfLastItem = page * 6;
  const indexOfFirstItem = indexOfLastItem - 6;

  const handleSearch = (e) => {
    setsearch(e.target.value);
  };

  useEffect(() => {
    if (search.trim() === "") {
      settotalPages(Math.ceil(allCommunity.length / 6));
    } else {
      settotalPages(
        Math.ceil(
          allCommunity.filter((item) =>
            item.name.toLocaleLowerCase().includes(search.trim())
          ).length / 6
        )
      );
    }
  }, [search, setsearch]);

  console.log("all communities", communities);
  if (isError) {
    toast.error(error.message);
  }

  if (isLoading) {
    return <DataLoadingCompo/>
  }

  return (
    <div className="w-full container component text-textPrimary">
      <div className="flex justify-between items-start mb-5 md:mb-8 rounded-xl gap-5 bg-backgroundv1 border-2 border-backgroundv3 p-5">
        <h2 className="font-500 text-22 flex-shrink-0 md:text-24 lg:text-28 ">
          Communites
        </h2>
        <div className="flex-grow p-1 relative">
          <input
            type="text"
            name="search"
            id=""
            className="bg-backgroundv3 focus:outline-none border border-textGray/40 text-textGray h-10 w-full rounded-full px-5 text-12"
            placeholder="search community here . . . "
            value={search}
            onChange={handleSearch}
          />
          <div className="absolute end-5 top-3">
            <Search className="h-5 w-5 text-textGray" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xxl:grid-cols-4 3xl:grid-cols-5 gap-5">
        {allCommunity
          ?.filter((item) =>
            search.trim() === ""
              ? item
              : item.name.toLocaleLowerCase().includes(search.trim())
          )
          .slice(indexOfFirstItem, indexOfLastItem)
          .map((item, index) => (
            <CommunityCard key={index} data={item} />
          ))}
      </div>

      <div className="pagination w-full mt-5 flex justify-between">
        <div>
          <Button
            variant={"outline"}
            className={`gap-3 text-textPrimary border transition-all duration-300 ease-linear h-10 ${
              page === 1
                ? "text-textGray hover:bg-transparent active:scale-1 border-textGray"
                : "bg-backgroundv1 hover:bg-backgroundv3  border-textPrimary "
            }`}
            onClick={() => page != 1 && setpage(page - 1)}
          >
            <ArrowLeft className="w-5 h-5" /> Privious
          </Button>
        </div>
        <div className="flex justify-center items-center gap-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              onClick={() => setpage(i + 1)}
              variant={"outline"}
              className={`text-textGray  ${
                page === i + 1
                  ? "bg-blueMain text-white hover:bg-blueMain "
                  : "hover:bg-backgroundv3 hover:text-textGray"
              } border-none h-10 transition-all duration-300 ease-linear`}
            >
              {i + 1}
            </Button>
          ))}
        </div>
        <div>
          <Button
            variant={"outline"}
            className={`gap-3 text-textPrimary border transition-all duration-300 ease-linear h-10 ${
              page === totalPages
                ? "text-textGray hover:bg-transparent active:scale-1 border-textGray"
                : "bg-backgroundv1 hover:bg-backgroundv3  border-textPrimary "
            }`}
            onClick={() => page !== totalPages && setpage(page + 1)}
          >
            Next <ArrowRight className="w-5 h-5" />{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AllCommunity;
