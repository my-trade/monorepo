const { transaction } = require('../utils/transaction');
const { getAuthData, validateToken } = require('./auth');
const AuthException = require('../exceptions/AuthException');
const express = require('express');
const HttpException = require('../exceptions/HttpException');

const middleware = (req, res, next) => {
	const tokenString = req.headers['x-auth'];

	transaction(
		res,
		async () => {
			if (!tokenString) {
				throw new HttpException('This route is only accessible when signed in.');
			}

			let token;

			try {
				token = JSON.parse(tokenString);
			}
			catch (error) {
				throw new AuthException('Invalid token');
			}

			await validateToken(token);

			const authData = await getAuthData(token);

			req.user = authData;
			req.token = token;

			next();
		}
	);
}

const authRouter = express.Router();

authRouter.use(middleware);

module.exports = authRouter;