import 'babel-polyfill';
import Client from '@my-trade/client';
import cookiesMiddleware from 'universal-cookie-express';

const cors = require('cors');
const express = require('express');

const client = new Client();
const app = express();
const port = process.env.PORT || 80;

app.use(cors());
app.use(express.static('static'));
app.use(cookiesMiddleware());

const STORAGE_KEY_TOKEN = 'my-trade-token';

const validToken = async (req, res, next) => {
	const token = req.universalCookies.get(STORAGE_KEY_TOKEN);

	if (token) {
		try {
			const response = await client.validateToken(token);

			if (response.error) {
				req.universalCookies.remove(STORAGE_KEY_TOKEN);

				res.redirect('/');
			}
			else {
				next();
			}
		}
		catch (error) {
			req.universalCookies.remove(STORAGE_KEY_TOKEN);

			res.redirect('/');
		}
	}
	else {
		next();
	}
};

const requiredToken = async (req, res, next) => {
	const token = req.universalCookies.get(STORAGE_KEY_TOKEN);

	if (token) {
		next();
	}
	else {
		res.redirect('/');
	}
}

app.use('/', validToken);
app.use('/dashboard/*', requiredToken, validToken);
app.use('*', express.static('static'));

const server = app.listen(port, () => {
	const host = server.address().address;

	console.log(`MyTrade Web listening at http://${host}:${port}`);
});