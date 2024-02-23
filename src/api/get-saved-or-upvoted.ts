import { log } from "../util.js";
import { reddit } from "./index.js";
import { headers } from "./headers.js";

type Action = "saved" | "upvoted";

export const getSavedOrUpvoted = async (username: string, redditSession: string, action: Action) => {
    const endpoint = `user/${username}/${action}.json`;
    const response = await reddit.request("GET", endpoint, headers(redditSession));
    const postsList = response.data.data.children;
    let posts: { id: string, subreddit: string }[] = [];

    if (postsList.length < 1) {
        log(`[_getting ${action}_] zero posts ${action} found`, "Warning");
        return posts;
    }

    for (let i = 0, l = postsList.length; i < l; i++) {
        const post = postsList[i].data;

        posts.push({
            id: post.name,
            subreddit: post.subreddit
        });
    }

    for (let count = 25, lastPostId = posts[posts.length - 1].id; ; count += 25) {
        const endpoint = `user/${username}/${action}.json?count=${count}&after=${lastPostId}`;
        const response = await reddit.request("GET", endpoint, headers(redditSession));
        const pagePosts = response.data.data.children;

        if (pagePosts.length === 0 || pagePosts[pagePosts.length - 1].data.name === lastPostId) break;

        for (let i = 0, l = pagePosts.length; i < l; i++) {
            const post = pagePosts[i].data;

            posts.push({
                id: post.name,
                subreddit: post.subreddit
            });
        }

        lastPostId = pagePosts[pagePosts.length - 1].data.name;
    }

    return posts;
}