const { EarningsService } = require('@my-trade/db');
const { forEachWithRetries } = require('../utils/utils');
const { UserService } = require('@my-trade/db');
const { executeRico } = require('@my-trade/crawlers');

module.exports = async (client) => {
    const users = await UserService.list(client);

    await forEachWithRetries(users, async ({ email }) => {
        console.log('[Earnings Job]', `Running job for ${email}`);

        const earnings = await executeRico({ username: process.env.RICO_USERNAME, password: process.env.RICO_PASSWORD });
        await EarningsService.saveAll(client, email, earnings);

        console.log('[Earnings Job]', `Synced ${earnings.length} earnings.`);
    })
};