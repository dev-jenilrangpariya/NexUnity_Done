import { CommonResponse } from "../models/common.model";
import communityModel from "../models/community.model";
import eventModel from "../models/event.model";
import jobModel from "../models/job.model";
import postCategoriesModel from "../models/post-categories,model";
import usersModel from "../models/users.model";

export default class AdminPanelController{
    
    constructor() { };
    commonResponse = new CommonResponse();

    getAllAdminPanelData = async (req,res) =>{
        
        try {

            // To get today's event
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set hours to 00:00:00
            // Get the end of the day
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            let noOfTodayEvents = await eventModel.countDocuments({
                time : {
                    $gte : today,
                    $lte : endOfDay
                }
            })

            // To get number of users.
            let noOfUsers = await usersModel.countDocuments({
                active : true
            })

            // To get number of categories.
            let noOfCategories = await postCategoriesModel.countDocuments();

            // To get number of categories.
            let noOfCommunities = await communityModel.countDocuments();

            // To get number of jobs.
            let noOfJobs = await jobModel.countDocuments();

            // To get number of events.
            let noOfTotalEvents = await eventModel.countDocuments();

            // Making Response
            this.commonResponse.success = true;
            this.commonResponse.status = 200;
            this.commonResponse.data = {
                noOfTodayEvents,
                noOfUsers,
                noOfCategories,
                noOfCommunities,
                noOfJobs,
                noOfTotalEvents
            };
            this.commonResponse.message = "Data fetched";           

    

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
    