import api from "./base-api.js"
import Body from "./classes/body.js"
import { headersCookie } from "./headers.js"

export default async function DeleteAccount(username, password, modhash, redditSession) {
    const data = {
        confirm: "on",
        deactivate_message: "",
        id: "#pref - deactivate",
        passwd: password,
        uh: modhash,
        user: username,
    } 

    const body = new Body("post", "api/deactivate_user", headersCookie(redditSession), data)

    return (await api(body)).data
}