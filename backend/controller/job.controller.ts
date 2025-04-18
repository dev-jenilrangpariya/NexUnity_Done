import nodemailer from "nodemailer";
import { removeFile } from "../helper/removeFile.helper";
import { CommonResponse } from "../models/common.model";
import jobModel, { Job } from "../models/job.model";
import usersModel from "../models/users.model";

export default class JobController {

    constructor() { };
    commonResponse = new CommonResponse();

    // Create Job.
    createJob = async (req, res) => {
        try {
            var jobImage = req.file;
            const { content, companyName, title }: Job = req.body;
            const userId = req.user._id;
            if (!jobImage) {
                throw new Error("Something went wrong")
            }
            const jobId = await jobModel.create({
                title,
                companyName,
                createUserId: userId,
                content,
                jobImage: jobImage.filename,
            })
            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.message = "Job created successfully."
            this.commonResponse.data = jobId._id;
        } catch (error) {
            const path = process.env.JOBIMAGE + jobImage.filename;
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

    // Update Job.
    updateJob = async (req, res) => {
        // Image add jobImage 
        let jobImage = null;
        try {
            const { content, companyName, title }: Job = req.body;

            // jobImage is not required
            if ((req.file && req.file.filename && req.file.filename.length > 0)) {
                jobImage = req.file.filename;
            }

            let jobData = await jobModel.findOne({ _id: req.body.id });
            if (!jobData) {
                throw new Error("Job doesn't exist")
            }
            if (jobImage) {
                const path = process.env.JOBIMAGE + jobData.jobImage;
                removeFile(path)
                    .then((message) => {
                    })
                    .catch((error) => {
                    });
            }
            let updateData = await jobModel.findByIdAndUpdate(req.body.id, {
                companyName,
                title,
                content,
                jobImage: jobImage ? jobImage : jobData.jobImage
            }, { new: true });

            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.data = updateData;
            this.commonResponse.message = "Job updated successfully.";

        }
        catch (error) {
            if (jobImage) {
                const path = process.env.JOBIMAGE + jobImage;
                removeFile(path)
                    .then((message) => {
                    })
                    .catch((error) => {
                    });
            }
            this.commonResponse.data = [];
            this.commonResponse.message = error.message;
            this.commonResponse.success = false;
            this.commonResponse.status = 400;

        }
        finally {
            res.status(this.commonResponse.status).send(this.commonResponse);
        }
    }

    // Delete Job.
    deleteJob = async (req, res) => {

        try {
            const { jobid } = req.params;
            let deleteJob = await jobModel.findByIdAndDelete(jobid);
            if (!deleteJob) {
                throw new Error("Job doesn't exist")
            }
            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.data = [];
            this.commonResponse.message = "Job deleted successfully.";
            if (deleteJob.jobImage) {
                const path = process.env.JOBIMAGE + deleteJob.jobImage;
                removeFile(path)
                    .then((message) => {
                    })
                    .catch((error) => {
                    });
            }
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

    // Get Jobs.
    getAllJob = async (req, res) => {
        try {
            const { name } = req.query;
            let groupIds = [];
            if (name) {
                groupIds = await jobModel.find({
                    title: {
                        $regex: name,
                        $options: 'i'
                    }
                });
            } else {
                groupIds = await jobModel.find();
            }
            this.commonResponse.success = true;
            this.commonResponse.status = 200;

            if (groupIds && groupIds.length) {
                this.commonResponse.data = groupIds;
                this.commonResponse.message = `${groupIds.length} founded.`;
            }
            else {
                this.commonResponse.data = [];
                this.commonResponse.message = "No job found with entered name.";
            }

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

    // Apply job.
    applyJob = async (req, res) => {
        try {

            let jobData = await jobModel.findById(req.body.id);
            if (!jobData) {
                new Error("No job found for job application.");
            }

            const findUser = await usersModel.findOne({ _id: jobData.createUserId });
            findUser.email = findUser.email.toLowerCase();
            if (!findUser) {
                new Error("No employer (User) found for this job.");
            }
            await jobData.updateOne({
                applicants: (jobData.applicants + 1)
            })
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_SECRET_KEY,
                },
            });
            const htmlTemplate = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Recieved Job Applicant</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333333;
                    }
                    p {
                        color: #666666;
                    }
                    .btn {
                        display: inline-block;
                        background-color: #007bff;
                        color: #ffffff;
                        text-decoration: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                    }
                    .btn:hover {
                        background-color: #0056b3;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <p>Dear ${findUser.first_name},</p>
                    <p>I trust this email finds you well. I am writing to inform you about a recent job application received on our platform for your advertised "${jobData.title}" position.</p>
                    <p>The applicant's detail is given below :</p>
                    <table>
                        <tr>
                            <th colspan="2">Applicant's Detail</th>
                        </tr>
                        <tr>
                            <td>Name:</td>
                            <td>${req.body.fullName}</td>
                        </tr>
                        <tr>
                            <td>Email:</td>
                            <td>${req.body.email}</td>
                        </tr>
                        <tr>
                            <td>Experience:</td>
                            <td>${req.body.experience} years.</td>
                        </tr>
                        <tr>
                            <td>Description:</td>
                            <td>${req.body.description}</td>
                        </tr>
                    </table>
                    <p>Thank you for utilizing our platform for your hiring needs. We appreciate your commitment to finding the best talent, and we look forward to facilitating a successful connection for the right one you need.</p>
                    <p>Best regards,</p>
                    <p>nexUnity</p>
                </div>
            </body>
            </html>
            `;
            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: process.env.EMAIL_ID, // sender address
                to: findUser.email, // list of receivers
                subject: "Notification of New Job Application on nexUnity", // Subject line
                html: htmlTemplate, // html body
            });
            console.log("Message sent: %s", info.messageId);


            this.commonResponse.success = true;
            this.commonResponse.status = 200;
            this.commonResponse.data = [];
            this.commonResponse.message = "Application sent successfully.";

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