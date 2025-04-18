import mongoose, { ObjectId } from "mongoose";
import { CommunityParticipantRole } from "./common.model";

export class CommunityParticipant{
    constructor(){};
    _id : ObjectId;
    communityId : ObjectId;
    userId : ObjectId;
    role : Number;
}

const communityParticipantSchema = new mongoose.Schema<CommunityParticipant>({
    communityId : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'community'
    },
    userId : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'users'
    },
    role : {
        type : Number,
        required : true,
        default : CommunityParticipantRole.PARTICIPANT
    },
},{timestamps : true});


communityParticipantSchema.index({ userId: 1, communityId: 1 }, { unique: true });

export default mongoose.model('community-participant',communityParticipantSchema);