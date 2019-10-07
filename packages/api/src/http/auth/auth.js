const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CLIENT_REDIRECT
} = process.env;

const getClient = () => {
	return new OAuth2Client(
		GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET,
		GOOGLE_CLIENT_REDIRECT
	);
}

const getToken = async (code) => {
	const client = getClient();
	const token = await client.getToken(code);

	return token.tokens;
};

const revokeToken = async (token) => {
	const client = getClient();

	try {
		await client.revokeToken(token.access_token);
	}
	catch (error) {
		// If token is already invalid, do nothing
		console.log(error.data);
		if (!error.data || error.data.error !== 'invalid_token') {
			throw error;
		}
	}
}

const getAuthData = async (token) => {
	const client = getClient();

	client.setCredentials(token);

	var oauth2 = google.oauth2({
		auth: client,
		version: 'v2'
	});

	const response = await oauth2.userinfo.v2.me.get();

	return response.data;
};

const validateToken = async (token) => {
	const client = getClient();

	client.setCredentials(token);

	try {
		await client.verifyIdToken({
			idToken: token.id_token,
			audience: GOOGLE_CLIENT_ID
		});
	}
	catch (error) {
		// if refresh is successfull, we have a valid token
		await client.refreshToken(token.refresh_token);
	}
};

module.exports = {
	getAuthData,
	getToken,
	revokeToken,
	validateToken
};