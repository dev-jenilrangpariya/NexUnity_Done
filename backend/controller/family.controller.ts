import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";
import { CommonResponse, Relation } from "../models/common.model";
import familyRelation from "../models/family-relation";
import usersModel from "../models/users.model";

export default class FamilyController {
    constructor() { };
    commonResponse = new CommonResponse();

    invitationToken = async (req, res) => {
        try {
            const userId = req.user._id;
            let { relation, receiverEmail }: any = req.body;
            receiverEmail = receiverEmail.toLowerCase();
            const findUser = await usersModel.findOne({ email: receiverEmail });
            if (findUser) {
                const isRelation = await familyRelation.findOne({ mainUserID: userId, relatedUserID: findUser._id, relationType: relation });
                if (isRelation) {
                    this.commonResponse.data = [];
                    this.commonResponse.message = "Already this relation establish";
                    this.commonResponse.status = 400;
                    this.commonResponse.success = false;
                    return;
                }
            }
            const token = await JWT.sign({ mainUserID: userId, relationType: relation }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_SECRET_KEY,
                },
            });
            const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Email Verification</title>
              <style>
              
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .logo {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .logo img {
                  max-width: 150px;
                }
                .verification-message {
                  margin-bottom: 20px;
                }
                .verification-link {
                  display: inline-block;
                  background-color: #4CAF50;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 4px;
                }
                .footer {
                  text-align: center;
                  margin-top: 20px;
                  color: #888888;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="logo">
                  <img src="your-logo-url" alt="Logo">
                </div>
                <div class="verification-message">
                  <h2>Dear ${Relation[relation]},</h2>
                  <p>You're invited to join our family community! Click the link below to accept:</p>
                  <a class="verification-link" href="${process.env.MAIN_DOMAIN_FOR_RELATION + '?token=' + token}">Create New Account</a>
                </div>
                <div class="footer">
                  <p>If you did not sign up for an account, you can safely ignore this email.</p>
                  <p>This link is valid for 1 day only.</p>
                </div>
              </div>
            </body>
            </html>`;
            const info = await transporter.sendMail({
                from: process.env.EMAIL_ID, // sender address
                to: receiverEmail, // list of receivers
                subject: "Join Our Family Community Today!", // Subject line
                html: htmlTemplate, // html body
            });

            this.commonResponse.data = token;
            this.commonResponse.message = "Email send successfully";
            this.commonResponse.status = 200;
            this.commonResponse.success = true;
        } catch (error) {
            this.commonResponse.data = [];
            this.commonResponse.message = error.message;
            this.commonResponse.status = 400;
            this.commonResponse.success = false;
        } finally {
            res.status(this.commonResponse.status).send(this.commonResponse);
        }
    }
}