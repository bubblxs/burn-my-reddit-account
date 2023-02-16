import prompts from "prompts"
import Save from "./api/save.js"
import Login from "./api/login.js"
import Upvote from "./api/upvote.js"
import DeleteAccount from "./api/delete-account.js"
import GetSubreddits from "./api/get-subreddits.js"
import JoinSubreddits from "./api/join-subreddit.js"
import GetSavedOrUpvoted from "./api/get-saved-or-upvoted.js"

export default async function StartMigration(mainAccount, newAccount, options) {
    console.log(`\nThe migration has begun! It might take a while.`)

    let { username, redditSession } = await Login(mainAccount.username, mainAccount.password)
    let saved = null
    let upvoted = null
    let subreddits = null

    for (let option of options) {
        if (option === "upvoted") {
            upvoted = await GetSavedOrUpvoted(username, redditSession, "upvoted")
            continue
        }

        if (option === "saved") {
            saved = await GetSavedOrUpvoted(username, redditSession, "saved")
            continue
        }

        if (option === "subreddits") {
            subreddits = await GetSubreddits(redditSession, false)
            continue
        }
    }

    let { modhash: mh, redditSession: rs } = await Login(newAccount.username, newAccount.password)

    saved?.map(async (e) => {
        try {
            await Save(e.postId, rs, mh)

        } catch (error) {
            console.log(`Post ${e.postId} could not be saved`)
        }
    })

    upvoted?.map(async (e) => {
        try {
            await Upvote(e.postId, e.subreddit, mh, rs)

        } catch (error) {
            if (error.response.status === 400) {
                console.log(`Post ${e.postId} couldn't be upvoted so it will be saved instead`)

                try {
                    await Save(e.postId, rs, mh)

                } catch (error) {
                    console.log(`Post ${e.postId} couldn't be saved.`)
                }

            } else {
                console.log(`Post "https://reddit.com/r/${e.subreddit}/comments/${e.postId.split("_")[1]}" couldn't be upvoted`)
            }
        }
    })

    subreddits?.map(async (e) => {
        try {
            await JoinSubreddits(e, mh, rs)

        } catch (error) {
            console.log(`Error while joining ${e}`)
        }
    })

    const del = await prompts({
        type: 'toggle',
        name: "value",
        message: `Would you like to delete your old account (${mainAccount.username})?`,
        initial: false,
        active: "yes",
        inactive: "no"
    })

    if (del.value === true) {
        try {
            const { username, modhash, redditSession } = await Login(mainAccount.username, mainAccount.password)

            await DeleteAccount(username, mainAccount.password, modhash, redditSession)

        } catch (error) {
            throw new Error(`Something went wrong while deleting your account!: ${error.message}`)
        }
    }
}