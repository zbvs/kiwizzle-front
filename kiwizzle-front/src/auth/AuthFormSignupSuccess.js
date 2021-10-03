import React, {useEffect} from "react";
import {config} from "../Config";
import {AUTH_URL_PARAM_EMAIL, AUTH_URL_PARAM_SIGNUP_BY, authFontSize, authProgressInfo} from "./Auth";
import {useHistory, useLocation} from 'react-router-dom'


export default function AuthFormSignupSuccess() {

    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        queryParams.delete(AUTH_URL_PARAM_EMAIL);
        queryParams.delete(AUTH_URL_PARAM_SIGNUP_BY);
        history.replace({
            search: queryParams.toString(),
        })
    }, [])

    return (
        <>
            <div>
                <span style={{fontSize: authFontSize.fontSize, color: config.COLOR_BLACK}}>{"회원가입을 환영합니다 "}</span>
                <span
                    style={{fontSize: authFontSize.fontSize, color: config.COLOR_GREEN}}>{authProgressInfo.email}</span>
                <span style={{fontSize: authFontSize.fontSize, color: config.COLOR_BLACK}}>{"님!"}</span>
            </div>
        </>
    )
}
