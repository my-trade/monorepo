import Client from '@pebble-finances/client';
import { deleteToken, getToken } from '../../shared/auth/token';

const client = new Client();

export default async (history) => {
    const token = getToken();

    deleteToken();

    try {
        await client.signOut(token);
    }
    catch (error) {
        console.log('Error trying to sign out');
    }

    history.push('/');
}