import mongoose from "mongoose";

export class Otp{
    
    _id : String;
    email : String;
    isVerified : Boolean;
    createdAt : Date;
    otp : Number;

}

const otpSchema = new mongoose.Schema<Otp>({
    
    email : {
        type : String,
        required : true,
    },
    otp : {
        type : Number,
        required : true,
    },
    isVerified : {
        type : Boolean,
        required : true,
        default : false
    },
    createdAt: {
        type: Date,
        expires: '5m', 
        default: Date.now 
    }
})

export default mongoose.model('otp',otpSchema);