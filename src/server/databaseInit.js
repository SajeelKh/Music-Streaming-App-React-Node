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
	return new Promise(resolve => {
		do {
			console.log("======>",foldersArr);
			// console.log(path.join(CONFIG.folderPath, foldersArr.pop()));
			fs.readdir(path.join(CONFIG.folderPath, foldersArr.pop()), (err, files) => {

				files.forEach((file) => {
					fs.stat(path.join(CONFIG.folderPath, file), (err, stats) => {

						if(path.extname(file) !== '.mp3' && !stats.isDirectory())
							return;

						if(stats.isDirectory()) {
							if(foldersArr.indexOf(file) === -1){
								console.log(file);
								foldersArr.push(file);
								console.log("Array", foldersArr);
							}
						}

						else{
							const readableSongStream = fs.createReadStream(path.join(CONFIG.folderPath, file));
							let uploadStream = bucket.openUploadStream(file);
							let song = {};

							readableSongStream.pipe(uploadStream);

							mmd.parseFile(path.join(CONFIG.folderPath, file)).then( metadata => {
								song = {
									duration: metadata.format.duration || 0,
									title: metadata.common.title || 'Unknown',
									artist: metadata.common.albumartist || 'Unknown',
									album: metadata.common.album || 'Unknown',
									genre: metadata.common.genre || 'Unknown',
								}
							}).catch((err) => {
								console.log(err);
							});

							uploadStream.on('error', (err) => {
								console.log(err, ` Can't upload the song ${file}`);
							})

							uploadStream.on('finish', (err) => {
								console.log("FINISH!");
								db.collection('songs').insert(song, (err, result) => {
									if(err)
										console.log(`Can't add a record of ${file}`);
								});
							})
						}
			
						// console.log("Database Ready!");
					});
				});
			});
			console.log('///////',foldersArr.length);
		}while(foldersArr.length !== 0);
	})
	console.log("HEEELLLLLLLLOOOOOOOOOOO!!!");
	resolve();
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