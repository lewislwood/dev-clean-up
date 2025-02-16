const { clear } = require('node:console');
const fs = require('node:fs');
const path = require("path");  


const zoneSearch = RegExp(/Zone\.Identifier$/);
const flags = {
    "help": false,
    "verbose": false,
    "test": false,
    "zone": false,
    "confirmed": false,
    }
    const folders = {
        "start": ".",
        "ignore": [".git", ".testdata"],
        "delete": ['dist', ".next","node_modules"]
    }

const isDirOrEmpty = (fileName) => {
if (fileName === "") return false; 
     return (! fs.statSync(fileName).isFile());
};

const helpOutput = `
devCleanUp Utility  <Tool>Short for Developer Clean Up
This is a Nodejs  Script for cleaning up and is customizable.

syntax:
devCleanUp [options] [start folder path]
[start folder path] - defaults "."  (* current folder *)
-v or --verbose  outputs details of what it is doing
-t or --test Test run (non destructive)
-z  Zone delte, deletes the zone.identifier files.
-y   Auto Comfirm without asking user to confirm that they want to clean up
-i or --ignore followed by equals sign (=) then a comma delimited list of folders to add to the ignore list. 
     ie: devCleanUp -i=images,assets . // Starts in current folder ignores [.git,.testdata,images,assets]
       ** the inital value always ignores [.git, .testdata]
       -d or --delete is followed by a comma delimitted list of folders to delete.  Replaces default folders
          ie: devCleanUp -d=dist,temp  //Replaces default list [dist,.next,node_modules] with [dist,temp]  are deleted
          -h or --help  displays this help screen.

          written by Lewis Wood
          https://lewislwood.com
`


function displayHelp() {
console.log(helpOutput );
}

async function devDelete( fileName) {
    try {
        console.log(`Deleting ${fileName}`);
        
        if (! flags.test) fs.rmSync(fileName, {recursive: true,});
    }
    catch(err) {
        console.log(fileName,err.message);
    }
}; //devDelete
function devCleanUp(folderPath) {
    if (flags.verbose) console.log(`Processing... ${folderPath}`);
fs.readdirSync(folderPath)
    .map((fileName) => {
        if (folders.ignore.includes(fileName)) return "";
        if (folders.delete.includes(fileName))  {
            devDelete(path.join(folderPath, fileName));
            return ""
        }
        const  fullName = path.join(folderPath, fileName);
        if ((flags.zone) && (zoneSearch.test(fileName))){
            if (flags.verbose) console.log(`Zone delete: ${fullName}`);
            if (! flags.test) fs.rmSync(fullName);
            return "";
        }
        return path.join(folderPath, fileName);
    })
    .filter( isDirOrEmpty)
    .forEach((fPath) =>{ devCleanUp(fPath)} );
   
}; //devCleanUp

function getChar() {
  let buffer = Buffer.alloc(1)
  fs.readSync(0, buffer, 0, 1)
  return buffer.toString('utf8')
}



function parseArgs() {
let pArgs= [...process.argv];
const caller = pArgs.shift();
const theScript = pArgs.shift();

while (pArgs.length > 0) {
    const cArg = pArgs.shift();
    switch(true) {
        case /^\-v/i.test(cArg):
            flags.verbose = true;
            break;
            case /^\-t/i.test(cArg):
                flags.test = true;
                break;
                case /^\-i\=/i.test(cArg) || /^\-\-ignore\=/i.test(cArg):
                    folders.ignore =  [...cArg.replace(/^\-i\=/i,"").replace(/^\-\-ignore\=/i,"").split(","), folders.ignore];
                    break;
                    case /^\-d/.test(cArg) || /^\-\-delete\=/.test(cArg): 
                    folders.delete=  cArg.replace(/^\-d\=/,"").replace(/^\-\-delete\=/,"").split(",");
                    break;
                    case /^\-z/i.test(cArg):
                        flags.zone = true;
                        break;
                        case /^\-y/.test(cArg):
                            flags.confirmed = true;
                            break;
                            case /^\-Y/.test(cArg):
                                break;  // Do nIgnore it and just ask question perhaps caps lock
case /^\-h/i.test(cArg) || /^\-\-help/i.test(cArg):
    flags.help = true;
    break;
case /^\-/.test(cArg):
console.log(`invalid Option: ${cArg}`);
flags.help = true;
flags.verbose = false;
break;
default:
    folders.start = cArg;
    }
}
    if (flags.help) flags.verbose = false;
    if (flags.verbose) {
//  console.log(`Program: ${caller} Script: ${theScript }  CWD: ${process.cwd()} `);
 console.log(`Test Run: ${flags.test}  Zone Delete Files: ${flags.zone}`)
 console.log(`Ignore Folders: [${folders.ignore.join(",")}]`);
 console.log(`Delete Folders: [${folders.delete.join(",")}]`)
}
}; // parseArgs
parseArgs();
if (flags.help) displayHelp()
    else  {
if (! flags.confirmed) {
console.log(`Are you sure you want to clean up development folders (y/n)?`);
flags.confirmed =  /^[yt]/i.test( getChar());
}

if (flags.confirmed) devCleanUp(folders.start);
    }
