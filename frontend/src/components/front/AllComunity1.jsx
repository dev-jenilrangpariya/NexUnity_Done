import { Search } from "lucide-react";
import React, { useState } from "react";
import CommunityPageCard from "./CommunityPageCard";

const AllCommunity1 = ({ communities }) => {
  const [search, setsearch] = useState("");

  const handleSearch = (e) => {
    setsearch(e.target.value);
  };

  console.log("all communities", communities);

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

      <div className="grid grid-cols-1 xsm:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-3 3xl:grid-cols-4 gap-3 lg:gap-5">
        {communities
          ?.slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          ?.filter((item) =>
            search.trim() === ""
              ? item
              : item.name.toLocaleLowerCase().includes(search.trim())
          )
          .map((item, index) => (
            <CommunityPageCard key={index} data={item} />
          ))}
      </div>
    </div>
  );
};

export default AllCommunity1;
