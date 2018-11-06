const path = require('path');
const util = require('util');
const fs = require('fs');
const CONFIG = require('./CONFIG');

let promisedReaddir = util.promisify(fs.readdir);
let promisedStat = util.promisify(fs.stat);

async function getFolders(files, pathname){
	let wait = ms => new Promise(resolve => setTimeout(resolve(), ms));
	let filter = file => wait(1).then(async() => {
		let stat = await promisedStat(path.join(CONFIG.folderPath, pathname, file));
		if(stat.isDirectory())
			return file;
	});

	async function filterAsync(files) {
		return Promise.all(files.map(file => filter(file))).then((result) => {
			return result.filter(file => file);
		});
	}

	return await filterAsync(files);
}

async function RecursiveDirectorySearch(){
	let directoriesArr = [];
	let tmpArr = [['.']];
	let foldersArr = ['.'];
	let currDirectory = '';

	async function CurrDirectorySearch(){
		currDirectory = path.join(currDirectory, foldersArr.shift());		//concatenate the next dir into curr dir.
		directoriesArr.push(currDirectory);									//note the directory.
		let files = await promisedReaddir(path.join(CONFIG.folderPath, currDirectory));	//Search current directory.
		let folders = await getFolders(files, currDirectory);				//get only folders from current directory.
		tmpArr.unshift(folders);					//push the folders in the array to keep track of the folders of current directory.
		
		if(folders.length <= 0){					//if curr dir contain no folders means its root dir start tracing back.

			let ph = process.platform !== 'win32'?
					currDirectory.split("/"):
					currDirectory.split("\\"); 		//split the path into separate dirs

			while(tmpArr[0].length <= 0){			//while the tmpArr and curr dir contains roots shift them out
				
				tmpArr.shift();						//shift out the last entry in tmpArr which was a empty arr because it root dir and contain no more dirs
				if(tmpArr[0])						//pop out the curr dir or if tmpArr[0] contains entries shift one of them out.
					tmpArr[0].shift();
				else								//this break used when the tmpArr is empty means all the dirs have been traversed.
					break;
				ph.pop();							//pop the root out of current directory

			}
			
			currDirectory = process.platform !== 'win32'?
						ph.join("/"):
						ph.join("\\");				//join the curr dir
		}
		foldersArr.unshift(...folders);

	}

	while(foldersArr.length > 0){
		await CurrDirectorySearch();
	}

	return(directoriesArr);
}