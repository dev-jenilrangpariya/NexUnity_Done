import Joi from "joi";
import { Community } from "../models/community.model";

export const communityValidation = Joi.object<Community>({
    name: Joi.string().min(3).required()
        .error(new Error('Name must be at least 3 characters long and contain only alphabetic characters')),
    description: Joi.string().required(),
    createUserId: Joi.string().required(),
    frontImage: Joi.string().allow('').optional(),
    backImage: Joi.string().allow('').optional(),
    isPublic: Joi.boolean().optional(),
})

export const communityGetCommunityValidation = Joi.object({
    name: Joi.string().required()
})

export const communityUpdateCommunityValidation = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().min(3).required()
        .error(new Error('Name must be at least 3 characters long and contain only alphabetic characters')),
    description: Joi.string().required(),
    frontImage: Joi.string().allow('').optional(),
    backImage: Joi.string().allow('').optional(),
    isPublic: Joi.boolean().required(),
})

export const communityDeleteCommunityValidation = Joi.object({
    id: Joi.string().required(),
})

export const communityJoinParticipantValidation = Joi.object({
    userId: Joi.string().required(),
    communityId: Joi.string().required(),
})