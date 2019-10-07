const puppeteer = require('puppeteer');
const { EventEmitter } = require('events');

const collectEarnings = require('./actions/collectEarnings');
const login = require('./actions/login');

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
		let earnings = [];

		const browser = await this.createBrowser();
		const page = await this.createPage(browser);

		try {
			await this.login(page, this._credentials);

			earnings = await this.getEarnings(page);

			this.emit('success', earnings);
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

		return earnings;
	}

	async createBrowser() {
		return await puppeteer.launch(configs);
	}

	async createPage(browser) {
		const page = await browser.newPage();

		await page.setViewport({ width: 1280, height: 800 });
		await page.goto('https://www.rico.com.vc/login/', { waitUntil: 'domcontentloaded', timeout: 0 });

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

	async getEarnings(page) {
		this.emit('earningsStart');

		try {
			const earnings = await collectEarnings(page);

			this.emit('earningsSuccess', { earnings });

			return earnings;
		}
		catch (error) {
			this.emit('earningsFail', error);

			throw error;
		}
	}
}

module.exports = Worker;