import process from 'node:process';
import readline from 'node:readline/promises';
import os from 'node:os';

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

async function main(){
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.on("close", () => {
        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
        rl.close();
    });
    rl.on("line", (input) => 
    {
        if(input === ".exit")
        {
            rl.close();
        }
        else
        {
            console.log(`Your command is ${input}`);
            console.log(`You are currently in ${curDir}`);
        }

    });
    console.log(`You are currently in ${curDir}`);
}


parseArgs();
main();
