import { Response } from "express"

export  function success(res: Response, msg: string, data: object | Array<any> | string = {}){
    return res.status(200).json({msg, data})
}

export  function badRequest(res: Response, msg: string, data: object | Array<any> | string = {}){
    return res.status(400).json({msg, data})
}

export  function internalerror(res: Response, msg: string, data: object | Array<any> | string = {}){
    return res.status(500).json({msg, data})
}

export  function unauthorize(res: Response, msg: string){
    return res.status(403).json({msg})
}