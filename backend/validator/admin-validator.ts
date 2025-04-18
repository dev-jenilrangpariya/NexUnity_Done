import usersModel from "../models/users.model";

export const isAdmin = async (req, res, next) => {
    try {
        let verifyAdmin = await usersModel.findOne({
            role : 1,
            _id : req.user._id
        });
        if(! verifyAdmin){
            throw new Error('User is not admin.');
        }
        next();
    } catch (error) {
        // console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "You are not authorized.",
        });
    }
};