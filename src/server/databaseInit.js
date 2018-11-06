const fs = require('fs');
const mmd = require('music-metadata');
const path = require('path');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const CONFIG = require('./CONFIG');
const util = require('util');
const { RecursiveDirectorySearch } = require('./directories');

 
let db;
let bucket;
let promisedReaddir = util.promisify(fs.readdir);
let promisedStat = util.promisify(fs.stat);

function forEachFileStream(folderPath, files){
	return new Promise((resolve) => {
		let promises = files.map(async(file) => {
			// console.log("forEach");
			const stats = await promisedStat(path.join(CONFIG.rootPath, folderPath, file));
			// console.log("stat");
			if(path.extname(file) !== '.mp3' || stats.isDirectory())
				return;

			// if(stats.isDirectory()) {
			// 	if(foldersArr.indexOf(file) === -1){
			// 		// console.log(file);
			// 		foldersArr.push(file);
			// 		console.log("Array", foldersArr);
			// 	}
			// }
			else{
				return promisedStream(folderPath, file);
			}
		});
		//console.log(promises);
		resolve(promises);
	});
}


async function insertSong(metadata){
	return new Promise(async(resolve) => {
		let song = {
			duration: metadata.format.duration || 0,
			title: metadata.common.title || 'Unknown',
			artist: metadata.common.albumartist || 'Unknown',
			album: metadata.common.album || 'Unknown',
			genre: metadata.common.genre || 'Unknown',
		}

		try{
			 await db.collection('songs').insert(song);
		}
		catch(err){
			console.log(`Can't add a record of ${file}`);
		}
		resolve();
	});
}

async function promisedStream(folderPath, file){
	return new Promise(async(resolve, reject) => {
		let readableSongStream = fs.createReadStream(path.join(CONFIG.rootPath, folderPath, file));
		let uploadStream = bucket.openUploadStream(file);
		readableSongStream.pipe(uploadStream);

		uploadStream.on('error', (err) => {
			console.log(err, ` Can't upload the song ${file}`);
		})

		uploadStream.on('finish', async() => {
			console.log("FINISH!");
			readableSongStream.close();
			
			var metadata = await mmd.parseFile(path.join(CONFIG.rootPath, folderPath, file), {native:true})
			//console.log(metadata);

			await insertSong(metadata)
			resolve();
		})
	});
} 

async function connectDatabaseBucket(){
	return new Promise(resolve => {
		MongoClient.connect(CONFIG.connString2, (err, client) => {
		    if(err){
		        console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
		        process.exit(1);
		    }
		    console.log("Database connected...");
		    db = client;

		    bucket = new mongodb.GridFSBucket(db,
			    {
			        bucketName: 'songs',
			    }
			);
			resolve();
		});
	})
}

async function uploadSongs(){
	let promises = [];
	let directories = await RecursiveDirectorySearch();
	async function dirPromises(folderPath){
		return new Promise(async(resolve) => {
				const files = await promisedReaddir(path.resolve(CONFIG.rootPath, folderPath));
				// console.log("Readdir");
				let promises = await forEachFileStream(folderPath, files);
				// console.log(promises);
				await Promise.all(promises);
				resolve();
		})
	}
	promises = directories.map(folderpath => dirPromises(folderpath));
	console.log("Promises: ", promises);
	await Promise.all(promises);
}

async function initialize(){
	console.log("Wait while we set up the database...");
	try{
		await connectDatabaseBucket();
		await uploadSongs();
	}
	catch(err){
		console.log(err);
	}
	console.log("Database Ready!");
}

initialize();

module.exports = {
	initialize,
}