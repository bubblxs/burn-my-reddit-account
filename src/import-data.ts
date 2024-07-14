import { existsSync, readFileSync } from "fs";
import { joinAllSubreddits, log, saveAll, upvoteAll } from "./util.js";
import { redditAPI as reddit } from "./api/index.js";
import { getFilePath } from "./user-interactions.js";

export const importData = async (username: string, password: string) => {
    const filePath = await getFilePath();

    if (!existsSync(filePath)) {
        log("[_importing data_] file not found", "Error", true);
    }

    let subreddits = null;
    let upvoted = null;
    let saved = null;

    try {
        const content = JSON.parse(readFileSync(filePath, "utf-8"));

        subreddits = content.subreddits;
        upvoted = content.upvoted;
        saved = content.saved;

    } catch (error) {
        log(`[_importing data_] file couldnt be parsed correctly. ${(error as Error).message}`, "Error", true);
    }

    const account = await reddit.login(username, password);
    const { redditSession, modhash } = account;

    await joinAllSubreddits(subreddits, modhash, redditSession);
    await upvoteAll(upvoted, modhash, redditSession);
    await saveAll(saved, modhash, redditSession);
}