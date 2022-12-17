import process from 'node:process';
import readline from 'node:readline/promises';
import os from 'node:os';
import * as StreamPromises from "stream/promises"
import fsSync from 'node:fs'
import path from 'node:path'
import { once } from 'node:events';

let username = "";
let curDir = os.homedir();

function parseArgs(){
    const args = process.argv.slice(2);
    const usernameArg = args.find(element => {
        if(element.startsWith("--username")){
            return true;           
        }
    });
    username = usernameArg.split("=")[1];
    console.log(`Welcome to the File Manager, ${username}!`);
}

function main(){
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.on("close", () => {
        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
        rl.close();
    });
    rl.on("line", async (input) => {
        try {
            if (input === ".exit") {
                rl.close();
                return;
            }
            else if (input === "up") {
                curDir = path.resolve(curDir, "../");
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
                const content = fsSync.readdirSync(curDir, { withFileTypes: true });
                let index = 0;
                for(const dirEnt of content) {
                    console.log(`${index}\t${dirEnt.name}\t\t${dirEnt.isDirectory() ? "directory" : "file"}`);
                    index++;
                }
            }
            else if(input.startsWith("cat")) {
                const args = input.split(" ");
                const filePath = path.resolve(curDir, args[1]);
                if(fsSync.existsSync(filePath) && fsSync.lstatSync(filePath).isFile()) {
                    const readableFromFile = fsSync.createReadStream(path.resolve(filePath));
                    readableFromFile.pipe(process.stdout);
                    await once(readableFromFile, 'end');
                }
                else {
                    throw new Error("Invalid input");
                }
            }
            else {
                throw new Error("Invalid input");
            }
        }
        catch (err) {
            console.log(err);
        }
        console.log(`Your command is ${input}`);
        console.log(`You are currently in ${curDir}`);
    });
    console.log(`You are currently in ${curDir}`);
}


parseArgs();
main();
