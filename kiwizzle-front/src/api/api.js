import {config} from "../Config";

export const requestGet = (endpoint, noJson = false) => {
    const options = {};
    options.noJson = noJson;
    return requestAPI(endpoint, options);
}


export const requestPost = (endpoint, data) => {
    const options = {};
    if (data) {
        options.body = JSON.stringify(data);
    }
    options.headers = {
        'Content-Type': 'application/json'
    };
    options.method = "POST";
    return requestAPI(endpoint, options);
}

export const requestPut = (endpoint, data) => {
    const options = {};
    if (data) {
        options.body = JSON.stringify(data);
    }
    options.headers = {
        'Content-Type': 'application/json'
    };
    options.method = "PUT";
    return requestAPI(endpoint, options);
}

export const requestDelete = (endpoint, data) => {
    const options = {};
    if (data) {
        options.body = JSON.stringify(data);
    }
    options.headers = {
        'Content-Type': 'application/json'
    };
    options.method = "DELETE";
    return requestAPI(endpoint, options);
}


export const requestAPI = (endpoint, options) => {
    return fetch(
        config.API_HOST + endpoint, options
    ).then((response) => {
        return new Promise((resolve) => {
            if (options.noJson === true)
                response.text().then((queryResult) => {
                    resolve({data: queryResult, status: response.status})
                });
            else
                response.json().then((queryResult) => {
                    resolve({data: queryResult, status: response.status})
                });
        })
    })
}


export const HTTP_CODE = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500,
};
const messages = {};
messages[HTTP_CODE.BAD_REQUEST] = "잘못된 입력값입니다.";
messages[HTTP_CODE.UNAUTHORIZED] = "허용되지 않은 접근입니다.";
messages[HTTP_CODE.INTERNAL_SERVER_ERROR] = "잘못된 입력을 하였거나 서버에 문제가 있습니다.";

export const CODE_MESSAGE = messages;
