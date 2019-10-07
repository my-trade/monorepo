import { fetch } from 'cross-fetch'
import jsonp from 'jsonp-promise';

const ENDPOINT = 'http://homepi.ddns.net:3333';

const uri = (path) => `${ENDPOINT}${path}`;

const withBody = (body, token) => ({
	method: 'post',
	body: JSON.stringify(body),
	headers: {
		"Content-Type": "application/json",
		'x-auth': token && JSON.stringify(token)
	}
});

const withAuthHeader = (token) => ({
	headers: {
		'x-auth': JSON.stringify(token)
	}
});

class Client {
	constructor() {

	}

	async getSymbolValue(token, symbol) {
		const response = await fetch(
			uri(`/symbols/${symbol}/value`)
		);
		const {value} = await response.json();

		return value;
	}

	async signIn(code) {
		const response = await fetch(
			uri('/auth/signin'),
			withBody({ code })
		);

		return await response.json();
	}

	async validateToken(token) {
		const response = await fetch(
			uri('/auth/validate'),
			{
				method: 'post',
				...withAuthHeader(token)
			}
		);

		return await response.json();
	}

	async signOut(token) {
		return await fetch(
			uri('/auth/signout'),
			{
				...withAuthHeader(token),
				method: 'post'
			}
		);
	}

	async getUser(token) {
		const response = await fetch(
			uri('/user/get'),
			withAuthHeader(token)
		);

		return await response.json();
	}

	async listAlerts(token) {
		const response = await fetch(
			uri('/alerts/list'),
			withAuthHeader(token)
		);

		return await response.json();
	}

	async listUsers(token) {
		const response = await fetch(
			uri('/user/list'),
			withAuthHeader(token)
		);

		return await response.json();
	}

	async listSymbols(token) {
		const response = await fetch(
			uri('/symbols/list'),
			withAuthHeader(token)
		);

		return await response.json();
	}

	async listUserAssets(token) {
		const response = await fetch(
			uri('/user/assets'),
			withAuthHeader(token)
		);

		return await response.json();
	}

	async saveAlert(token, alert) {
		const response = await fetch(
			uri('/alerts/add'),
			{
				method: 'post',
				...withBody(alert, token)
			}
		);

		return await response.json();
	}

	async removeAlert(token, alertId) {
		const response = await fetch(
			uri('/alerts/remove'),
			{
				method: 'post',
				...withBody({alertId}, token)
			}
		);

		return await response.json();
	}

	async updateCEI(token, cei) {
		const response = await fetch(
			uri('/user/updateCEI'),
			{
				...withBody(cei, token)
			}
		);

		return await response.json();
	}
}

export default Client;