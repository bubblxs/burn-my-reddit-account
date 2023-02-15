#!/usr/bin/env node

import Login from "./api/login.js"
import StartMigration from "./start-migration.js"
import ExportAccountData from "./export-data.js"
import ImportAccountData from "./import-data.js"
import { Action, GetCredentials, ImportExport, Options } from "./interaction.js"

(async () => {
    const action = await Action()

    if (action === "import/export") {
        let options = await ImportExport()

        if (options === "import") {
            try {
                await ImportAccountData()

            } catch (error) {
                throw new Error(`${error.message}`)
            }

        } else {
            const { username, password } = await GetCredentials()
            const { redditSession } = await Login(username, password)

            if (!username || !password) {
                throw new Error("check your credentials")
            }

            try {
                await ExportAccountData(redditSession, username)

            } catch (error) {
                throw new Error(`Error while exporting your data\n${error.message}`)
            }
        }

        return
    }

    try {
        const options = await Options()
        
        console.log("\nplease, enter your current and new account credentials below\n")

        console.log("credentials of your account")
        const account = await GetCredentials()
        
        console.log("credentials of your new account")
        const newAccount = await GetCredentials()

        if (!account.username || !account.password ||
            !newAccount.password || !newAccount.password) {
            throw new Error("check your credentials")
        }

        await StartMigration(account, newAccount, options)

    } catch (error) {
        throw new Error(`Error while migrating your account\n${error.message}`)
    }
})()