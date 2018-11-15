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

async function removeSingle(filePath, database){
	db = database;
	let file = process.platform !== 'win32'?
				filePath.split("/"):
				filePath.split("\\");
	let search = await db.collection('songs.files').find({filename:file[file.length-1]}, { _id: 1 } ).limit(1).toArray();
	// console.log(search);

	await bucket.delete(search[0]._id);
	return;
}

async function uploadSingle(filePath, database){
	db = database;

	let file = process.platform !== 'win32'?
					filePath.split("/"):
					filePath.split("\\");

	const stats = await promisedStat(filePath);
	let search = await db.collection('songs.files').find({filename:file[file.length-1]}).toArray();
	// console.log("stat");
	if(path.extname(filePath) !== '.mp3' || stats.isDirectory()){
		throw "Cannot upload, Requested entity is either a folder or not a audio file";
	}
	else if(search.length !== 0){
		// console.log(search);
		console.log(`${filePath} Already Present in the database.`);
		throw "Cannot upload, Requested song already present in database";
	}

	else{
		return await promisedStream(filePath);
	}

}

function uploadSongs(folderPath, files){
	return new Promise((resolve) => {
		let promises = files.map(async(file) => {
			// console.log("forEach");
			let filePath = path.join(CONFIG.rootPath, folderPath, file);
			const stats = await promisedStat(filePath);
			let search = await db.collection('songs.files').find({filename:file}).toArray();
			// console.log("stat");
			if(path.extname(file) !== '.mp3' || stats.isDirectory()){
				return;
			}
			else if(search.length !== 0){
				// console.log(search);
				console.log("Already Present");
				return;
			}
			// if(stats.isDirectory()) {
			// 	if(foldersArr.indexOf(file) === -1){
			// 		// console.log(file);
			// 		foldersArr.push(file);
			// 		console.log("Array", foldersArr);
			// 	}
			// }
			else{
				return promisedStream(filePath);
			}
		});
		//console.log(promises);
		resolve(promises);
	});
}


async function insertSong(file, metadata){
	return new Promise(async(resolve) => {
		let albumArt;

		if(metadata.common.picture){
			let data = "data:" + metadata.common.picture[0].format;
			let encoding = "charset=utf-8";
			let image = metadata.common.picture[0].data.toString('base64');
			albumArt = `${data};${encoding};base64,${image}`;
		}

		let song = {
			duration: metadata.format.duration || 0,
			title: metadata.common.title || 'Unknown',
			artist: metadata.common.albumartist || 'Unknown',
			album: metadata.common.album || 'Unknown',
			genre: metadata.common.genre || 'Unknown',
			picture: metadata.common.picture ? albumArt : undefined,
		}

		// console.log("Song: ", song.picture);

		try{
			await db.collection('songs.files').updateOne({filename: file[file.length-1]}, {$set: song});
		}
		catch(err){
			console.log(`Can't add a record of ${file}`);
		}
		resolve();
	});
}

async function promisedStream(filePath){
	return new Promise(async(resolve, reject) => {
		let file = process.platform !== 'win32'?
					filePath.split("/"):
					filePath.split("\\");

		let readableSongStream = fs.createReadStream(filePath);
		let uploadStream = bucket.openUploadStream(file[file.length-1]);
		readableSongStream.pipe(uploadStream);
		// console.log("promisedStream");
		uploadStream.on('error', (err) => {
			console.log(err, ` Can't upload the song ${file}`);
		})

		uploadStream.on('finish', async() => {
			console.log(`A Song Uploaded ${file[file.length-1]}!`);
			readableSongStream.close();
			
			var metadata = await mmd.parseFile(filePath, {native:true})
			//console.log(metadata);

			await insertSong(file, metadata)
			resolve();
		})
	});
} 

async function connectDatabase(){
	return new Promise(async resolve => {
		try{
        	db = await MongoClient.connect(CONFIG.connString2);
        	// db = client.db;
    	}
	    catch(err){
	        console.log(err,' :MongoDB Connection Error. Please make sure that MongoDB is running.');
	        throw "err";
	        process.exit(1);
	    }

	    bucket = new mongodb.GridFSBucket(db,
		    {
		        bucketName: 'songs',
		    }
		);
		resolve(db);
	})
}

async function searchDirectories(){
	let promises = [];
	let directories = await RecursiveDirectorySearch();
	async function dirPromises(folderPath){
		return new Promise(async(resolve) => {
				const files = await promisedReaddir(path.resolve(CONFIG.rootPath, folderPath));
				// console.log("Readdir");
				let promises = await uploadSongs(folderPath, files);
				// console.log(promises);
				await Promise.all(promises);
				resolve();
		})
	}
	promises = directories.map(folderpath => dirPromises(folderpath));
	// console.log("Promises: ", promises);
	await Promise.all(promises);
}

async function initialize(database){
	console.log("Wait while we set up the database...");
	db = database;
	try{
		await connectDatabase();
		await searchDirectories();
	}
	catch(err){
		console.log(err);
	}
	console.log("Database Ready!");
	return;
}

// initialize();

module.exports = {
	initialize,
	uploadSingle,
	connectDatabase,
	removeSingle,
}