import fs from "fs"
import prompts from "prompts"
import Save from "./api/save.js"
import Login from "./api/login.js"
import Upvote from "./api/upvote.js"
import JoinSubreddit from "./api/join-subreddit.js"
import { GetCredentials } from "./interaction.js"

export default async function ImportAccountData() {
    const { filePath } = await prompts({
        type: "text",
        name: "filePath",
        message: "File path"
    })
    const { subreddits, upvoted, saved } = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }))
    const { username, password } = await GetCredentials()
    const { redditSession, modhash } = await Login(username, password)

    subreddits?.map(async (e) => {
        try {
            await JoinSubreddit(e, modhash, redditSession)

        } catch (error) {
            console.log(`Error trying to join "${e}".`)
        }
    })

    upvoted?.map(async (e) => {
        try {
            await Upvote(e.postId, e.subreddit, modhash, redditSession)

        } catch (error) {
            if (error.response.status === 400) {
                console.log(`Post ${e.postId} from ${e.subreddit} couldn't be upvoted, so it will be saved instead.`)

                try {
                    await Save(e.postId, redditSession, modhash)

                } catch (error) {
                    console.log(`Post "https://reddit.com/r/${e.subreddit}/comments/${e.postId.split("_")[1]}" couldn't be upvoted`)
                }

            } else {
                console.log(`Post "https://reddit.com/r/${e.subreddit}/comments/${e.postId.split("_")[1]}" couldn't be upvoted`)
            }
        }
    })

    saved?.map(async (e) => {
        try {
            await Save(e.postId, redditSession, modhash)

        } catch (error) {
            console.log(`Error ${error.message} while saving ${e.postId} from ${e.subreddit}`)
        }
    })
}