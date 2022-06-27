export default class Body {
    constructor(method, params, headers, data, isOldUrl = true, urlParams = null) {
        this.method = method
        this.params = params
        this.headers = headers
        this.isOldUrl = isOldUrl
        this.urlParams = urlParams
        this.data = new URLSearchParams(data)
    }
}