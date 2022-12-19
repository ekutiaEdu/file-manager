
let username = "";

function parseArgs(){
    const args = process.argv.slice(2);
    const usernameArg = args.find(element => {
        if(element.startsWith("--username")){
            return true;           
        }
    });
    username = usernameArg.split("=")[1];
    
}

function welcome() {
    console.log(`Welcome to the File Manager, ${username}!`);
}

function byebye() {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
}

export default {parseArgs, welcome, byebye};