const { connect } = require('@my-trade/db');
const server = require('./http/server');

(async () => {
	try {
		const client = await connect();

		server(client);
	}
	catch (error) {
		console.error(error);
	}
})();