import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { CategoriesTable } from "../../components/dash/CategoriesTable";
import AddCategoryModal from "../../components/dash/modal/AddCategoryModal";
import { Button } from "../../components/ui/Button";

const DashCategoriesPage = () => {
  const [addCategoryModalOpen, setaddCategoryModalOpen] = useState(false)
  return (
    <div className="dash h-full min-h-screen w-full bg-backgroundv2 transition-all duration-200 ease-in-out p-8 container">
      <div className="flex justify-between items-center w-full">
        <div>
          <h3 className="text-28 lg:text-32 text-textPrimary">Categories</h3>
          <h5 className="text-12 lg:text-16 text-textGray">Add ,Edit Or Delete a Category</h5>
        </div>
        <div>
          <Button variant={"blueV1"} className={"px-5 h-11 flex justify-center items-center gap-3 rounded"} onClick={()=>setaddCategoryModalOpen(true)}>Add <PlusIcon className="h-6 w-6"/></Button>
        </div>
      </div>
      <div className="py-5 lg:py-8">
        <CategoriesTable />
      </div>
      <AddCategoryModal addCategoryModalOpen={addCategoryModalOpen} setaddCategoryModalOpen={setaddCategoryModalOpen}/>
    </div>
  );
};

export default DashCategoriesPage;
