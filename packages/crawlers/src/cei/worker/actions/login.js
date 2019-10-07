const { TIMEOUT } = require('../../../util/constants');

module.exports = async (page, credentials) => {
	const {cpf, senha} = credentials;

	await page.click('#ctl00_ContentPlaceHolder1_txtLogin');
	await page.type('#ctl00_ContentPlaceHolder1_txtLogin', cpf);
	await page.click('#ctl00_ContentPlaceHolder1_txtSenha');
	await page.type('#ctl00_ContentPlaceHolder1_txtSenha', senha);
	await page.waitFor(1000);
	await page.click('#ctl00_ContentPlaceHolder1_btnLogar');
	await page.waitForSelector('#ctl00_lblNome', { timeout: TIMEOUT });
};