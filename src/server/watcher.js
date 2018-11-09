const chokidar = require('chokidar');
const CONFIG = require('./CONFIG');
const database = require('./databaseInit');
const pathMod = require('path');
var log = console.log.bind(console);

async function main(){
	let db;

	try{
		db = await database.connectDatabase();
	}
	catch(err){
		console.log(`${err}: Watcher could not connect to database.`);
	}

	console.log(`Watcher, watching ${CONFIG.rootPath}...`);

	var watcher = chokidar.watch(CONFIG.rootPath, {
		ignored: /(^|[\/\\])\../,
		persistent: true,
		ignoreInitial: true,
		awaitWriteFinish: {
		    stabilityThreshold: 2000,
		    pollInterval: 100,
	  	},
	});

	watcher
		.on('add', path => {
			log(`File ${path} has been added`)
			database.uploadSingle(path, db)
			.then(() => log(`File ${path} has been uploaded`))
			.catch((err) => log(`${err}: File ${path} could not be uploaded`))  		
		})
		.on('change', path => {
			log(`File ${path} has been changed`);
			if(pathMod.extname(path) === '.mp3') {
				database.removeSingle(path, db).then(() => {
					database.uploadSingle(path, db);
				} ).catch((err) => {
					log(`${err}: File ${path} could not be updated on the database.`);
				})
			}
		})
		.on('unlink', path => {
			log(`File ${path} has been removed from directory`);
			database.removeSingle(path, db)
			.then(() => log(`File ${path} has been removed from database.`))
			.catch((err) => log(`${err}: File ${path} could not be deleted from database.`)) 
		});
}

main();