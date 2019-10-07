const { AssetService, EarningsService, UserService, TransactionService } = require('@my-trade/db');
const { getStockPrice } = require('@my-trade/stocks');
const { transaction } = require('../utils/transaction');
const authMiddleware = require('../auth/middleware');
const HttpException = require('../exceptions/HttpException');

module.exports = (client, app) => {
    app.post('/user/add', authMiddleware, (req, res) => {
        const user = { ...req.body };

        transaction(
            res,
            async () => {
                const result = await UserService.add(client, user);

                res.send(result);
            }
        );
    });

    app.post('/user/updateCEI', authMiddleware, (req, res) => {
        const cei = { ...req.body };
        const { email } = req.user;

        transaction(
            res,
            async () => {
                const result = await UserService.updateCEI(client, email, cei);

                res.send(result);
            }
        );
    });

    app.get('/user/assets', authMiddleware, (req, res) => {
        const { email } = req.user;

        transaction(
            res,
            async () => {
                const symbols = await TransactionService.groupByStock(client, email);
                const stocks = await Promise.all(
                    symbols.map(async ({ _id: symbol }) => {
                        const price = await getStockPrice(symbol);
                        const transactions = await TransactionService.findBySymbol(client, email, symbol);
                        const earnings = await EarningsService.list(client, email, symbol);

                        return {
                            amount: transactions.reduce((total, { count, type }) => {
                                if (type === 'C') {
                                    return total + count;
                                }

                                return total - count;
                            }, 0),
                            symbol,
                            price,
                            earnings,
                            transactions
                        }
                    })
                );

                res.send(stocks);
            }
        );
    });

    app.get('/user/get', authMiddleware, (req, res) => {
        const { email } = req.user;

        transaction(
            res,
            async () => {
                if (!email) {
                    throw new HttpException('[email] is required.')
                }

                const result = await UserService.get(client, { email });
                const { ceiCPF, ceiSenha } = result;

                res.send({
                    ...req.user,
                    ...result,
                    ceiComplete: !!(ceiCPF && ceiSenha)
                });
            }
        );
    });

    app.get('/user/list', authMiddleware, (req, res) => {
        transaction(
            res,
            async () => {
                const result = await UserService.list(client);

                res.send(result);
            }
        );
    });
};