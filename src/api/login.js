import api from "./base-api.js"
import Body from "./classes/body.js"
/* import { headers } from "./headers.js" */

export default async function Login(username, password) {
    const data = {
        api_type: "json",
        user: username,
        passwd: password,
        rem: "yes",
        op: "login",
    }
    const headers = {
        "sec-ch-ua": '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        "Accept": 'application/json, text/javascript, */*; q=0.01',
        "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
        "sec-ch-ua-mobile": "?0",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36", "X-Requested-With": "XMLHttpRequestContent-Type:application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua-platform": "Windows"
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