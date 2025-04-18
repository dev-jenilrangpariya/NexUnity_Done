import mongoose, { ObjectId } from "mongoose";
import { Relation } from "./common.model";

export class FamilyRelation {
    _id: ObjectId;
    mainUserID: ObjectId;
    relationType: Relation;
    relatedUserID: ObjectId;
    isActive:boolean;
    // familyId: ObjectId;
}

const familyRelationSchema = new mongoose.Schema<FamilyRelation>({
    mainUserID: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    relationType: {
        type: Number,
        enum: Relation,
        required: true
    },
    relatedUserID: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    isActive: {
        type: Boolean,
        default: false,
        required: true
    },
    // familyId: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'family',
    //     required: true
    // }
}, { timestamps: true })

export default mongoose.model('family-relation', familyRelationSchema)