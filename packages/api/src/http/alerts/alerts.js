const { transaction } = require('../utils/transaction');
const { AlertsService } = require('@my-trade/db');
const authMiddleware = require('../auth/middleware');

module.exports = (client, app) => {
    app.get('/alerts/list', authMiddleware, async (req, res) => {
        const { email } = req.user;

        transaction(
            res,
            async () => {
                res.send(await AlertsService.list(client, email));
            }
        );
    });

    app.post('/alerts/save', authMiddleware, async (req, res) => {
        const { email } = req.user;
        const alert = { ...req.body };
        const value = parseFloat(req.body.value);

        transaction(
            res,
            async () => {
                res.send(await AlertsService.save(client, email, { ...alert, value }));
            }
        );
    });

    app.post('/alerts/remove', authMiddleware, async (req, res) => {
        const { alertId } = { ...req.body };

        transaction(
            res,
            async () => {
                res.send(await AlertsService.remove(client, alertId));
            }
        );
    });
};