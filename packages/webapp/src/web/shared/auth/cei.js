import { Cookies } from 'react-cookie';

const STORAGE_KEY_CEI = 'my-trade-cei';

const cookies = new Cookies();

export const getCEI = () => {
    const cei = cookies.get(STORAGE_KEY_CEI);

    if (cei) {
        return cei;
    }

	return null;
}

export const hasCEI = () => {
	return !!getCEI();
}

export const saveCEI = ({cpf, senha}) => {
	cookies.set(STORAGE_KEY_CEI, JSON.stringify({cpf, senha}), { path: '/' });
}

export const deleteCEI = () => {
	cookies.remove(STORAGE_KEY_CEI);
}