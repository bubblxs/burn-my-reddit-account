import axios from "axios"

const URL = "https://old.reddit.com/"
const NEW_URL = "https://reddit.com/"

export default async function api(content) {
    const res = await axios({
        method: content.method,
        url: `${content.isOldUrl ? URL : NEW_URL}${content.params}`,
        headers: content.headers,
        data: content.data,
        params: content.urlParams
    })

    return res
}