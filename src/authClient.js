const serverUrl = 'http://localhost:5000'

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

        // Check uri param that could indicate that auth is good
        if (window.location.search.includes('authResult=yay')) {
            this.setAuthenticatedStatus(true)

            let searchParams = new URLSearchParams(window.location.search);
            searchParams.delete('authResult');
            if (history.replaceState) {
                let searchString = searchParams.toString().length > 0 ? '?' + searchParams.toString() : '';
                let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + searchString + window.location.hash;
                history.replaceState(null, '', newUrl);
            }
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
