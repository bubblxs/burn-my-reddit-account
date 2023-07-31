import { reddit } from "./index.js";
import { headers } from "./headers.js";
import { waitSeconds } from "../util.js";

type Action = "saved" | "upvoted";

export const getSavedOrUpvoted = async (username: string, redditSession: string, action: Action) => {
    await waitSeconds(1);
    const endpoint = `user/${username}/${action}.json`;
    const response = await reddit.request("GET", endpoint, headers(redditSession));
    // rawData will recieve a lists of posts;
    const rawData = response.data.data.children;
    let posts: { id: string, subreddit: string }[] = [];

    for (let i = 0, l = rawData.length; i < l; i++) {
        const post = rawData[i].data;

        posts.push({
            id: post.name,
            subreddit: post.subreddit
        })
    }

    let count = 25;
    let lastPostId = posts[posts.length - 1].id;
    while (true) {
        waitSeconds(1);
        count += 25;

        let endpoint = `user/${username}/${action}.json?count=${count}&after=${lastPostId}`;
        let response = await reddit.request("GET", endpoint, headers(redditSession));
        let rawData = response.data.data.children;

        if (rawData.length === 0) break;
        if (rawData[rawData.length - 1].data.name === lastPostId) break;

        for (let i = 0, l = rawData.length; i < l; i++) {
            const post = rawData[i].data;

            posts.push({
                id: post.name,
                subreddit: post.subreddit
            });
        }

        lastPostId = rawData[rawData.length - 1].data.name;
    }

    return posts;
}