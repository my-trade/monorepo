const { forEachWithRetries } = require('../utils/utils');
const { UserService, TransactionService } = require('@my-trade/db');
const executeCEIJob = require('@my-trade/crawler-cei');

module.exports = async (client) => {
    const users = await UserService.list(client);

    await forEachWithRetries(users, async ({ email, cei: { cpf, senha } }) => {
        console.log('[Stocks Job]', `Running job for ${email}`);

        const transactions = await executeCEIJob({ cpf, senha });

        await TransactionService.saveAll(client, email, transactions);

        console.log('[Stocks Job]', `Synced ${transactions.length} trades.`);
    })
};