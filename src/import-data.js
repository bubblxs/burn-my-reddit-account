import fs from "fs"
import prompts from "prompts"
import Save from "./api/save.js"
import Login from "./api/login.js"
import Upvote from "./api/upvote.js"
import JoinSubreddit from "./api/join-subreddit.js"
import { GetCredentials } from "./interaction.js"

export default async function ImportAccountData() {
    //TO DO: VALIDATE PATH, FILE EXTENTION AND CONTENT
    const { filePath } = await prompts({
        type: "text",
        name: "filePath",
        message: "File path"
    })

    const { subreddits, upvoted, saved } = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }))
    const { username, password } = await GetCredentials()
    const { redditSession, modhash } = await Login(username, password)

    if (subreddits) {
        for (let sr of subreddits) {
            try {
                await JoinSubreddit(sr, modhash, redditSession)

            } catch (error) {
                console.log(`Error joining ${sr}. Code: ${error.response.status}`)
            }
        }
    }

    if (upvoted) {
        for (let up of upvoted) {
            try {
                await Upvote(up.postId, up.subreddit, modhash, redditSession)

            } catch (error) {
                if (error.response.status === 400) {
                    console.log(`Post ${up.postId} from ${up.subreddit} couldn't be upvoted, so it will be saved instead.`)

                    try {
                        await Save(up.postId, redditSession, modhash)

                    } catch (error) {
                        console.log(`Post ${up.postId} couldn't be saved either lol. Error ${error.message}`)
                    }

                } else {
                    console.log(`Post ${up.postId} couldn't be upvoted. Error ${error.message}`)
                }
            }
        }
    }

    if (saved) {
        for (let sv of saved) {
            try {
                await Save(sv.postId, redditSession, modhash)

            } catch (error) {
                console.log(`Error ${error.message} while saving ${sv.postId} from ${sv.subreddit}`)
            }
        }
    }
}