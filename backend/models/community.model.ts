import mongoose, { ObjectId } from "mongoose";

export class Community {
    _id: ObjectId;
    name: String;
    description: String;
    createUserId: String;
    frontImage: String;
    backImage: String;
    isPublic: Boolean;
}

const communitySchema = new mongoose.Schema<Community>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    createUserId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    frontImage: {
        type: String,
        required: true
    },
    backImage: {
        type: String,
        default: null

    },
    isPublic: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

export default mongoose.model('community', communitySchema);