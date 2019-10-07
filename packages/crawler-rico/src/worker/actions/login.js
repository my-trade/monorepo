const { TIMEOUT } = require('../../util/constants');
const {enterKeyboardPassword} = require('./keyboard');

module.exports = async (page, credentials) => {
	const {username, password} = credentials;

	await page.click('input[ng-model="loginController.username"]');
	await page.type('input[ng-model="loginController.username"]', username);

	await page.click('button[type="submit"]');

	await enterKeyboardPassword(page, password);

	await page.waitForSelector('#homeBrokerLink', { timeout: TIMEOUT });
};