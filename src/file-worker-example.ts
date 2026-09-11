import path from "node:path";
import { mkdir } from "node:fs/promises";
import FileWorker from "./FileWorker.ts";

const FILE_TO_PATH = path.join("logs", "logs.txt");

await mkdir("logs", { recursive: true });
FileWorker.path = FILE_TO_PATH;
let content: string | undefined = await FileWorker.getContent();
await FileWorker.writeToFile(FILE_TO_PATH, content);
content = (await FileWorker.readFile(FILE_TO_PATH))?.toString("utf-8");
console.log(`Content from file:\n ${content}`);
