import { log } from "../util.js";
import { reddit } from "./index.js";
import { headers } from "./headers.js";

export const login = async (username: string, password: string) => {
    const options = {
        "api_type": "json",
        "user": username,
        "passwd": password,
        "rem": "yes",
        "op": "login"
    };
    const endpoint = `api/login/${username}`;
    const response = await reddit.request("POST", endpoint, headers(), options);

    if (response.status !== 200 || response.data.success === false || response?.data.json.errors.length > 0) {
        const err = response?.data.json.errors[0][1] || "something went wrong";
        const code = response.status;

        return {
            error: err,
            code: code
        }
    }

    const redditSession = (response.headers["set-cookie"]!).toString().split(";").join("").split(",").find((e: string) => e.match(/(reddit_session=)/g))!.trimStart().split(" ")[0].split("=")[1];

    if (redditSession === undefined || redditSession.length === 0) {
        log("cannot get ['reddit_session']", "Error", true);
    }

    return {
        username: username,
        modhash: response.data.json.data.modhash,
        redditSession: redditSession
    };
};