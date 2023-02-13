import prompts from "prompts"
import Login from "./api/login.js"

async function GetCredentials() {
    let username = await prompts({
        type: "text", name: "username", message: "Username",
        validate: (username) => username !== null && username.length > 2
    })
    let password = await prompts({
        type: "password", name: "password", message: "Password",
        validate: async (passwrd) => {
            let isValid = await VerifyCredentials(username.username, passwrd)

            return isValid && passwrd.length > 0
        }
    })

    return {
        username: username.username,
        password: password.password
    }
}

async function VerifyCredentials(username, password) {
    const res = await Login(username, password)

    return res.error ? false : true
}

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

async function Action() {
    const options = await prompts({
        type: "select",
        name: "options",
        message: "What would you like to do?",
        choices: [
            {
                title: "migrate account",
                value: "migrateAccount",
                selected: true
            }
            , {
                title: "import/export data",
                value: "import/export"
            }]
    })

    return options.options
}

async function Options() {
    const options = await prompts({
        type: "multiselect",
        name: "options",
        message: "What would you like to export?",
        choices: [
            {
                title: "Upvoted",
                value: "upvoted",
                selected: true
            },
            {
                title: "Saved",
                value: "saved",
                selected: true
            },
            {
                title: "Joined subreddits",
                value: "subreddits",
                selected: true
            }
        ]
    })

    return options.options
}

export {
    GetCredentials,
    VerifyCredentials,
    ImportExport,
    Action,
    Options
}