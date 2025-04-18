import { CommonResponse } from "../models/common.model";
import postCategoriesModel from "../models/post-categories,model";

export default class CategoryController {
  constructor() {}
  commonResponse = new CommonResponse();

  // Create Category.
  createCategory = async (req, res) => {
    try {
      const { category_name } = req.body;
      const categoryId = await postCategoriesModel.create({
        category_name,
      });

      this.commonResponse.status = 200;
      this.commonResponse.success = true;
      this.commonResponse.message = "Category created successfully.";
      this.commonResponse.data = categoryId._id;
    } catch (error) {
      this.commonResponse.status = 400;
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.success = false;
      return;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  };

  // Get Category.
  getCategory = async (req, res) => {
    try {
      // const categoryList = await postCategoriesModel.find({});
      const categoryList = await postCategoriesModel.aggregate([
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "category_id",
            as: "posts",
          },
        },
        {
          $addFields: {
            postCount: { $size: "$posts" },
          },
        },
      ]);
      this.commonResponse.status = 200;
      this.commonResponse.success = true;
      this.commonResponse.message = "Success";
      this.commonResponse.data = categoryList;
    } catch (error) {
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.success = false;
      this.commonResponse.status = 400;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  };

  // Update Category.
  updateCategory = async (req, res) => {
    try {
      const { category_id } = req.params;
      const { category_name } = req.body;
      const updateCategory = await postCategoriesModel.findByIdAndUpdate(
        { _id: category_id },
        { category_name }
      );
      this.commonResponse.status = 200;
      this.commonResponse.success = true;
      this.commonResponse.message = "Category update successfully.";
      this.commonResponse.data = [];
    } catch (error) {
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.success = false;
      this.commonResponse.status = 400;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  };

  // Delete Category.
  deleteCategory = async (req, res) => {
    try {
      const { category_id } = req.params;
      const deleteCategory = await postCategoriesModel.findByIdAndDelete({
        _id: category_id,
      });

      if (!deleteCategory) {
        throw new Error("Category doesn't exist");
      }
      this.commonResponse.status = 200;
      this.commonResponse.success = true;
      this.commonResponse.message = "Delete category successfully.";
      this.commonResponse.data = [];
    } catch (error) {
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.success = false;
      this.commonResponse.status = 400;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  };
}
