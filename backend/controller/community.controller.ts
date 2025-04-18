import mongoose from "mongoose";
import { removeFile } from "../helper/removeFile.helper";
import { CommonResponse, CommunityParticipantRole } from "../models/common.model";
import communityModel from "../models/community.model";
import communityParticipantModel from "../models/community.participant.model";
import usersModel from "../models/users.model";

export default class communityController {
  constructor() { };
  commonResponse = new CommonResponse();

  createCommunity = async (req, res) => {
    // Image add front and back
    let frontImage = null;
    let backImage = null;
    try {
      let data = req.body;

      // Black image is not required
      if ((req.files && req.files.backImage && req.files.backImage.length > 0)) {
        backImage = req.files.backImage[0];
      }

      // Fornt image is required
      if (!(req.files && req.files.frontImage && req.files.frontImage.length > 0)) {
        throw new Error("Front-Image is required");
      }


      frontImage = req.files.frontImage[0];
      const userId = await usersModel.findById(data.createUserId);
      const groupId = await communityModel.create({
        createUserId: userId,
        name: data.name,
        description: data.description,
        frontImage: frontImage.filename,
        backImage: backImage ? backImage.filename : backImage, // if back image is not available to null assign
        isPublic: data.isPublic
      })

      // Adding createUser as a participant and have admin role.
      const participantId = await communityParticipantModel.create({
        userId: userId,
        communityId: groupId,
        role: CommunityParticipantRole.ADMIN
      });

      this.commonResponse.status = 200;
      this.commonResponse.success = true;
      this.commonResponse.message = "Group created successfully."
      this.commonResponse.data = groupId;
    } catch (error) {
      if (frontImage) {
        const path = process.env.COMMUNITY_FRONT_IMAGE + backImage.filename;
        removeFile(path)
          .then((message) => {
                    })
          .catch((error) => {
                    });
      }
      if (backImage) {
        const path = process.env.COMMUNITY_BACK_IMAGE + backImage.filename;
        removeFile(path)
          .then((message) => {
                    })
          .catch((error) => {
                    });
      }
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

  // Get Community
  getCommunity = async (req, res) => {
    try {

      // Fetching search query from request query.
      let search_query = req.query.name;
      let groupIds = [];

      groupIds = await communityModel.find({
        name: {
          $regex: search_query,
          $options: 'i'
                }
      });

      this.commonResponse.success = true;
      this.commonResponse.status = 200;
      const modifiedGroups = groupIds.map(group => {
        if (group.backImage) {
          group.backImage = `${process.env.BACKENDURL}${group.backImage}`;
        }
        if (group.frontImage) {
          group.frontImage = `${process.env.BACKENDURL}${group.frontImage}`;
        }
        return group;
      });
      if (groupIds && groupIds.length) {
        this.commonResponse.data = groupIds;
        this.commonResponse.message = `${groupIds.length} founded.`;
      }
            else {
        this.commonResponse.data = [];
        this.commonResponse.message = "No Community found with entered name.";
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

  getAllCommunity = async (req, res) => {
    try {
      const { name } = req.query;
      let groupIds = [];
      if (name) {
        groupIds = await communityModel.find({
          name: {
            $regex: name,
            $options: 'i'
                    }
        });
      } else {
        groupIds = await communityModel.find();
      }
      // const modifiedGroups = groupIds.map(group => {
      //     if (group.backImage) {
      //         group.backImage = `${process.env.BACKENDURL}${group.backImage}`;
      //     }
      //     if (group.frontImage) {
      //         group.frontImage = `${process.env.BACKENDURL}${group.frontImage}`;
      //     }
      //     return group;
      // });
      this.commonResponse.success = true;
      this.commonResponse.status = 200;

      if (groupIds && groupIds.length) {
        this.commonResponse.data = groupIds;
        this.commonResponse.message = `${groupIds.length} founded.`;
      }
            else {
        this.commonResponse.data = [];
        this.commonResponse.message = "No Community found with entered name.";
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

  // Update Community.
  updateCommunity = async (req, res) => {
    // Image add front and back
    let frontImage = null;
    let backImage = null;
    try {
      const { name, description, isPublic } = req.body;

      // Black image is not required
      if ((req.files && req.files.backImage && req.files.backImage.length > 0)) {
        backImage = req.files.backImage[0];
      }

      // Fornt image is required
      if ((req.files && req.files.frontImage && req.files.frontImage.length > 0)) {
        frontImage = req.files.frontImage[0];
      }

      let communityData = await communityModel.findOne({ _id: req.body.id });
      if (!communityData) {
        throw new Error("Community doesn't exist")
      }
      if (backImage) {
        const path = process.env.COMMUNITY_BACK_IMAGE + communityData.backImage;
        removeFile(path)
          .then((message) => {
                    })
          .catch((error) => {
                    });
      }
      if (frontImage) {
        const path = process.env.COMMUNITY_FRONT_IMAGE + communityData.frontImage;
        removeFile(path)
          .then((message) => {
                    })
          .catch((error) => {
                    });
      }
      let updateData = await communityModel.findByIdAndUpdate(req.body.id, {
          name,
          description,
          frontImage: frontImage ? frontImage.filename : communityData.frontImage,
          backImage: backImage ? backImage.filename : communityData.backImage,
          isPublic
        }, { new: true });

      this.commonResponse.status = 200;
      this.commonResponse.success = true;
      this.commonResponse.data = updateData;
      this.commonResponse.message = "Community updated successfully.";
    
        }
        catch (error) {
      if (frontImage) {
        const path = process.env.COMMUNITY_FRONT_IMAGE + frontImage.filename;
        removeFile(path)
          .then((message) => {
                    })
          .catch((error) => {
                    });
      }
      if (backImage) {
        const path = process.env.COMMUNITY_BACK_IMAGE + backImage.filename;
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
  
  deleteCommunity = async (req, res) => {

    try {

      let deleteCommunity = await communityModel.findByIdAndDelete(req.body.id);
      if (!deleteCommunity) {
        throw new Error("Community doesn't exist")
      }
      this.commonResponse.status = 200;
      this.commonResponse.success = true;
      this.commonResponse.data = [];
      this.commonResponse.message = "Community deleted successfully.";
      if (deleteCommunity.frontImage) {
        const path = process.env.COMMUNITY_FRONT_IMAGE + deleteCommunity.frontImage;
        removeFile(path)
          .then((message) => {
                    })
          .catch((error) => {
                    });
      }
      if (deleteCommunity.backImage) {
        const path = process.env.COMMUNITY_BACK_IMAGE + deleteCommunity.backImage;
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

  // Join community participants.
  joinCommunity = async (req, res) => {

    try {

      let communityId = await communityModel.findById(req.body.communityId);
      let userId = await usersModel.findById(req.body.userId);

      if (communityId) {

        let joinCommunity = await communityParticipantModel.create({
          communityId: communityId._id,
          userId: userId._id
        });

        this.commonResponse.status = 200;
        this.commonResponse.success = true;
        this.commonResponse.data = [];
        this.commonResponse.message = "Community joined successfully.";
      
            }

            else {
        throw "No community found to join.";
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

  // Left community participants.
  leftCommunity = async (req, res) => {

    try {

      let communityId = await communityModel.findById(req.body.communityId);
      let userId = await usersModel.findById(req.body.userId);

      if (communityId) {

        let leftCommunity = await communityParticipantModel.findOneAndDelete({
          communityId: communityId._id,
          userId: userId._id
        });

        if (leftCommunity) {
          this.commonResponse.status = 200;
          this.commonResponse.success = true;
          this.commonResponse.data = [];
          this.commonResponse.message = "Community left successfully.";
        }
                else {
          throw new Error('No such community joined by user.');
        }
      
            }

            else {
        throw new Error('No such community joined by user.');
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
  
  // Get community participants.
  getAllParticipants = async (req, res) => {

    try {

      let communityId = req.params.community_id;
      let allParticipants = await communityParticipantModel.find(
        { communityId: communityId },
        {
          _id: 0,
          communityId: 0,
          createdAt: 0,
          updatedAt: 0
        }
      );

      this.commonResponse.status = 200;
      this.commonResponse.success = true;
      this.commonResponse.message = "Participant successfully fetched.";
      this.commonResponse.data = allParticipants;
    } catch (error) {
      this.commonResponse.data = [];
      this.commonResponse.message = error.message;
      this.commonResponse.success = false;
      this.commonResponse.status = 400;
    } finally {
      res.status(this.commonResponse.status).send(this.commonResponse);
    }
  };

  //get user created community
  getCommunityCreatedByUser = async (req, res) => {
    try {
      // Fetching search query from request query.
      let { userId } = req.params;

      const userCreatedCommunity = await communityModel.find({
        createUserId: userId,
      });

      this.commonResponse.success = true;
      this.commonResponse.status = 200;
      // const modifiedGroups = userCreatedCommunity.map(group => {
      //     if (group.backImage) {
      //         group.backImage = `${process.env.BACKENDURL}${group.backImage}`;
      //     }
      //     if (group.frontImage) {
      //         group.frontImage = `${process.env.BACKENDURL}${group.frontImage}`;
      //     }
      //     return group;
      // });
      if (userCreatedCommunity && userCreatedCommunity.length > 0) {
        this.commonResponse.data = userCreatedCommunity;
        this.commonResponse.message = `${userCreatedCommunity.length} communty created by ${userId}.`;
      } else {
        this.commonResponse.data = [];
        (this.commonResponse.message = "No Community created by "), userId;
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

  //get user joinned community
  getCommunityJoinedByUser = async (req, res) => {
    try {
      let { userId } = req.params;

      const userJoinedCommunity = await communityParticipantModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            role: 2
          },
        },
        {
          $lookup: {
            from: "communities",
            localField: "communityId",
            foreignField: "_id",
            as: "communityDetails",
          },
        },
      ]);

      console.log(userJoinedCommunity);

      this.commonResponse.success = true;
      this.commonResponse.status = 200;
      // const modifiedGroups = userJoinedCommunity.map(group => {
      //     if (group.backImage) {
      //         group.backImage = `${process.env.BACKENDURL}${group.backImage}`;
      //     }
      //     if (group.frontImage) {
      //         group.frontImage = `${process.env.BACKENDURL}${group.frontImage}`;
      //     }
      //     return group;
      // });
      if (userJoinedCommunity && userJoinedCommunity.length > 0) {
        this.commonResponse.data = userJoinedCommunity;
        this.commonResponse.message = `${userJoinedCommunity.length} communty joined by ${userId}.`;
      } else {
        this.commonResponse.data = [];
        (this.commonResponse.message = "No Community join by "), userId;
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

  //get community by
  getCommunityById = async (req, res) => {
    try {
      let { communityId } = req.params;

      const communityExist = await communityModel.findById(communityId);
      if (!communityExist) {
        this.commonResponse.data = [];
        (this.commonResponse.message = "No Community found "), communityId;
      } else {
        const communityDetail = await communityModel.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(communityId),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "createUserId",
              foreignField: "_id",
              as: "userDetails",
            },
          },
          {
            $lookup: {
              from: "community-participants",
              localField: "_id",
              foreignField: "communityId",
              as: "communityParticipants",
            },
          },
          {
            $lookup: {
              from: "posts",
              localField: "_id",
              foreignField: "communityId",
              as: "communityPosts",
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              description: 1,
              createUserId: 1,
              groupImage: 1,
              createdAt: 1,
              updatedAt: 1,
              backImage: 1,
              frontImage: 1,
              isPublic: 1,
              userDetails: 1,
              communityParticipantsDetail: "$communityParticipants",
              communityParticipantsCount: { $size: "$communityParticipants" },
              communityPostsDetail: "$communityPosts",
              communityPostsCount: { $size: "$communityPosts" },
            },
          },
        ]);
        console.log(communityDetail);

        this.commonResponse.success = true;
        this.commonResponse.status = 200;

        this.commonResponse.data = communityDetail[0];
        this.commonResponse.message = `${communityId}communty detail found`;
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
}
