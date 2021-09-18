import React, {useState} from "react";
import {CODE_MESSAGE, HTTP_CODE, requestGet, requestPut} from "../api/api";
import {getUserId, KIWIZZLE_PROVIDER_NAME, LOCAL_PROVIDER_NAME, USER_PATH} from "../auth/Auth";
import Modal from "react-bootstrap/Modal";
import {config} from "../Config";
import Button from "react-bootstrap/Button";
import {ACCOUNT_FORM} from "./Account";
import Style from "../Style.module.css"
import {FORM_STATUS_CODE, FORM_STATUS_MESSAGE} from "../form/Form";

export default function AccountFormInfo(props) {
    const {selectForm, handleClose} = props;

    const [data, setData] = useState(
        {
            fetched: false,
            status: FORM_STATUS_CODE.FORM_DEFAULT,
            password: "",
            newPassword: "",
            reNewPassword: "",
            userId: null,
            email: "",
            nickname: "",
            providerCode: ""
        }
    );
    const [message, setMessage] = useState("");

    const fetchAccountData = () => {
        requestGet(USER_PATH + `/${getUserId()}`).then((result) => {
            data.fetched = true;
            if (result.status === HTTP_CODE.OK) {
                data.email = result.data.email;
                data.nickname = result.data.nickname;
                data.userId = result.data.userId;
                if (result.data.providerCode === LOCAL_PROVIDER_NAME)
                    data.providerCode = KIWIZZLE_PROVIDER_NAME
                else
                    data.providerCode = result.data.providerCode;
            } else {
                setMessage(CODE_MESSAGE[HTTP_CODE.INTERNAL_SERVER_ERROR]);
            }
            setData({...data});
        })
    }


    if (data.fetched === false)
        fetchAccountData();

    const handleDelete = () => {
        selectForm(ACCOUNT_FORM.DELETE_CONFIRM);
    }

    const handleSave = () => {
        if (data.fetched) {
            if (data.password.length < 8) {
                setData({...data, status: FORM_STATUS_CODE.PASSWORD_TOO_SHORT});
                setMessage(FORM_STATUS_MESSAGE.PASSWORD_TOO_SHORT);
            } else if (data.password.length < 8 || (data.newPassword.length > 0 && data.newPassword.length < 8)) {
                setData({...data, status: FORM_STATUS_CODE.INVALID_PASSWORD_FORMAT});
                setMessage(FORM_STATUS_MESSAGE.INVALID_PASSWORD_FORMAT);
            } else if (data.nickname.length < 3) {
                setData({...data, status: FORM_STATUS_CODE.NICKNAME_TOO_SHORT});
                setMessage(FORM_STATUS_MESSAGE.NICKNAME_TOO_SHORT);
            } else if (data.newPassword !== data.reNewPassword) {
                setData({...data, status: FORM_STATUS_CODE.REPASSWORD_NOT_MATCHED});
                setMessage(FORM_STATUS_MESSAGE.REPASSWORD_NOT_MATCHED)
            } else {
                requestPut(USER_PATH + "/" + data.userId,
                    {
                        nickname: data.nickname,
                        password: data.password,
                        newPassword: data.newPassword,
                        reNewPassword: data.reNewPassword
                    })
                    .then((result) => {
                        if (result.status === HTTP_CODE.OK) {
                            data.password = "";
                            data.newPassword = "";
                            data.reNewPassword = "";
                            setData({...data, status: FORM_STATUS_CODE.FORM_UPDATE_SUCCESS});
                            setMessage(FORM_STATUS_MESSAGE.FORM_UPDATE_SUCCESS);

                        } else if (result.status === HTTP_CODE.UNAUTHORIZED) {
                            setData({...data, status: FORM_STATUS_CODE.WORNG_PASSWORD});
                            setMessage(FORM_STATUS_MESSAGE.WORNG_PASSWORD);
                        } else {
                            setData({...data, status: FORM_STATUS_CODE.SEVER_ERROR});
                            setMessage(FORM_STATUS_MESSAGE.SERVER_ERROR);
                        }
                    })
            }
        }
    }

    const handleDataChange = (key, value) => {
        data[key] = value;
        setData({...data});
        setMessage("");
    }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div style={{marginBottom: "20px"}}>
                        <span style={{color: config.COLOR_GREEN}}>Kiwizzle</span>
                        <br/>
                        <span style={{fontSize: 20}}>Setting Account Info</span>
                    </div>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <span style={{color: config.COLOR_BLACK}}>{"email"}</span>
                <input style={{marginBottom: "10px", borderColor: config.COLOR_BLACK}}
                       type="text" value={data.email} disabled className="form-control"/>

                <span style={{color: config.COLOR_BLACK}}>{"login by"}</span>
                <input style={{marginBottom: "10px", borderColor: config.COLOR_BLACK}}
                       type="text" value={data.providerCode} disabled className="form-control"/>


                <div className={Style.divPasswordBox}>
                    <span style={{color: config.COLOR_BLACK}}>{"current password"}</span>
                    <input style={{marginBottom: "10px", borderColor: config.COLOR_BLACK}} value={data.password}
                           onChange={event => handleDataChange("password", event.target.value)} type="password"
                           className="form-control"/>

                    <span style={{color: config.COLOR_BLACK}}>{"nickname"}</span>
                    <input style={{marginBottom: "10px", borderColor: config.COLOR_BLACK}}
                           onChange={event => handleDataChange("nickname", event.target.value)} value={data.nickname}
                           type="text" className="form-control"/>

                    <span style={{color: config.COLOR_BLACK}}>{"new password"}</span>
                    <input style={{marginBottom: "10px", borderColor: config.COLOR_BLACK}} value={data.newPassword}
                           onChange={event => handleDataChange("newPassword", event.target.value)} type="password"
                           className="form-control"/>

                    <input style={{marginBottom: "10px", borderColor: config.COLOR_BLACK}} value={data.reNewPassword}
                           onChange={event => handleDataChange("reNewPassword", event.target.value)} type="password"
                           className="form-control"/>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <div style={{display: "block", width: "100%"}}>
                    <span
                        style={{color: data.status === FORM_STATUS_CODE.FORM_UPDATE_SUCCESS ? config.COLOR_GREEN : config.COLOR_RED}}>{message}</span>
                </div>

                <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                    <Button variant="danger" onClick={handleDelete}>
                        {"Delete Account"}
                    </Button>

                    <div style={{display: "flex", columnGap: "10px"}}>
                        <Button variant="success" onClick={handleSave}>
                            {"Save"}
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            {"Close"}
                        </Button>
                    </div>
                </div>
            </Modal.Footer>
        </>
    )
}

