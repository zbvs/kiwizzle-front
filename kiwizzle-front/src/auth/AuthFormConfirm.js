import React, {useState} from "react";
import {config} from "../Config";
import {AUTH_PATH, authFontSize, authProgressInfo} from "./Auth";
import {modalUseStyles} from "../form/Modal";
import {HTTP_CODE, requestGet} from "../api/api";
import {FORM_STATUS_CODE, FORM_STATUS_MESSAGE} from "../form/Form";


export default function AuthFormConfirm(props) {
    const [authStatus, setAuthStatus] = useState(FORM_STATUS_CODE.FORM_DEFAULT);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const handleConfirm = () => {
        setLoading(true);
        requestGet(AUTH_PATH + "/validation-code/" + authProgressInfo.email, true).then((result) => {
            setLoading(false);
            if (result.status === HTTP_CODE.OK) {
                setMessage("인증 메일을 발송했습니다. 링크를 통해 회원가입을 완료해주세요.");
            } else {
                setAuthStatus(FORM_STATUS_CODE.SEVER_ERROR);
                setMessage(FORM_STATUS_MESSAGE.SERVER_ERROR);
            }
        })
    }

    const classes = modalUseStyles();

    return (
        <>
            <div>
                <span style={{color: config.COLOR_BLACK}}>{"ID"}</span>
                <input style={{marginBottom: "10px", borderColor: config.COLOR_GREEN}}
                       type="text" value={authProgressInfo.email} disabled className="form-control"/>
                <span style={{color: config.COLOR_PURPLE}}>{authProgressInfo.email}</span>
                <span style={{color: config.COLOR_BLACK}}>{"이메일은 이미 "}</span>
                <span style={{color: config.COLOR_PURPLE}}>{authProgressInfo.providers.join()}</span>
                <span style={{color: config.COLOR_BLACK}}>{"로 가입하셨습니다. 계속하시겠습니까?"}</span>
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
                <button style={{fontSize: authFontSize}} className={classes.buttonStart} type="button"
                        onClick={handleConfirm}>
                    Kiwizzle 계정 생성하기
                </button>
                <span
                    style={{color: authStatus === FORM_STATUS_CODE.FORM_DEFAULT ? config.COLOR_GREEN : config.COLOR_RED}}>{message}</span>
            </div>
        </>
    )
}
