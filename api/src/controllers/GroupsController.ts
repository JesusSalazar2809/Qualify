import { Response } from "express";
import { IGetUserAuthInfoRequest } from "../tools/types";
import { badRequest, internalerror, success } from '../tools/apiResponse';
import { Groups } from "../models/GroupsModel";
import { isValidObjectId, ObjectId, Types } from 'mongoose';
import { Teacher } from '../models/TeachersModel';


export default {
    create: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const { teacher_id } = req.body;
            const teacher = await Teacher.findById(teacher_id);
            if(!isValidObjectId(teacher_id) || !teacher){
                return badRequest(res, 'Invalid ID sent')
            }
            await Groups.create(req.body);
            return success(res, 'Group created successfully')
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
    readAll: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const groups = await Groups.aggregate([
                {
                    $match:{
                        'teacher_id': req.user?._id
                    }
                },
                {
                    $lookup:{
                        from:'students',
                        localField:'_id',
                        foreignField:'group_id',
                        as:"students"
                    }
                },
                {
                    $project:{
                        _id:0,
                        name:1,
                        students:{$size:"$students"}
                    }
                }
            ]);
            return success(res, 'Groups got successfully', groups)
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
    readOne: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const id: Types.ObjectId = new Types.ObjectId(req.params.id)
            const group = await Groups.aggregate([
                {
                    $match:{
                        '_id': id
                    }
                },
                {
                    $lookup:{
                        from:'partials',
                        localField:'_id',
                        foreignField:'group_id',
                        as:"partials"
                    }
                },
                {
                    $project:{
                        _id:0,
                        name:1,
                        partials:1
                    }
                }
            ]);
            return success(res, 'Group information got successfully', group)
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
    update: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const { id } = req.params;
            const group = await Groups.findById(id);
            if(!group){
                return badRequest(res, "The group that you want to update doesn't exist")
            }
            await Groups.findByIdAndUpdate(id, req.body)
            return success(res, 'Group updated successfully')
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