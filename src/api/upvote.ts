import { reddit } from "./index.js";
import { headers } from "./headers.js";

export const upvote = async (postId: string, subreddit: string, modhash: string, redditSession: string) => {
    const options = { uh: modhash };
    const params = new URLSearchParams({
        dir: "1",
        id: postId,
        sr: subreddit
    });
    const endpoint = "api/vote";
    const response = await reddit.request("POST", endpoint, headers(redditSession), options, params);

    return response.data;
}