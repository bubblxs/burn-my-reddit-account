import api from "./base-api.js"
import Body from "./classes/body.js"
import { headersCookie } from "./headers.js"

export default async function Save(postId, redditSession, modhash) {
    const data = { id: postId, uh: modhash }
    const body = new Body("post", "api/save", headersCookie(redditSession), data)

    return (await api(body)).data
}