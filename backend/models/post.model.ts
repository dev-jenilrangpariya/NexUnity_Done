import mongoose, { ObjectId } from "mongoose";
import { PostType } from "./common.model";
import { string } from "joi";

export class Post {
    _id: ObjectId;
    createUserId: String;
    content: string;
    image: String;
    category_id: String;
    post_type: PostType;
    communityId:String;
}

const postSchema = new mongoose.Schema<Post>({
    createUserId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    category_id: {
        type: mongoose.Types.ObjectId,
        ref: 'post-categories',
        required: true
    },
    content: {
        type: String
    },
    post_type: {
        type: Number,
        enum: PostType,
        required: true
    },
    image: {
        type: String
    },
    communityId: {
        type: mongoose.Types.ObjectId,
        ref: 'community'
    },
}, { timestamps: true })

export default mongoose.model('posts', postSchema);