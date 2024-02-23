import { reddit } from "./index.js";
import { headers } from "./headers.js";

export const joinSubreddit = async (subredditId: string, modhash: string, redditSession: string) => {
    const options = {
        action: "sub",
        sr: subredditId,
        uh: modhash
    };
    const endpoint = "api/subscribe";
    const response = await reddit.request("POST", endpoint, headers(redditSession), options);

    return response.data;
}