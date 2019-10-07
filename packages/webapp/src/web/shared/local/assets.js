const STORAGE_KEY_USER_ASSETS = 'my-trade-user-assets';

export const getUserAssets = () => {
	return JSON.parse(localStorage.getItem(STORAGE_KEY_USER_ASSETS) || '[]');
}

export const saveUserAssets = (assets) => {
	localStorage.setItem(STORAGE_KEY_USER_ASSETS, JSON.stringify(assets), { path: '/' });
}