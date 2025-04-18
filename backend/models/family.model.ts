import { boolean } from "joi";
import mongoose, { ObjectId } from "mongoose";

export class Family {
    _id: ObjectId;
    createUserId: ObjectId | mongoose.Types.ObjectId;
    active: boolean;
}

const familySchema = new mongoose.Schema<Family>({
    createUserId: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
        ref: "users",
    },
    active: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
export default mongoose.model('family', familySchema);