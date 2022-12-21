export type TGroup = {
    _id?:string,
    students?:TStudent[],
    countStudents:number,
    name:string,
    teacher_id?:string,
    partials?:TPartial[]
    createdAt?:Date,
    updateAt?:Date
}

export type TStudent = {
    name:string,
    scores:TScores[],
    group_id:string,
    createdAt: Date,
    updateAt: Date,
}

export type TScores = {
    activity_id: string,
    score: number,
    createdAt: Date,
    updateAt: Date,
}

export type TPartial = {
    _id?:string,
    name:string,
    group_id:string,
    activities?:any,
    students?:TStudent[],
}