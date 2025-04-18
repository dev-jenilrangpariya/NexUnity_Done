import { removeFile } from "../helper/removeFile.helper";
import { CommonResponse } from "../models/common.model";
import eventModel, { Event } from "../models/event.model";

export default class EventController {
    
    constructor() { };
    commonResponse = new CommonResponse();

    // Create Event.
    createEvent = async (req, res) => {
        try {
            var eventImage = req.file;
            const { content, location, time, eventName }: Event = req.body;
            const userId = req.user._id;
            // if (createUserId != userId) {
            //     throw new Error("User invalid");
            // }

            if (!eventImage) {
                throw new Error("Something went wrong")
            }
            const categoryId = await eventModel.create({
                content,
                createUserId: userId,
                eventName,
                eventImage: eventImage.filename,
                location,
                time
            })
            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.message = "Event created successfully."
            this.commonResponse.data = categoryId._id;
        } catch (error) {
            const path = process.env.EVENTIMAGE + eventImage.filename;
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

    // Update Event.
    updateEvent = async (req, res) => {
        // Image add eventImage 
        let eventImage = null;
        try {
            const { eventName, content, time, location }: Event = req.body;

            // eventImage is not required
            if ((req.file && req.file.filename && req.file.filename.length > 0)) {
                eventImage = req.file.filename;
            }

            let communityData = await eventModel.findOne({ _id: req.body.id });
            if (!communityData) {
                throw new Error("Event doesn't exist")
            }
            if (eventImage) {
                const path = process.env.EVENTIMAGE + communityData.eventImage;
                removeFile(path)
                    .then((message) => {
                    })
                    .catch((error) => {
                    });
            }
            let updateData = await eventModel.findByIdAndUpdate(req.body.id, {
                eventName, content, time,
                location,
                eventImage: eventImage ? eventImage : communityData.eventImage
            }, { new: true });

            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.data = updateData;
            this.commonResponse.message = "Event updated successfully.";

        }
        catch (error) {
            if (eventImage) {
                const path = process.env.EVENTIMAGE + eventImage;
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

    // Delete Event.
    deleteEvent = async (req, res) => {

        try {
            const { eventid } = req.params;
            let deleteEvent = await eventModel.findByIdAndDelete(eventid);
            if (!deleteEvent) {
                throw new Error("Event doesn't exist")
            }
            this.commonResponse.status = 200;
            this.commonResponse.success = true;
            this.commonResponse.data = [];
            this.commonResponse.message = "Event deleted successfully.";
            if (deleteEvent.eventImage) {
                const path = process.env.EVENTIMAGE + deleteEvent.eventImage;
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

     // Get Eventq.
    getAllEvent = async (req, res) => {
        try {
            const { name } = req.query;
            let groupIds = [];
            if (name) {
                groupIds = await eventModel.find({
                    eventName: {
                        $regex: name,
                        $options: 'i'
                    }
                });
            } else {
                groupIds = await eventModel.find();
            }
            this.commonResponse.success = true;
            this.commonResponse.status = 200;

            if (groupIds && groupIds.length) {
                this.commonResponse.data = groupIds;
                this.commonResponse.message = `${groupIds.length} founded.`;
            }
            else {
                this.commonResponse.data = [];
                this.commonResponse.message = "No event found with entered name.";
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
}