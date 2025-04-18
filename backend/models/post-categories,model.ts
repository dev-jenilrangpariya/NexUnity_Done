import mongoose, { ObjectId } from "mongoose";

export class Categories {
    _id: ObjectId;
    category_name: String;
}

const categoriesSchema = new mongoose.Schema<Categories>({
    category_name: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })

export default mongoose.model('post-categories', categoriesSchema);