const { transaction } = require('../utils/transaction');
const { getAllSymbols, getStockPrice, getStockPriceAndChange } = require('@my-trade/stocks');

module.exports = (client, app) => {
    app.get('/symbols/list', async (req, res) => {
        transaction(
            res,
            async () => {
                res.send(await getAllSymbols());
            }
        );
    });

    app.get('/symbols/:symbol/value', async (req, res) => {
        const { symbol } = { ...req.params };

        transaction(
            res,
            async () => {
                const value = await getStockPrice(symbol);

                res.send({value});
            }
        );
    });

    app.get('/symbols/:symbol/value_change', async (req, res) => {
        const { symbol } = { ...req.params };

        transaction(
            res,
            async () => {
                const result = await getStockPriceAndChange(symbol);

                res.send(result);
            }
        );
    });
};