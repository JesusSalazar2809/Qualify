import { Response } from "express";
import { IGetUserAuthInfoRequest } from "../tools/types";
import { badRequest, internalerror, success } from '../tools/apiResponse';
import { Groups } from "../models/GroupsModel";
import { Types } from 'mongoose';
import { Partials } from '../models/PartialsModel';
import { Students } from "../models/StudentsModel";
import { Activities } from "../models/ActivitiesModel";


export default {
    create: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            await Groups.create({
                teacher_id: req.user?._id,
                name:req.body.name
            });
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
                        name:1,
                        countStudents:{$size:"$students"}
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
                        _id:1,
                        name:1,
                        partials:1
                    }
                }
            ]);
            return success(res, 'Group information got successfully', group.shift())
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
    delete: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const { id } = req.params;
            const partials = await Partials.find({group_id:id}).distinct('_id');
            await Students.remove({group_id:id});
            await Activities.remove({partial_id:{$in:[partials]}});
            await Partials.remove({group_id:id});
            await Groups.findOneAndRemove({_id:id})
            return success(res, 'Group created successfully')
        } catch (error:any) {
            return internalerror(res, 'Problems in the endpoint')
        }
    },
}