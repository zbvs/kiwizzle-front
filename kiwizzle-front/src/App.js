import * as React from 'react';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {Box, createMuiTheme, useMediaQuery} from '@material-ui/core';
import TopBar from './topmenu/TopBar';
import Search from './job/Search'
import {BrowserRouter as Router, Redirect, Route, Switch, useHistory} from "react-router-dom";
import Hidden from "@material-ui/core/Hidden";
import RowGrid from "./layout/RowGrid";
import Header from "./Header";
import Statistics from "./statistics/Statistics";
import {Helmet} from "react-helmet-async";
import Grid from "@material-ui/core/Grid";
import Style from "./Style.module.css";
import Error from "./Error";
import {shallowEqual, useSelector} from "react-redux";
import Subscribe, {SUBSCRIPTION_PATH} from "./subscription/Subscribe";
import {AUTH_STATE_COOKE_VALUE_LOGGED_IN} from "./auth/Auth";
import LoginModal from "./auth/LoginModal";
import {getUrlParamaters} from "./Util";
import {SelectedCountryId} from "./job/JobData";


const theme = createMuiTheme({
    palette: {
        background: {
            default: "#ffffff"
        }
    }
});


const historyInfo = {
    initialLenth: window.history.length,
    paths: []
};

const pushState = window.history.pushState;
window.history.pushState = (...arg) => {
    historyInfo.paths.push(arg[2]);
    pushState.apply(window.history, [...arg]);
}

const globalPopSatetelistener = (event) => {
    historyInfo.paths.pop();
}
window.addEventListener("popstate", globalPopSatetelistener);


const PrivateRoute = (props) => {
    const {Component, path} = props;
    const history = useHistory();


    const {authState} = useSelector((state) => {
        return {
            authState: state.auth.authState
        }
    }, shallowEqual);

    const onModalCloseCallback = () => {
        if (historyInfo.paths.length > 0)
            history.goBack();
        else
            history.push("/");
    }

    return (
        <Route path={path}>
            {authState === AUTH_STATE_COOKE_VALUE_LOGGED_IN ? <Component/> :
                <LoginModal modalShow={true} onModalCloseCallback={onModalCloseCallback}/>}
        </Route>
    )
}

const DataSet = (props) => {
    const {finished} = props;
    useSelector((state) => {
        return {
            topMenu: state.job.topMenu
        }
    }, shallowEqual);

    if (finished) {
        let selectedCountryId;
        if (getUrlParamaters("country", window.location.search))
            selectedCountryId = getUrlParamaters("country", window.location.search);
        else
            selectedCountryId = "1";
        SelectedCountryId.value = selectedCountryId;
    }

    return (
        <>
        </>
    )
}

const MainRouter = () => {
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const {finished} = useSelector((state) => ({
        finished: state.init.finish,
    }), shallowEqual);

    return (
        <>
            <DataSet finished={finished}/>
            <TopBar title="Kiwizzle" isMobile={isMobile}/>
            <Grid item xs={12} className={Style.divHeader}>
                <Box pt={isMobile ? 0 : 1}>
                </Box>
                <Hidden smDown>
                    <RowGrid>
                        <Header/>
                    </RowGrid>
                </Hidden>
            </Grid>
            <div className={Style.divContent}>
                <hr style={{width: "100%", borderTop: "solid 1px", color: "#BFBFBF"}}/>
                <Switch>
                    {/*<Route path="/about" >*/}
                    {/*    <About></About>*/}
                    {/*</Route>*/}

                    <PrivateRoute path={SUBSCRIPTION_PATH}
                                  Component={Subscribe}/>

                    <Route path="/error">
                        <Error></Error>
                    </Route>
                    <Route path="/statistics">
                        <Statistics isMobile={isMobile} finished={finished}/>
                    </Route>

                    <Route path="/search">
                        <Search isMobile={isMobile} finished={finished}/>
                    </Route>
                    <Route path={"/"}>
                        <Redirect to="/search"/>
                    </Route>

                </Switch>
            </div>
        </>
    )
}

export default function App() {
    return (
        <React.Fragment>
            <MuiThemeProvider theme={theme}>
                <Helmet>
                    <title>{"개발자 채용 | 키위즐"}</title>
                    <meta name="description"
                          content="주요 IT 기업 개발자 채용 정보"
                    />
                </ Helmet>
                <Router>
                    <MainRouter/>
                </Router>
            </MuiThemeProvider>
        </React.Fragment>
    );
}
