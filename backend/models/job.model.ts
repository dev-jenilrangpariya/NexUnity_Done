import mongoose, { ObjectId } from "mongoose";

export class Job {
    _id: ObjectId;
    title : String;
    createUserId: String;
    companyName: String;
    content : String;
    jobImage: String;
    applicants : any;
}

const jobSchema = new mongoose.Schema<Job>({
    createUserId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    jobImage: {
        type: String,
        required: true
    },
    applicants: {
        type: Number,
        default : 0,
    }
}, { timestamps: true })

export default mongoose.model('job', jobSchema);