import Joi from "joi";
import { Event } from "../models/event.model";


export const eventValidation = Joi.object<Event>({
    createUserId: Joi.string().min(24).required(),
    eventName: Joi.string().min(3).required()
        .error(new Error('Name must be at least 3 characters long and contain only alphabetic characters')),
    content: Joi.string().required(),
    time: Joi.string().required(),
    location: Joi.string().required(),
    eventImage: Joi.string().optional(),
})

export const eventUpdateValidation = Joi.object({
    id: Joi.string().required(),
    eventName: Joi.string().min(3).required()
        .error(new Error('Name must be at least 3 characters long and contain only alphabetic characters')),
    content: Joi.string().required(),
    time: Joi.string().required(),
    location: Joi.string().required(),
    eventImage: Joi.string().allow('').optional(),
})