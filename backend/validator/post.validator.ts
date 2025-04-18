import Joi from "joi";
import { PostType } from "../models/common.model";
import { Categories } from "../models/post-categories,model";
import { Post } from "../models/post.model";

export const categoryValidation = Joi.object<Categories>({
    category_name: Joi.string().min(4).required(),
})
export const postValidation = Joi.object<Post>({
    createUserId: Joi.string().min(24).required(),
    category_id: Joi.string().min(24).required(),
    communityId: Joi.string().min(24),
    content: Joi.string().required(),
    image: Joi.string(),
    post_type: Joi.number().integer().valid(PostType.USER, PostType.COMMUNITY).required(),
})
export const postLikeValidation = Joi.object({
    postId : Joi.string().required(),
})
export const postCommentAddValidation = Joi.object({
    postId : Joi.string().required(),
    content : Joi.string().required(),
})
export const postCommentDeleteValidation = Joi.object({
    commentId : Joi.string().required()
})
export const postCommentUpdateValidation = Joi.object({
    commentId : Joi.string().required(),
    content : Joi.string().required(),
})