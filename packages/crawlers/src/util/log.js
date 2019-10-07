module.exports = async (page, message = '[Log]') => {
	const stamp = (new Date()).getTime();
	const path = `/tmp/${stamp}.png`;
	await page.screenshot({ path });
	console.log(message, path);
}