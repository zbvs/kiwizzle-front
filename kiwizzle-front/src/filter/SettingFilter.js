import {doQuery,} from "../store/job-reducer";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {logger} from "../Util";
import React, {useState} from "react";
import {config} from "../Config";
import {globalQueryState} from "../query/Query"
import {Grid} from "@material-ui/core";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import "./ExperienceFilter.css"
import {JobData} from "../job/JobData";


const SearchOrderTable = {}
SearchOrderTable[config.SEARCH_ORDER_REGISTRATION_DATE_DESC] = "최근 등록 순";
SearchOrderTable[config.SEARCH_ORDER_REMAIN_TIME_ASC] = "마감 임박 순";
SearchOrderTable[config.SEARCH_ORDER_COMPANY] = "기업별 정렬";


const ResultCount = (props) => {
    const {isMobile} = props;
    useSelector((state) => {
        return {
            finishSearch: state.job.finishSearch
        }
    }, shallowEqual);
    return (
        <div style={{display: "flex", justifyContent: "flex-start"}}>
                        <span style={{
                            fontWeight: "bold",
                            fontSize: isMobile ? "medium" : "large",
                            display: "flex",
                            color: config.COLOR_LIGHT_BLUE,
                            justifyContent: "flex-start"
                        }}>
                            {JobData.searchResult ? JobData.searchResult.totalCnt + "개의 공고" : ""}
                        </span>
        </div>
    )
}


export default function ExperienceFilter(props) {
    const {isMobile} = props;
    logger.trace("#### ExperienceFilter rendered. ")
    const [stateCounter, setCounter] = useState(0);
    const dispatch = useDispatch();

    const onPageSizeChange = (e) => {
        globalQueryState.searchPageSize = parseInt(e.currentTarget.getAttribute('value'));
        setCounter(stateCounter + 1);
        dispatch(doQuery());
    };


    const onSearchOrderChange = (e) => {
        globalQueryState.searchOrder = e.currentTarget.getAttribute('value');
        setCounter(stateCounter + 1);
        dispatch(doQuery());
    };

    const styleChanged = {
        width: "100%",
        paddingBottom: "15px",
        color: config.COLOR_LIGHT_BLUE,
        borderColor: config.COLOR_WHITE,
        fontSize: isMobile ? "medium" : "medium"
    };

    return (
        <>
            <Grid style={{paddingTop: "5px", paddingBottom: "5px"}} container direction={"row"}>
                <Grid item xs={4}>
                    <ResultCount isMobile={isMobile}/>
                </Grid>

                <Grid item xs={8}>
                    <Grid style={{height: "100%"}} alignContent={"flex-end"} justify={"flex-end"} container
                          direction={"row"}>
                        <div style={{marginRight: "5px"}} className="dropdown-menu-right">
                                <span style={styleChanged} className="dropdown-toggle" type="button"
                                      data-toggle="dropdown">
                                    {globalQueryState.searchPageSize + "개씩 검색"}
                                </span>
                            <ul style={{
                                border: "1px solid #3B82F6",
                                maxHeight: "60vh",
                                left: "0px",
                                position: "absolute",
                                zIndex: "10"
                            }} className="dropdown-menu dropdown-menu-search-page" aria-labelledby="dLabel">
                                <li onClick={onPageSizeChange} value={20}>{"20개씩 검색"}</li>
                                <li onClick={onPageSizeChange} value={100}>{"100개씩 검색"}</li>
                            </ul>
                        </div>
                        <div className="dropdown-menu-right">
                                <span style={styleChanged} className="dropdown-toggle" type="button"
                                      data-toggle="dropdown">
                                    {SearchOrderTable[globalQueryState.searchOrder]}
                                </span>
                            <ul style={{
                                border: "1px solid #3B82F6",
                                maxHeight: "60vh",
                                right: "0px",
                                position: "absolute",
                                zIndex: "10"
                            }} className="dropdown-menu dropdown-menu-search-order" aria-labelledby="dLabel">
                                <li onClick={onSearchOrderChange}
                                    value={config.SEARCH_ORDER_REGISTRATION_DATE_DESC}>{SearchOrderTable[config.SEARCH_ORDER_REGISTRATION_DATE_DESC]}</li>
                                <li onClick={onSearchOrderChange}
                                    value={config.SEARCH_ORDER_REMAIN_TIME_ASC}>{SearchOrderTable[config.SEARCH_ORDER_REMAIN_TIME_ASC]}</li>
                                {/*<li onClick={onSearchOrderChange} value={config.SEARCH_ORDER_COMPANY}>{SearchOrderTable[config.SEARCH_ORDER_COMPANY]}</li>*/}
                            </ul>
                        </div>

                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}
