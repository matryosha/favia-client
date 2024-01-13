import { dep } from "main";
import authClient, {isAuthenticated} from "authClient";

authClient.init()
console.log("New auth status: ", authClient.isAuthenticated ? "Logged in" : "Anonymous")


// all re exported here will be available in any place. See webpack config for index.js entry, library option
export {authClient}