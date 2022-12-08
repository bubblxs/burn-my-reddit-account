#!/usr/bin/env node

import chalk from "chalk"
import prompts from "prompts"

import Login from "./api/login.js"
import StartMigration from "./start-migration.js"
import ExportAccountData from "./export-data.js"
import ImportAccountData from "./import-data.js"
import { GetCredentials } from "./credentials.js"

(async () => {
    const options = await WhatToDo()

    if (options === "Import/Export") {
        const options = await ImportExport()

        if (options === "import") {
            ImportAccountData()
                .then(() => console.log("Done! --> Import Account Data"))
                .catch(err => console.log(`Error Importing data from your account. Error: ${err.message}`))

        } else {
            const { username, password } = await GetCredentials()
            const { redditSession } = await Login(username, password);

            ExportAccountData(redditSession, username)
                .then(() => console.log("Done! --> Exporting Data"))
                .catch(err => console.log(`Error exporting data from your account. Error: ${err.message}`))
        }

    } else {
        const options = await GetUserOptions()

        console.log(`\n>>> ${chalk.yellowBright("Insert the credentials of your")} ${chalk.bold("ATUAL ACCOUNT")} <<<`)
        const oldAccount = await GetCredentials()

        console.log(`\n>>> ${chalk.yellowBright("Insert the credentials of your")} ${chalk.bold("NEW ACCOUNT")} <<<`)
        const newAccount = await GetCredentials()

        await StartMigration(oldAccount, newAccount, options)
    }
})()

async function ImportExport() {
    const options = await prompts({
        type: "select",
        name: "options",
        message: "What to do?",
        choices: [
            {
                title: "Import account data from a file",
                value: "import",
                selected: true
            }
            , {
                title: "Export account data to a file",
                value: "export"
            }]
    })

    return options.options

}

async function WhatToDo() {
    const options = await prompts({
        type: "select",
        name: "options",
        message: "What to do?",
        choices: [
            {
                title: "Account Migration",
                value: "accountMigration",
                selected: true
            }
            , {
                title: "Import/Export",
                value: "Import/Export"
            }]
    })

    return options.options
}

async function GetUserOptions() {
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