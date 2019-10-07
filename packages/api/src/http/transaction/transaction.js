const { transaction } = require('../utils/transaction');
const { TransactionService } = require('@my-trade/db');
const authMiddleware = require('../auth/middleware');

module.exports = (client, app) => {
    app.get('/transactions/latest', authMiddleware, (req, res) => {
        const { email } = req.user;

        transaction(
            res,
            async () => {
                const result = await TransactionService.latest(client, email);

                res.send(result);
            }
        );
    });

    app.get('/transactions/highest', authMiddleware, (req, res) => {
        const { email } = req.user;

        transaction(
            res,
            async () => {
                const result = await TransactionService.highest(client, email);

                res.send(result);
            }
        );
    });
};