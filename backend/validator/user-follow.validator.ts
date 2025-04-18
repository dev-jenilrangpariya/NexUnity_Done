import Joi from "joi";
import { UserFollow } from "../models/user-follow.model";

export const userFollowRequestValidator = Joi.object<UserFollow>({
    toUserId : Joi.string().required(),
    fromUserId : Joi.string().required(),
    isActive : Joi.boolean().optional(),
})
