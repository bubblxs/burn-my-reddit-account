import api from "./base-api.js"
import Body from "./classes/body.js"

export default async function Upvote(postId, subreddit, modhash, redditSession){
    const data = { uh: modhash }
    const urlParams = new URLSearchParams({ dir: 1, id: postId, sr: subreddit })
    const headers = {
        'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': `reddit_session=${redditSession};`
    }
    const body = new Body("post", "api/vote", headers, data, true, urlParams)

    return (await api(body)).data
}