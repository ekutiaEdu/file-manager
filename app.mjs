import process from 'node:process';
import readline from 'node:readline/promises';
import os from 'node:os';
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'

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
    rl.on("line", (input) => {
        try {
            if (input === ".exit") {
                rl.close();
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
