import { Response } from "express";
import { IGetUserAuthInfoRequest } from "../tools/types";
import { badRequest, internalerror, success } from '../tools/apiResponse';
import { Partials } from '../models/PartialsModel';
import { isValidObjectId } from "mongoose";
import { Activities } from '../models/ActivitiesModel';


export default {
    create: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const { partial_id } = req.body;
            const partial = await Partials.findById(partial_id);
            if(!isValidObjectId(partial_id) || !partial){
                return badRequest(res, 'Invalid ID sent')
            }
            await Activities.create(req.body);
            return success(res, 'Activity created successfully')
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
    update: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const { id } = req.params;
            const activity = await Activities.findById(id);
            if(!activity){
                return badRequest(res, "The activity that you want to update doesn't exist")
            }
            await Activities.findByIdAndUpdate(id, req.body)
            return success(res, 'Activity updated successfully')
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
    //Pending to check
    /* delete: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const { teacher_id } = req.body;
            const teacher = await Teacher.findById(teacher_id);
            if(!isValidObjectId(teacher_id) || !teacher){
                return badRequest(res, 'Invalid ID sent')
            }
            await Groups.create(req.body);
            return success(res, 'Group created successfully')
        } catch (error:any) {
            return internalerror(res, 'Problems in the endpoint')
        }
    }, */
}