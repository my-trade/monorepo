const authRoutes = require('./auth/routes');
const alertsRoutes = require('./alerts/alerts');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const symbolsRoutes = require('./symbols/symbols');
const transactionRoutes = require('./transaction/transaction');
const userRoutes = require('./user/user');

module.exports = (client) => {
    const app = express();
    const port = process.env.PORT || 3333;

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/status', async (req, res) => {
        res.send('Service is up.');
    });

    alertsRoutes(client, app);
    authRoutes(client, app);
    symbolsRoutes(client, app);
    transactionRoutes(client, app);
    userRoutes(client, app);

    const server = app.listen(port, '0.0.0.0', () => {
        const host = server.address().address;

        console.log(`MyTrade API listening at http://${host}:${port}`);
    });
}