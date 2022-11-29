import { Document, Schema, model, Types } from 'mongoose';

interface IActivities extends Document{
    name:string;
    percentage: number;
    partial_id:Types.ObjectId;
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
});

export const Activities = model<IActivities>('activities', activitiesShcema);