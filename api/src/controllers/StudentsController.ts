import { Response } from "express";
import { IGetUserAuthInfoRequest } from "../tools/types";
import { badRequest, internalerror, success } from '../tools/apiResponse';
import { Students } from '../models/StudentsModel';
import { Groups } from '../models/GroupsModel';
import { isValidObjectId, Types } from "mongoose";
import { Activities } from '../models/ActivitiesModel';
import Excel from 'exceljs';
import path from 'path';
import fs from 'fs';

export default {
    create: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const { students, group_id, partial_id } = req.body;
            const group = await Groups.findById(group_id);
            if(!isValidObjectId(group_id) || !group){
                return badRequest(res, 'Invalid ID sent')
            }
            let obj = [];

            const currentActivities = await Activities.distinct("_id",{partial_id})
            const scores:any[] = [];
            await currentActivities.map((id:string)=>{
                const activity ={
                    activity_id:new Types.ObjectId(id),
                    score:0
                }
                scores.push(activity);
            })

            if(students.length > 0){
                for(let student of students){

                    const newStudent = {
                        name:student,
                        group_id,
                        scores
                    }
                    obj.push(newStudent)
                }
            }

            await Students.insertMany(obj)
            return success(res, "Students saved successfully")
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
    update: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const { id } = req.params;
            const students = await Students.findById(id);
            if(!students){
                return badRequest(res, "The students that you want to update doesn't exist")
            }
            await Students.findByIdAndUpdate(id, req.body)
            return success(res, 'Student updated successfully')
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
    delete: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const { id } = req.params;
            const students = await Students.findById(id);
            if(!students){
                return badRequest(res, "The students that you want to delete doesn't exist")
            }
            await Students.findByIdAndDelete(id)
            return success(res, 'Student deleted successfully')
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
    readFile: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            if(req.file?.path){
                //Variable to that will save the names to save
                const namesToUpload: Array<any> = [];
                //Declaring the path of the file
                const pathFile = path.resolve(req.file?.path)
                //Create de work book
                const workbook = new Excel.Workbook();
                //Read the content of the file
                const content = await workbook.xlsx.readFile(pathFile);
                //Row where we are going to start
                const rowStartIndex = 1;
                //Selecting the work sheet that we are going to use
                const worksheet = content.worksheets[0];
                //Getting the total of rows
                const numberOfRows = worksheet.rowCount;
                //Getting the rows in the interval determined
                const rows = worksheet.getRows(rowStartIndex, numberOfRows) ?? [];
                //Maping the rows and saving the name in the variable
                await rows.map((row:any)=>{
                    if(getCellValue(row, 1)){
                        namesToUpload.push(getCellValue(row, 1))
                    }
                })
                //Remove file unused
                fs.unlink(pathFile, (err:any)=>{
                    if(err) throw err;
                    console.log("File deleted")
                })
                //Send the variable to confirm wich studunts will be save
                return success(res, 'This are the students that you will save', namesToUpload)
            }else{
                return badRequest(res,"Invalid file's path")
            }
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
    assignActivities: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const { id } = req.params;
            const { students_id } = req.body;
            const activity = await Activities.findById(id);
            if(!activity){
                return badRequest(res, "The activity that you want to asign doesn't exist")
            }
            await Students.updateMany({_id:students_id},
                {
                    $push:{
                        scores:{
                            activity_id: id,
                            score: 0
                        }
                    }
                }
            );
            return success(res, 'Activity added successfully')
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
    saveScores: async (req: IGetUserAuthInfoRequest, res: Response) =>{
        try {
            const { students } = req.body;
            for(const student of students){
                await Students.findByIdAndUpdate(student._id, student)
            }
            return success(res, 'Scores saved successfully')
        } catch (error:any) {
            console.log(error)
            return internalerror(res, 'Problems in the endpoint')
        }
    },
}

const getCellValue = (row:  Excel.Row, cellIndex: number) => {
    const cell = row.getCell(cellIndex);
    return cell.value ? cell.value.toString() : '';
};