const { connect } = require('@my-trade/db');
const stocksJob = require('./stocks/stocks');
const earningsJob = require('./earnings/earnings');
const alertsJob = require('./alerts/alerts');
const {wait} = require('./utils/utils');

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

(async () => {
	try {
        const client = await connect();
        
        console.log('[Jobs] Connected');

		await Promise.all([
            new Promise(async () => {
                while (true) {
                    await stocksJob(client);

                    await wait(DAY);
                }
            }),
            new Promise(async () => {
                while (true) {
                    await earningsJob(client);

                    await wait(DAY);
                }
            }),
            new Promise(async () => {
                while (true) {
                    await alertsJob(client);

                    await wait(15 * MINUTE);
                }
            })
        ])
	}
	catch (error) {
		console.error(error);
	}
})();