import express from "express";
import multer from "multer";
import path from "path";
import PostController from "../controller/post.controller";
import { requireSignIn } from "../middleware/auth.middleware";
import { validateMiddleware } from "../middleware/validator.middleware";
import { postCommentAddValidation, postCommentDeleteValidation, postCommentUpdateValidation, postLikeValidation, postValidation } from "../validator/post.validator";
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == "postImage") {
            cb(null, './public/images/postImage/');
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
    // onFileUploadStart: function(file, req, res){
    //     if(req.files.file.length > maxSize) {
    //       return false;
    //     }
    //   }
});
const fileFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|jpg|png|gif|webp)$/)) {
        return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
};
const upload = multer({
    storage: storage, limits: { fileSize: 1000000 },
    fileFilter: fileFilter,
});


function handleMulterError(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File size exceeds the limit of 1 MB.',
                success: false
            });
        }
        // Handle other multer errors if needed
    } else if (err) {
        // An unknown error occurred
        return  res.status(400).json({
            message: err.message,
            success: false
        });
    }
    // Pass the control to the next middleware if no errors occurred
    next();
}
const postController = new PostController();

// Route to create a new post
router.post("/create-post", requireSignIn, upload.single('postImage'),handleMulterError, validateMiddleware(postValidation), postController.createPost);

// Route to get all posts
router.get("/get-all-post", requireSignIn, postController.getAllPost);

// Route to get all public posts
router.get("/get-public-post", postController.getAllPublicPost);

// Route to get all public and following posts for a specific user
router.get("/get-public-and-following-post", requireSignIn, postController.getAllPublicAndFollowingPost);

// Route to get personal posts for a specific user
router.get("/get-personal-post", requireSignIn, postController.getPersonalPost);

// Route to delete a post by post ID
router.delete("/delete-post/:post_id", requireSignIn, postController.deletePost);

// Route to like a post by post ID
router.post("/like-post", requireSignIn, validateMiddleware(postLikeValidation), postController.postLike);

// Route to add comment on a post by post ID.
router.post("/add-comment-post", requireSignIn, validateMiddleware(postCommentAddValidation), postController.postCommentAdd);

// Route to delete comment on a post by post ID.
router.delete("/delete-comment-post", requireSignIn, validateMiddleware(postCommentDeleteValidation), postController.postCommentDelete);

// Route to update comment on a post by post ID.
router.post("/update-comment-post", requireSignIn, validateMiddleware(postCommentUpdateValidation), postController.postCommentUpdate);

// Route to get like post id wise
router.get("/get-comment/:post_id", requireSignIn, postController.getCommentPostIdWise);

// Route to get like post id wise
router.get("/get-like/:post_id", requireSignIn, postController.getLikePostIdWise);

// Route to get all post category-wise
router.get("/get-all-post/:categoryId", requireSignIn, postController.getAllPost);

// Route to get all public category-wise
router.get("/get-public-post/:categoryId", postController.getAllPublicPost);

// Route to get all public and following posts for a specific user category-wise
router.get("/get-public-and-following-post/:categoryId", requireSignIn, postController.getAllPublicAndFollowingPost);

// Route to get personal posts for a specific user category-wise
router.get("/get-personal-post/:categoryId", requireSignIn, postController.getPersonalPost);

export default router;

