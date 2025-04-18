import mongoose, { ObjectId } from "mongoose";

export class PostTag {
    _id: ObjectId;
    tag_name: String;
}

const postTagSchema = new mongoose.Schema<PostTag>({
    tag_name: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })

export default mongoose.model('post-tags', postTagSchema);