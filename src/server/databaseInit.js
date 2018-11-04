const fs = require('fs');
const mmd = require('music-metadata');
const path = require('path');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const CONFIG = require('./CONFIG');
const util = require('util');
const { Readable } = require('stream');
 
let db;
let bucket;
let filesArr = [];
let foldersArr = [''];
let promisedReaddir = util.promisify(fs.readdir);
let promisedStat = util.promisify(fs.stat);

function forEachFileStream(files){
	return new Promise((resolve) => {
		let promises = files.map(async(file) => {
			// console.log("forEach");
			const stats = await promisedStat(path.join(CONFIG.folderPath, file));
			// console.log("stat");
			if(path.extname(file) !== '.mp3' && !stats.isDirectory())
				return;

			if(stats.isDirectory()) {
				if(foldersArr.indexOf(file) === -1){
					// console.log(file);
					foldersArr.push(file);
					// console.log("Array", foldersArr);
				}
			}
			else{
				return promisedStream(file);
			}
		});
		//console.log(promises);
		resolve(promises);
	});
}

// class PromiseParallelizer {
// 	constructor(){
// 		this.promises = [];
// 		this.length = 0;
// 		this.firstPass = true;
// 	}

// 	push(promise){
// 		this.promises.push(promise);
// 		this.length++;
// 		this.life;
// 	}

// 	repeat(){
// 		if(this.promises.length <= 0){
// 			repeat();
// 		}
// 		else
// 			return;
// 	}

// 	all(){
// 		return new Promise((resolve) => {
// 			if(this.firstPass && this.length === 0){
// 				this.firstPass = false;
// 				this.repeat();
// 				Promise.all(promises).then(() => {

// 				});

// 			}

// 		})
// 		// return new Promise(async(resolve) => {
// 		// 	console.log(`Promises: ${this.promises}, ${this.promises.length}`);
// 		// 	if (this.promises.length === 0){
// 		// 		console.log("DASDASD");
// 		// 		await setInterval(() => {
// 		// 			return new Promise((resolve) => {
// 		// 				if(this.promises.length > 0)
// 		// 					resolve();
// 		// 			})

// 		// 		}, 0)
// 		// 	}

// 		// 	Promise.all(this.promises).then(async() => {
// 		// 		await setTimeout(() => {
// 		// 			return new Promise((resolve) => {
// 		// 				if(this.promises.length !== this.length)
// 		// 					this.all()
// 		// 				resolve();
// 		// 			})
// 		// 		},2000)
// 		// 	})
// 		// 	resolve();
// 		// })
// 	}

// }

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

async function promisedStream(file){
	return new Promise(async(resolve, reject) => {
		let readableSongStream = fs.createReadStream(path.join(CONFIG.folderPath, file));
		let uploadStream = bucket.openUploadStream(file);
		readableSongStream.pipe(uploadStream);

		uploadStream.on('error', (err) => {
			console.log(err, ` Can't upload the song ${file}`);
		})

		uploadStream.on('finish', async() => {
			console.log("FINISH!");

			var metadata = await mmd.parseFile(path.join(CONFIG.folderPath, file), {native:true})
			console.log(metadata);

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
	return new Promise(async(resolve) => {
		// do {
		// 	console.log("======>",foldersArr);
			// console.log(path.join(CONFIG.folderPath, foldersArr.pop()));
			const files = await promisedReaddir(path.join(CONFIG.folderPath, foldersArr.pop()));
			console.log("Readdir");
			//const promises = new PromiseParallelizer();
			

				
				// console.log("else");
					
				let promises = await forEachFileStream(files);
				console.log(promises);
				Promise.all(promises).then(() => resolve());
				console.log("through");
				
				
				// console.log("Database Ready!");
			//});
			
		// 	console.log('///////',foldersArr.length);
		// }while(foldersArr.length !== 0);
	// console.log("HEEELLLLLLLLOOOOOOOOOOO!!!");
	})
}

async function main(){
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

main();