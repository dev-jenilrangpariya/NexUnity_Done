import express from "express";
import multer from "multer";
import path from "path";
import JobController from "../controller/job.controller";
import { requireSignIn } from "../middleware/auth.middleware";
import { validateMiddleware } from "../middleware/validator.middleware";
import { jobApplicantValidation, jobUpdateValidation, jobValidation } from "../validator/job.validator";
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == "jobImage") {
            cb(null, './public/images/jobImage/');
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

const jobController = new JobController();

// Route to create a new job
router.post("/create-job", requireSignIn, upload.single('jobImage'),handleMulterError, validateMiddleware(jobValidation), jobController.createJob);

// Route to update event
router.put("/update-job", requireSignIn, upload.single('jobImage'),handleMulterError, validateMiddleware(jobUpdateValidation), jobController.updateJob);

// Route to delete job
router.delete("/delete-job/:jobid", requireSignIn, jobController.deleteJob);

// Route to get job 
router.get("/get", jobController.getAllJob);

// Route to apply job 
router.post("/applyJob",requireSignIn,validateMiddleware(jobApplicantValidation), jobController.applyJob);

export default router;

