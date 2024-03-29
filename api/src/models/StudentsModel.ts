import { Document, Schema, model, Types } from 'mongoose';

interface IScores{
    activity_id: Types.ObjectId;
    score: number;
    createdAt: Date;
    updateAt: Date;
}
interface IStudents extends Document{
    name:string;
    scores:IScores;
    group_id:Types.ObjectId;
    createdAt: Date;
    updateAt: Date;
}

const ScoreSchema = new Schema<IScores>({
    activity_id: {
        type: Schema.Types.ObjectId,
        ref:'activities',
    },
    score: {
        type: Number,
    },
},{timestamps: true})

const studentShcema = new Schema<IStudents>({
    name:{
        type: String,
        required: true
    },
    scores:[ScoreSchema],
    group_id:{
        type: Schema.Types.ObjectId,
        ref:'groups',
        required: true
    },
},{timestamps: true});

export const Students = model<IStudents>('students', studentShcema);