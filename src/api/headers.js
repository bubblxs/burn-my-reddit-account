export const headers = {
    "sec-ch-ua": '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
    "Accept": 'application/json, text/javascript, */*; q=0.01',
    "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
    "sec-ch-ua-mobile": "?0",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36", "X-Requested-With": "XMLHttpRequestContent-Type:application/x-www-form-urlencoded; charset=UTF-8",
    "sec-ch-ua-platform": "Windows"
}

export const headersCookie = (redditSession) => {
    return {
        headers,
        'Cookie': `reddit_session=${redditSession};`
    }
}