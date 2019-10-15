const puppeteer = require('puppeteer');
const { EventEmitter } = require('events');

const collectAssets = require('./actions/collectAssets');
const collectTransations = require('./actions/collectTransactions');
const login = require('./actions/login');
const logout = require('./actions/logout');

const log = require('../../util/log');
const { TIMEOUT } = require('../../util/constants');

const configs = {
	headless: true,
	timeout: TIMEOUT,
	args: ['--no-sandbox', '--single-process', '--disable-gpu']
};

if (process.env.CHROMIUM_EXECUTABLE) {
	configs.executablePath = process.env.CHROMIUM_EXECUTABLE

	console.log('Using Chrome from', configs.executablePath);
}

class Worker extends EventEmitter {
	constructor(credentials) {
		super();

		this._credentials = credentials;
	}

	async execute() {
		let transactions = [];

		const browser = await this.createBrowser();
		const page = await this.createPage(browser);

		try {
			await this.login(page, this._credentials);

			transactions = await this.getTransactions(page);

			this.emit('success', transactions);
		}
		catch (error) {
			console.log(error);

			await log(page);

			this.emit('error', error);

			throw error;
		}
		finally {
			this.emit('close');

			await browser.close();
		}

		return transactions;
	}

	async createBrowser() {
		return await puppeteer.launch(configs);
	}

	async createPage(browser) {
		const page = await browser.newPage();

		await page.setViewport({ width: 1280, height: 800 });
		await page.goto('https://cei.b3.com.br/CEI_Responsivo/login.aspx', { waitUntil: 'domcontentloaded', timeout: 0 });

		return page;
	}

	async login(page, credentials) {
		this.emit('loginStart');

		try {
			await login(page, credentials);

			this.emit('loginSuccess');
		}
		catch (error) {
			this.emit('loginFail', error);

			throw error;
		}
	}

	async getAssets(page) {
		this.emit('assetsStart');

		try {
			const assets = await collectAssets(page);

			this.emit('assetsSuccess', { assets });

			return assets;
		}
		catch (error) {
			this.emit('assetsFail', error);

			throw error;
		}
	}

	async getTransactions(page) {
		this.emit('transactionsStart');

		try {
			const transactions = await collectTransations(page);

			this.emit('transactionsSuccess', { transactions });

			return transactions;
		}
		catch (error) {
			this.emit('transactionsFail', error);

			throw error;
		}
	}
}

module.exports = Worker;