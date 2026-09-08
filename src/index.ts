import {stdout, stdin} from "node:process";
import MyFile from './files.js';
import path from "node:path";


const FILE_TO_PATH: string = path.join('logs', 'logs.txt');
const isFileExists: boolean = await MyFile.isFileExists(FILE_TO_PATH);

if(!isFileExists){

}

stdout.write("Enter content: ");

const data = await MyFile.getContent();
await MyFile.writeToFile(FILE_TO_PATH, data);

await MyFile.readFile(FILE_TO_PATH);
