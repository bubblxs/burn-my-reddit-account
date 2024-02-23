import os from "os";
import path from "path";
import * as fs from "fs";
import { log } from "./util.js";
import { r as reddit } from "./api/index.js";

export const exportData = async (username: string, password: string) => {
    const homedir = os.homedir();
    const fileName = `${Date.now()}_${username}.json`;
    const savePath = path.join(homedir, fileName);
    const account = await reddit.login(username, password);
    const { redditSession } = account;
    const saved = await reddit.getSavedOrUpvoted(username, redditSession, "saved");
    const upvoted = await reddit.getSavedOrUpvoted(username, redditSession, "upvoted");
    const subreddits = await reddit.getJoinedSubreddits(redditSession);
    const content = {
        saved: saved,
        upvoted: upvoted,
        subreddits: subreddits
    };

    fs.writeFile(savePath, JSON.stringify(content), "utf-8", (err) => {
        if (err) {
            log(`${err.message}`, "Error", true);
        }
    });

    log(`[_exporting data_] done! you can find the file at '${savePath}'`, "Success");
};