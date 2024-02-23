import { isAxiosError } from "axios";
import { r as reddit } from "./api/index.js";

type LogType = "Log" | "Success" | "Warning" | "Error";

enum ANSIColor {
    red = "\x1b[31m",
    white = "\x1b[37m",
    green = "\x1b[32m",
    yellow = "\x1b[33m",
};

const waitSeconds = async (seconds: number) => {
    return new Promise((r) => setTimeout(() => { r("Done"); }, seconds * 1000));
}

const log = (message: string, logType: LogType, exit?: boolean) => {
    let logMessage = "";

    switch (logType) {
        case "Error":
            logMessage += `${ANSIColor.red}[X] .... `;
            break;
        case "Success":
            logMessage += `${ANSIColor.green}[+] .... `;
            break;
        case "Warning":
            logMessage += `${ANSIColor.yellow}[!] .... `;
            break;
        default:
            logMessage += `${ANSIColor.white}[-] .... `;
            break;
    }

    console.log(`${logMessage}${message}${ANSIColor.white}`);

    if (exit) {
        process.exit(logType === "Error" ? 1 : 0);
    }
}

const removeDuplicated = (arr: any[]) => {
    if (arr.length < 1) {
        return arr;
    }

    arr.sort();
    let newArr: any[] = [];

    for (let i = 0, l = arr.length; i < l; i++) {
        const idx = newArr.indexOf(arr[i]);

        if (idx === -1) {
            newArr.push(arr[i]);
        }
    }

    return newArr;
}

const buildUrl = (postId: string, subreddit: string) => {
    const id = postId.split("_")[1];
    const postUrl = `https://reddit.com/r/${subreddit}/comments/${id}`;

    return postUrl;
}

const joinAllSubreddits = async (subreddits: { id: string, name: string }[] | string[], modhash: string, redditSession: string) => {
    if (subreddits.length < 1 || !subreddits) return;

    subreddits.forEach(async (subreddit) => {
        const subredditId = typeof subreddit === "string" ? subreddit : subreddit.id;

        try {
            await reddit.joinSubreddit(subredditId, modhash, redditSession);

        } catch (error) {
            const subredditName = typeof subreddit === "string" ? subreddit : subreddit.name;
            log(`[_joining subreddits_] we couldnt join to r/${subredditName}. ${(error as Error).message}`, "Error");
        }
    })
}

const saveAll = async (saveList: { id: string, subreddit: string }[], modhash: string, redditSession: string) => {
    if (saveList.length < 1 || !saveList) return;

    saveList.forEach(async (post) => {
        try {
            await reddit.save(post.id, redditSession, modhash);

        } catch (error) {
            const postUrl = buildUrl(post.id, post.subreddit);
            log(`[_saving post_] we couldnt save ${postUrl}. ${(error as Error).message}`, "Error");
        }

    })
}

const upvoteAll = async (upvotesList: { id: string, subreddit: string }[], modhash: string, redditSession: string) => {
    if (upvotesList.length < 1 || !upvotesList) return;

    upvotesList.forEach(async (post) => {
        try {
            await reddit.upvote(post.id, post.subreddit, modhash, redditSession);

        } catch (error) {
            const postUrl = buildUrl(post.id, post.subreddit);

            if (isAxiosError(error) && error.response?.status === 400) {
                try {
                    await reddit.save(post.id, redditSession, modhash);
                    log(`[_upvoting_] post ${postUrl} couldn't be upvoted so it was saved instead.`, "Warning");

                } catch (error) {
                    log(`[_upvoting_] we couldnt upvote ${postUrl}. ${(error as Error).message}.`, "Error");
                }

            } else {
                log(`[_upvoting_] we couldnt upvote ${postUrl}. ${(error as Error).message}.`, "Error");
            }
        }
    })
}

export {
    log,
    saveAll,
    upvoteAll,
    waitSeconds,
    removeDuplicated,
    joinAllSubreddits
};