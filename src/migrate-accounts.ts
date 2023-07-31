import { isAxiosError } from "axios";
import { r as reddit } from "./api/index.js";
import { log, waitSeconds } from "./util.js";

type AccountCrendentials = {
    username: string,
    password: string
};

export const migrateAccounts = async (currentAccount: AccountCrendentials, newAccount: AccountCrendentials) => {
    const currentAcc = await reddit.login(currentAccount.username, currentAccount.password);

    if (currentAcc?.error) {
        log(`current account error: ${currentAcc.error}`, "Error", true);
    }

    const { redditSession, username } = currentAcc;

    const saved = await reddit.getSavedOrUpvoted(username!, redditSession!, "saved");
    await waitSeconds(1);
    const upvoted = await reddit.getSavedOrUpvoted(username!, redditSession!, "upvoted");
    await waitSeconds(1);
    const subreddits = await reddit.getJoinedSubreddits(redditSession!);
    await waitSeconds(1);

    const newAcc = await reddit.login(newAccount.username, newAccount.password);

    if (newAcc?.error) {
        log(`new account error: ${newAcc.error}`, "Error", true);
    }

    const { redditSession: rs, modhash: mh } = newAcc;

    await subreddits?.forEach(async (subreddit: any) => {
        try {
            await reddit.joinSubreddit(subreddit.id, mh, rs!);

        } catch (error) {
            log(`we couldnt join to r/${subreddit.name}. ${(error as Error).message}`, "Error");
        }
    });

    await upvoted?.forEach(async (post: any) => {
        const postUrl = `https://reddit.com/r/${post.subreddit}/comments/${post.id.split("_")[1]}`;

        try {
            await reddit.upvote(post.id, post.subreddit, mh, rs!);

        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 400 || "400") {
                try {
                    await reddit.save(post.id, rs!, mh);
                    log(`post ${postUrl} couldn't be upvoted so it was saved instead.`, "Warning");

                } catch (error) {
                    log(`we couldnt upvote ${postUrl}. ${(error as Error).message}.`, "Error");
                }
            } else {
                log(`we couldnt upvote ${postUrl}. ${(error as Error).message}.`, "Error");
            }
        }
    });

    await saved?.forEach(async (post: any) => {
        const postUrl = `https://reddit.com/r/${post.subreddit}/comments/${post.id.split("_")[1]}`;

        try {
            await reddit.save(post.id, rs!, mh);

        } catch (error) {
            log(`we couldnt save ${postUrl}. ${(error as Error).message}`, "Error");
        }
    });
}