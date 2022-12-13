import { Document, Schema, model, Types } from 'mongoose';

interface IActivities extends Document{
    name:string;
    percentage: number;
    partial_id:Types.ObjectId;
    createdAt: Date;
    updateAt: Date;
}

const activitiesShcema = new Schema<IActivities>({
    name:{
        type: String,
        required: true
    },
    percentage:{
        type: Number,
        required: true
    },
    partial_id:{
        type: Schema.Types.ObjectId,
        ref:'partials',
        required: true
    },
},{timestamps: true});

export const Activities = model<IActivities>('activities', activitiesShcema);