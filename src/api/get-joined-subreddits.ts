import { isAxiosError } from "axios";
import { reddit } from "./index.js";
import { headers } from "./headers.js";
import { waitSeconds, log, removeDuplicated } from "../util.js";

/**
 *
 * to do: fix regex
 * apparently reddit has changed some of its html tags so filtering them is kinda fucked up now
 * is still working but we are getting random subreddits recommended in https://old.reddit.com/subreddits/
 *  
**/

export const getJoinedSubreddits = async (redditSession: string) => {
    const ignoredSubreddits = ["users", "popular", "all", "announcements"];
    const filterTagsRegex = /<a href="https:\/\/old.reddit.com\/(user|r)\/(.*?)\/" class="choice" >(.*?)<\/a>/gim;
    const removeTagsRegex = /(<a href="https:\/\/old.reddit.com\/(user|r)\/(.*?)\/" class="choice" >|<\/a>)/gim;
    const endpoint = "subreddits";
    const response = await reddit.request("GET", endpoint, headers(redditSession));
    let subredditsList: string[] = (response.data.match(filterTagsRegex)).toString().replace(removeTagsRegex, "").split(",");
    let joinedSubreddits: { id: string, name: string }[] = [];

    subredditsList.sort();
    subredditsList = removeDuplicated(subredditsList);

    ignoredSubreddits.forEach((el: string) => {
        const idx = subredditsList.indexOf(el);

        if (idx !== -1) {
            subredditsList.splice(idx, 1);
        }
    });

    if (subredditsList.length < 1) {
        log("[_getting subreddits_] zero subreddits joined found", "Warning");
        return joinedSubreddits;
    }

    for (let i = 0, attempt = 0, l = subredditsList.length; i < l; i++) {
        const subreddit = subredditsList[i];

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
                if (attempt < 5) {
                    await waitSeconds(5);
                    i -= 1;
                    attempt += 1;
                } else {
                    log(`[_getting subreddits_] we could not fetch r/${subreddit} (${attempt} attempts were made). You wll have to join them by yourself. Axios error code: ${error.response.status}`, "Error");
                    attempt = 0;
                }
            } else {
                log(`[_getting subreddits_] we could not fetch r/${subreddit}. ${err.message}.`, "Error");
                attempt = 0;
            }
        }
    }

    return joinedSubreddits;
}