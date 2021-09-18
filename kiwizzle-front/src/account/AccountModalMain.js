import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import "../topmenu/TopMenu.css"
import {authFontSize} from "../auth/Auth";
import {defaultModalStyle} from "../form/Modal";
import {ACCOUNT_FORM} from "./Account";
import AccountFormInfo from "./AccountFormInfo";
import AccountFormDeleteConfirm from "./AccountFormDeleteConfirm";
import {topbarUseStyle} from "../topmenu/TopBar";


const selectModalForm = (form, selectForm, handleClose) => {
    switch (form) {
        case ACCOUNT_FORM.DELETE_CONFIRM:
            return (
                <AccountFormDeleteConfirm selectForm={selectForm} handleClose={handleClose}/>
            )
        case ACCOUNT_FORM.COMPLETE:
            return (
                <></>
            )
        default:
            return (
                <AccountFormInfo selectForm={selectForm} handleClose={handleClose}/>
            )
    }
}


export default function AccountModalMain(props) {
    const {isMobile} = props;
    const classes = topbarUseStyle();

    const [modalShow, setModalShow] = useState(false);
    const [form, selectForm] = useState(ACCOUNT_FORM.ACCOUNT_MAIN);

    const handleOpen = () => {
        setModalShow(true);
    }


    const handleAccountModalClose = () => {
        selectForm(ACCOUNT_FORM.ACCOUNT_MAIN);
        setModalShow(false);
    }

    return (
        <>
            <button style={{fontSize: isMobile ? authFontSize.fontSizeMobile : authFontSize.fontSize}}
                    className={classes.buttonTopbar} type="button" onClick={handleOpen}>
                My Account
            </button>

            <Modal
                style={defaultModalStyle}
                show={modalShow}
                onHide={handleAccountModalClose}
                keyboard={false}
                animation={false}
                centered
            >
                {modalShow ? selectModalForm(form, selectForm, handleAccountModalClose) : null}
            </Modal>
        </>
    );
}
