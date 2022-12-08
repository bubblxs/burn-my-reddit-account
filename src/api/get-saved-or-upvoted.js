import api from "./base-api.js"
import Body from "./classes/body.js"
import { headersCookie } from "./headers.js"

export default async function GetSavedOrUpvoted(username, redditSession, option) {
    const body = new Body("get", `user/${username}/${option}.json`, headersCookie(redditSession))
    const res = await api(body)

    let responseData = res.data.data.children
    let lastPost = ""
    let count = 25
    let data = []

    for (let i = 0, l = responseData.length; i < l; i++) {
        data.push({
            postId: responseData[i].data.name,
            subreddit: responseData[i].data.subreddit
        })

        if (i + 1 === l) {
            lastPost = responseData[i].data.name
        }
    }

    while (true) {
        count += 25

        let newParams = `user/${username}/${option}.json?count=${count}&after=${lastPost}`
        let body = new Body("get", newParams, headersCookie(redditSession))
        let res = await api(body)
        let data = res.data.data.children

        if (data.length <= 0) {
            return data
        }

        if (data[data.length - 1].data.name === lastPost) {
            break
        }

        for (let i = 0, l = data.length; i < l; i++) {
            data.push({
                postId: data[i].data.name,
                subreddit: data[i].data.subreddit
            })

            if (i + 1 === l) {
                lastPost = data[i].data.name
            }
        }
    }

    return data
}