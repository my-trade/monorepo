const { EarningsService } = require('@my-trade/db');
const { forEachWithRetries } = require('../utils/utils');
const { UserService } = require('@my-trade/db');
const executeRicoJob = require('@my-trade/crawler-rico');

module.exports = async (client) => {
    const users = await UserService.list(client);

    await forEachWithRetries(users, async ({ email }) => {
        console.log('[Earnings Job]', `Running job for ${email}`);
    
        const earnings = await executeRicoJob({ username: process.env.RICO_USERNAME, password: process.env.RICO_PASSWORD });
        await EarningsService.saveAll(client, email, earnings);

        console.log('[Earnings Job]', `Synced ${earnings.length} earnings.`);
    })
};