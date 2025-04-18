import mongoose, { ObjectId } from "mongoose";
import { Gender, Role } from "./common.model.js";

export class User {
    _id: ObjectId;
    userId: string;
    first_name: String;
    middle_name: String;
    surname: String;
    gender: Gender;
    email: String;
    password: String;
    profile_pic: String;
    token: String;
    role: Role;
    isPrivate: boolean;
    active: Boolean;
    isRoot: Boolean;
}
export class UserLogin {
    email: String;
    password: String;
}

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
            trim: true
        },
        middle_name: {
            type: String,
            required: true,
            trim: true
        },
        surname: {
            type: String,
            required: true,
            trim: true
        },
        gender: {
            type: Number,
            default: Gender.MALE
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        profile_pic: {
            type: String
        },
        isPrivate: {
            type: Boolean,
            required: true
        },
        role: {
            type: Number,
            default: Role.USER
        },
        isRoot: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.model("users", userSchema);