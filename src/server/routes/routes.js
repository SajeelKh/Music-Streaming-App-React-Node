const fs = require('fs');
const multer = require('multer');
const mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const { Readable } = require('stream');
const CONFIG = require('../CONFIG');

module.exports = function(trackRoute, db){
	trackRoute.get('/', (req, res) => {
	    let bucket = new mongodb.GridFSBucket(db,
	        {
	            bucketName: 'songs'
	        }
	    );

	    res.header('Access-Control-Allow-Origin', "*");
	    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	    res.header('Access-Control-Allow-Headers', 'Content-Type');
	    // res.set('content-type', 'application/json');
	    //res.set('accept-ranges', 'bytes');

	    db.collection("songs.files").find({}).toArray((err, docs) => {
	        // console.log("------------------------------------------------");
	        // console.log(docs);
	        res.send(docs);
	        //res.end();
	    });
	});

	trackRoute.get('/:trackID', (req, res) => {
	    try{
	        var trackID = new ObjectID(req.params.trackID);
	    }
	    catch(err){
	        return res.status(400).json({ message:" :Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" });
	    }

	    res.set('content-type', 'audio/mp3');
	    res.set('accept-ranges', 'bytes');
	    // res.set('Transfer-Encoding', 'chunked');

	    let bucket = new mongodb.GridFSBucket(db,
	        {
	            bucketName: 'songs'
	        }
	    );

	    let downloadStream = bucket.openDownloadStream(trackID);

	    // downloadStream.pipe(res);
	    let accChunks = 0;
	    let fileLength = 0;

	    downloadStream.on('file', (file) => {
	    	console.log(file);
	    	fileLength = file.length;
	    	res.set('content-length', file.length);
	    });

	    downloadStream.on('data', (chunk) => {
	    	console.log("Sent chunk: ", chunk.length);
	    	let bt = 'bytes ' + accChunks + '-' + (accChunks+chunk.length) + '/' + fileLength;
	    	// console.log("BT: ", bt);
			// res.set('content-range', 'bytes ' + accChunks + '-' + (accChunks+chunk.length) + '/' + fileLength);

	        res.write(chunk);
	    });

	    downloadStream.on('error', (err) => {
	        res.sendStatus(404);
	    });

	    downloadStream.on('end', () => {
	        res.end();
	    });

	    // let readableSongStream = fs.createReadStream("C:\\Users\\Sajeel\\Music\\Demons - Imagine Dragons.mp3");
	    // readableSongStream.pipe(res);
	});

	trackRoute.post('/', (req, res) => {
	    const storage = multer.memoryStorage();
	    const upload = multer(
	        {
	            storage:storage,
	            limits: {
	                fields: 1,
	                fileSize: 10000000,
	                files: 1,
	                parts: 2, 
	            }
	        }
	    );

	    upload.single('song')(req, res, (err) => {
	        if(err){
	            return res.status(400).json({ message: "Upload Request Validation Failed" });
	        }
	        else if(!req.body.name){
	            return res.status(400).json({message: "No track name in request body"});
	        }

	        let trackName = req.body.name;

	        const readableTrackStream = new Readable();
	        readableTrackStream.push(req.file.buffer);
	        readableTrackStream.push(null);

	        let bucket = new mongodb.GridFSBucket(db,{
	            bucketName: 'songs',
	        });

	        let uploadStream = bucket.openUploadStream(trackName);
	        let id = uploadStream.id;

	        readableTrackStream.pipe(uploadStream);

	        uploadStream.on('error', (err) => {
	            return res.status(400).json({message: "Error uploading file"});
	        });

	        uploadStream.on('finish', () => {
	            return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
	        });
	    });
	});

}