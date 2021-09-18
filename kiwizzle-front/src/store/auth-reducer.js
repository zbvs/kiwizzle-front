import {AUTH_LOGGED_IN, AUTH_UNAUTHORIZED} from "./action_types";
import {
    AUTH_STATE_COOKE_VALUE_LOGGED_IN,
    AUTH_STATE_COOKE_VALUE_UNAUTHORIZED,
    AUTH_STATE_COOKIE_NAME,
    getCookie,
} from "../auth/Auth";


export const authLoggedIn = () => {
    return {
        type: AUTH_LOGGED_IN,
        authState: AUTH_STATE_COOKE_VALUE_LOGGED_IN
    }
}

export const authUnauthorized = () => {
    return {
        type: AUTH_UNAUTHORIZED,
        authState: AUTH_STATE_COOKE_VALUE_UNAUTHORIZED
    }
}


const initialState = {
    authState: getCookie(AUTH_STATE_COOKIE_NAME) ? getCookie(AUTH_STATE_COOKIE_NAME) : AUTH_STATE_COOKE_VALUE_UNAUTHORIZED
};

export default function authReducer(state = initialState, action) {

    switch (action.type) {
        case AUTH_LOGGED_IN: {
            return {...state, authState: action.authState}
        }
        // case AUTH_NEED_LOGIN:{
        //     return {...state, authState:action.authState}
        // }
        case AUTH_UNAUTHORIZED: {
            return {...state, authState: action.authState}
        }
        default:
            return state;
    }
}
