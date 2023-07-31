import fs from "fs";
import prompts from "prompts";
import { isAxiosError } from "axios";
import { log } from "./util.js";
import { r as reddit } from "./api/index.js";
import { getFilePath } from "./user-interactions.js";

export const importData = async (username: string, password: string) => {
    const filePath = await getFilePath();

    if (!fs.existsSync(filePath)) {
        log("file not found", "Error", true);
    }

    let subreddits = null;
    let upvoted = null;
    let saved = null;

    try {
        const j = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        subreddits = j.subreddits;
        upvoted = j.upvoted;
        saved = j.saved;

    } catch (error) {
        log(`file couldnt be parsed correctly. ${(error as Error).message}`, "Error", true);
    }

    const account = await reddit.login(username, password);

    if (account?.error) {
        log(`${account.error}!. login failed with status ${account.code}`, "Error", true);
    }

    const { redditSession, modhash } = account;

    subreddits?.forEach(async (subreddit: any) => {
        try {
            await reddit.joinSubreddit(typeof subreddit === "string" ? subreddit : subreddit.id, modhash, redditSession!);

        } catch (error) {
            log(`we couldnt join to r/${typeof subreddit === "string" ? subreddit : subreddit.name}`, "Error");
        }
    });

    upvoted?.forEach(async (post: any) => {
        const postId: string = post.id || post.postId;
        const postUrl = `https://reddit.com/r/${post.subreddit}/comments/${postId.split("_")[1]}`;

        try {
            await reddit.upvote(postId, post.subreddit, modhash, redditSession!);

        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 400 || "400") {
                try {
                    await reddit.save(postId, redditSession!, modhash);
                    log(`post ${postUrl} couldn't be upvoted so it was saved instead.`, "Warning");

                } catch (error) {
                    log(`post couldnt be upvoted ${postUrl}. ${(error as Error).message}.`, "Error");
                }
            } else {
                log(`post couldnt be upvoted ${postUrl}. ${(error as Error).message}.`, "Error");
            }
        }
    });

    saved?.forEach(async (post: any) => {
        const postId: string = post.id || post.postId;
        const postUrl = `https://reddit.com/r/${post.subreddit}/comments/${postId.split("_")[1]}`;

        try {
            await reddit.save(post.id || post.postId, redditSession!, modhash);

        } catch (error) {
            log(`post couldnt be saved ${postUrl}. ${(error as Error).message}`, "Error");
        }
    });
}