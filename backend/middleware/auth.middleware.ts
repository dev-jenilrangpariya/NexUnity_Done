import JWT from "jsonwebtoken";
import { CommonResponse } from "../models/common.model";
import user_invitationModel from "../models/user-invitation.model";
import { error } from "console";
import usersModel from "../models/users.model";

export const relationToken = async (req, res, next) => {
    let commonResponse = new CommonResponse();
    try {
        if (req.body.token && req.body.token != "") {
            // const token = await user_invitationModel.findOne({ token: req.body.token });
            // if (!token) {
                // throw new Error("Link is not found");
            // }
            const decode = JWT.verify(
                req.body.token,
                process.env.JWT_SECRET
            );
            req.relation = decode;
        }
        next();
    } catch (error) {
        commonResponse.message = error.message + ' please generate new link';
        commonResponse.status = 400;
        return res.status(commonResponse.status).json(commonResponse);
    }
};

// export const forgetPassToken = async (req, res, next) => {
//     let commonResponse = new CommonResponse();
//     try {
//         if (req.body.token && req.body.token != "") {

//             const decode = JWT.verify(
//                 req.body.token,
//                 process.env.JWT_SECRET
//             );
//             req.user = decode;
//         }
//         next();
//     } catch (error) {
//         commonResponse.message = error.message + ' please generate new link';
//         commonResponse.status = 400;
//         return res.status(commonResponse.status).json(commonResponse);
//     }
// };

export const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        let verifyUser = await usersModel.findOne({
            _id : decode['_id'],
            active : true
        });
        if(! verifyUser){
            throw new Error('User is not active.');
        }
        req.user = decode;
        next();
    } catch (error) {
        // console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "Unauthorized User",
        });
    }
};