import { AxiosError, isAxiosError } from "axios";
import { reddit } from "./index.js";
import { headers } from "./headers.js";
import { removeDuplicated } from "../util.js";
import { waitSeconds, log } from "../util.js";

export const getJoinedSubreddits = async (redditSession: string) => {
    await waitSeconds(1);
    const ignoredSubreddits = ["users", "popular", "all", "announcements"];
    const filterTagsRegex = /<a href="https:\/\/old.reddit.com\/(user|r)\/(.*?)\/" class="choice" >(.*?)<\/a>/gim;
    const removeTagsRegex = /(<a href="https:\/\/old.reddit.com\/(user|r)\/(.*?)\/" class="choice" >|<\/a>)/gim;
    const endpoint = "subreddits";
    const response = await reddit.request("GET", endpoint, headers(redditSession));
    // rawData, in this case, will receive the names of all subreddits that you have been participating
    let rawData: string[] = (response.data.match(filterTagsRegex)).toString().replace(removeTagsRegex, "").split(",");
    let joinedSubreddits: { id: string, name: string }[] = [];

    rawData.sort();
    rawData = removeDuplicated(rawData);

    ignoredSubreddits.forEach((el: any) => {
        const idx = rawData.indexOf(el);

        if (idx !== -1) rawData.splice(idx, 1);
    });

    let attempt = 0;
    for (let i = 0, l = rawData.length; i < l; i++) {
        const subreddit = rawData[i];

        try {
            const endpoint = `${subreddit.startsWith("u/") ? subreddit : `r/${subreddit}`}/about.json`;
            const response = await reddit.request("GET", endpoint, headers(redditSession));
            const subredditId = response.data.data.name;

            joinedSubreddits.push({
                id: subredditId,
                name: subreddit
            });

            attempt = 0;

        } catch (error) {
            const err = error as Error;

            if (isAxiosError(error) && error.response?.status === 429) {
                const maxAttempts = 30;

                if (attempt < maxAttempts) {
                    await waitSeconds(5);
                    i -= 1;
                    attempt += 1;
                } else {
                    log(`we could not fetch the r/${subreddit} (${attempt} attempt(s) were made). You wll have to join them by yourself. Axios error code: ${error.response.status}`, "Error");
                    i -= 1;
                    attempt = 0;
                }
            } else {
                log(`we could not fetch r/${subreddit}. ${err.message}.`, "Error");
                attempt = 0;
            }
        }
    }

    return joinedSubreddits;
}