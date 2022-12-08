import api from "./base-api.js"
import Body from "./classes/body.js"
import { headersCookie } from "./headers.js"

export default async function GetSavedOrUpvoted(username, redditSession, option) {
    const body = new Body("get", `user/${username}/${option}.json`, headersCookie(redditSession))
    const res = await api(body)

    let data = res.data.data.children
    let lastPost = ""
    let count = 25
    let temp = []

    for (let i = 0, l = data.length; i < l; i++) {
        temp.push({
            postId: data[i].data.name,
            subreddit: data[i].data.subreddit
        })

        if (i + 1 === l) {
            lastPost = data[i].data.name
        }
    }

    while (true) {
        count += 25

        let newParams = `user/${username}/${option}.json?count=${count}&after=${lastPost}`
        let body = new Body("get", newParams, headersCookie(redditSession))
        let res = await api(body)
        let data = res.data.data.children

        if (data.length <= 0) {
            return temp
        }

        if (data[data.length - 1].data.name === lastPost) {
            break
        }

        for (let i = 0, l = data.length; i < l; i++) {
            temp.push({
                postId: data[i].data.name,
                subreddit: data[i].data.subreddit
            })

            if (i + 1 === l) {
                lastPost = data[i].data.name
            }
        }
    }

    return temp
}