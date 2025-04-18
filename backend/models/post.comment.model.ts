import mongoose, { ObjectId } from "mongoose";

export class PostComment{
    _id : ObjectId;
    userId : ObjectId;
    postId : ObjectId;
    content : String;
}

const postCommentSchema = new mongoose.Schema<PostComment>({
    userId : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : "Users"
    },
    postId : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : "posts"
    },
    content : {
        type : String,
        required : true,
    }
},{timestamps : true}
);

export default mongoose.model('post-comments',postCommentSchema);