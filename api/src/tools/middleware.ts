import { Response, NextFunction } from "express"
import { unauthorize } from './apiResponse';
import jwt from 'jsonwebtoken';
import { Teacher } from "../models/TeachersModel";
import { User, IGetUserAuthInfoRequest } from "./types"
export default{
    verifyUser: async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction)=>{
        try {
            if(req.originalUrl != '/api/sign-in' && req.originalUrl != '/api/sign-up'){
                if(req.headers.authorization){
                    const token = req.headers.authorization.split(" ")[1]
                    if(!token){
                        unauthorize(res, "Unauthorized")
                    }
                    const data:any = await jwt.verify(token, process.env.JWT_SECRET || 'Key inexist', {audience:process.env.JWT_AUDIENCE})
                    if(!data){
                        unauthorize(res, "Unauthorized")
                    }
                    const user:User | null = await Teacher.findById(data._id);
                    if(!user){
                        unauthorize(res, "Teacher no found in DB")
                    }
                    req.user = user || undefined;
                    next()
                }else{
                    unauthorize(res,"Authorization field inexist")
                }
            }else{
                next();
            }
        } catch (error:any) {
            unauthorize(res,"something went wrong in validation")
        }
    }
}