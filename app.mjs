import process from 'node:process';
import readline from 'node:readline/promises';
import os from 'node:os';
import greeting from "./greeting.mjs";
import { Filemanager } from './filemanager.mjs';
import parser from "./commandParser.mjs"


greeting.parseArgs();
greeting.welcome();

const filemanager = new Filemanager();

function main(){
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });    
    rl.on("close", () => {
        greeting.byebye();
        rl.close();
    });
    rl.on("line", async (input) => {
        try {
            let command = parser(input);

            if (command.name === ".exit") {
                rl.close();
                return;
            }
            else {
                await filemanager.execute(command);
                console.log(`You are currently in ${filemanager.getCurDir()}`)
            }
        }
        catch (err) {
            console.log(err);
            console.log(`You are currently in ${filemanager.getCurDir()}`)
        }
    });
    //console.log(`You are currently in ${filemanager.getCurDir()}`);
}

main();