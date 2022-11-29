import jwt from 'jsonwebtoken';

const generateToken = async (data:any) : Promise<string> =>{
    try {
        if(!process.env.JWT_SECRET){
            throw new Error("Secret to create the token, doesn't exist")
        }
        return await jwt.sign(JSON.parse(JSON.stringify(data)), process.env.JWT_SECRET, {audience: process.env.JWT_AUDIENCE});
    } catch (error:any) {
        return error;
    }
}


export {
    generateToken
}