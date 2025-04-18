import express from "express";
import CategoryController from "../controller/category.controller";
import { validateMiddleware } from "../middleware/validator.middleware";
import { categoryValidation } from "../validator/post.validator";
const router = express.Router()

const categoryController = new CategoryController();

// Route to create a new category
router.post("/create", validateMiddleware(categoryValidation), categoryController.createCategory);

// Route to get all categories
router.get("/get", categoryController.getCategory);

// Route to update a category by category ID
router.put("/update/:category_id", validateMiddleware(categoryValidation), categoryController.updateCategory);

// Route to delete a category by category ID
router.delete("/delete/:category_id", categoryController.deleteCategory);

export default router;

