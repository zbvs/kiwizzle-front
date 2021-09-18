import {Grid} from "@material-ui/core";
import {Link, Route, useRouteMatch} from "react-router-dom";
import React from "react";
import RowGrid from '../layout/RowGrid';
import JobList from './JobList';
import JobDetail from './JobDetail'
import PageNumber from "../filter/PageNumber";
import SearchQuery from "../query/SearchQuery";
import FilterMenuBox from "../filter/FilterMenuBox";
import SearchFilter from "../filter/SearchFilter";
import SettingFilter from "../filter/SettingFilter";
import {makeStyles} from "@material-ui/core/styles";
import {config} from "../Config";
import {SUBSCRIPTION_PATH} from "../subscription/Subscribe";


const useStyles = makeStyles((theme) => ({
    divSubscribe: {
        width: "fit-content",
        padding: "3px",
        marginTop: "10px",
        borderRadius: "5px",
        backgroundColor: config.COLOR_WHITE,
        color: config.COLOR_LIGHT_BLUE,
        border: "1px solid " + config.COLOR_LIGHT_BLUE
    },
    linkSubscribe: {
        width: "fit-content",
        "&:hover": {
            color: config.COLOR_LIGHT_BLUE,
            textDecoration: 'none'
        }
    }
}));


export default function Search(props) {
    const {isMobile, finished} = props;
    const match = useRouteMatch();

    const classes = useStyles();

    return (
        <>
            {/* main */ finished ?
                <>
                    {/*  Desc Detail */}
                    <Route exact path={match.url + "/detail/:descId"}>
                        <RowGrid>
                            <Grid item xl={6} md={8} xs={12}>
                                <Grid container direction={"column"}>
                                    <JobDetail/>
                                </Grid>
                            </Grid>
                        </RowGrid>
                    </Route>


                    {/*  Desc List */}
                    <Route exact path={match.url}>
                        <SearchQuery isMobile={isMobile} item/>

                        <RowGrid>
                            <Grid item xl={6} md={8} xs={12}>
                                <Grid container direction={"row"} justify={"center"}>
                                    <FilterMenuBox isMobile={isMobile}/>

                                    <Grid item lg={6} xs={12} style={{padding: "5px", margin: "0px"}}>
                                        <SearchFilter/>
                                    </Grid>
                                    <Grid item xs={12} style={{padding: "5px", margin: "0px"}}>
                                        <div className={classes.divSubscribe}>
                                            <Link className={classes.linkSubscribe} to={SUBSCRIPTION_PATH}>
                                                {"현재 설정으로 이메일 구독하기"}
                                            </Link>
                                        </div>
                                    </Grid>


                                    <Grid container direction={"column"}>
                                        <PageNumber isBotton={false}/>
                                        <SettingFilter isMobile={isMobile}/>


                                        <JobList isMobile={isMobile} item/>
                                        <PageNumber isBotton={true}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </RowGrid>
                    </Route>
                </>
                : null}
        </>
    )

}
