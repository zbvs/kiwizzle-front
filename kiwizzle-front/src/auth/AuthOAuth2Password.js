import React, {useState} from "react";
import {HTTP_CODE, requestPost} from "../api/api";
import {config} from "../Config";
import {
    AUTH_PATH,
    AUTH_STATUS,
    AUTH_URL_PARAM_EMAIL,
    AUTH_URL_PARAM_VALIDATION_CODE,
    authFontSize,
    authProgressInfo,
    setUserId
} from "./Auth";
import {modalUseStyles} from "../form/Modal";
import {FORM_STATUS_CODE, FORM_STATUS_MESSAGE} from "../form/Form";


export default function AuthFormOAuth2Password(props) {
    const {selectForm} = props;

    const [loginStatus, setLoginStatus] = useState(FORM_STATUS_CODE.FORM_DEFAULT);
    const [data, setData] = useState({password: "", rePassword: ""});
    const [message, setMessage] = useState("");

    const validationCode = new URLSearchParams(window.location.search).get(AUTH_URL_PARAM_VALIDATION_CODE);
    authProgressInfo.email = new URLSearchParams(window.location.search).get(AUTH_URL_PARAM_EMAIL);

    const handleLogin = () => {
        if (data.password.length < 8) {
            setLoginStatus(FORM_STATUS_CODE.INVALID_PASSWORD_FORMAT);
            setMessage(FORM_STATUS_MESSAGE.INVALID_PASSWORD_FORMAT)
        } else if (data.password !== data.rePassword) {
            setLoginStatus(FORM_STATUS_CODE.REPASSWORD_NOT_MATCHED);
            setMessage(FORM_STATUS_MESSAGE.REPASSWORD_NOT_MATCHED)
        } else {
            requestPost(AUTH_PATH + "/register", {
                validationCode: validationCode,
                password: data.password,
                rePassword: data.rePassword
            }).then((result) => {
                if (result.status === HTTP_CODE.OK) {
                    setUserId(result.data.userId);
                    selectForm(AUTH_STATUS.SIGNUP_SUCCESS);
                } else {
                    setLoginStatus(FORM_STATUS_CODE.INVALID_INPUT);
                    setMessage(FORM_STATUS_CODE.INVALID_INPUT);
                }
            })
        }
    }


    const classes = modalUseStyles();

    const onDataChange = (key, value) => {
        data[key] = value;
        setData({...data});
        setMessage("");
    }

    return (
        <>
            <div>
                <p style={{color: config.COLOR_GREEN}}>{"비밀번호를 설정하여 회원가입을 완료하세요."}</p>

                <span style={{color: config.COLOR_BLACK}}>{"비밀번호"}</span>
                <input style={{
                    marginBottom: "10px",
                    borderColor: loginStatus === FORM_STATUS_CODE.FORM_DEFAULT ? config.COLOR_GREEN : config.COLOR_RED
                }}
                       onChange={event => onDataChange("password", event.target.value)} type="password"
                       className="form-control"/>

                <input style={{
                    marginBottom: "10px",
                    borderColor: loginStatus === FORM_STATUS_CODE.FORM_DEFAULT ? config.COLOR_GREEN : config.COLOR_RED
                }}
                       onChange={event => onDataChange("rePassword", event.target.value)} type="password"
                       className="form-control"/>

                <span style={{color: config.COLOR_RED}}>{message}</span>
                <button style={{fontSize: authFontSize}} className={classes.buttonStart} type="button"
                        onClick={handleLogin}>
                    {"회원가입"}
                </button>

            </div>
        </>
    )
}
