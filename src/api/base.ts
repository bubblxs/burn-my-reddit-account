import axios from "axios";
import { getRandomUserAgent } from "./headers.js";

type Method = "GET" | "POST";

export const request = async (method: Method, endpoint: string, headers: object, options?: any, params?: any) => {
    const url = `https://old.reddit.com/${endpoint}`;
    const ua = getRandomUserAgent();
    const response = await axios(url, {
        method: method,
        headers: {
            ...headers,
            "User-Agent": ua
        },
        params: new URLSearchParams(params),
        data: new URLSearchParams(options)
    });

    return response;
}