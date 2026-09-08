import readline from "node:readline/promises";
import {stdin as input, stdout as output} from "node:process";
import fs from "node:fs/promises";
import path from "node:path";


export default class MyFile {

    public static FILE_TO_PATH = path.join('logs', 'logs.txt');

    public static async isFileExists(path: string): Promise<boolean> {
        try {
            await fs.access('./logs/logs.txt');
            return true;
        } catch {
            console.log("File does not exist");
            return false;
        }
    }

    public static async getContent(): Promise<string> {
        const rl = readline.createInterface({input, output})
        try {
            return await rl.question("Enter your content: ");
        } finally {
            rl.close();
        }
    }

    public static async writeToFile(filePath: string, content: string): Promise<void> {
        try {
            //await fs.writeFile(filePath, content, 'utf8');
            await fs.appendFile(filePath, content, 'utf8');
            console.log("File successfully written to " + filePath);
        } catch (error) {
            console.error('File was not written, ' + error);
        }
    }

    public static async readFile(filePath: string): Promise<void> {
        try {
            const data: string = await fs.readFile(filePath, 'utf8');
            console.log(data);
        } catch (error) {
            console.error('File was not written, ' + error);
        }
    }
}