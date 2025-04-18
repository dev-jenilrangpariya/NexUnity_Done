import express from "express";
import multer from "multer";
import path from "path";
import EventController from "../controller/event.controller";
import { requireSignIn } from "../middleware/auth.middleware";
import { validateMiddleware } from "../middleware/validator.middleware";
import { eventUpdateValidation, eventValidation } from "../validator/event.validator";
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == "eventImage") {
            cb(null, './public/images/eventImage/');
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

const eventController = new EventController();

// Route to create a new event
router.post("/create-event", requireSignIn, upload.single('eventImage'), handleMulterError,validateMiddleware(eventValidation), eventController.createEvent);

// Route to update event
router.put("/update-event", requireSignIn, upload.single('eventImage'),handleMulterError,validateMiddleware(eventUpdateValidation), eventController.updateEvent);

// Route to delete event
router.delete("/delete-event/:eventid", requireSignIn, eventController.deleteEvent);

router.get("/get", eventController.getAllEvent);

export default router;

