const { getAuthData, getToken, revokeToken } = require('./auth');
const { transaction } = require('../utils/transaction');
const { UserService, NoSuchUserException } = require('@my-trade/db');
const AuthException = require('../exceptions/AuthException');
const HttpException = require('../exceptions/HttpException');
const authMiddleware = require('./middleware');

module.exports = (client, app) => {
	app.post('/auth/signin', (req, res) => {
		const { code } = req.body;

		transaction(
			res,
			async () => {
				if (!code) {
					throw new HttpException('[code] is required.');
				}

				try {
					const token = await getToken(code);
					const { email, name } = await getAuthData(token);
					const user = { email, name };

					// Sign in automatically creates a new user
					try {
						await UserService.get(client, { email });
					}
					catch (error) {
						if (error instanceof NoSuchUserException) {
							await UserService.add(client, user);
						}
						else {
							throw error;
						}
					}

					res.send({
						...token,
						email
					});
				}
				catch (error) {
					console.log(error);
					throw new AuthException(error);
				}
			}
		);
	});

	app.post('/auth/signout', authMiddleware, (req, res) => {
		const { token } = req;

		transaction(
			res,
			async () => {
				await revokeToken(token);

				res.sendStatus(200);
			}
		);
	});

	app.post('/auth/validate', authMiddleware, (req, res) => {
		transaction(
			res,
			async () => {
				res.send({
					ok: true
				});
			}
		);
	});
};