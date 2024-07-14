import { homedir } from "os";
import { join } from "path";
import { writeFileSync } from "fs";
import { log } from "./util.js";
import { redditAPI as reddit } from "./api/index.js";

export const exportData = async (username: string, password: string) => {
    const filename = `${Date.now()}_${username}.json`;
    const saveTo = join(homedir(), filename);
    const account = await reddit.login(username, password);
    const { redditSession } = account;
    const content = {
        saved: await reddit.getSavedOrUpvoted(username, redditSession, "saved"),
        upvoted: await reddit.getSavedOrUpvoted(username, redditSession, "upvoted"),
        subreddits: await reddit.getJoinedSubreddits(redditSession)
    };

    try {
        writeFileSync(saveTo, JSON.stringify(content), "utf-8");

    } catch (error) {
        log(`${(error as Error).message}`, "Error", true);
    }

    log(`[_exporting data_] done! you can find the file at '${saveTo}'`, "Success");
};