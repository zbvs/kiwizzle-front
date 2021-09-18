import React, {useState} from "react";
import {config} from "../Config";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {CODE_MESSAGE, HTTP_CODE, requestDelete, requestGet} from "../api/api";
import {authProgressInfo, getUserId, KIWIZZLE_PROVIDER_NAME, LOCAL_PROVIDER_NAME, USER_PATH} from "../auth/Auth";
import {FORM_STATUS_CODE, FORM_STATUS_MESSAGE} from "../form/Form";


export default function AccountFormDeleteConfirm(props) {
    const {handleClose} = props;

    const [loginStatus, setLoginStatus] = useState(FORM_STATUS_CODE.FORM_DEFAULT);


    const [data, setData] = useState(
        {fetched: false, password: "", rePassword: "", userId: null, email: "", nickname: "", providerCode: ""}
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
        if (data.fetched) {
            if (data.password.length < 8) {
                setData({...data, status: FORM_STATUS_CODE.PASSWORD_TOO_SHORT});
                setMessage(FORM_STATUS_MESSAGE.PASSWORD_TOO_SHORT);

            } else if (data.password !== data.rePassword) {
                setData({...data, status: FORM_STATUS_CODE.REPASSWORD_NOT_MATCHED});
                setMessage(FORM_STATUS_MESSAGE.REPASSWORD_NOT_MATCHED);
            } else {
                requestDelete("/user/" + getUserId(), {
                    email: authProgressInfo.email,
                    password: data.password,
                    rePassword: data.rePassword
                }).then((result) => {
                    if (result.status === HTTP_CODE.OK) {
                        window.location.href = "/"
                    } else if (result.status === HTTP_CODE.BAD_REQUEST) {
                        setLoginStatus(FORM_STATUS_CODE.WORNG_PASSWORD);
                        setMessage(FORM_STATUS_MESSAGE.WORNG_PASSWORD);
                    } else if (result.status >= 500) {
                        setLoginStatus(FORM_STATUS_CODE.SEVER_ERROR);
                        setMessage(FORM_STATUS_MESSAGE.SEVER_ERROR);
                    } else {
                        setLoginStatus(FORM_STATUS_CODE.INVALID_INPUT);
                        setMessage(FORM_STATUS_MESSAGE.INVALID_INPUT);
                    }
                })
            }
        }
    }

    const onDataChange = (key, value) => {
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
                <div style={{display: "block", width: "100%"}}>
                    <span style={{color: config.COLOR_RED}}>{"계정을 삭제합니다."}</span>
                </div>
                <span style={{color: config.COLOR_BLACK}}>{"email"}</span>
                <input style={{marginBottom: "10px", borderColor: config.COLOR_BLACK}}
                       type="text" value={data.email} disabled className="form-control"/>

                <span style={{color: config.COLOR_BLACK}}>{"확인 비밀번호"}</span>
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
            </Modal.Body>

            <Modal.Footer>
                <div style={{display: "block", width: "100%"}}>
                    <span
                        style={{color: data.code === HTTP_CODE.OK ? config.COLOR_GREEN : config.COLOR_RED}}>{message}</span>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                    <Button variant="danger" onClick={handleDelete}>
                        {"Delete Account"}
                    </Button>


                    <Button variant="primary" onClick={handleClose}>
                        {"Close"}
                    </Button>
                </div>
            </Modal.Footer>
        </>
    )
}
