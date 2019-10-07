module.exports = (page) => {
	page.on('console', msg => {
		for (let i = 0; i < msg.args().length; ++i)
			console.log(`${i}: ${msg.args()[i]}`);
	});
}