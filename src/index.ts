#!/usr/bin/env node

import { log } from "./util.js";
import { migrateAccounts } from "./migrate-accounts.js"
import { importData as importAccountData } from "./import-data.js";
import { exportData as exportAccountData } from "./export-data.js";
import { getCredentials, importOrExport, migrateAccountsOrImportExport } from "./user-interactions.js";

(async () => {
    try {
        // what would you like to do?
        const action = await migrateAccountsOrImportExport();

        if (action === "import/export") {
            // pick an option
            const option = await importOrExport();

            log("current account", "Log");
            const { username, password } = await getCredentials();

            if (option === "import") {
                await importAccountData(username, password);

            } else {
                await exportAccountData(username, password);
            }

        } else {
            log("current account", "Log");
            const currentAccount = await getCredentials();

            log("new account", "Log");
            const newAccount = await getCredentials();

            log("accounts migration has begun", "Log");
            await migrateAccounts(currentAccount, newAccount);
        }
    } catch (error) {
        console.log((error as Error).message);
        log((error as Error).message, "Error", true);
    }
})();