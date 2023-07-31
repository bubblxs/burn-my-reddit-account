import { reddit } from "./index.js";
import { headers } from "./headers.js";
import { waitSeconds } from "../util.js";

export const save = async (postId: string, redditSession: string, modhash: string) => {
    await waitSeconds(1);
    const options = {
        id: postId,
        uh: modhash
    };
    const endpoint = "api/save";
    const response = await reddit.request("POST", endpoint, headers(redditSession), options);

    return response.data;
}