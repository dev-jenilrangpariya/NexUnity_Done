import express from "express";
import multer from "multer";
import path from "path";
import communityController from "../controller/community.controller";
import { validateMiddleware } from "../middleware/validator.middleware";
import { communityDeleteCommunityValidation, communityJoinParticipantValidation, communityUpdateCommunityValidation, communityValidation } from "../validator/community.validator";

const communityRouter = express.Router()
const communityCont = new communityController();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == "frontImage") {
            cb(null, './public/images/community-frontImage/');
        }
        if (file.fieldname == "backImage") {
            cb(null, './public/images/community-backImage/');
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

// Create community.
communityRouter.post("/create", upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 },
]), handleMulterError, validateMiddleware(communityValidation), communityCont.createCommunity);

// Get community.
// communityRouter.get("/get/:name", communityCont.getAllCommunity);
communityRouter.get("/get", communityCont.getAllCommunity);
// communityRouter.get("/get", validateMiddlewareQuery(communityGetCommunityValidation), communityCont.getCommunity);

// Update community.
communityRouter.put("/update", upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 },
]), validateMiddleware(communityUpdateCommunityValidation), communityCont.updateCommunity);

// Delete community.
communityRouter.delete("/delete", validateMiddleware(communityDeleteCommunityValidation), communityCont.deleteCommunity);

// Join community participant.
communityRouter.post("/join_community", validateMiddleware(communityJoinParticipantValidation), communityCont.joinCommunity);

// Left community participant.
communityRouter.post("/left_community", validateMiddleware(communityJoinParticipantValidation), communityCont.leftCommunity);
communityRouter.get("/getCommunityCreatedByUser/:userId", communityCont.getCommunityCreatedByUser);
communityRouter.get("/getUserJoinedCommunity/:userId", communityCont.getCommunityJoinedByUser);
communityRouter.get("/:communityId", communityCont.getCommunityById);

// Get all community participant.
communityRouter.get("/get_participants/:community_id", communityCont.getAllParticipants);


export default communityRouter;