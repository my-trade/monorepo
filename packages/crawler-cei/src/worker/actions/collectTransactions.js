const { fromReal } = require('../../util/currency');
const { TIMEOUT } = require('../../util/constants');
const moment = require('moment');

module.exports = async (page) => {
	await page.goto('https://cei.b3.com.br/CEI_Responsivo/negociacao-de-ativos.aspx', { timeout: TIMEOUT });
	await page.waitForSelector('#ctl00_ContentPlaceHolder1_ddlAgentes', { timeout: TIMEOUT });

	const brokers = await page.evaluate(async () => {
		const brokers = [];
		const brokerNodes = document.querySelectorAll('#ctl00_ContentPlaceHolder1_ddlAgentes option');

		brokerNodes.forEach(brokerNode => {
			brokers.push(brokerNode.value);
		});

		return Promise.resolve(brokers);
	});

	const transactions = [];

	while (brokers.length) {
		await page.goto('https://cei.b3.com.br/CEI_Responsivo/negociacao-de-ativos.aspx', { timeout: TIMEOUT });
		await page.waitForSelector('#ctl00_ContentPlaceHolder1_ddlAgentes', { timeout: TIMEOUT });

		const brokerId = brokers.shift();

		if (brokerId === '-1') {
			continue;
		}

		await page.evaluate(async (brokerId) => {
			const select = document.querySelector('#ctl00_ContentPlaceHolder1_ddlAgentes');
			const options = select.querySelectorAll('option');

			const findIndex = (value) => {
				let index = -1;

				options.forEach((node, currentIndex) => {
					if (node.value === value) {
						index = currentIndex;
					}
				});

				return index;
			}

			select.selectedIndex = findIndex(brokerId);
		}, brokerId);

		await page.waitFor(1000);
		await page.waitForSelector('#ctl00_ContentPlaceHolder1_btnConsultar', { timeout: TIMEOUT });
		await page.click('#ctl00_ContentPlaceHolder1_btnConsultar', { timeout: TIMEOUT });

		await page.waitForFunction(() => {
			const alertBox = document.querySelector('.alert-box');
			const resultTable = document.querySelector('#ctl00_ContentPlaceHolder1_rptAgenteBolsa_ctl00_rptContaBolsa_ctl00_pnAtivosNegociados');

			return !!resultTable || !!alertBox
		});

		const brokerTransactions = await page.evaluate(async () => {
			const transactions = [];
			const transactionRows = document.querySelectorAll('#ctl00_ContentPlaceHolder1_rptAgenteBolsa_ctl00_rptContaBolsa_ctl00_pnAtivosNegociados table tbody tr');

			transactionRows.forEach(rowNode => {
				const columns = rowNode.querySelectorAll('td');

				const count = columns[6].innerText.trim();
				const date = columns[0].innerText.trim();
				const name = columns[5].innerText.trim();
				const market = columns[2].innerText.trim();
				const value = columns[7].innerText.trim();
				const symbol = columns[4].innerText.trim();
				const type = columns[1].innerText.trim();

				transactions.push({count, name, value, symbol, date, market, type});
			});

			return Promise.resolve(transactions);
		});

		transactions.push(...brokerTransactions);
	}

	return transactions.map(
		({ count, date, value, ...asset }) => {
			return {
				...asset,
				count: parseInt(count, 10),
				date: moment(date, 'DD/MM/YYYY').toISOString(),
				value: fromReal(value)
			}
		}
	);
}