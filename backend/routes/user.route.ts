import express from "express";
import multer from "multer";
import path from "path";
import UserController from "../controller/user.controller";
import { relationToken, requireSignIn } from "../middleware/auth.middleware";
import { validateMiddleware } from "../middleware/validator.middleware";
import { activeStatusUpdateValidation, forgetPasswordValidation, forgetValidation, generateOtpValidation, removeAccountReuestValidation, resetPasswordValidation, updateProfileValidation, userInvitationValidation, userLoginValidation, userValidation, verifyOtpValidation } from "../validator/user.validator";
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == "profile_pic") {
            cb(null, process.env.PROFILEIMAGE);
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
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

const userController = new UserController()

// Route to register a new user
router.post("/register", validateMiddleware(userValidation), relationToken, userController.register);

// Route to log in a user
router.post("/login", validateMiddleware(userLoginValidation), userController.login);

// Route to update user profile
router.put("/update-profile", upload.single('profile_pic'), handleMulterError,requireSignIn, validateMiddleware(updateProfileValidation), userController.updateProfile);

// Route to update user active status
router.put("/user-active-status-update", validateMiddleware(activeStatusUpdateValidation), userController.userStatusUpdate);

// Route to generate token for password reset
router.post("/forgetpass-token-generate", validateMiddleware(forgetValidation), userController.forgetTokenGenerate);

// Route to reset user password
router.post("/forget-password", validateMiddleware(forgetPasswordValidation), userController.forgetPassword);

// Route to invite a user
// router.post("/user-invitation", requireSignIn, validateMiddleware(userInvitationValidation), userController.invitationToken);

// Route to get user details
router.get("/get-user", userController.getAllUser);

// Route to generate OTP for user registration
router.post("/generate_otp", validateMiddleware(generateOtpValidation), userController.generateOtpRegister);

// Route to verify OTP
router.post("/verify_otp", validateMiddleware(verifyOtpValidation), userController.verifyOtp);

// Route to reset password
router.post("/reset-password", requireSignIn, validateMiddleware(resetPasswordValidation), userController.resetPassword);

// Route to Deactive Account Reuest
router.post("/remove-account", requireSignIn, validateMiddleware(removeAccountReuestValidation), userController.removeAccountReuest);

router.get("/get-all-remove-account-request", userController.getAllRemoveAccountRequest);

router.get("/profile-details/:userId", requireSignIn, userController.userWiseProfileDetails);
export default router;


