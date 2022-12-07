import fs from "fs"
import prompts from "prompts"

import Save from "./api/save.js"
import Login from "./api/login.js"
import Upvote from "./api/upvote.js"
import JoinSubreddit from "./api/join-subreddit.js"

import { GetCredentials } from "./credentials.js"
 
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
        for (let s of subreddits) {
            JoinSubreddit(s, modhash, redditSession)
                .catch(err => console.log(`Error joining ${s}. Code: ${err.response.status}`))
        }
    }

    if (upvoted) {
        for (let u of upvoted) {
            Upvote(u.postId, u.subreddit, modhash, redditSession)
                .catch((err) => {
                    if (err.response.status === 400) {
                        console.log(`Post ${u.postId} from ${u.subreddit} couldn't be upvoted, so it was saved instead.`)
                    }

                    Save(u.postId, redditSession, modhash)
                        .catch(err => console.log(`Post ${u.postId} couldn't be saved either lol. Error ${err.message}`))
                })
        }
    }

    if (saved) {
        for (let s of saved) {
            Save(s.postId, redditSession, modhash)
                .catch(err => console.log(`Error "${err.message}" while saving ${s.postId} from ${s.subreddit}`))
        }
    }
}