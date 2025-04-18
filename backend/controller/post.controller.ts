import mongoose, { Types } from "mongoose";
import { removeFile } from "../helper/removeFile.helper";
import { CommonResponse } from "../models/common.model";
import communityModel from "../models/community.model";
import categoriesModel from "../models/post-categories,model";
import postTagModel from "../models/post-tag.model";
import postCommentModel from "../models/post.comment.model";
import postLikeModel from "../models/post.like.model";
import postModel, { Post } from "../models/post.model";
import userFollowModel from "../models/user-follow.model";
import usersModel from "../models/users.model";

export default class PostController {
    constructor() { };
    commonResponse = new CommonResponse();

    // Create Post.
    createPost = async (req, res) => {
        try {
            var postImage = req.file;
            const { category_id, content, createUserId, post_type, communityId }: Post = req.body;
            const userId = req.user._id;
            // if (createUserId != userId) {
            //     throw new Error("User invalid");
            // }

            if (communityId) {
                const community = await communityModel.findOne({ _id: communityId });
                if (!community) {
                    throw new Error("community does not exist")
                }
            }
            if (category_id) {
                const category = await categoriesModel.findOne({ _id: category_id });
                if (!category) {
                    throw new Error("Category does not exist")
                }
            }
            if (!postImage) {
                throw new Error("Something went wrong")
            }
            this.extractAndStoreTags(content).then((message) => {
            })
                .catch((error) => {
                });;
            let categoryId
            if (communityId) {
                categoryId = await postModel.create({
                    category_id,
                    content,
                    createUserId: userId,
                    image: postImage.filename,
                    post_type,
                    communityId
                })
            } else {
                categoryId = await postModel.create({
                    category_id,
                    content,
                    createUserId: userId,
                    image: postImage.filename,
                    post_type,
                })
            }
            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.message = "Post created successfully."
            this.commonResponse.data = categoryId._id;
        } catch (error) {
            const path = process.env.POSTIMAGE + postImage.filename;
            removeFile(path)
                .then((message) => {
                })
                .catch((error) => {
                });
            this.commonResponse.status = 400;
            this.commonResponse.data = [];
            this.commonResponse.message = error.message;
            this.commonResponse.success = false;
            return;
        }
        finally {
            res.status(this.commonResponse.status).send(this.commonResponse);
        }
    }

    // Delete Post.
    deletePost = async (req, res) => {
        try {
            const { post_id } = req.params;
            const deletePost = await postModel.findByIdAndDelete({ _id: post_id });
            if (!deletePost) {
                throw new Error("Post doesn't exist")
            }
            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.message = "Delete post successfully."
            this.commonResponse.data = [];
            const path = process.env.POSTIMAGE + deletePost.image;
            removeFile(path)
                .then((message) => {
                })
                .catch((error) => {
                });
        }
        catch (error) {
            this.commonResponse.data = [];
            this.commonResponse.message = error.message;
            this.commonResponse.success = false;
            this.commonResponse.status = 400;
        }
        finally {
            res.status(this.commonResponse.status).send(this.commonResponse);
        }
    }

    // Get all post.
    getAllPost = async (req, res) => {
        try {

            // const postData = await postModel.find({});
            let categoryId = req.params.categoryId;
            let dataFiltering = null;

            // To get data category-wise
            if (categoryId) {
                let objectIdInstance = new mongoose.Types.ObjectId(categoryId);
                dataFiltering = [
                    {
                        $lookup: {
                            from: 'users', // Name of the User collection
                            localField: 'createUserId', // Field in the Post collection
                            foreignField: '_id', // Field in the User collection
                            as: 'user' // Alias for the joined User document
                        }
                    },
                    {
                        $lookup: {
                            from: "post-likes", // Collection name for PostLike model
                            localField: "_id",
                            foreignField: "postId",
                            as: "likes"
                        }
                    },
                    {
                        $lookup: {
                            from: "post-comments", // Collection name for PostLike model
                            localField: "_id",
                            foreignField: "postId",
                            as: "comments"
                        }
                    },
                    {
                        $addFields: {
                            likeCount: { $size: "$likes" },
                            commentCount: { $size: "$comments" }
                        }
                    },
                    {
                        $project: {
                            likes: 0,
                            comments: 0
                        }
                    },
                    // Adding additional lookup for getting data in category-wise
                    {
                        $lookup: {
                            from: "post-categories",
                            localField: "category_id",
                            foreignField: "_id",
                            as: "category"
                        }
                    },
                    {
                        $match: {
                            'category._id': objectIdInstance
                            // Replace 'your_category_id' with the actual _id value you want to compare
                        }
                    }
                ]
            }
            else {

                dataFiltering = [
                    {
                        $lookup: {
                            from: 'users', // Name of the User collection
                            localField: 'createUserId', // Field in the Post collection
                            foreignField: '_id', // Field in the User collection
                            as: 'user' // Alias for the joined User document
                        }
                    },
                    {
                        $lookup: {
                            from: "post-likes", // Collection name for PostLike model
                            localField: "_id",
                            foreignField: "postId",
                            as: "likes"
                        }
                    },
                    {
                        $lookup: {
                            from: "post-comments", // Collection name for PostLike model
                            localField: "_id",
                            foreignField: "postId",
                            as: "comments"
                        }
                    },
                    {
                        $addFields: {
                            likeCount: { $size: "$likes" },
                            commentCount: { $size: "$comments" }
                        }
                    },
                    {
                        $project: {
                            likes: 0,
                            comments: 0
                        }
                    }
                ]
            }
            const postData = await postModel.aggregate(dataFiltering)
            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.message = postData && postData.length > 0 ? `${postData.length} Post Get` : "Not found any post."
            this.commonResponse.data = postData;
        }
        catch (error) {

            this.commonResponse.data = [];
            this.commonResponse.message = error.message;
            this.commonResponse.success = false;
            this.commonResponse.status = 400;
        }
        finally {
            res.status(this.commonResponse.status).send(this.commonResponse);
        }
    }

    // Get all public post.
    getAllPublicPost = async (req, res) => {
        try {

            let dataFiltering = null;
            let categoryId = req.params.categoryId;
            if (categoryId) {
                let objectIdInstance = new mongoose.Types.ObjectId(categoryId);
                dataFiltering = [
                    {
                        $lookup: {
                            from: 'users', // Name of the User collection
                            localField: 'createUserId', // Field in the Post collection
                            foreignField: '_id', // Field in the User collection
                            as: 'user' // Alias for the joined User document
                        }
                    },
                    {
                        $lookup: {
                            from: "post-likes", // Collection name for PostLike model
                            localField: "_id",
                            foreignField: "postId",
                            as: "likes"
                        }
                    },
                    {
                        $lookup: {
                            from: "post-comments", // Collection name for Postcomments model
                            localField: "_id",
                            foreignField: "postId",
                            as: "comments"
                        }
                    },
                    {
                        $addFields: {
                            likeCount: { $size: "$likes" },
                            commentCount: { $size: "$comments" }
                        }
                    },
                    {
                        $project: {
                            likes: 0,
                            comments: 0
                        }
                    },
                    {
                        $match: {
                            'user.isPrivate': false // Filter posts where the corresponding user's isPrivate is false
                        }
                    },
                    // Adding additional lookup for getting data in category-wise
                    {
                        $lookup: {
                            from: "post-categories",
                            localField: "category_id",
                            foreignField: "_id",
                            as: "category"
                        }
                    },
                    {
                        $match: {
                            'category._id': objectIdInstance
                            // Replace 'your_category_id' with the actual _id value you want to compare
                        }
                    }
                ]
            }
            else {
                dataFiltering = [
                    {
                        $lookup: {
                            from: 'users', // Name of the User collection
                            localField: 'createUserId', // Field in the Post collection
                            foreignField: '_id', // Field in the User collection
                            as: 'user' // Alias for the joined User document
                        }
                    },
                    {
                        $lookup: {
                            from: "post-likes", // Collection name for PostLike model
                            localField: "_id",
                            foreignField: "postId",
                            as: "likes"
                        }
                    },
                    {
                        $lookup: {
                            from: "post-comments", // Collection name for Postcomments model
                            localField: "_id",
                            foreignField: "postId",
                            as: "comments"
                        }
                    },
                    {
                        $addFields: {
                            likeCount: { $size: "$likes" },
                            commentCount: { $size: "$comments" }
                        }
                    },
                    {
                        $project: {
                            likes: 0,
                            comments: 0
                        }
                    },
                    {
                        $match: {
                            'user.isPrivate': false // Filter posts where the corresponding user's isPrivate is false
                        }
                    }
                ]
            }

            const postData = await postModel.aggregate(dataFiltering).exec();
            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.message = postData && postData.length > 0 ? `${postData.length} Post Get` : "Not found any post."
            this.commonResponse.data = postData;
        }
        catch (error) {

            this.commonResponse.data = [];
            this.commonResponse.message = error.message;
            this.commonResponse.success = false;
            this.commonResponse.status = 400;

        }
        finally {
            res.status(this.commonResponse.status).send(this.commonResponse);
        }
    }

    // Get all public and also following post.
    getAllPublicAndFollowingPost = async (req, res) => {
        try {
            const userId = req.user._id;

            const allFollowUsers = await userFollowModel.find({ fromUserId: userId }).select({ toUserId: 1, _id: 0 }).lean();
            const allUsers = await usersModel.find({ isPrivate: false }).select({});

            // Extract the 'toUserId' values and rename the key
            const toUserIds: any = allFollowUsers.map(user => user.toUserId);
            const userIds: any[] = allUsers.map(user => user._id);

            //combined Array
            var userIdNew = Types.ObjectId.createFromHexString(userId);
            const combinedArray: any = Array.from(new Set(toUserIds.concat(userIds, userIdNew)));
            // Use the renamed key in the query to find posts
            // const postData = await postModel.find({ createUserId: { $in: combinedArray } });

            let dataFiltering = null;
            let categoryId = req.params.categoryId;

            if (categoryId) {
                let objectIdInstance = new mongoose.Types.ObjectId(categoryId);
                dataFiltering = [
                    { $match: { createUserId: { $in: combinedArray } } }, // Filter posts
                    {
                        $lookup: {
                            from: 'users', // Name of the User collection
                            localField: 'createUserId', // Field in the Post collection
                            foreignField: '_id', // Field in the User collection
                            as: 'user' // Alias for the joined User document
                        }
                    },
                    {
                        $lookup: { // Perform a left outer join to retrieve post likes
                            from: "post-likes",
                            localField: "_id",
                            foreignField: "postId",
                            as: "likes"
                        }
                    },
                    {
                        $lookup: { // Perform a left outer join to retrieve post comments
                            from: "post-comments",
                            localField: "_id",
                            foreignField: "postId",
                            as: "comments"
                        }
                    },
                    {
                        $addFields: { // Add fields to each document with like and comment counts
                            likeCount: { $size: "$likes" },
                            commentCount: { $size: "$comments" },
                            isLiked: {
                                $cond: {
                                    if: { $in: [userIdNew,"$likes.userId" ] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: { // Exclude likes and comments arrays from the output
                            likes: 0,
                            comments: 0
                        }
                    },
                    // Adding additional lookup for getting data in category-wise
                    {
                        $lookup: {
                            from: "post-categories",
                            localField: "category_id",
                            foreignField: "_id",
                            as: "category"
                        }
                    },
                    {
                        $match: {
                            'category._id': objectIdInstance
                            // Replace 'your_category_id' with the actual _id value you want to compare
                        }
                    }
                ]
            }
            else {
                dataFiltering = [
                    { $match: { createUserId: { $in: combinedArray } } }, // Filter posts
                    {
                        $lookup: {
                            from: 'users', // Name of the User collection
                            localField: 'createUserId', // Field in the Post collection
                            foreignField: '_id', // Field in the User collection
                            as: 'user' // Alias for the joined User document
                        }
                    },
                    {
                        $lookup: { // Perform a left outer join to retrieve post likes
                            from: "post-likes",
                            localField: "_id",
                            foreignField: "postId",
                            as: "likes"
                        }
                    },
                    {
                        $lookup: { // Perform a left outer join to retrieve post comments
                            from: "post-comments",
                            localField: "_id",
                            foreignField: "postId",
                            as: "comments"
                        }
                    },
                    {
                        $addFields: { // Add fields to each document with like and comment counts
                            likeCount: { $size: "$likes" },
                            commentCount: { $size: "$comments" },
                            isLiked: {
                                $cond: {
                                    if: { $in: [userIdNew,"$likes.userId" ] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: { // Exclude likes and comments arrays from the output
                            likes: 0,
                            comments: 0
                        }
                    }
                ]
            }

            const postData = await postModel.aggregate(dataFiltering);

            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.message = postData && postData.length > 0 ? `${postData.length} Post Get` : "Not found any post."
            this.commonResponse.data = postData;
        }
        catch (error) {

            this.commonResponse.data = [];
            this.commonResponse.message = error.message;
            this.commonResponse.success = false;
            this.commonResponse.status = 400;
        }
        finally {
            res.status(this.commonResponse.status).send(this.commonResponse);
        }
    }

    // Get all only personal post.
    getPersonalPost = async (req, res) => {
        try {
            const userId = req.user._id;

            // const postData = await postModel.find({ createUserId: { $in: [userId] } });
            var userIdNew = Types.ObjectId.createFromHexString(userId);

            let categoryId = req.params.categoryId;
            let dataFiltering = null;

            if (categoryId) {
                let objectIdInstance = new mongoose.Types.ObjectId(categoryId);
                dataFiltering = [
                    { $match: { createUserId: userIdNew } }, // Filter posts
                    {
                        $lookup: {
                            from: 'users', // Name of the User collection
                            localField: 'createUserId', // Field in the Post collection
                            foreignField: '_id', // Field in the User collection
                            as: 'user' // Alias for the joined User document
                        }
                    },
                    {
                        $lookup: { // Perform a left outer join to retrieve post likes
                            from: "post-likes",
                            localField: "_id",
                            foreignField: "postId",
                            as: "likes"
                        }
                    },
                    {
                        $lookup: { // Perform a left outer join to retrieve post comments
                            from: "post-comments",
                            localField: "_id",
                            foreignField: "postId",
                            as: "comments"
                        }
                    },
                    {
                        $addFields: { // Add fields to each document with like and comment counts
                            likeCount: { $size: "$likes" },
                            commentCount: { $size: "$comments" },
                            isLiked: {
                                $cond: {
                                    if: { $in: [userIdNew,"$likes.userId" ] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: { // Exclude likes and comments arrays from the output
                            likes: 0,
                            comments: 0
                        }
                    },
                    // Adding additional lookup for getting data in category-wise
                    {
                        $lookup: {
                            from: "post-categories",
                            localField: "category_id",
                            foreignField: "_id",
                            as: "category"
                        }
                    },
                    {
                        $match: {
                            'category._id': objectIdInstance
                            // Replace 'your_category_id' with the actual _id value you want to compare
                        }
                    }
                ]
            }
            else {
                dataFiltering = [
                    { $match: { createUserId: userIdNew } }, // Filter posts
                    {
                        $lookup: {
                            from: 'users', // Name of the User collection
                            localField: 'createUserId', // Field in the Post collection
                            foreignField: '_id', // Field in the User collection
                            as: 'user' // Alias for the joined User document
                        }
                    },
                    {
                        $lookup: { // Perform a left outer join to retrieve post likes
                            from: "post-likes",
                            localField: "_id",
                            foreignField: "postId",
                            as: "likes"
                        }
                    },
                    {
                        $lookup: { // Perform a left outer join to retrieve post comments
                            from: "post-comments",
                            localField: "_id",
                            foreignField: "postId",
                            as: "comments"
                        }
                    },
                    {
                        $addFields: { // Add fields to each document with like and comment counts
                            likeCount: { $size: "$likes" },
                            commentCount: { $size: "$comments" },
                            isLiked: {
                                $cond: {
                                    if: { $in: [userIdNew,"$likes.userId" ] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: { // Exclude likes and comments arrays from the output
                            likes: 0,
                            comments: 0
                        }
                    }
                ]
            }
            const postData = await postModel.aggregate(dataFiltering);

            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.message = postData && postData.length > 0 ? `${postData.length} Post Get` : "Not found any post."
            this.commonResponse.data = postData;
        }
        catch (error) {

            this.commonResponse.data = [];
            this.commonResponse.message = error.message;
            this.commonResponse.success = false;
            this.commonResponse.status = 400;
        }
        finally {
            res.status(this.commonResponse.status).send(this.commonResponse);
        }
    }

    // Unique post tage insert
    extractAndStoreTags = async (inputString: string): Promise<void> => {
        const tagRegex = /#(\w+)/g;
        const tags = inputString.match(tagRegex) || [];
        const insertionPromises = tags.map(async (tag) => {
            const tagWithoutHash = tag.slice(1);
            const findTag = await postTagModel.findOne({ tag_name: { $regex: new RegExp(tagWithoutHash, 'i') } });
            if (!findTag) {
                await postTagModel.create({ tag_name: tag });
            }
        });
        try {
            await Promise.all(insertionPromises);
            return
        } catch (err) {
            return
        }
    };

    postLike = async (req, res) => {
        try {
            const userId = await req.user._id;

            let postExistsId = await postModel.findOne({
                _id: req.body.postId
            });

            if (!postExistsId) {
                throw new Error("Error while liking post, no such post exists.")
            }

            let postLikeId = await postLikeModel.findOne({
                postId: req.body.postId,
                userId: userId
            });

            if (postLikeId) {
                await postLikeId.deleteOne();
            }
            else {

                let newLike = await postLikeModel.create({
                    postId: postExistsId._id,
                    userId: userId
                });

            }

            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.message = "Post reaction sent successfully."
            this.commonResponse.data = [];
        }
        catch (error) {

            this.commonResponse.data = [];
            this.commonResponse.message = error.message;
            this.commonResponse.success = false;
            this.commonResponse.status = 400;
        }
        finally {
            res.status(this.commonResponse.status).send(this.commonResponse);
        }
    }

    // Post comment add.
    postCommentAdd = async (req, res) => {
        try {
            const userId = await req.user._id;

            try {
                let postExistsId = await postModel.findOne({
                    _id: req.body.postId
                });
            }
            catch (error) {
                throw new Error("Error while commenting post, no such post exists.")
            }

            let postCommentId = await postCommentModel.create({
                postId: req.body.postId,
                userId: userId,
                content: req.body.content
            });

            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.message = "Commented on post successfully."
            this.commonResponse.data = [];
        }
        catch (error) {

            this.commonResponse.data = [];
            this.commonResponse.message = error.message;
            this.commonResponse.success = false;
            this.commonResponse.status = 400;
        }
        finally {
            res.status(this.commonResponse.status).send(this.commonResponse);
        }
    }

    // Post Delete comment.
    postCommentDelete = async (req, res) => {
        try {
            const userId = await req.user._id;

            let postCommentExistsId = await postCommentModel.findOne({
                _id: req.body.commentId
            });

            if (!postCommentExistsId) {
                throw new Error("Error while deleting comment, no such post exists.")
            }

            if (!postCommentExistsId.userId.toString() == userId) {
                throw new Error("Error while deleting comment, user have no right to delete.")
            }

            let deleteCommentPost = await postCommentExistsId.deleteOne();

            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.message = "Commented deleted successfully."
            this.commonResponse.data = [];
        }
        catch (error) {

            this.commonResponse.data = [];
            this.commonResponse.message = error.message;
            this.commonResponse.success = false;
            this.commonResponse.status = 400;
        }
        finally {
            res.status(this.commonResponse.status).send(this.commonResponse);
        }
    }

    // Post Update comment.
    postCommentUpdate = async (req, res) => {
        try {
            const userId = await req.user._id;

            let postCommentExistsId = await postCommentModel.findOne({
                _id: req.body.commentId
            });

            if (!postCommentExistsId) {
                throw new Error("Error while updating comment, no such post exists.")
            }

            if (!postCommentExistsId.userId.toString() == userId) {
                throw new Error("Error while updating comment, user have no right to delete.")
            }

            let updateCommentPost = await postCommentExistsId.updateOne({
                content: req.body.content
            });

            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.message = "Commented updated successfully."
            this.commonResponse.data = [];
        }
        catch (error) {

            this.commonResponse.data = [];
            this.commonResponse.message = error.message;
            this.commonResponse.success = false;
            this.commonResponse.status = 400;
        }
        finally {
            res.status(this.commonResponse.status).send(this.commonResponse);
        }
    }

    // Delete Post.
    getLikePostIdWise = async (req, res) => {
        try {
            const { post_id } = req.params;
            const deletePost = await postModel.findOne({ _id: post_id });
            if (!deletePost) {
                throw new Error("Post doesn't exist")
            }
            var post_idNew = Types.ObjectId.createFromHexString(post_id);

            // const likeData = await postLikeModel.find({ postId: post_id });
            const likeData = await postLikeModel.aggregate(
                [{
                    $match: { postId: post_idNew }
                }, {
                    $lookup: {
                        from: 'users', // Name of the User collection
                        localField: 'userId', // Field in the Post collection
                        foreignField: '_id', // Field in the User collection
                        as: 'user' // Alias for the joined User document
                    }
                }]);

            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.message = likeData && likeData.length > 0 ? `${likeData.length} Like Get` : "Not found any likes."
            this.commonResponse.data = likeData;
        }
        catch (error) {
            this.commonResponse.data = [];
            this.commonResponse.message = error.message;
            this.commonResponse.success = false;
            this.commonResponse.status = 400;
        }
        finally {
            res.status(this.commonResponse.status).send(this.commonResponse);
        }
    }
    getCommentPostIdWise = async (req, res) => {
        try {
            const { post_id } = req.params;
            const deletePost = await postModel.findOne({ _id: post_id });
            if (!deletePost) {
                throw new Error("Post doesn't exist")
            }
            var post_idNew = Types.ObjectId.createFromHexString(post_id);

            // const likeData = await postLikeModel.find({ postId: post_id });
            const likeData = await postCommentModel.aggregate(
                [{
                    $match: { postId: post_idNew }
                }, {
                    $lookup: {
                        from: 'users', // Name of the User collection
                        localField: 'userId', // Field in the Post collection
                        foreignField: '_id', // Field in the User collection
                        as: 'user' // Alias for the joined User document
                    }
                }]);

            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.message = likeData && likeData.length > 0 ? `${likeData.length} Comment Get` : "Not found any Comments."
            this.commonResponse.data = likeData;
        }
        catch (error) {
            this.commonResponse.data = [];
            this.commonResponse.message = error.message;
            this.commonResponse.success = false;
            this.commonResponse.status = 400;
        }
        finally {
            res.status(this.commonResponse.status).send(this.commonResponse);
        }
    }
}

