const { fromReal } = require('../../util/currency');
const { TIMEOUT } = require('../../util/constants');
const log = require('../../util/log');
const moment = require('moment');

module.exports = async (page) => {
	await page.goto('https://www.rico.com.vc/dashboard/conta/extrato/', { timeout: TIMEOUT });

	await page.waitForSelector('input[ng-model="statementController.startDate"]', { timeout: TIMEOUT });
	await page.click('input[ng-model="statementController.startDate"]', { clickCount: 3 });
	await page.type('input[ng-model="statementController.startDate"]', '01/01/2000');
	await page.click('body', { timeout: TIMEOUT });

	await page.waitFor(2000);
	await page.waitForSelector('.statement-table', { timeout: TIMEOUT });

	const earnings = await page.evaluate(async () => {
		const earnings = [];
		const rowNodes = document.querySelectorAll('.statement-table tbody tr');

		rowNodes.forEach(rowNode => {
			const columns = rowNode.querySelectorAll('td');

			const date = columns[0].innerText.trim();
			const description = columns[2].innerText.trim();
			const value = columns[3].innerText.trim();

			if (
				description.includes('DIVIDENDOS') ||
				description.includes('RENDIMENTOS') ||
				description.includes('JUROS')
			) {
				const parts = description.split(' ');
				const symbol = parts.pop();

				let type = 'dividendo';

				if (description.includes('RENDIMENTOS')) {
					type = 'rendimento';
				}
				else if (description.includes('JUROS')) {
					type = 'juros';
				}

				earnings.push({ date, symbol, type, value });
			}
		});

		return Promise.resolve(earnings);
	});

	return earnings.map(
		({ date, value, ...asset }) => {
			return {
				...asset,
				date: moment(date, 'DD/MM/YYYY').toISOString(),
				value: fromReal(value)
			}
		}
	);
}