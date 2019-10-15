const Worker = require('./worker/Worker');

module.exports = async (credentials) => {
	const worker = new Worker(credentials);

	return await worker.execute();
};