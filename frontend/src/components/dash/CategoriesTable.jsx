import { Pen, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { CATEGORY_API_URL, POST_API_URL } from "../../security/axios";
import useAxiosPrivate from "../../security/useAxiosPrivate";
import DataLoadingCompo from "../common/DataLoadingCompo";
import Input from "../ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import EditCategoryModal from "./modal/EditCategoryModal";

export function CategoriesTable() {
  let id;
  const [loading, setloading] = useState(true);
  const queryClient = useQueryClient();
  const [search, setsearch] = useState("");
  const [editCategory, seteditCategory] = useState(null);
  const [editCategoryModalOpen, seteditCategoryModalOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const queryKey = useMemo(() => ["categories"], []);

  // get categoies api
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
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


  //delete api
  const { mutateAsync: deleteApi } = useMutation(
    async (deleteId) => {
      return await axiosPrivate.delete(
        CATEGORY_API_URL.delete.replace(":id", deleteId)
      );
    },
    {
      onSuccess: (res) => {
        toast.update(id, {
          render: res.data.message,
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: 2000,
        });
        queryClient.invalidateQueries("categories");
      },
      onError: (error) => {
        toast.dismiss(id);

        // if (error.response) {
        //   toast.update(id, {
        //     render:
        //       error.response.data.message || "An unexpected error occurred",
        //     type: toast.TYPE.ERROR,
        //     isLoading: false,
        //     autoClose: 2000,
        //   });
        //   // toast.error(error.response.data.message || "An error occurred");
        // } else {
        //   toast.update(id, {
        //     render: "An unexpected error occurred",
        //     type: toast.TYPE.ERROR,
        //     isLoading: false,
        //     autoClose: 2000,
        //   });
        // toast.error("An unexpected error occurred");
        // }
      },
    }
  );
  // console.log("All categories >>", categories);
  

  const handleEditCategory = (category) => {
    seteditCategory(category);
    seteditCategoryModalOpen(true);
    console.log("edit >> ", category);
  };
  const handleDeleteCategory = (deleteId) => {
    try {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this !!!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          id = toast.loading("Please wait...");
          await deleteApi(deleteId);
        }
      });
    } catch (error) {
      console.log("error >> ", error);
    }
  };


  if (isLoadingCategories) {
    return <DataLoadingCompo />;
  }

  if (isErrorCategories) {
    return (
      <div className="w-full h-[400px] flex justify-center items-center">
        <DataLoadingCompo />
        <h2 className="text-textPrimary text-center text-26">
          Network Error !!!!
        </h2>
      </div>
    );
  }

  
  return (
    <div className="w-full">
      <div className="rounded-xl w-full  text-textPrimary text-center text-12  shadow bg-backgroundv1 border-2 border-backgroundv3">
        <div className="p-5 xxl:p-8 w-full  flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="w-full">
            <Input
              className="bg-backgroundv2 focus:outline-none border border-backgroundv3 text-textGray h-10 w-full rounded-lg px-5 text-12"
              placeholder="Search ..."
              value={search}
              onChange={(e) => setsearch(e.target.value)}
            />
          </div>
          <div className="gap-5 hidden sm:flex">
            {/* <StatusFilter selectedcategory={status} setselectedcategory={setselectedstatus}/>
                        <CategoryFilter selectedcategory={category} setselectedcategory={setselectedCategory} /> */}
          </div>
        </div>
        <div className=" p-5 xxl:p-8 text-textPrimary text-center text-12 border-t-2 border-backgroundv3">
          <Table className="border-none w-full min-w-[800px]">
            <TableHeader className=" bg-backgroundv2 text-textPrimary !rounded-lg h-16 xl:h-16  border-none ">
              <TableRow className="py-5 border-none">
                <TableHead className="text-start text-14 xl:text-16 w-[100px] truncate">
                  Id
                </TableHead>
                <TableHead className="text-start text-14 xl:text-16">
                  Category Name
                </TableHead>
                <TableHead className="text-center text-14 xl:text-16">
                  Total Post
                </TableHead>
                <TableHead className="text-center text-14 xl:text-16">
                  CreatedAt
                </TableHead>
                <TableHead className="text-center text-14 xl:text-16">
                  Edit
                </TableHead>
                <TableHead className="text-end text-14 xl:text-16">
                  Delete
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories
                ?.filter((item) =>
                  search.trim() === ""
                    ? item
                    : item.category_name
                        .toLocaleLowerCase()
                        .includes(search.trim())
                )
                .map((category, index) => (
                  <TableRow
                    key={index}
                    className="border-y-2 border-backgroundv3 first:border-t-0"
                  >
                    <TableCell className="w-[100px] truncate">
                      {category._id}
                    </TableCell>
                    <TableCell>
                      <div className="text-start text-18 xl:text-20 font-semibold text-blueMain">
                        {category.category_name}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {category.postCount}
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <button
                        className="text-blue-600"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Pen className="h-6 w-6" />
                      </button>
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <button
                        className="text-red-600"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        <Trash2 className="h-6 w-6 " />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <EditCategoryModal
        editCategory={editCategory}
        seteditCategory={seteditCategory}
        editCategoryModalOpen={editCategoryModalOpen}
        seteditCategoryModalOpen={seteditCategoryModalOpen}
      />
    </div>
  );
}
