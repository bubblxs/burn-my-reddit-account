import axios from "axios"

const BASE_URL      = "https://old.reddit.com/"
const NEW_BASE_URL  = "https://reddit.com/"

export default async function api(content) {
    const res = await axios({
        method: content.method,
        url: `${content.isOldUrl ? BASE_URL : NEW_BASE_URL}${content.params}`,
        headers: content.headers,
        data: content.data,
        params: content.urlParams
    })

    return res
}