#!/usr/bin/env node
const fetch = require('cross-fetch');
const Worker = require('../worker/Worker');

const withBody = (body) => ({
	method: 'post',
	body: JSON.stringify(body),
	headers: {
		"Content-Type": "application/json"
	}
});

var argv = require('yargs')
	.usage('Usage: $0 --credentials --endpoint')
	.describe('credentials', 'JSON of job credentials')
	.describe('endpoint', 'Http endpoint that will receive job data')
	.demandOption(['credentials'])
	.argv;

(async () => {
	try {
		const credentials = JSON.parse(argv.credentials);
		const { endpoint } = argv;

		const send = async (event, payload = {}) => {
			if (endpoint) {
				await fetch(
					`${endpoint}/${event}`,
					withBody(payload)
				);
			}

			console.log(event, payload);
		}

		const worker = new Worker(credentials);

		// login
		worker.on('loginStart', async () => await send('loginStart'));
		worker.on('loginSuccess', async () => await send('loginSuccess'));
		worker.on('earningsStart', async () => await send('earningsStart'));
		worker.on('earningsSuccess', async (earnings) => await send('earningsSuccess', earnings));
		worker.on('error', async (error) => {
			await send('jobFailed', error);

			process.exit(1);
		});
		worker.on('success', async () => {
			await send('jobSuccess');

			process.exit(0);
		});

		await worker.execute();
	}
	catch (error) {
		console.error(error);

		process.exit(1);
	}
})();