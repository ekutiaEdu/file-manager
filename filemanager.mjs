import os from 'node:os';
import fsPromise from 'node:fs/promises';
import path from 'node:path';


export class Filemanager {

    constructor(){
        this._curDir = os.homedir();
    }

    getCurDir() {
        return this._curDir;
    }

    async setCurDir(value) {
        const dirStat = await fsPromise.stat(value);
        if(dirStat.isDirectory()) {
            this._curDir = value;
        }
        else {
            throw new Error(`Couldn\'t set new current directoty: ${value}`);
        }
    }

    up() {
        try {
            this.setCurDir(path.resolve(this.getCurDir(), "../"));
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
            let index = 0;
            let list = [];
            folderContent.filter(ent => { 
                return ent.isDirectory();
            }).sort((a, b) => {
                return a.name.localeCompare(b);
            }).forEach(el => {
                list.push({index: index++, name: el.name, isDir: true});
            });
            const files = folderContent.filter(ent => { 
                return ent.isFile();
            }).sort((a, b) => {
                return a.name.localeCompare(b);
            }).forEach(el => {
                list.push({index: index++, name: el.name, isDir: false});
            });
            return list;
        }
        catch(err) {
            console.log(`Invalid operation.\n${err}`);
        }
    }
}