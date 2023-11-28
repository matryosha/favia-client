import authClient from "../authClient";

console.log(authClient);

(async function (){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const signInCode = urlParams.get('signInCode');

    if (signInCode === undefined) {
        console.log('no code found')
        return
    }

    const isSuccessful = await authClient.exchangeSignCodeToTokenCookie(signInCode)
    if (isSuccessful) {
        authClient.setAuthenticatedStatus(true)
        window.location.href = '/'
        return
    }

})();