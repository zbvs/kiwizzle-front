import {authFontSize} from "../auth/Auth";
import LoginModal from "../auth/LoginModal";
import React from "react";
import {topbarUseStyle} from "./TopBar";


export default function LoginButton(props) {
    const {isMobile, modalShow, setModalShow} = props;
    const classes = topbarUseStyle();


    const handleOpen = () => {
        setModalShow(true);
    }

    const onModalCloseCallback = () => {
        setModalShow(false);
    }

    return (
        <>
            <button style={{fontSize: isMobile ? authFontSize.fontSizeMobile : authFontSize.fontSize}}
                    className={classes.buttonTopbar} type="button" onClick={handleOpen}>
                Login/Signup
            </button>
            <LoginModal modalShow={modalShow} onModalCloseCallback={onModalCloseCallback}/>
        </>
    );
}

