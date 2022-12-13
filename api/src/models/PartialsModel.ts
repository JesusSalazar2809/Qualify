import { Document, Schema, model, Types } from 'mongoose';

interface IPartials extends Document{
    name:string;
    group_id:Types.ObjectId;
    createdAt: Date;
    updateAt: Date;
}

const partialShcema = new Schema<IPartials>({
    name:{
        type: String,
        required: true
    },
    group_id:{
        type: Schema.Types.ObjectId,
        ref:'groups',
        required: true
    },
},{timestamps: true});

export const Partials = model<IPartials>('partials', partialShcema);