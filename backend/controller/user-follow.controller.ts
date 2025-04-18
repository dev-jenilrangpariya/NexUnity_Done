import { CommonResponse } from "../models/common.model";
import userFollowModel from "../models/user-follow.model";
import usersModel from "../models/users.model";

export default class UserFollowController {
  constructor() {}
  commonResponse = new CommonResponse();

  // Sending request to user.
  sendRequest = async (req, res) => {
    try {
      let data = req.body;
      let fromUserId = await usersModel.findById(data.fromUserId);
      let toUserId = await usersModel.findById(data.toUserId);

      if (!fromUserId || !toUserId || fromUserId._id.equals(toUserId._id)) {
        throw new Error("Error while sending request.");
      }

      let sendingRequest = await userFollowModel.create({
        toUserId: toUserId._id,
        fromUserId: fromUserId._id,
      });

      this.commonResponse.status = 200;
      this.commonResponse.message = "Request sent successfully.";
      this.commonResponse.data = [];
      this.commonResponse.success = true;
    } catch (error) {
      this.commonResponse.status = 400;
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.success = false;
      return;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  };

  // Accept follow request.
  acceptFollowRequest = async (req, res) => {
    try {
      let data = req.params;
      let followRequest = await userFollowModel.findByIdAndUpdate(
        data.follow_id,
        {
          isActive: true,
        }
      );
      if (followRequest.isActive) {
        throw new Error("Error while sending request.");
      }

      this.commonResponse.status = 200;
      this.commonResponse.message = "Request accepted successfully.";
      this.commonResponse.data = [];
      this.commonResponse.success = true;
    } catch (error) {
      this.commonResponse.status = 400;
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.success = false;
      return;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  };

  // Decline follow request / Remove Follower.
  declineFollowRequest = async (req, res) => {
    try {
      let data = req.params;
      let followRequest = await userFollowModel.findByIdAndDelete(
        data.follow_id
      );

      if (!followRequest) {
        throw new Error("Error while sending request.");
      }

      this.commonResponse.status = 200;
      this.commonResponse.message = "Request declined successfully.";
      this.commonResponse.data = [];
      this.commonResponse.success = true;
    } catch (error) {
      this.commonResponse.status = 400;
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.success = false;
      return;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  };

  // Get pending follow requests.
  getPendingFollowRequest = async (req, res) => {
    try {
      let data = req.params;
      // let followRequestIds = await userFollowModel.find({
      //     toUserId : data.user_id,
      //     isActive : false
      // });

      const userExist = await usersModel.findById(data.user_id);
      if (!userExist) {
        this.commonResponse.status = 405;
        this.commonResponse.data = [];
        this.commonResponse.message = "user not exists";
        this.commonResponse.success = false;
      }
      let followRequestIds = await userFollowModel.aggregate([
        {
          $match: {
            toUserId: userExist._id,
            isActive: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "fromUserId",
            foreignField: "_id",
            as: "fromUserDetail",
          },
        },
        {
          $addFields: {
            fromUserIdDetail: { $arrayElemAt: ["$fromUserDetail", 0] },
          },
        },
        {
          $project: {
            _id: 1,
            fromUserId: 1,
            toUserId: 1,
            isActive: 1,
            createdAt: 1,
            updatedAt: 1,
            fromUserIdDetail: 1
          },
        },
        {
          $project: {
            // Exclude fields you want to hide
            "fromUserIdDetail.password": 0,
            "fromUserIdDetail.email": 0,
          },
        }
      ]);

      console.log("result >>>>> ", followRequestIds);

      this.commonResponse.status = 200;
      this.commonResponse.message = "Pending request fetched successfully.";
      this.commonResponse.data = followRequestIds;
      this.commonResponse.success = true;
    } catch (error) {
      this.commonResponse.status = 400;
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.success = false;
      return;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  };

  // Get followers.
  getFollowers = async (req, res) => {
    try {
      let data = req.params;
      let followerIds = await userFollowModel.find({
        toUserId: data.user_id,
        isActive: true,
      });

      this.commonResponse.status = 200;
      this.commonResponse.message = "Pending request fetched successfully.";
      this.commonResponse.data = followerIds;
      this.commonResponse.success = true;
    } catch (error) {
      this.commonResponse.status = 400;
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.success = false;
      return;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  };

  // Get following.
  getFollowing = async (req, res) => {
    try {
      let data = req.params;
      let followingIds = await userFollowModel.find({
        fromUserId: data.user_id,
        isActive: true,
      });

      this.commonResponse.status = 200;
      this.commonResponse.message = "Pending request fetched successfully.";
      this.commonResponse.data = followingIds;
      this.commonResponse.success = true;
    } catch (error) {
      this.commonResponse.status = 400;
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.success = false;
      return;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  };


  // Get requested.
  getRequested = async (req, res) => {
    try {
      let data = req.params;
      let followerIds = await userFollowModel.find({
        fromUserId: data.user_id,
        isActive: false,
      });

      this.commonResponse.status = 200;
      this.commonResponse.message = "requested request fetched successfully.";
      this.commonResponse.data = followerIds;
      this.commonResponse.success = true;
    } catch (error) {
      this.commonResponse.status = 400;
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.success = false;
      return;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  };
}
