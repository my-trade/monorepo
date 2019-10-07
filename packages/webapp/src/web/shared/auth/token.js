import { Cookies } from 'react-cookie';

const STORAGE_KEY_TOKEN = 'my-trade-token';

const cookies = new Cookies();

export const getToken = () => {
	return cookies.get(STORAGE_KEY_TOKEN);
}

export const hasToken = () => {
	return !!getToken();
}

export const saveToken = (token) => {
	cookies.set(STORAGE_KEY_TOKEN, token, { path: '/' });
}

export const deleteToken = () => {
	cookies.remove(STORAGE_KEY_TOKEN);
}