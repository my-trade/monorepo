const { connect } = require('@my-trade/db');
const stocksJob = require('./stocks/stocks');
const earningsJob = require('./earnings/earnings');
const alertsJob = require('./alerts/alerts');
const {wait} = require('./utils/utils');

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

(async () => {
	try {
        const client = await connect();
        
        console.log('[Jobs] Connected');

        const jobs = [];

        if (process.env.MYTRADE_JOB_STOCKS) {
            console.log('[Jobs] Starting stocks job');

            jobs.push(
                new Promise(async () => {
                    while (true) {
                        await stocksJob(client);
    
                        await wait(2 * HOUR);
                    }
                })
            );
        }

        if (process.env.MYTRADE_JOB_EARNINGS) {
            console.log('[Jobs] Starting earnings job');

            jobs.push(
                new Promise(async () => {
                    while (true) {
                        await earningsJob(client);
    
                        await wait(2 * HOUR);
                    }
                })
            );
        }

        if (process.env.MYTRADE_JOB_ALERTS) {
            console.log('[Jobs] Starting alerts job');

            new Promise(async () => {
                while (true) {
                    await alertsJob(client);

                    await wait(15 * MINUTE);
                }
            })
        }

		await Promise.all(jobs);
	}
	catch (error) {
		console.error(error);
	}
})();