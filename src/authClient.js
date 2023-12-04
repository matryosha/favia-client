import { SERVER_URL as serverUrl } from './serverEndpoints'


class AuthClient {
    #isAuthenticated = false;

    get isAuthenticated() {
        return this.#isAuthenticated;
    }

    init() {
        const authStatus = localStorage.getItem('authStatus')
        if (authStatus !== null) {
            this.#isAuthenticated = true;
            return;
        }
    }

    async exchangeSignCodeToTokenCookie(code) {
        const respone = await fetch(serverUrl + `/exchangeCodeToToken?code=${code}`, {credentials: 'include'})

        return respone.ok
    }

    setAuthenticatedStatus(isAuth) {
        if (isAuth) {
            localStorage.setItem('authStatus', 'yay')
            this.#isAuthenticated = true;
        } else {
            localStorage.removeItem('authStatus');
            this.#isAuthenticated = false;
        }
    }

    async goToAuthPage() {
        const serverGetAuthUrl = `${serverUrl}/request-auth-url;`;

        const response = await fetch(serverGetAuthUrl);
        const { authUrl } = await response.json();

        window.location.href = authUrl;
    }

}

const authClient = new AuthClient();

export const isAuthenticated = () => authClient.isAuthenticated;

export default authClient;
