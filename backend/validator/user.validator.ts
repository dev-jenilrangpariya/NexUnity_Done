import Joi from "joi";
import { Gender } from "../models/common.model";
import { Otp } from "../models/otp.model";
import { UserInvitation } from "../models/user-invitation.model";
import { User, UserLogin } from "../models/users.model";

// Reusable function to handle password validation errors
const handlePasswordError: any = (errors: any) => {
    errors.forEach((err: any) => {
        switch (err.code) {
            case "any.empty":
                err.message = "Password is required";
                break;
            case "string.min":
                err.message = "Password must be at least 8 characters long";
                break;
            case "string.pattern.base":
                err.message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
                break;
            default:
                break;
        }
    });
    return errors;
};

export const userValidation = Joi.object({
    first_name: Joi.string().min(3).required().regex(/^[a-zA-Z]+$/)
        .error(new Error('First name must be at least 3 characters long and contain only alphabetic characters')),

    middle_name: Joi.string().min(3).required().regex(/^[a-zA-Z]+$/)
        .error(new Error('Middle name must be at least 3 characters long and contain only alphabetic characters')),

    surname: Joi.string().min(3).required().regex(/^[a-zA-Z]+$/)
        .error(new Error('Surname must be at least 3 characters long and contain only alphabetic characters')),

    gender: Joi.number().integer().valid(1, 2).required(), // Assuming 0: Male, 1: Female

    email: Joi.string().email().required(),

    password: Joi.string().min(8).required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/)
        .error(handlePasswordError),

    profile_pic: Joi.string().allow('').optional(),
    token: Joi.string().allow('').optional(),
    isPrivate: Joi.boolean().required(),
    role: Joi.number().integer().valid(0, 1).optional(), // Assuming 0: Regular user, 1: Admin
    isRoot: Joi.boolean().optional(),
    active: Joi.boolean().required()
});
export const updateProfileValidation = Joi.object<User>({
    // userId: Joi.string().required(),

    first_name: Joi.string().min(3).required().regex(/^[a-zA-Z]+$/)
        .error(new Error('First name must be at least 3 characters long and contain only alphabetic characters')),

    middle_name: Joi.string().min(3).required().regex(/^[a-zA-Z]+$/)
        .error(new Error('Middle name must be at least 3 characters long and contain only alphabetic characters')),

    surname: Joi.string().min(3).required().regex(/^[a-zA-Z]+$/)
        .error(new Error('Surname must be at least 3 characters long and contain only alphabetic characters')),

    gender: Joi.number().integer().valid(Gender.MALE, Gender.FEMALE).required(), // Assuming 0: Male, 1: Female, 2: Other
    isPrivate: Joi.boolean().required(),
    profile_pic: Joi.string().allow('').optional(), // Assuming profile pic can be empty
})
export const activeStatusUpdateValidation = Joi.object<User>({
    userId: Joi.string().required()
})
export const forgetPasswordValidation = Joi.object({
    otp: Joi.number().integer().min(0).max(999999).required()
        .error(new Error('OTP must be a 6-digit number')),
    password: Joi.string().min(8).required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/)
        .error(handlePasswordError),
    email: Joi.string().email().required().error(new Error("Enter proper email.")),
})
export const userLoginValidation = Joi.object<UserLogin>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})
export const userInvitationValidation = Joi.object<UserInvitation>({
    // createUserId: Joi.string().required(),
    // familyId: Joi.string().required(),
    relation: Joi.number().required(),
    receiverEmail: Joi.string().email().required(),
})
export const forgetValidation = Joi.object<any>({
    email: Joi.string().required(),
})

export const generateOtpValidation = Joi.object<Otp>({
    email: Joi.string().email().required()
})

export const verifyOtpValidation = Joi.object<Otp>({
    email: Joi.string().required(),
    otp: Joi.number().integer().min(0).max(999999).required()
        .error(new Error('OTP must be a 6-digit number')),
});

export const resetPasswordValidation = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/)
        .error(handlePasswordError),
});

export const removeAccountReuestValidation = Joi.object({
    reasonForDeactivation: Joi.string().required(),
});

