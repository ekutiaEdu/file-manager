import os from 'node:os';
import fsPromise from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import Validator from './fsValidator.mjs';
import { once } from 'node:events';
import { Stream } from 'node:stream';
import streamPromises from 'node:stream/promises';


export class Filemanager {

    constructor(){
        this._curDir = os.homedir();
    }

    async execute(command)
    {
        if(!command.name)
        {
            throw new Error("Invalid input");
        }

        if(command.name == "up")
        {
            this.up();
        }
        else if(command.name == "cd")
        {
            try
            {
                if(command.args.length !== 1)
                {
                    throw new Error("Invalid input");
                }

                const pathToDir = path.resolve(this.getCurDir(), command.args[0]);
                if(!await Validator.isDirectoryExist(pathToDir))
                {
                    throw new Error("Invalid input");
                }
                this.cd(pathToDir);
            }
            catch(err)
            {
                console.log(err);
            }
        }
        else if(command.name === "ls")
        {
            const content = await this.ls();
            console.table(content);
        }
        else if(command.name === "cat")
        {
            if(command.args.length !== 1)
            {
                throw new Error("Invalid input");
            }
            const pathToFile = path.resolve(this.getCurDir(), command.args[0]);
            if(await Validator.isFileExist(pathToFile))
            {
                throw new Error("Invalid input");
            }
            this.cat(pathToFile);
        }
        else if(command.name === "add")
        {
            if(command.args.length !== 1)
            {
                throw new Error("Invalid input");
            }
            const pathToFile = path.resolve(this.getCurDir(), command.args[0]);
            if(!await Validator.isFileExist(pathToFile))
            {
                throw new Error("Invalid input");
            }
            this.add(pathToFile);
        }
        else if(command.name === "rn")
        {
            if(command.args.length !== 2)
            {
                throw new Error("Invalid input");
            }
            const pathToFileOld = path.resolve(this.getCurDir(), command.args[0]);
            const pathToFileNew = path.resolve(this.getCurDir(), command.args[1]);
            const [isOldFileExist, isNewFileExist] = await Promise.all([Validator.isFileExist(pathToFileOld), Validator.isFileExist(pathToFileNew)]);
            if(!isOldFileExist || isNewFileExist)
            {
                throw new Error("Invalid input");
            }
            this.rn(pathToFileOld, pathToFileNew);
        }
        else if (command.name === "cp")
        {
            if(command.args.length !== 2)
            {
                throw new Error("Invalid input");
            }
            const pathToSourceFile = path.resolve(this.getCurDir(), command.args[0]);
            const pathToDir = path.resolve(this.getCurDir(), command.args[1]);
            const pathToDestFile = path.resolve(pathToDir, path.basename(pathToSourceFile));
            const [isSourceFileExist, isDirExist, isDestFileExist] = await Promise.all(
                [
                    Validator.isFileExist(pathToSourceFile), 
                    Validator.isDirectoryExist(pathToDir),
                    Validator.isFileExist(pathToDestFile)
                ]);
            if(!isSourceFileExist || !isDirExist || isDestFileExist)
            {
                throw new Error("Invalid input");
            }
            this.cp(pathToSourceFile, pathToDestFile);
        }
        else if(command.name === "rm")
        {
            if(command.args.length !== 1)
            {
                throw new Error("Invalid input");
            }
            const pathToFile = path.resolve(this.getCurDir(), command.args[0]);
            if(!await Validator.isFileExist(pathToFile))
            {
                throw new Error("Invalid input");
            }
            this.rm(pathToFile);
        }
        else if (command.name === "mv")
        {
            if(command.args.length !== 2)
            {
                throw new Error("Invalid input");
            }
            const pathToSourceFile = path.resolve(this.getCurDir(), command.args[0]);
            const pathToDir = path.resolve(this.getCurDir(), command.args[1]);
            const pathToDestFile = path.resolve(pathToDir, path.basename(pathToSourceFile));
            const [isSourceFileExist, isDirExist, isDestFileExist] = await Promise.all(
                [
                    Validator.isFileExist(pathToSourceFile), 
                    Validator.isDirectoryExist(pathToDir),
                    Validator.isFileExist(pathToDestFile)
                ]);
            if(!isSourceFileExist || !isDirExist || isDestFileExist)
            {
                throw new Error("Invalid input");
            }
            await this.cp(pathToSourceFile, pathToDestFile);
            await this.rm(pathToSourceFile);
        }
    }

    getCurDir() {
        return this._curDir;
    }

    async setCurDir(value) {
        try {
            const dirStat = await fsPromise.stat(value);
            if (dirStat.isDirectory()) {
                this._curDir = value;
            }
            else {
                throw new Error(`Couldn\'t set new current directoty: ${value}`);
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
    
    async up() {
        try {
            let dir = this.getCurDir();
            let newDir = path.resolve(dir, "..");
            await this.setCurDir(newDir);
        }
        catch(err) {
            console.log(`Invalid operation.\n${err}`);
        }
    }

    cd(path) {
        try {
            this.setCurDir(path);
        }
        catch(err) {
            console.log(`Invalid operation.\n${err}`);
        }
    }

    async ls() {
        try{
            const folderContent = await fsPromise.readdir(this.getCurDir(), { withFileTypes: true });
            let list = [];
            folderContent.filter(ent => { 
                return ent.isDirectory();
            }).sort((a, b) => {
                return a.name.localeCompare(b);
            }).forEach(el => {
                list.push({name: el.name, type: "directory"});
            });
            const files = folderContent.filter(ent => { 
                return ent.isFile();
            }).sort((a, b) => {
                return a.name.localeCompare(b);
            }).forEach(el => {
                list.push({name: el.name, type: "file"});
            });
            return list;
        }
        catch(err) {
            console.log(`Invalid operation.\n${err}`);
        }
    }

    async cat(pathToFile)
    {
        try
        {
            const readableFromFile = await fsPromise.createReadStream(pathToFile);
            readableFromFile.pipe(process.stdout);
            await once(readableFromFile, 'end');
        }
        catch(err)
        {
            console.log(`Invalid operation.\n${err}`);
        }
    }

    async add(pathToFile)
    {
        try
        {
            fsPromise.writeFile(pathToFile, "");
        }
        catch(err)
        {
            console.log(`Invalid operation.\n${err}`);
        }
    }

    async rn(pathToFileOld, pathToFileNew)
    {
        try
        {
            fsPromise.rename(pathToFileOld, pathToFileNew);
        }
        catch(err)
        {
            console.log(`Invalid operation.\n${err}`);
        }
    }

    async cp(pathToSourceFile, pathToDestFile)
    {
        try
        {
            const readableFromFile = fs.createReadStream(pathToSourceFile);
            const writableFromFile = fs.createWriteStream(pathToDestFile,);
            await streamPromises.pipeline(readableFromFile, writableFromFile);
        }
        catch(err)
        {
            console.log(`Invalid operation.\n${err}`);
        }
    }

    async rm(pathToFile)
    {
        try
        {
            await fsPromise.unlink(pathToFile, "");
        }
        catch(err)
        {
            console.log(`Invalid operation.\n${err}`);
        }
    }
}