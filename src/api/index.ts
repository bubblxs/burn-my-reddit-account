import * as reddit from "./base.js";
import { save } from "./save.js";
import { login } from "./login.js";
import { upvote } from "./upvote.js";
import { joinSubreddit } from "./join-subreddit.js";
import { getSavedOrUpvoted } from "./get-saved-or-upvoted.js";
import { getJoinedSubreddits } from "./get-joined-subreddits.js";
import { deleteAccount } from "./delete.js";

const redditAPI = {
    save,
    login,
    upvote,
    joinSubreddit,
    deleteAccount,
    getSavedOrUpvoted,
    getJoinedSubreddits,
}

/* yeah i know this is beyond retarded. but hey is there anything in this whole repo which is not? :3 */
export {
    redditAPI as r,
    reddit,
};