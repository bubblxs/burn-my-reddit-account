import chalk from "chalk"
import prompts from "prompts"

import Save from "./api/save.js"
import Login from "./api/login.js"
import Upvote from "./api/upvote.js"
import DeleteAccount from "./api/delete-account.js"
import GetSubreddits from "./api/get-subreddits.js"
import JoinSubreddits from "./api/join-subreddit.js"
import GetSavedOrUpvoted from "./api/get-saved-or-upvoted.js"

export default async function StartMigration(mainAccount, newAccount, options) {
    console.log(`\n >> The migration has begun! It might take a while. PLEASE, ${chalk.bold(chalk.yellow("DO NOT CLOSE THE TERMINAL!"))}`)

    let { username, redditSession } = await Login(mainAccount.username, mainAccount.password)
    let saved = null
    let upvoted = null
    let subreddits = null

    for await (let option of options) {
        if (option === 'upvoted') {
            upvoted = await GetSavedOrUpvoted(username, redditSession, "upvoted")
            continue
        }

        if (option === 'saved') {
            saved = await GetSavedOrUpvoted(username, redditSession, "saved")
            continue
        }

        if (option === 'subreddits') {
            subreddits = await GetSubreddits(redditSession, false)
            continue
        }
    }

    let { modhash: mh, redditSession: rs } = await Login(newAccount.username, newAccount.password)

    if (saved) {
        saved.map(async (e) => {
            try {
                await Save(e.postId, rs, mh)

            } catch (err) {
                console.log(`[${chalk.redBright("X")}] post ${chalk.bold(e.postId)} could not be saved`)
            }
        })
    }

    if (upvoted) {
        upvoted.map(async (e) => {
            try {
                await Upvote(e.postId, e.subreddit, mh, rs)

            } catch (err) {
                if (err.response.status === 400) {
                    await Save(e.postId, rs, mh)
                    console.log(`[${chalk.redBright("X")}] post ${chalk.bold(e.postId)} couldn't be upvoted so it was saved instead`)
                }
            }
        })
    }

    if (subreddits) {
        subreddits.map(async (e) => {
            try {
                await JoinSubreddits(e, mh, rs)

            } catch (err) {
                console.log(`[${chalk.redBright("X")}] error while joining ${chalk.bold(e)}`)
            }
        })
    }

    const del = await prompts({
        type: 'toggle',
        name: "value",
        message: `Would you like to delete your old account(${chalk.bold(chalk.cyanBright(mainAccount.username))})?`,
        initial: false,
        active: "yes",
        inactive: "no"
    })

    if (del.value === true) {
        const { username, modhash, redditSession } = await Login(mainAccount.username, mainAccount.password)

        DeleteAccount(username, mainAccount.password, modhash, redditSession).catch(err => {
            console.log(`Something went wrong while deleting your account! --> ${chalk.bgRedBright(chalk.whiteBright(err.message))}`)
        })
    }

    console.log(chalk.green(">> Done! <<"))
}