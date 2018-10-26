const path = require('path');

arr = [''];

async function returnvalue(){
	//return "Hello!";
	await new Promise(resolve => setTimeout(resolve,10000));
	return "Hello!";
}

async function returnvalue2(){
	//return "Hello!";
	await new Promise(resolve => setTimeout(resolve,10000));
	return "Hi";
}

async function main(){
	console.log(await returnvalue());
	console.log(await returnvalue2());
}

main();