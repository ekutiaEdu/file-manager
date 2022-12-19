import process from 'node:process';
import readline from 'node:readline/promises';
import os from 'node:os';
import * as StreamPromises from "stream/promises";
import fsSync from 'node:fs';
import path from 'node:path';
import { once } from 'node:events';
import greeting from "./greeting.mjs";
import { Filemanager } from './filemanager.mjs';

let curDir = os.homedir();

greeting.parseArgs();
greeting.welcome();

function main(){
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const filemanager = new Filemanager();
    rl.on("close", () => {
        greeting.byebye();
        rl.close();
    });
    rl.on("line", async (input) => {
        try {
            if (input === ".exit") {
                rl.close();
                return;
            }
            else if (input === "up") {
                filemanager.up();
            }
            else if (input.startsWith("cd")) {
                const args = input.split(" ");
                const newCurDir = path.resolve(curDir, args[1]);
                if(fsSync.existsSync(newCurDir)) {
                    curDir = newCurDir;
                }
                else {
                    throw new Error("Invalid input");
                }
            }
            else if (input == "ls") {
                //TODO: add table view
                const fileContent = await filemanager.ls();
                console.log(fileContent);
            }
            else if(input.startsWith("cat")) {
                //TODO: check path and name with space symbols
                //TODO: add try for invalid input
                //TODO: add acync
                const args = input.split(" ");
                const filePathAbs = path.resolve(curDir, args[1]);
                if(fsSync.existsSync(filePathAbs) && fsSync.lstatSync(filePathAbs).isFile()) {
                    const readableFromFile = fsSync.createReadStream(path.resolve(filePathAbs));
                    readableFromFile.pipe(process.stdout);
                    await once(readableFromFile, 'end');
                }
                else {
                    throw new Error("Invalid input");
                }
            }
            else if(input.startsWith("add")) {
                //TODO: check path and name with space symbols
                try {
                    const args = input.split(" ");
                    if(args.length !== 2) {
                        throw new Error("Invalid input");
                    }
                    const filePath = path.resolve(curDir, args[1]);
                    if(fsSync.existsSync(filePath)){
                        throw new Error("Invalid input");
                    }
                    fsSync.writeFileSync(filePath, "");
                }
                catch(err) {
                    console.log(err);
                }
            }
            else if(input.startsWith("rn")) {
                //TODO: check path and name with space symbols
                try {
                    const args = input.split(" ");
                    if(args.length !== 3) {
                        throw new Error("Invalid input");
                    }
                    const oldFilePath = path.resolve(curDir, args[1]);
                    const newFilePath = path.resolve(curDir, args[2]);
                    if(!fsSync.existsSync(oldFilePath)){
                        throw new Error("Invalid input");
                    }
                    fsSync.renameSync(oldFilePath, newFilePath);
                }
                catch(err) {
                    console.log(err);
                }
            }

            else {
                throw new Error("Invalid input");
            }
        }
        catch (err) {
            console.log(err);
        }
        console.log(`You are currently in ${filemanager.getCurDir()}`);
    });
    console.log(`You are currently in ${curDir}`);
}

main();
