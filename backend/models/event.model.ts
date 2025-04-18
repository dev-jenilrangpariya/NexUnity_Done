import mongoose, { ObjectId } from "mongoose";
import { PostType } from "./common.model";
import { string } from "joi";

export class Event {
    _id: ObjectId;
    createUserId: String;
    eventName: String;
    content: string;
    time: Date;
    location: string;
    eventImage: String;
}

const eventSchema = new mongoose.Schema<Event>({
    createUserId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    eventImage: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default mongoose.model('event', eventSchema);