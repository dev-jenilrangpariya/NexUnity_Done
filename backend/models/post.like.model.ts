import mongoose, { ObjectId } from "mongoose";

export class PostLike{
    _id : ObjectId;
    userId : ObjectId;
    postId : ObjectId;
}

const postLikeSchema = new mongoose.Schema<PostLike>({
    userId : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : "Users"
    },
    postId : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : "posts"
    }
},{timestamps : true}
);

export default mongoose.model('post-likes',postLikeSchema);