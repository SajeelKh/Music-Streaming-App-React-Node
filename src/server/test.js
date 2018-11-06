async function main(){
	promise1 = new Promise((resolve) => setTimeout(resolve, 3000));
	promise2 = new Promise((resolve) => setTimeout(resolve, 4000));
	promise3 = new Promise((resolve) => setTimeout(resolve, 6000));
	await Promise.all([promise1, promise2, promise3]);
	console.log("Done");
}

main();