import {Grid} from "@material-ui/core";
import {Route, useRouteMatch} from "react-router-dom";
import * as React from "react";
import RowGrid from '../layout/RowGrid';
import StatisticsFilter from "../filter/StatisticsFilter";
import Chart from "./Chart";
import FilterMenuBox from "../filter/FilterMenuBox";
import StatisticsQuery from "../query/StatisticsQuery";
import {Helmet} from "react-helmet-async";


export default function Statistics(props) {
    const {isMobile, finished} = props;
    const match = useRouteMatch();


    return (
        <>
            <Helmet>
                <title>{"개발 프로그래밍 언어 순위 통계 | 키위즐"}</title>
                <meta name="description"
                      content="IT 기업 채용공고 데이터에 기반한 프로그래밍 언어 순위 통계"
                />
            </Helmet>
            {/* main */ finished ?
                <Route exact path={match.url}>
                    <StatisticsQuery isMobile={isMobile} item/>

                    <RowGrid>
                        <Grid item xl={6} md={8} xs={12}>
                            <Grid container direction={"row"} justify={"center"}>
                                <Grid item md={6} xs={12}>
                                    <StatisticsFilter isMobile={isMobile}/>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <FilterMenuBox isMobile={isMobile} useIndex={2} itemSize={6}/>
                                </Grid>
                                <Grid container>
                                    <Chart style={{marginTop: "20px"}}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </RowGrid>
                </Route>
                : null}
        </>
    )

}
