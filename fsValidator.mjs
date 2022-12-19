import fsPromise from 'node:fs/promises';
import path from 'node:path';

async function isDirectoryExist(path)
{
    try {
        const dirStat = await fsPromise.stat(path);
        return dirStat.isDirectory();
    }
    catch (err) {
        return false;
    }
}

async function isFileExist(path)
{
    try {
        const dirStat = await fsPromise.stat(path);
        return dirStat.isFile();
    }
    catch (err) {
        return false;
    }
}

export default {isDirectoryExist, isFileExist}