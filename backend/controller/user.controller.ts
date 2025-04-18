import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";
import { comparePassword, hashPassword } from "../helper/auth.helper";
import { removeFile } from "../helper/removeFile.helper";
import { CommonResponse, Role } from "../models/common.model";
import { default as familyRelation, default as family_relation } from "../models/family-relation";
import familyModel from "../models/family.model";
import otpModel from "../models/otp.model";
import user_invitationModel, {
  UserInvitation,
} from "../models/user-invitation.model";
import usersModel, { User, UserLogin } from "../models/users.model";
import removeAccountRequestModel from "../models/remove-account-request.model";
import postModel from "../models/post.model";
import userFollowModel from "../models/user-follow.model";
import communityParticipantModel from "../models/community.participant.model";
import mongoose from "mongoose";
import communityModel from "../models/community.model";

export default class UserController {
  constructor() { }
  commonResponse = new CommonResponse();

  register = async (req, res) => {
    try {
      let {
        first_name,
        middle_name,
        surname,
        email,
        password,
        gender,
        profile_pic,
        isRoot,
        isPrivate,
        active,
        role,
        token,
      }: User = req.body;
      email = email.toLowerCase();
      if (req.relation) {
        const findUser = await usersModel.findOne({ email: email });
        if (findUser) {
          const isRelation = await familyRelation.findOne({
            mainUserID: req.relation.mainUserID,
            relatedUserID: findUser._id,
            relationType: req.relation.relationType,
          });
          if (isRelation) {
            this.commonResponse.data = [];
            this.commonResponse.message = "Already this relation establish";
            this.commonResponse.status = 400;
            this.commonResponse.success = false;
            return;
          }
        }
      }

      // Finding from otp model is entered email is verified or not.
      const isEmailVerified = await otpModel.findOne({
        email: email,
        isVerified: true,
      });

      if (!isEmailVerified) {
        throw new Error("Email is not verified");
      }

      const isEmail = await usersModel.find({ email });
      if (isEmail && isEmail.length) {
        this.commonResponse.data = [];
        this.commonResponse.message = "Email is already exist";
        this.commonResponse.status = 400;
        this.commonResponse.success = false;
        return;
      }

      password = await hashPassword(password); //okay
      const user = await new usersModel({
        first_name,
        middle_name,
        surname,
        email,
        password,
        gender,
        profile_pic,
        isRoot: req.relation ? false : true,
        active,
        isPrivate,
        role: role || Role.USER,
        token,
      }).save();

      if (req.relation) {
        // const { createUserId, relation } = (req.relation)
        const { mainUserID, relationType } = req.relation;
        const relationCreate = await new family_relation({
          mainUserID,
          relatedUserID: user._id,
          relationType,
          isActive: true,
        }).save();

        // await user_invitationModel.deleteOne({ token });
        // const data = await family_relation.find({
        //   mainUserID,  relationType
        // });

        // if (data && data.length == 2) {
        //   await familyModel.findByIdAndUpdate({ _id: familyId }, { active: true });
        // }

        this.commonResponse.data = [];
        this.commonResponse.message = "Account create successfully";
        this.commonResponse.status = 200;
        this.commonResponse.success = true;
        return;
      }

      this.commonResponse.data = await new familyModel({
        createUserId: user._id,
        active: isRoot,
      }).save();
      this.commonResponse.data.length < 0 && (this.commonResponse.data = user);
      this.commonResponse.message = "Success";
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
  };

  login = async (req, res) => {
    try {
      let { email, password }: UserLogin = req.body;
      email = email.toLowerCase();
      const findEmail = await usersModel.findOne({ email });
      if (!findEmail) {
        this.commonResponse.data = [];
        this.commonResponse.message = "User not registered";
        this.commonResponse.status = 400;
        this.commonResponse.success = false;
        return;
      }
      if (!(await comparePassword(password, findEmail.password))) {
        this.commonResponse.data = [];
        this.commonResponse.message = "Invalid credentials";
        this.commonResponse.status = 400;
        this.commonResponse.success = false;
        return;
      }
      const findEmailObject = findEmail.toObject();

      delete findEmailObject.password;
      delete findEmailObject.createdAt;
      delete findEmailObject.updatedAt;

      const token = await JWT.sign(
        { _id: findEmail._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "2d",
        }
      );
      this.commonResponse.data = { user: findEmailObject, token };
      this.commonResponse.message = "You are successfully logged in";
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
  };

  updateProfile = async (req, res) => {
    let profile_pic = null;
    try {
      let { first_name, middle_name, surname, gender, isPrivate } = req.body;
      // profile_pic is not required
      if (req.file && req.file.filename && req.file.filename.length > 0) {
        profile_pic = req.file.filename;
      }
      const findUser = await usersModel.findOne({ _id: req.user._id });
      if (!findUser) {
        this.commonResponse.data = [];
        this.commonResponse.message = "User not found";
        this.commonResponse.status = 400;
        this.commonResponse.success = false;
        return;
      }
      if (profile_pic) {
        const path = process.env.PROFILEIMAGE + findUser.profile_pic;
        removeFile(path)
          .then((message) => { })
          .catch((error) => { });
      }

      const newUser = await usersModel.findByIdAndUpdate(
        { _id: req.user._id },
        {
          first_name,
          middle_name,
          surname,
          gender,
          isPrivate,
          profile_pic: profile_pic ? profile_pic : findUser.profile_pic,
        },
        {
          new: true,
        }
      );
      this.commonResponse.data = newUser;
      this.commonResponse.message = "User update successfully";
      this.commonResponse.status = 200;
      this.commonResponse.success = true;
    } catch (error) {
      if (profile_pic) {
        const path = process.env.PROFILEIMAGE + profile_pic;
        removeFile(path)
          .then((message) => { })
          .catch((error) => { });
      }
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.status = 400;
      this.commonResponse.success = false;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  };

  userStatusUpdate = async (req, res) => {
    try {
      let { userId } = req.body;
      const findUser = await usersModel.findOne({ _id: userId });
      if (!findUser) {
        this.commonResponse.data = [];
        this.commonResponse.message = "User not found";
        this.commonResponse.status = 400;
        this.commonResponse.success = false;
        return;
      }
      if (findUser.active) {
        await removeAccountRequestModel.deleteOne({ userId: findUser._id });
      }
      await usersModel.findByIdAndUpdate(
        { _id: userId },
        {
          active: !findUser.active,
        }
      );
      this.commonResponse.data = [];
      this.commonResponse.message = !findUser.active
        ? "User is activate"
        : "User is deactivate";
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
  };

  forgetTokenGenerate = async (req, res) => {
    try {
      let { email }: any = req.body;
      email = email.toLowerCase();
      const findUser = await usersModel.findOne({ email: email });
      if (!findUser) {
        this.commonResponse.data = [];
        this.commonResponse.message = "User is invalid";
        this.commonResponse.status = 400;
        this.commonResponse.success = false;
        return;
      }
      findUser.email = findUser.email.toLowerCase();

      // Delete otp record if found same email.
      let emailExist = await otpModel.findOneAndDelete({
        email: email,
      });

      let newOtp = this.generateOTP(6);
      let newOtpGenerate = await otpModel.create({
        email: email,
        otp: newOtp,
      });

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_SECRET_KEY,
        },
        tls : { rejectUnauthorized: false }
      });
      const htmlTemplate = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Forget Password</title>
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
          </style>
      </head>
      <body>
          <div class="container">
            <p>You have requested to reset your password. Please use the OTP to reset your password:</p>
            <p>Your One-Time Password (OTP) for verification is: <br/> <b style="color: #007bff; font-weight: bold; font-size: 40px;" >${newOtp}</b></p>
            <p>Please use this OTP to complete the verification process. If you did not initiate this request, please ignore this email.</p>
            <p>For security reasons, this OTP is valid for a limited time. Do not share this OTP with anyone, including NexUnity support.</p>
            <p>Thank you for being a part of our community!</p>
            <br/>
            <p>Best regards,</p>
            <p>NexUnity Team</p>  
          </div>
      </body>
      </html>
      `;
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: process.env.EMAIL_ID, // sender address
        to: findUser.email, // list of receivers
        subject: "nexUnity - OTP for Reset Password!", // Subject line
        html: htmlTemplate, // html body
      });
      console.log("Message sent: %s", info.messageId);

      this.commonResponse.data = [];
      this.commonResponse.message = "Success";
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
  };

  forgetPassword = async (req, res) => {
    try {
      let { otp, password, email } = req.body;
      email = email.toLowerCase();
      // Verifying if email is correct or not.
      const isEmail = await usersModel.findOne({ email: email });
      if (!isEmail) {
        throw new Error("Entered email is incorrect.");
      }

      // Verifying OTP.
      let otpVerifyData = await otpModel.findOneAndDelete({
        otp: otp,
        email: email,
      });

      if (!otpVerifyData) {
        throw new Error("Entered OTP is incorrect.");
      }

      password = await hashPassword(password);
      const user = await usersModel.findByIdAndUpdate(
        { _id: isEmail._id.toString() },
        {
          password,
        }
      );
      this.commonResponse.data = [];
      this.commonResponse.message = "Forget password successfully";
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
  };

  generateOTP(length: number) {
    const characters = "0123456789";
    let otp = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }

    return otp;
  }

  generateOtpRegister = async (req, res) => {
    try {
      let data = req.body;
      data.email = data.email.toLowerCase();
      let userExists = await usersModel.findOne({
        email: data.email,
      });
      if (userExists) {
        throw new Error("Email already registered. Try to sign in.");
      }

      // Delete otp record if found same email.
      let emailExist = await otpModel.findOneAndDelete({
        email: data.email,
      });

      let newOtp = this.generateOTP(6);
      let newOtpGenerate = await otpModel.create({
        email: data.email,
        otp: newOtp,
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

      const htmlTemplate = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verification Code</title>
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
          </style>
      </head>
      <body>
          <div class="container">
          <h3>Hello,</h3>
            <p>Thank you for choosing <b style="color: #007bff; font-weight: bold;">NexUnity</b>. To ensure the security of your account, we require you to verify your email address.</p>

            <p>Your One-Time Password (OTP) for verification is: <br/> <b style="color: #007bff; font-weight: bold; font-size: 40px;" >${newOtp}</b></p>

            <p>Please use this OTP to complete the verification process. If you did not initiate this request, please ignore this email.</p>

            
            <p>For security reasons, this OTP is valid for a limited time. Do not share this OTP with anyone, including NexUnity support.</p>

            <p>Thank you for being a part of our community!</p>
            <br/>
            <p>Best regards,</p>
            <p>Team NexUnity</p>
          </div>
      </body>
      </html>
      `;
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: "NexUnity", // sender address
        to: data.email, // list of receivers
        subject: "NexUnity - One-Time Password (OTP) for Verification", // Subject line
        html: htmlTemplate, // html body
      });
      console.log("Message sent: %s", info.messageId);

      this.commonResponse.data = [];
      this.commonResponse.message = "Otp sent successfully";
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
  };

  verifyOtp = async (req, res) => {
    try {
      let data = req.body;
      data.email = data.email.toLowerCase();
      let emailVerify = await otpModel.findOne({
        email: data.email,
      });

      if (!emailVerify) {
        throw new Error("Regenerate OTP to verify.");
      }

      let otpAndEmailVerify = await otpModel.findOne({
        email: data.email,
        otp: data.otp,
      });

      if (!otpAndEmailVerify) {
        throw new Error("Entered OTP is incorrect.");
      }

      let updateOtpRec = await otpModel.findOneAndUpdate(
        {
          email: data.email,
          otp: data.otp,
        },
        {
          isVerified: true,
        }
      );

      this.commonResponse.data = [];
      this.commonResponse.message = "Otp verified successfully";
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
  };

  // Get Event.
  getAllUser = async (req, res) => {
    try {
      const { name } = req.query;
      let userData = [];
      if (name) {
        userData = await usersModel.find({
          $or: [
            {
              first_name: {
                $regex: name,
                $options: "i",
              },
            },
            {
              middle_name: {
                $regex: name,
                $options: "i",
              },
            },
            {
              surname: {
                $regex: name,
                $options: "i",
              },
            },
          ],
        });
      } else {
        userData = await usersModel.find();
      }
      this.commonResponse.success = true;
      this.commonResponse.status = 200;

      if (userData && userData.length) {
        this.commonResponse.data = userData;
        this.commonResponse.message = `${userData.length} founded.`;
      } else {
        this.commonResponse.data = [];
        this.commonResponse.message = "No event found with entered name.";
      }
    } catch (error) {
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.success = false;
      this.commonResponse.status = 400;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  };

  resetPassword = async (req, res) => {
    try {
      const userId = req.user._id;
      const currentUser = await usersModel.findOne({ _id: userId });
      if (
        !(await comparePassword(req.body.oldPassword, currentUser.password))
      ) {
        throw new Error("Entered old password is not correct.");
      }
      let newPasswordHash = await hashPassword(req.body.newPassword);
      await currentUser.updateOne({
        password: newPasswordHash,
      });
      this.commonResponse.data = [];
      this.commonResponse.message = "Password reset successfully.";
      this.commonResponse.success = true;
      this.commonResponse.status = 200;
    } catch (error) {
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.success = false;
      this.commonResponse.status = 400;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  }

  removeAccountReuest = async (req, res) => {

    try {

      let { reasonForDeactivation } = req.body;
      const userId = req.user._id;
      // email = email.toLowerCase();

      const removeAccount = await removeAccountRequestModel.findOne({ userId });
      if (removeAccount) {
        throw new Error("A remove account request has already been sent for this user");
      }
      let userExists = await usersModel.findOne({
        _id: userId,
      })
      if (!userExists) {
        throw new Error("Email not registered");
      }
      await new removeAccountRequestModel({
        userId: userExists._id,
        reasonForDeactivation: reasonForDeactivation
      }).save();
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_SECRET_KEY,
        },
      });

      const emailBody = this.htmlTemplate(userExists.first_name, userExists.email, reasonForDeactivation);
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: process.env.EMAIL_ID, // sender address
        to: "kreract@gmail.com", // list of receivers
        subject: "Account Remove Request", // Subject line
        html: emailBody, // html body
      });
      console.log("Message sent: %s", info.messageId);
      this.commonResponse.data = [];
      this.commonResponse.message = "Remove Account Request Sent Successfully";
      this.commonResponse.status = 200;
      this.commonResponse.success = true;

    }
    catch (error) {

      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.status = 400;
      this.commonResponse.success = false;

    }
    finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }

  }

  htmlTemplate = (userName, userEmail, reason) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Remove Request</title>
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
    </style>
</head>
<body>
    <div class="container">
        <p>Dear Admin,</p>

        <p>${userName} (${userEmail}) has requested to remove their account due to the following reason:</p>

        <p>${reason}</p>

        <p>Please take appropriate action regarding this request.</p>

        <p>Thank you.</p>
        <br/>
        <p>Best regards,</p>
        <p>NexUnity</p>
    </div>
</body>
</html>
`;

  getAllRemoveAccountRequest = async (req, res) => {
    try {
      let accountData = [];
      accountData = await removeAccountRequestModel.find({}).populate('userId');
      this.commonResponse.success = true;
      this.commonResponse.status = 200;

      if (accountData && accountData.length) {
        this.commonResponse.data = accountData;
        this.commonResponse.message = `${accountData.length} founded.`;
      }
      else {
        this.commonResponse.data = [];
        this.commonResponse.message = "No aby request found";
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

  userWiseProfileDetails = async (req, res) => {
    try {
      const mainUserId = req.user._id;
      let { userId } = req.params;
      userId = new mongoose.Types.ObjectId(userId)
      const dataFiltering = [
        { $match: { createUserId: userId } }, // Filter posts
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
                if: { $in: [userId, "$likes.userId"] },
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
      ];
      const [
        postDetails,
        joinCommunityDetails,
        createdCommunityDetails,
        userDetails,
        followerIds,
        followingIds,
        isYouFollowThisPerson,
        isThisPersonFollowYou,
        isYouRequested
      ] = await Promise.all([
        postModel.aggregate(dataFiltering),
        communityParticipantModel.find({ userId }).populate("userId"),
        communityModel.find({ createUserId: userId }),
        usersModel.findOne({ _id: userId }),
        userFollowModel.find({ toUserId: userId, isActive: true }),
        userFollowModel.find({ fromUserId: userId, isActive: true }),
        userFollowModel.findOne({ fromUserId: mainUserId, toUserId: userId, isActive: true }),
        userFollowModel.findOne({ fromUserId: userId, toUserId: mainUserId, isActive: true }),
        userFollowModel.findOne({ fromUserId: mainUserId, toUserId: userId, isActive: false })
      ]);

      // Counting arrays lengths
      const postCount = postDetails.length;
      const joinCommunityCount = joinCommunityDetails.length;
      const createdCommunityCount = createdCommunityDetails.length;
      const followerCount = followerIds.length;
      const followingCount = followingIds.length;

      // Setting boolean values
      const isYouFollowThisPersonValue = Boolean(isYouFollowThisPerson && isYouFollowThisPerson._id);
      const isThisPersonFollowYouValue = Boolean(isThisPersonFollowYou && isThisPersonFollowYou._id);
      const isYouRequestedValue = Boolean(isYouRequested && isYouRequested._id);

      // Constructing response data
      const responseData = {
        postDetails,
        userDetails,
        joinCommunityDetails,
        createdCommunityDetails,
        postCount,
        joinCommunityCount,
        createdCommunityCount,
        followerCount,
        followingCount,
        isYouFollowThisPerson: isYouFollowThisPersonValue,
        isThisPersonFollowYou: isThisPersonFollowYouValue,
        isYouRequested: isYouRequestedValue
      };

      this.commonResponse.data = responseData;
      this.commonResponse.message = "Profile Details";
      this.commonResponse.status = 200;
      this.commonResponse.success = true;
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
