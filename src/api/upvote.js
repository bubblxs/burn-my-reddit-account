import api from "./base-api.js"
import Body from "./classes/body.js"
import { headersCookie } from "./headers.js"

export default async function Upvote(postId, subreddit, modhash, redditSession) {
    const data = { uh: modhash }
    const urlParams = new URLSearchParams({ dir: 1, id: postId, sr: subreddit })
    const body = new Body("post", "api/vote", headersCookie(redditSession), data, true, urlParams)

    return (await api(body)).data
}