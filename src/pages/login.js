import authClient from "../authClient"


const googleLoginBtn = document.getElementById('google-login-btn')
googleLoginBtn.addEventListener('click', async () => {
    authClient.goToAuthPage();
})

console.log('login page code 3')