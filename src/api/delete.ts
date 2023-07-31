import { headers } from "./headers.js";
import { reddit } from "./index.js";

export const deleteAccount = async (username: string, password: string, modhash: string, redditSession: string) => {
    const options = {
        confirm: "on",
        deactivate_message: "",
        id: "#pref - deactivate",
        passwd: password,
        uh: modhash,
        user: username,
    };
    const endpoint = "api/deactivate_user";
    const response = await reddit.request("POST", endpoint, headers(redditSession), options);

    return response.data;
}