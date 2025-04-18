import mongoose, { ObjectId } from "mongoose";

export class UserFollow{
 
    constructor(){};
    _id : ObjectId;
    toUserId : ObjectId;
    fromUserId : ObjectId;
    isActive : Boolean;

}

const userFollowSchema = new mongoose.Schema<UserFollow>({

    fromUserId : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'users'
    },

    toUserId : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'users'
    },
    
    isActive : {
        type : Boolean,
        required : true,
        default : false
    }

},{timestamps : true})

userFollowSchema.index({ toUserId: 1, fromUserId: 1 }, { unique: true });

export default mongoose.model('user-follow',userFollowSchema);