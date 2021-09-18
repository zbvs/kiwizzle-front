const LOG_LEVEL_DEBUG = 0;
const LOG_LEVEL_TRACE = 1;
const LOG_LEVEL_INFO = 2;
const LOG_LEVEL_ERROR = 3;


const LOG_LEVEL = LOG_LEVEL_INFO;

export const logger = {
    debug: (...args) => {
        if (LOG_LEVEL <= LOG_LEVEL_DEBUG)
            console.log(...args);
    },
    trace: (...args) => {
        if (LOG_LEVEL <= LOG_LEVEL_TRACE)
            console.log("[TRACE]", ...args);
    },
    info: (...args) => {
        if (LOG_LEVEL <= LOG_LEVEL_INFO)
            console.log(...args);
    },
    error: (...args) => {
        if (LOG_LEVEL <= LOG_LEVEL_ERROR)
            console.log(...args);
    }
}


export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const addUrlParameter = (key, value, search) => {
    const prevPrams = new URLSearchParams(search)
    if (prevPrams.has(key))
        prevPrams.delete(key)
    prevPrams.append(key, value);

    const entries = Array.from(prevPrams.entries()).sort((a, b) => {
        if (a[0] > b[0])
            return -1;
        else
            return 1;
    });

    const newPrams = new URLSearchParams(window.location.path)
    for (const entry of entries) {
        newPrams.append(entry[0], entry[1])
    }
    return newPrams.toString();
}


export const deleteUrlParamaters = (key, search) => {
    const queryParams = new URLSearchParams(search)
    queryParams.delete(key);
    return queryParams.toString();
}

export const getUrlParamaters = (key, search) => {
    const queryParams = new URLSearchParams(search)
    return queryParams.get(key);
}
