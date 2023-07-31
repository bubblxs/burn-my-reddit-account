type LogType = "Log" | "Success" | "Warning" | "Error";

enum ANSIColor {
    red = "\x1b[31m",
    white = "\x1b[37m",
    green = "\x1b[32m",
    yellow = "\x1b[33m",
};

const waitSeconds = async (seconds: number) => {
    return new Promise((r) => setTimeout(() => { r("Done"); }, seconds * 1000));
}

const log = (message: string, logType: LogType, exit?: boolean) => {
    let logMessage = "";

    switch (logType) {
        case "Error":
            logMessage += `${ANSIColor.red}|X| .... `;
            break;
        case "Success":
            logMessage += `${ANSIColor.green}|✓| .... `;
            break;
        case "Warning":
            logMessage += `${ANSIColor.yellow}|!| .... `;
            break;
        default: 
            logMessage += `${ANSIColor.white}[^] .... `;
        break;
    }

    console.log(`${logMessage}${message}${ANSIColor.white}`);

    if (exit) process.exit(0);
}

const removeDuplicated = (arr: any[]) => {
    let newArr: any[] = [];

    for (let i = 0, l = arr.length; i < l; i++) {
        const idx = newArr.indexOf(arr[i]);

        if (idx === -1) newArr.push(arr[i]);
    }

    return newArr;
}

export {
    log,
    waitSeconds,
    removeDuplicated
};