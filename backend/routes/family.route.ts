import express from "express";
import FamilyController from "../controller/family.controller";
import { requireSignIn } from "../middleware/auth.middleware";
import { validateMiddleware } from "../middleware/validator.middleware";
import { userInvitationValidation } from "../validator/user.validator";
const router = express.Router()

const familyController = new FamilyController();

router.post("/user-invitation", requireSignIn, validateMiddleware(userInvitationValidation), familyController.invitationToken);

export default router;

