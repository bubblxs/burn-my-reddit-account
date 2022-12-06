import prompts from "prompts"
import Login from "./api/login.js"

export async function GetCredentials() {
    let username = await prompts({
        type: "text", name: "username", message: "Username"
    })
    let password = await prompts({
        type: "password", name: "password", message: "Password",
        validate: async (passwrd) => await VerifyCredentials(username.username, passwrd) ? true : "wrong password"
    })

    return {
        username: username.username,
        password: password.password
    }
}

export async function VerifyCredentials(username, password) {
    const res = await Login(username, password)

    return res.error ? false : true
}