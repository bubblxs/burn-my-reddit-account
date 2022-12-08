import api from "./base-api.js"
import Body from "./classes/body.js"
import { headersCookie } from "./headers.js"

export default async function GetSubreddits(redditSession, nameList = true) {
    const notAllowedSubreddits = ["users", "popular", "all", "announcements"]
    const rxFilterLinks = /<a href="https:\/\/old.reddit.com\/(user|r)\/(.*?)\/" class="choice" >(.*?)<\/a>/gim
    const rxRemoveTags = /(<a href="https:\/\/old.reddit.com\/(user|r)\/(.*?)\/" class="choice" >|<\/a>)/gim
    const body = new Body("get", "subreddits", headersCookie(redditSession))
    const res = await api(body)

    let data = (res.data.match(rxFilterLinks)).toString().replace(rxRemoveTags, "").split(",")
    let subredditsNameList = []

    data.map((e) => {
        let exist = subredditsNameList.find(i => i === e)
        let allowed = notAllowedSubreddits.find(i => i === e)

        if (!allowed && !exist) {
            subredditsNameList.push(e)
        }
    })

    if (nameList) {
        return subredditsNameList
    }

    data = []

    for (let i of subredditsNameList) {
        let body = new Body("get", `${i.startsWith("u/") ? i : `r/${i}`}/about.json`, headersCookie(redditSession))
        let res = await api(body)

        if (i.startsWith("u/")) {
            data.push(res.data.data.subreddit.name)

        } else {
            data.push(res.data.data.name)
        }
    }

    return data
}