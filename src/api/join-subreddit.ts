import { reddit } from "./index.js";
import { headers } from "./headers.js";
import { waitSeconds } from "../util.js";

export const joinSubreddit = async (subredditId: string, modhash: string, redditSession: string) => {
    await waitSeconds(1);
    const options = {
        action: "sub",
        sr: subredditId,
        uh: modhash
    };
    const endpoint = "api/subscribe";
    const response = await reddit.request("POST", endpoint, headers(redditSession), options);

    return response.data;
}