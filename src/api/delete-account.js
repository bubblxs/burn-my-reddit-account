import api from "./base-api.js"
import Body from "./classes/body.js"

export default async function DeleteAccount(username, password, modhash, redditSession) {
    const data = {
        confirm: "on",
        deactivate_message: "",
        id: "#pref - deactivate",
        passwd: password,
        uh: modhash,
        user: username,
    }
    const headers = {
        'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': `reddit_session=${redditSession};`
    }
    const body = new Body("post", "api/deactivate_user", headers, data)

    return (await api(body)).data
}