import express from "express";
import UserFollowController from "../controller/user-follow.controller";
import { validateMiddleware } from "../middleware/validator.middleware";
import { userFollowRequestValidator } from "../validator/user-follow.validator";

const userFollowRouter = express.Router();
const userFollowController = new UserFollowController();

// Send follow request.
userFollowRouter.post('/send_request',validateMiddleware(userFollowRequestValidator),userFollowController.sendRequest);

// Accept follow request.
userFollowRouter.get('/accept_request/:follow_id',userFollowController.acceptFollowRequest);

// Decline follow request.
userFollowRouter.get('/decline_request/:follow_id',userFollowController.declineFollowRequest);

// Get pending follow request.
userFollowRouter.get('/get_pending_request/:user_id',userFollowController.getPendingFollowRequest);

// Get followers.
userFollowRouter.get('/get_followers/:user_id',userFollowController.getFollowers);

// Get followings.
userFollowRouter.get('/get_following/:user_id',userFollowController.getFollowing);

// Get followings.
userFollowRouter.get('/get_requested/:user_id',userFollowController.getRequested);

export default userFollowRouter;