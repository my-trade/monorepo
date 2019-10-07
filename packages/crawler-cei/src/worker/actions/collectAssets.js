const { fromReal } = require('../../util/currency');
const { TIMEOUT } = require('../../util/constants');
const log = require('../../util/log');

module.exports = async (page) => {
	await page.goto('https://cei.b3.com.br/CEI_Responsivo/ConsultarCarteiraAtivos.aspx', { timeout: TIMEOUT });
	await page.waitForSelector('#ctl00_ContentPlaceHolder1_btnConsultar', { timeout: TIMEOUT });
	await page.click('#ctl00_ContentPlaceHolder1_btnConsultar', { timeout: TIMEOUT });
	await page.waitForSelector('#ctl00_ContentPlaceHolder1_btnConsultar', { timeout: TIMEOUT });
	await page.waitForFunction(
		'document.querySelector("body").innerText.includes("Conta nº")',
	);

	const assets = await page.evaluate(async () => {
		const assets = [];
		const wallets = document.querySelectorAll('[id*="BodyCarteira"]');

		wallets.forEach(walletNode => {
			const rows = walletNode.querySelectorAll('tbody tr');
			
			rows.forEach(rowNode => {
				const columns = rowNode.querySelectorAll('td');

				const name = columns[0].innerText.trim();
				const symbol = columns[2].innerText.trim();
				const count = columns[5].innerText.trim();
				const price = columns[4].innerText.trim();

				assets.push({count, name, price, symbol});
			});
		});

		return Promise.resolve(assets);
	});

	return assets.map(
		({ price, ...asset }) => {
			return {
				...asset,
				price: fromReal(price)
			}
		}
	);
}