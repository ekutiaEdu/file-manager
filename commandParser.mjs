export default function parse(commandStr) 
{
    try
    {
        if(!commandStr)
        {
            return {name: "", args:[]};
        }

        const command = commandStr.split(" ")[0];
        const argsStr = commandStr.slice(command.length).trim();
        
        let parsedArgsStr = argsStr;
        let startPos = parsedArgsStr.indexOf("\"");
        let args = [];
        while(startPos !== -1)
        {
            if(startPos > 0)
            {
                let beforeQuoteArgsStr = parsedArgsStr.slice(0, startPos).trim();
                args = args.concat(beforeQuoteArgsStr.split(" "));
            }
            const finishPos = parsedArgsStr.indexOf("\"", startPos + 1);
            if(finishPos === -1)
            {
                throw new Error("Couldn't find close quote.")
            }
            const argInQuotes = parsedArgsStr.slice(startPos + 1, finishPos);
            args.push(argInQuotes);
            parsedArgsStr = parsedArgsStr.slice(finishPos + 1);
            parsedArgsStr = parsedArgsStr.trim();
            startPos = parsedArgsStr.indexOf("\"");
        }
        if(parsedArgsStr)
        {
            args = args.concat(parsedArgsStr.split(" "));
        }
        return {name: command, args: args};
    }
    catch(err)
    {
        throw new Error(`Couldn't parse command string: ${err}`);
    }
}