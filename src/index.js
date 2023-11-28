import { dep } from "./main";
import authClient from "./authClient";

authClient.init()
console.log("New auth status: ", authClient.isAuthenticated ? "Logged in" : "Anonymous")