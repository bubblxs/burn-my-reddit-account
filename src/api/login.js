import api from "./base-api.js"
import Body from "./classes/body.js"
import { headers } from "./headers.js"

export default async function Login(username, password) {
    const data = {
        api_type: "json",
        user: username,
        passwd: password,
        rem: "yes",
        op: "login",
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