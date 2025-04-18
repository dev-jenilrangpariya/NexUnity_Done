import Joi from "joi";
import { Job } from "../models/job.model";


export const jobValidation = Joi.object<Job>({
    companyName: Joi.string().required()
        .error(new Error('Company name is required.')).min(3),
    content: Joi.string().required(),
    title: Joi.string().required(),
    jobImage: Joi.string().optional(),
})

export const jobUpdateValidation = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    companyName: Joi.string().required()
        .error(new Error('Company name is required.')).min(3),
    content: Joi.string().required(),
    jobImage: Joi.string().allow('').optional(),
})
export const jobApplicantValidation = Joi.object({
    id: Joi.string().required(),
    fullName: Joi.string().min(6).required()
    .error(new Error('Enter Full Name.')).trim(),
    experience: Joi.number().required().min(0).max(100).error(new Error("Experience must contain number of years of experience. If fresher then enter 0.")),
    description: Joi.string().required().min(50).trim()
    .error(new Error("Description must be of minimum 50 words.")),
    email : Joi.string().email().required(),
})