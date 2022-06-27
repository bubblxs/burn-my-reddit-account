import api from "./base-api.js"
import Body from "./classes/body.js"

export default async function Login(username, password) {
    const data = {
        api_type: "json",
        user: username,
        passwd: password,
        rem: "yes",
        op: "login",
    }
    const headers = {
        'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }
    const body = new Body("post", `api/login/${username}`, headers, data)
    const res = await api(body)

    if (res.data.json?.errors?.length > 0) {
        return { error: res.data.json.errors[0][1] }
    }

    return {
        username: username,
        modhash: res.data.json.data.modhash,
        redditSession: (res.headers["set-cookie"]).toString().split(";").join("").split(",").find(i => i.match(/(reddit_session=)/g)).trimStart().split(" ")[0].split("=")[1]
    }
}