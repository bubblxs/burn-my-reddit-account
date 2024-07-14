import { redditAPI as reddit } from "./api/index.js";
import { joinAllSubreddits, saveAll, upvoteAll } from "./util.js";

type AccountCrendentials = {
    username: string,
    password: string
};

export const migrateAccounts = async (currentAccount: AccountCrendentials, newAccount: AccountCrendentials) => {
    const currentAcc = await reddit.login(currentAccount.username, currentAccount.password);
    const { redditSession, username } = currentAcc;
    const saved = await reddit.getSavedOrUpvoted(username, redditSession, "saved");
    const upvoted = await reddit.getSavedOrUpvoted(username, redditSession, "upvoted");
    const subreddits = await reddit.getJoinedSubreddits(redditSession);
    const newAcc = await reddit.login(newAccount.username, newAccount.password);
    const { redditSession: rs, modhash: mh } = newAcc;

    await saveAll(saved, mh, rs);
    await upvoteAll(upvoted, mh, rs);
    await joinAllSubreddits(subreddits, mh, rs);
}