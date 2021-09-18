import {doQuery,} from "../store/job-reducer";
import {useDispatch} from "react-redux";
import {logger} from "../Util";
import React, {useState} from "react";
import {config} from "../Config";
import {globalQueryState} from "../query/Query"
import {Grid, TextField} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import Style from "../Style.module.css"

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import "./ExperienceFilter.css"
import {isQueryStateDefaultWithKey} from "../job/JobData";


const searchGridConfig = {
    xs: 6
}


const styleDefault = {width: "100%"};
const styleChanged = {width: "100%", color: "#9704C4", borderColor: "#9704C4"};


const SearchOrderTable = {}
SearchOrderTable[config.SEARCH_ORDER_REGISTRATION_DATE_DESC] = "최근 등록 순";
SearchOrderTable[config.SEARCH_ORDER_REMAIN_TIME_ASC] = "마감 임박 순";
SearchOrderTable[config.SEARCH_ORDER_COMPANY] = "기업순 정렬";


export default function ExperienceFilter() {
    logger.trace("#### ExperienceFilter rendered. ")
    const [stateCounter, setCounter] = useState(0);
    const dispatch = useDispatch();

    const onExperienceAboveInputChange = (e) => {
        globalQueryState.experienceAbove = e.target.value;
        setCounter(stateCounter + 1);
        dispatch(doQuery());
    };
    const onExperienceBelowInputChange = (e) => {
        globalQueryState.experienceBelow = e.target.value;
        setCounter(stateCounter + 1);
        dispatch(doQuery());
    };

    return (
        <Grid style={{padding: "10px"}} container direction={"row"}>
            <Grid item {...searchGridConfig} className={Style.divDropboxItem}>
                <TextField
                    style={isQueryStateDefaultWithKey("experienceAbove") ? styleDefault : styleChanged}

                    variant="outlined"
                    label="경력"
                    type="number"
                    value={globalQueryState.experienceAbove === null ? "" : globalQueryState.experienceAbove}
                    onChange={onExperienceAboveInputChange}
                    InputLabelProps={{
                        shrink: true,
                        style: isQueryStateDefaultWithKey("experienceAbove") ? styleDefault : styleChanged
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">년 이상</InputAdornment>,

                    }}
                />
            </Grid>
            <Grid item {...searchGridConfig} className={Style.divDropboxItem}>
                <TextField
                    style={{width: "100%"}}
                    variant="outlined"
                    label="경력 (0=무관/신입)"
                    type="number"
                    value={globalQueryState.experienceBelow === null ? "" : globalQueryState.experienceBelow}
                    onChange={onExperienceBelowInputChange}
                    InputLabelProps={{
                        shrink: true,
                        style: isQueryStateDefaultWithKey("experienceBelow") ? styleDefault : styleChanged
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">년 이하</InputAdornment>,
                    }}
                />
            </Grid>
        </Grid>

    )
}
