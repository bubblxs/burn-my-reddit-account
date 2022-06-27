import api from "./base-api.js"
import Body from "./classes/body.js"

export default async function Save(postId, redditSession, modhash) {
    const data = { id: postId, uh: modhash }
    const headers = {
        'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': `reddit_session=${redditSession};`
    }
    const body = new Body("post", "api/save", headers, data)

    return (await api(body)).data
}