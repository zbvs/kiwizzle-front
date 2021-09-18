import React, {useState} from "react";
import {HTTP_CODE, requestPost} from "../api/api";
import {config} from "../Config";
import {AUTH_PATH, authFontSize, authProgressInfo, setUserId} from "./Auth";
import {modalUseStyles} from "../form/Modal";
import {useDispatch} from "react-redux";
import {authLoggedIn} from "../store/auth-reducer";
import {FORM_STATUS_CODE, FORM_STATUS_MESSAGE} from "../form/Form";

export default function AuthFormLogin() {

    const [loginStatus, setLoginStatus] = useState(FORM_STATUS_CODE.FORM_DEFAULT);
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    const handleLogin = () => {
        if (password.length < 8) {
            setLoginStatus(FORM_STATUS_CODE.INVALID_PASSWORD_FORMAT);
            setMessage(FORM_STATUS_MESSAGE.INVALID_PASSWORD_FORMAT);
        } else {
            requestPost(AUTH_PATH + "/login", {email: authProgressInfo.email, password: password}).then((result) => {
                if (result.status === HTTP_CODE.OK) {
                    setUserId(result.data.userId);
                    dispatch(authLoggedIn());
                } else if (result.status === HTTP_CODE.UNAUTHORIZED) {
                    setLoginStatus(FORM_STATUS_CODE.WORNG_PASSWORD);
                    setMessage(FORM_STATUS_MESSAGE.WORNG_PASSWORD);
                } else {
                    setLoginStatus(FORM_STATUS_CODE.SEVER_ERROR);
                    setMessage(FORM_STATUS_MESSAGE.SERVER_ERROR);
                }
            })
        }
    }

    const classes = modalUseStyles();

    return (
        <>
            <div>
                <span style={{color: config.COLOR_BLACK}}>{"ID"}</span>
                <input style={{marginBottom: "10px", borderColor: config.COLOR_GREEN}}
                       type="text" value={authProgressInfo.email} disabled className="form-control"/>

                <span style={{color: config.COLOR_BLACK}}>{"비밀번호"}</span>
                <input style={{
                    marginBottom: "10px",
                    borderColor: loginStatus === FORM_STATUS_CODE.FORM_DEFAULT ? config.COLOR_GREEN : config.COLOR_RED
                }}
                       onChange={event => setPassword(event.target.value)} type="password" className="form-control"/>

                <span style={{color: config.COLOR_RED}}>{message}</span>
                <button style={{fontSize: authFontSize}} className={classes.buttonStart} type="button"
                        onClick={handleLogin}>
                    로그인
                </button>

            </div>
        </>
    )
}
