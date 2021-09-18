import Modal from "react-bootstrap/Modal";
import {config} from "../Config";
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import {AUTH_STATUS, isLoggedInCookieSet, isNeedPasswordEmailSignup, isUnauthorizedOAuth2State} from "./Auth";
import AuthEmailPassword from "./AuthEmailPassword";
import AuthOAuth2Password from "./AuthOAuth2Password";
import AuthFormConfirm from "./AuthFormConfirm";
import AuthFormSignupSuccess from "./AuthFormSignupSuccess";
import AuthFormLogin from "./AuthFormLogin";
import AuthFormMain from "./AuthFormMain";
import {authLoggedIn} from "../store/auth-reducer";
import {useDispatch} from "react-redux";
import {defaultModalStyle} from "../form/Modal";

const selectAuthForm = (form, selectForm) => {

    switch (form) {
        case AUTH_STATUS.EMAIL_PASSWORD:
            return (
                <AuthEmailPassword selectForm={selectForm}/>
            )
        case AUTH_STATUS.OAUTH2_PASSWORD:
            return (
                <AuthOAuth2Password selectForm={selectForm}/>
            )
        case AUTH_STATUS.SIGNUP_CONFIRM:
            return (
                <AuthFormConfirm selectForm={selectForm}/>
            )
        case AUTH_STATUS.SIGNUP_SUCCESS:
            return (
                <AuthFormSignupSuccess/>
            )
        case AUTH_STATUS.LOGIN:
            return (
                <AuthFormLogin selectForm={selectForm}/>
            )
        case AUTH_STATUS.COMPLETE:
            return (
                <></>
            )
        default:
            return (
                <AuthFormMain selectForm={selectForm}/>
            )
    }
}


export default function LoginModal(props) {
    const {modalShow, onModalCloseCallback} = props;
    const [form, selectForm] = useState(isUnauthorizedOAuth2State() ? AUTH_STATUS.OAUTH2_PASSWORD :
        isNeedPasswordEmailSignup() ? AUTH_STATUS.EMAIL_PASSWORD : AUTH_STATUS.AUTH_MAIN);
    const dispatch = useDispatch();

    const handleLoginModalClose = () => {
        if (isLoggedInCookieSet())
            dispatch(authLoggedIn());
        if (onModalCloseCallback && form !== AUTH_STATUS.SIGNUP_SUCCESS)
            onModalCloseCallback();
        selectForm(AUTH_STATUS.AUTH_MAIN);
    }

    return (
        <Modal
            style={defaultModalStyle}
            show={modalShow}
            onHide={handleLoginModalClose}
            keyboard={false}
            animation={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <div style={{marginBottom: "20px"}}>
                        <span style={{color: config.COLOR_GREEN}}>Kiwizzle</span>
                        <br/>
                        <span style={{fontSize: 20}}>Kiwizzle에서 다양한 개발 정보를 체험하세요!</span>
                    </div>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {selectAuthForm(form, selectForm)}
            </Modal.Body>
            <Modal.Footer>

                <Button variant="primary" onClick={handleLoginModalClose}>
                    {"취소"}
                </Button>

            </Modal.Footer>
        </Modal>
    )
}
