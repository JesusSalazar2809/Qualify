import {Teacher } from "../models/TeachersModel";
import { Request, Response } from "express";
import { badRequest, internalerror, success } from '../tools/apiResponse';
import isValidEmail from 'is-valid-email';
import { generateToken } from "../tools/util";

export default {
    signIn: async (req: Request, res: Response) =>{
        try {
            const { email, password } = req.body;
            const teacher: any = await Teacher.findOne({email});
            if(!teacher){
                return badRequest(res, "Something went wrong we're while validating a teacher · Email")
            }
            if(!await teacher.isValidPassword(password)){
                return badRequest(res, "Something went wrong we're while validating a teacher · Password")
            }
            const token:string = await generateToken(teacher)
            return success(res, 'Teacher verified successfully', token)
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
    signUp: async (req: Request, res: Response) =>{
        try {
            const { email } = req.body;
            if(!isValidEmail(email)){
                return badRequest(res,'Email invalid')
            }
            const teacher: any = await Teacher.findOne({email});
            if(teacher){
                return badRequest(res, "Email is already in use")
            }
            await Teacher.create(req.body);
            const token:string = await generateToken(teacher)
            return success(res, 'Teacher created successfully', token)
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
}