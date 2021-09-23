import {config} from "../Config";
import {HTTP_CODE} from "../api/api";


export const authFontSize = {
    fontSizeMobile: 10,
    fontSize: 15
}


export const AUTH_STATUS = {
    AUTH_MAIN: "AUTH_MAIN",
    LOGIN: "LOGIN",
    SIGNUP_CONFIRM: "SIGNUP_CONFIRM",
    PASSWORD_REQUIRED: "EMAIL_PASSWORD",
    SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
    COMPLETE: "COMPLETE"
}


export const authProgressInfo = {
    email: "",
    providers: [],
}

export const resetAuthProgressInfo = () => {
    authProgressInfo.email = "";
    authProgressInfo.providers.length = 0;
}


export const GOOGLE_AUTH_URL = config.API_HOST + '/oauth2/authorize/google?redirect_uri='
export const GITHUB_AUTH_URL = config.API_HOST + '/oauth2/authorize/github?redirect_uri='
export const LOCAL_PROVIDER_NAME = "local";
export const KIWIZZLE_PROVIDER_NAME = "Kiwizzle";

export const AUTH_STATE_COOKIE_NAME = "auth_state";

export const AUTH_STATE_COOKE_VALUE_UNAUTHORIZED = "unauthorized";
export const AUTH_STATE_COOKE_VALUE_LOGGED_IN = "logged_in";

export const USER_ID_COOKIE_NAME = "user_id";

export const ROLE_ADMIN = "admin";
export const AUTH_PATH = "/auth"
export const USER_PATH = "/user"

export const AUTH_URL_PARAM_SIGNUP_BY = "signup_by";
export const AUTH_URL_PARAM_EMAIL = "email";


const globalAuthInfo = {
    userId: null
}

export const setUserId = (userId) => {
    globalAuthInfo.userId = userId;
}

export const getUserId = () => {
    return globalAuthInfo.userId;
}


export const resetUserId = () => {
    globalAuthInfo.userId = null;
}

export const getCookie = (key) => {
    const lines = document.cookie.split("; ")
    for (const line of lines) {
        const pairs = line.split("=")

        if (pairs.length === 2 && pairs[0] === key)
            return pairs[1];
    }
    return undefined;
}

export const setCookie = (key, value) => {
    document.cookie = key + "=" + value + ";"
}

export const deleteCookie = (key) => {
    document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export const isLoggedInCookieSet = () => {
    return getCookie(AUTH_STATE_COOKIE_NAME) === AUTH_STATE_COOKE_VALUE_LOGGED_IN;
}

export const isSignupRedirected = () => {
    return new URLSearchParams(window.location.search).get(AUTH_URL_PARAM_EMAIL) !== null;
}

export const isNeedPasswordForSignup = () => {
    return new URLSearchParams(window.location.search).get(AUTH_URL_PARAM_SIGNUP_BY) === "email";
}

export const isUnauthorizedOAuth2State = () => {
    return new URLSearchParams(window.location.search).get(AUTH_URL_PARAM_SIGNUP_BY) === "oauth2";
}

const loginInitDataExtractors = {}

if (isLoggedInCookieSet()) {
    loginInitDataExtractors["/user/" + getCookie(USER_ID_COOKIE_NAME)] = (result) => {
        if (result.status === HTTP_CODE.OK) {
            setUserId(result.data.userId);
        } else {
            deleteCookie(AUTH_STATE_COOKIE_NAME);
        }
    }
}


export const LoginInitDataExtractors = loginInitDataExtractors;



