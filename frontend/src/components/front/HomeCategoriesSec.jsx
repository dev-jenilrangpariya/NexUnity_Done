import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { CATEGORY_API_URL } from "../../security/axios.js";
import useAxiosPrivate from "../../security/useAxiosPrivate.js";
import DataLoadingCompo from "../common/DataLoadingCompo.jsx";

const HomeCategoriesSec = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryKey = useMemo(() => ["categories"], []);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const paramCategory = queryParams.get("category");

  console.log("param Category:", paramCategory);

  // get api
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery(
    queryKey,
    async () => {
      const response = await axiosPrivate.get(CATEGORY_API_URL.get);
      return response.data.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  const matchingCategory = categories?.find(
    (category) => paramCategory === category.category_name
  );

  const nonMatchingCategories = categories?.filter(
    (category) => paramCategory !== category.category_name
  );

  const orderedCategories = matchingCategory
    ? [matchingCategory, ...nonMatchingCategories]
    : nonMatchingCategories;

  console.log("all category >> ", categories);

  if (isError) {
    return <DataLoadingCompo />;
  }

  return (
    <>
      {isLoading && <DataLoadingCompo />}
      <div className="w-full pt-5 xxl:pt-10 text-textPrimary ">
        <ul className="w-full flex justify-start gap-x-3 overflow-x-auto post-scroll">
          <li
            className={`cursor-pointer border  rounded-lg py-3 px-5 h-full w-full flex justify-center items-center text-center group/item 
              ${
                paramCategory === null
                  ? "border-blueMain bg-blueMain text-white"
                  : "border-textPrimary bg-backgroundv1 text-textPrimary"
              }
              `}
            onClick={() => navigate(`/`)}
          >
            <div className="w-full h-full text-center">
              <h2 className="font-500 text-18"> All </h2>
            </div>
          </li>
          {categories
            ?.map((category, index) => (
              <li
                className={`cursor-pointer border  rounded-lg py-3 px-5 h-full w-full flex justify-center items-center text-center group/item 
              ${
                paramCategory !== null &&
                paramCategory === category.category_name
                  ? "border-blueMain bg-blueMain text-white"
                  : "border-textPrimary bg-backgroundv1 text-textPrimary"
              }
              `}
                key={index}
                onClick={() => navigate(`?category=${category.category_name}`)}
              >
                <div className="w-full h-full text-center">
                  <h2 className="font-500 text-18">{category.category_name}</h2>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default HomeCategoriesSec;
