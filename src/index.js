import { dep } from "./main";
import authClient, {isAuthenticated} from "./authClient";

authClient.init()
console.log("New auth status: ", authClient.isAuthenticated ? "Logged in" : "Anonymous")

document.addEventListener('DOMContentLoaded', () => {
    const loginBtnsContainer = document.getElementById('login-btns-container')
    if (isAuthenticated()) {
        loginBtnsContainer.style.display = 'none'
    }
})