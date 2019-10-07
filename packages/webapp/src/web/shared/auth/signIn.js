import Client from '@my-trade/client';
import { saveToken } from './token';

const client = new Client();

export default async (history) => {
    const auth2 = gapi.auth2.getAuthInstance();
    const authResult = await auth2.grantOfflineAccess();
    const { code } = authResult;

    if (code) {
        const token = await client.signIn(code);

        saveToken(token);

        history.push('/dashboard/');
    } else {
        console.log('Unable to sign in');
    }
}