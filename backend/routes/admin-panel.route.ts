import express from "express";
import { requireSignIn } from "../middleware/auth.middleware";
import { validateMiddleware } from "../middleware/validator.middleware";
import AdminPanelController from "../controller/admin-panel.controller";
import { isAdmin } from "../validator/admin-validator";

const router = express.Router()

const adminPanelController = new AdminPanelController();

router.get("/get-all-counts",requireSignIn,isAdmin,adminPanelController.getAllAdminPanelData)

export default router;