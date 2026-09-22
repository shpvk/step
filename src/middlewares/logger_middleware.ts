import {Request, Response, NextFunction} from "express"
import FileWorker from "../utils/fileWorker.js"
import path from "node:path"
 
export const loggerMiddleware = async (req:Request,res:Response,next:NextFunction)=>{
    console.log("Run middleware logger")
    const FILE_TO_PATH = path.join("logs","logs.txt")
    let message = `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
    if(req.params) {
        const params = JSON.stringify(req.params)
        message += ` params: ${params}`
    }
    if(req.query) {
        const query = JSON.stringify(req.query)
        message += ` query: ${query}`
    }
    if(req.body) {
        const body = JSON.stringify(req.body)
        message += ` body: ${body}`
    }
    await FileWorker.writeToFile(FILE_TO_PATH, message)
    next()
}
