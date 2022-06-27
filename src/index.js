#!/usr/bin/env node

import chalk from "chalk"
import prompts from "prompts"

import Save from "./api/save.js"
import Login from "./api/login.js"
import Upvote from "./api/upvote.js"
import DeleteAccount from "./api/delete-account.js"
import GetSubreddits from "./api/get-subreddits.js"
import JoinSubreddits from "./api/join-subreddit.js"
import GetSavedOrUpvoted from "./api/get-saved-or-upvoted.js"

(async () => {
    const options = await GetOptions()

    console.log(`\n>>> ${chalk.yellowBright("Insert the credentials of your")} ${chalk.bold("ATUAL ACCOUNT")} <<<`)
    const oldAccount = await GetCredentials()

    console.log(`\n>>> ${chalk.yellowBright("Insert the credentials of your")} ${chalk.bold("NEW ACCOUNT")} <<<`)
    const newAccount = await GetCredentials()

    await StartMigration(oldAccount, newAccount, options)
})()

async function StartMigration(mainAccount, newAccount, options) {
    console.log(`\n >> The migration has begun! It might take a while. PLEASE, ${chalk.bold(chalk.yellow("DO NOT CLOSE THE TERMINAL!"))}`)

    let saved = null
    let upvoted = null
    let subreddits = null
    let { username, redditSession } = await Login(mainAccount.username, mainAccount.password)

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
                Save(e.postId, rs, mh).then(res => {
                    console.log(`[${chalk.redBright("X")}] post ${chalk.bold(e.postId)} could not be upvoted and it was saved instead`)
                })
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

async function VerifyCredentials(username, password) {
    const res = await Login(username, password)

    return res.error ? false : true
}

async function GetOptions() {
    const options = await prompts({
        type: "multiselect", name: "options", message: "What would you like to export?",
        choices: [
            { title: "Upvoted itens", value: "upvoted", selected: true },
            { title: "Saved itens", value: "saved", selected: true },
            { title: "Joined subreddits", value: "subreddits", selected: true }
        ]
    })

    return options.options
}

async function GetCredentials() {
    let username = await prompts({
        type: "text", name: "username", message: "Username"
    })
    let password = await prompts({
        type: "password", name: "password", message: "Password",
        validate: async (passwrd) => await VerifyCredentials(username.username, passwrd) ? true : "wrong password"
    })

    return {
        username: username.username,
        password: password.password
    }
}