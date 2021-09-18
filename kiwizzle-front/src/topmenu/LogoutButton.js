import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {requestPost} from "../api/api";
import {AUTH_PATH, authFontSize} from "../auth/Auth";
import {authUnauthorized} from "../store/auth-reducer";
import React from "react";
import {topbarUseStyle} from "./TopBar";


export default function LogoutButton(props) {
    const {setModalShow} = props;
    const history = useHistory();
    const classes = topbarUseStyle();
    const dispatch = useDispatch();
    const handleLogout = () => {
        requestPost(AUTH_PATH + "/logout").then(() => {
            history.push("/");
            dispatch(authUnauthorized());
            setModalShow(false);
        });
    }
    const isMobile = props.isMobile;

    return (
        <button style={{fontSize: isMobile ? authFontSize.fontSizeMobile : authFontSize.fontSize}}
                className={classes.buttonTopbar} type="button" onClick={handleLogout}>
            Logout
        </button>
    )
}
