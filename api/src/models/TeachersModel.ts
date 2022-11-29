import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';


interface ITeacher extends Document{
    name:string;
    email:string;
    password:string;
}


const teacherShcema = new Schema<ITeacher>({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
});

teacherShcema.pre('save', async function (next) {
    const user = this;
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
})

teacherShcema.methods.isValidPassword = async function(password: string | Buffer) {
    const user = this;
    const compare = bcrypt.compare(password, user.password);
    return compare;
}

export const Teacher = model<ITeacher>('teachers', teacherShcema);