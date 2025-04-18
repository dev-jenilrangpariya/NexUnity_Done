import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import morgan from "morgan";
import path from "path";
import connectDB from "./config/db.js";

import categoryRouter from "./routes/category.route.js";
import communityRouter from "./routes/community.route.js";
import eventRouter from "./routes/event.route.js";
import jobRouter from "./routes/job.route.js";
import postRouter from "./routes/post.route.js";
import userFollowRouter from "./routes/user-follow.route.js";
import UserRouter from "./routes/user.route.js";
import FmailyRouter from "./routes/family.route.js";
import adminPanelRouter from "./routes/admin-panel.route.js";

// Loading environment variables from a .env file
dotenv.config();

// Creating an Express application
const app = express();

// Middleware setup for enabling cross-origin resource sharing (CORS)
app.use(cors());

// Middleware setup for HTTP request logging during development using Morgan
app.use(morgan('dev'));

app.get('', (req, res) => {
    res.send("Server is working.")
});

// Middleware for parsing JSON data in incoming requests
app.use(express.json());

// Authentication
const imageDirectories = [
    'public/images/community-backImage',
    'public/images/community-frontImage',
    'public/images/postImage',
    'public/images/profileImage',
    'public/images/jobImage',
    'public/images/eventImage'
];

// Middleware to serve images from multiple directories
app.use('/images', (req, res, next) => {
    const imageName = req.url.split('/').pop(); // Extract the image name from the URL

    // Iterate through each directory to find the image
    for (const directory of imageDirectories) {
        const imagePath = path.join(directory, imageName);
        if (fs.existsSync(imagePath)) {
            // If the image exists in this directory, serve it
            return res.sendFile(path.resolve(imagePath));
        }
    }

    // If the image is not found in any directory, return a 404 error
    res.status(404).send('Image not found');
});

app.use("/api/v1/auth", UserRouter);

// Community
app.use("/api/v1/community", communityRouter);

// Category
app.use("/api/v1/category", categoryRouter);

// Post
app.use("/api/v1/post", postRouter);

// Event
app.use("/api/v1/event", eventRouter);

// User Follow
app.use("/api/v1/follow", userFollowRouter);

// Job
app.use("/api/v1/job", jobRouter);

// Admin Panel
app.use("/api/v1/admin-panel", adminPanelRouter);

// Family
app.use("/api/v1/family", FmailyRouter);


// Connecting to the MongoDB database
connectDB();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server is runing ${PORT}`)
})