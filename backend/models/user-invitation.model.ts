import mongoose, { ObjectId } from "mongoose";
import { Relation } from "./common.model";

export class UserInvitation {
    _id: ObjectId;
    createUserId: ObjectId;
    relation: Relation;
    token: String;
    receiverEmail: String;
}

const userInvitationSchema = new mongoose.Schema<UserInvitation>({
    token: {
        type: String,
        unique: true,
        require: true,
    }
}, {
    timestamps: true,
    expires: '1d'
});

export default mongoose.model('user-invitation', userInvitationSchema);