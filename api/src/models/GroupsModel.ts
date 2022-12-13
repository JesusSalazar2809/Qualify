import { Document, Schema, model, Types } from 'mongoose';

interface IGroups extends Document{
    name:string;
    teacher_id:Types.ObjectId;
    createdAt: Date;
    updateAt: Date;
}

const groupsShcema = new Schema<IGroups>({
    name:{
        type: String,
        required: true
    },
    teacher_id:{
        type: Schema.Types.ObjectId,
        ref:'teachers',
        required: true
    },
},{timestamps: true});

export const Groups = model<IGroups>('groups', groupsShcema);