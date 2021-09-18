import React, {useState} from "react";
import {validateEmail} from "../Util";
import {HTTP_CODE, requestGet} from "../api/api";
import {config} from "../Config";

import googleLogo from "../img/google-logo.png";
import githubLogo from "../img/github-logo.png";
import {
    AUTH_PATH,
    AUTH_STATUS,
    authFontSize,
    authProgressInfo,
    GITHUB_AUTH_URL,
    GOOGLE_AUTH_URL,
    LOCAL_PROVIDER_NAME,
    resetAuthProgressInfo
} from "./Auth";
import {modalUseStyles} from "../form/Modal";
import {FORM_STATUS_CODE, FORM_STATUS_MESSAGE} from "../form/Form";


export default function AuthFormMain(props) {
    const {selectForm} = props;
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [authStatus, setAuthStatus] = useState(FORM_STATUS_CODE.FORM_DEFAULT);
    const [email, setEmail] = useState('');

    resetAuthProgressInfo();

    const handleEmail = () => {
        if (!validateEmail(email)) {
            setAuthStatus(FORM_STATUS_CODE.INVALID_EMAIL_FORMAT);
            setMessage(FORM_STATUS_MESSAGE.INVALID_EMAIL_FORMAT);
        } else {
            requestGet(AUTH_PATH + "/check/" + email).then((result) => {
                if (result.status === HTTP_CODE.OK) {
                    if (result.data.length === 0) {
                        setLoading(true);
                        requestGet(AUTH_PATH + "/validation-code/" + email, true).then((result) => {
                            setLoading(false);
                            if (result.status === HTTP_CODE.OK) {
                                setMessage("인증 메일을 발송했습니다. 링크를 통해 회원가입을 완료해주세요.");
                            } else {
                                setAuthStatus(FORM_STATUS_CODE.SEVER_ERROR);
                                setMessage(FORM_STATUS_MESSAGE.SERVER_ERROR);
                            }
                        })
                    } else {
                        const providers = result.data.map(user => user.providerCode);
                        if (providers.includes(LOCAL_PROVIDER_NAME)) {
                            authProgressInfo.email = email;
                            selectForm(AUTH_STATUS.LOGIN);
                        } else {
                            authProgressInfo.email = email;
                            providers.forEach(provider => authProgressInfo.providers.push(provider));
                            selectForm(AUTH_STATUS.SIGNUP_CONFIRM);
                        }
                    }
                } else {
                    setAuthStatus(FORM_STATUS_CODE.SEVER_ERROR);
                    setMessage(FORM_STATUS_MESSAGE.SERVER_ERROR);
                }
            })
        }
    }

    const classes = modalUseStyles();
    const toRedirect = window.location.href;

    const onInputChange = (event) => {
        setEmail(event.target.value)
    };

    return (
        <>
            <div>
                <input style={{
                    marginBottom: "10px",
                    borderColor: authStatus === FORM_STATUS_CODE.FORM_DEFAULT ? config.COLOR_GREEN : config.COLOR_RED
                }}
                       onChange={onInputChange} type="text" placeholder="이메일을 입력하세요." className="form-control"/>
                <span
                    style={{color: authStatus === FORM_STATUS_CODE.FORM_DEFAULT ? config.COLOR_GREEN : config.COLOR_RED}}>{message}</span>
                {
                    loading ?
                        <div style={{padding: "10px", display: "flex", width: "100%", justifyContent: "center"}}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only"></span>
                            </div>
                        </div>
                        :
                        null
                }
                <button style={{fontSize: authFontSize.fontSize}} className={classes.buttonStart} type="button"
                        onClick={handleEmail}>
                    이메일로 시작하기
                </button>

            </div>
            <div style={{display: "flex", justifyContent: "center"}}>
                <span>or</span>
            </div>

            <div className={classes.divLogin}>
                <a className={classes.linkLogin} type="button" href={GOOGLE_AUTH_URL + toRedirect}>
                    <img style={{maxHeight: "100%", maxWidth: "100%", marginRight: "10px"}} src={googleLogo}
                         alt="Google"/>
                    Google로 시작하기
                </a>
            </div>

            <div className={classes.divLogin}>
                <a className={classes.linkLogin} type="button" href={GITHUB_AUTH_URL + toRedirect}>
                    <img style={{maxHeight: "100%", maxWidth: "100%", marginRight: "10px"}} src={githubLogo}
                         alt="Github"/>
                    Github로 시작하기
                </a>
            </div>
        </>
    )
}
