import mongoose, { ObjectId } from "mongoose";

export class RemoveRequest {
    constructor() { };
    _id: ObjectId;
    userId: ObjectId;
    reasonForDeactivation: string;
}

const RemoveAccountRequestSchema = new mongoose.Schema<RemoveRequest>({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique:true,
        ref: 'users'
    },
    reasonForDeactivation: {
        type: String,
        required: true,
    },
}, { timestamps: true });


export default mongoose.model('remove-account-request', RemoveAccountRequestSchema);