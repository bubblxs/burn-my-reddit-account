import prompts from "prompts";

const getCredentials = async () => {
    const { username } = await prompts({
        type: "text",
        name: "username",
        message: "username: ",
        validate: (usr: string) => usr.length < 3 ? "username must have at least 3 chars" : true
    });

    const { password } = await prompts({
        type: "password",
        name: "password",
        message: "password: ",
        validate: (pswd: string) => pswd.length < 3 ? "password must have at least 3 chars" : true
    })

    return {
        username: username,
        password: password
    };
};

const importOrExport = async () => {
    const options = await prompts({
        type: "select",
        name: "options",
        message: "pick an option",
        choices: [
            {
                title: "Import account data from a file",
                value: "import",
                selected: true
            },
            {
                title: "Export account data to a file",
                value: "export"
            }
        ]
    })

    return options.options;
}

const migrateAccountsOrImportExport = async () => {
    const options = await prompts({
        type: "select",
        name: "options",
        message: "what would you like to do?",
        choices: [
            {
                title: "migrate account",
                value: "migrateAccount",
                selected: true
            },
            {
                title: "import/export data",
                value: "import/export"
            }]
    })

    return options.options
}

const getFilePath = async () => {
    const { filePath } = await prompts({
        type: "text",
        name: "filePath",
        message: "file path: "
    });

    return filePath;
}

const getDeleteAccount = async (accountName: string) => {
    const { del } = await prompts({
        type: "toggle",
        name: "del",
        message: `would you like to delete your old account -->> ${accountName} <<-- ???`,
        initial: false,
        active: "yes",
        inactive: "no"
    });

    return del;
}

export {
    getFilePath,
    getCredentials,
    importOrExport,
    getDeleteAccount,
    migrateAccountsOrImportExport
};