import { Request } from "express"

export interface IGetUserAuthInfoRequest extends Request {
  user?: User // or any other type
}

export interface User{
    name: string;
    email: string;
    password: string;
    _id:string;
}