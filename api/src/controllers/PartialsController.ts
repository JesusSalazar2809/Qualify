import { Response } from "express";
import { IGetUserAuthInfoRequest } from "../tools/types";
import { badRequest, internalerror, success } from '../tools/apiResponse';
import { Partials } from '../models/PartialsModel';
import { isValidObjectId, Types } from "mongoose";
import { Groups } from '../models/GroupsModel';


export default {
    create: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const { group_id } = req.body;
            const group = await Groups.findById(group_id);
            if(!isValidObjectId(group_id) || !group){
                return badRequest(res, 'Invalid ID sent')
            }
            await Partials.create(req.body);
            return success(res, 'Partial created successfully')
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
    readOne: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const id: Types.ObjectId = new Types.ObjectId(req.params.id)
            const partials = await Partials.aggregate([
                {
                    $match:{
                        '_id': id
                    }
                },
                {
                    $lookup:{
                        from:'activities',
                        localField:'_id',
                        foreignField:'partial_id',
                        as:"activities"
                    }
                },
                {
                    $lookup:{
                        from:'students',
                        localField:'group_id',
                        foreignField:'group_id',
                        as:"students"
                    }
                },
                {
                    $project:{
                        _id:0,
                        name:1,
                        activities:1,
                        students:1
                    }
                }
            ]);
            return success(res, 'Partial information got successfully', partials.shift())
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
    update: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const { id } = req.params;
            const partial = await Partials.findById(id);
            if(!partial){
                return badRequest(res, "The partial that you want to update doesn't exist")
            }
            await Partials.findByIdAndUpdate(id, req.body)
            return success(res, 'Partial updated successfully')
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