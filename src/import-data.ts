import fs from "fs";
import { joinAllSubreddits, log, saveAll, upvoteAll } from "./util.js";
import { r as reddit } from "./api/index.js";
import { getFilePath } from "./user-interactions.js";

export const importData = async (username: string, password: string) => {
    const filePath = await getFilePath();

    if (!fs.existsSync(filePath)) {
        log("[_importing data_] file not found", "Error", true);
    }

    let subreddits = null;
    let upvoted = null;
    let saved = null;

    try {
        const fileData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        subreddits = fileData.subreddits;
        upvoted = fileData.upvoted;
        saved = fileData.saved;

    } catch (error) {
        log(`[_importing data_] file couldnt be parsed correctly. ${(error as Error).message}`, "Error", true);
    }

    const account = await reddit.login(username, password);
    const { redditSession, modhash } = account;

    await joinAllSubreddits(subreddits, modhash, redditSession);
    await upvoteAll(upvoted, modhash, redditSession);
    await saveAll(saved, modhash, redditSession);
}