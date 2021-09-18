import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {AppBar, Grid, useScrollTrigger} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Link, useHistory} from "react-router-dom";
import RowGrid from "../layout/RowGrid";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Hidden from "@material-ui/core/Hidden";
import {config} from "../Config";
import AccountButton from "../account/AccountModalMain";
import {AUTH_STATE_COOKE_VALUE_LOGGED_IN, isSignupRedirected} from "../auth/Auth";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import {SUBSCRIPTION_PATH} from "../subscription/Subscribe";
import {changeTopMenu} from "../store/job-reducer";

const fontSizeMobile = 20;
const fontSize = 25

export const topbarUseStyle = makeStyles((theme) => ({
    AppBar: {
        background: '#ffffffe0'
    },
    grid: {
        minHeight: 64,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    logo: {
        textDecoration: 'none',
        color: '#14ad3b',
        fontFamily: 'Helvetica',
        fontSize: fontSize,
        marginLeft: "20px",
        "&:hover": {
            color: '#14ad3b',
            textDecoration: 'none'
        }
    },
    logoMobile: {
        textDecoration: 'none',
        color: '#14ad3b',
        fontFamily: 'Helvetica',
        fontSize: fontSizeMobile,
        marginLeft: "20px",
        "&:hover": {
            color: '#14ad3b',
            textDecoration: 'none'
        }
    },
    linkSelected: {
        textDecoration: "underline",
        padding: "0 12px",
        cursor: "pointer",
        fontSize: fontSize,
        display: "block",
        color: "#000000",
        "&:hover": {
            color: "#000000",
            textDecoration: "underline"
        }
    },
    linkSelectedMobile: {
        textDecoration: "underline",
        padding: "0 6px",
        cursor: "pointer",
        fontSize: fontSizeMobile,
        display: "block",
        color: "#000000",
        "&:hover": {
            color: "#000000",
            textDecoration: "underline"
        }
    },
    linkUnselected: {
        textDecoration: "none",
        padding: "0 12px",
        cursor: "pointer",
        fontSize: fontSize,
        display: "block",
        color: "#000000",
        "&:hover": {
            color: "#000000",
            textDecoration: "underline"
        }
    },
    linkUnselectedMobile: {
        textDecoration: "none",
        padding: "0 6px",
        cursor: "pointer",
        fontSize: fontSizeMobile,
        display: "block",
        color: "#000000",
        "&:hover": {
            color: "#000000",
            textDecoration: "none"
        }
    },
    buttonTopbar: {
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        backgroundColor: config.COLOR_WHITE,
        color: config.COLOR_LIGHT_BLUE,
        border: "1px solid " + config.COLOR_LIGHT_BLUE,
        padding: "5px !important"
    }
}));


const ElevationScroll = (props) => {
    const {children, window} = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};


const TopMenu = {
    "0": {title: "Job", path: "/search"},
    "1": {title: "Kiwizzle 통계", path: "/statistics"},
    "2": {title: "구독관리", path: SUBSCRIPTION_PATH}

};
const TopMenuMobile = {
    "0": {title: "Job", path: "/search"},
    "1": {title: "Kiwizzle 통계", path: "/statistics"},
    "2": {title: "구독관리", path: SUBSCRIPTION_PATH}
};


const logoTitle = "Kiwizzle";
let initialMenu = null;


for (let key in TopMenu) {
    if (window.location.pathname === TopMenu[key].path) {
        initialMenu = key;
        break
    } else if (window.location.pathname === "/") {
        initialMenu = "0";
        break;
    }
}


function TopBar(props) {
    const {isMobile} = props;
    const history = useHistory();

    const classes = topbarUseStyle();
    const [selected, setSelected] = useState(initialMenu);
    const {authState} = useSelector((state) => {
        return {
            authState: state.auth.authState
        }
    }, shallowEqual);

    const [modalShow, setModalShow] = useState(isSignupRedirected());
    const Menu = isMobile ? TopMenuMobile : TopMenu;
    const links = [];
    const dispatch = useDispatch();
    useEffect(() => {
        const historyListner = (location) => {

            const paths = location.pathname.split("\\");

            if (paths.length > 0) {
                for (const key in TopMenuMobile) {
                    if (TopMenuMobile[key].path === paths[0]) {
                        setSelected(key);
                        break;
                    }
                }
            }
        }
        const unlistenHistory = history.listen(historyListner)

        const popStatelistener = (event) => {
            if (document.activeElement instanceof HTMLElement)
                document.activeElement.blur();
        }
        window.addEventListener("popstate", popStatelistener);

        return () => {
            window.removeEventListener("popstate", popStatelistener)
            unlistenHistory();
        }
    })

    const onClick = (e) => {
        dispatch(changeTopMenu(e.target.getAttribute("idkey")));
    }

    for (const key in Menu) {
        if (selected === key)
            links.push(<Link className={isMobile ? classes.linkSelectedMobile : classes.linkSelected}
                             to={Menu[key].path} onClick={onClick} idkey={key} key={key}>{Menu[key].title} </Link>)
        else
            links.push(<Link className={isMobile ? classes.linkUnselectedMobile : classes.linkUnselected}
                             to={Menu[key].path} onClick={onClick} idkey={key} key={key}>{Menu[key].title} </Link>)
    }


    const buttons = [];
    if (authState === AUTH_STATE_COOKE_VALUE_LOGGED_IN) {
        buttons.push(
            <div key={buttons.length} style={{marginLeft: "20px"}}>
                <AccountButton isMobile={isMobile}></AccountButton>
            </div>
        )
    }

    const authButton = authState === AUTH_STATE_COOKE_VALUE_LOGGED_IN ?
        <LogoutButton isMobile={isMobile} setModalShow={setModalShow}/> :
        <LoginButton isMobile={isMobile} modalShow={modalShow} setModalShow={setModalShow}/>;

    buttons.push(
        <div key={buttons.length} style={{marginLeft: "20px"}}>
            {authButton}
        </div>
    );

    return (
        <React.Fragment>
            <ElevationScroll {...props}>
                <AppBar className={classes.AppBar}>
                    <RowGrid className={classes.grid}>
                        <Hidden xsDown>
                            <Grid container xs={12} direction="row" alignItems={"center"} item>
                                <Link className={isMobile ? classes.logoMobile : classes.logo} idkey={"0"}
                                      to={Menu["0"].path}>{logoTitle}
                                </Link>
                                {<span>&nbsp;&nbsp;&nbsp;</span>}
                                {links}
                                {buttons}
                            </Grid>
                        </Hidden>

                        <Hidden smUp>
                            <Grid style={{padding: "10px"}} container justify={"space-between"} xs={12} direction="row"
                                  item>
                                <Link className={isMobile ? classes.logoMobile : classes.logo} idkey={"0"}
                                      to={Menu["0"].path}>{logoTitle}
                                </Link>
                                <Grid item>
                                    <Grid container>
                                        {buttons}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid style={{marginBottom: "5px"}} container xs={12} direction="row" item>
                                {<span>&nbsp;&nbsp;&nbsp;</span>}
                                {links}
                            </Grid>
                            <hr style={{width: "100%", margin: "0px", borderTop: "solid 1px", color: "#BFBFBF"}}/>
                        </Hidden>
                    </RowGrid>
                </AppBar>
            </ElevationScroll>
            <div style={{marginBottom: "60px"}}/>

        </React.Fragment>
    );
}


export default TopBar;

