import api from "./base-api.js"
import Body from "./classes/body.js"
import { headersCookie } from "./headers.js"

export default async function JoinSubreddit(subredditId, modhash, redditSession) {
    const data = {
        action: "sub",
        sr: subredditId,
        uh: modhash
    }
    const body = new Body("post", "api/subscribe", headersCookie(redditSession), data)

    return (await api(body)).data
}