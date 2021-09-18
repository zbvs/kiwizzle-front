import {shallowEqual, useSelector} from "react-redux";
import JobData, {validateId} from "../job/JobData";
import BarChart from "./BarChart";
import ExperienceChart from "./ExperienceChart";
import * as React from "react";
import Grid from "@material-ui/core/Grid";
import {backgroundColors} from "./Colors";


export const getColorIndex = (key) => {
    validateId(key);
    const mod = backgroundColors.length;
    return parseInt(key) % mod < 0 ? mod + (parseInt(key) % mod) : parseInt(key) % mod;
}

export const ChartMap = {
    "1": {
        title: "언어/기술 요구 사항 (필수/우대)",
        mapPropKey: "totalLanguageJobCnt",
        JobDataKey: "language",
        fieldName: "언어/기술"
    },
    "2": {
        title: "언어/기술 요구 사항 (필수)",
        mapPropKey: "requireLanguageJobCnt",
        JobDataKey: "language",
        fieldName: "언어/기술"
    },
    "3": {
        title: "경력 별 공고",
        mapPropKey: "experienceJobCnt",
        fieldName: "경력",
    },
    "4": {
        title: "직무별 공고",
        mapPropKey: "positionJobCnt",
        JobDataKey: "position",
        fieldName: "직무",
    },
    "5": {
        title: "기업별 공고",
        mapPropKey: "companyJobCnt",
        JobDataKey: "company",
        fieldName: "기업"
    }
}


const createChartMap = (key) => {
    switch (key) {
        case "1":
            return <BarChart {...(ChartMap[key])} />
        case "2":
            return <BarChart {...(ChartMap[key])} />
        case "3":
            return <ExperienceChart {...(ChartMap[key])} />
        case "4":
            return <BarChart {...(ChartMap[key])} />
        case "5":
            return <BarChart {...(ChartMap[key])} />
        default:
            return <BarChart {...(ChartMap["1"])} />
    }
}

var prevCount = 0;
var prevKey = 0;
const isSameWithPrev = (count, key) => {
    return prevCount === count && prevKey === key;
}
const setPrev = (count, key) => {
    prevCount = count;
    prevKey = key;

}
export default function Chart() {
    const {finishStatistics, chartKey} = useSelector((state) => ({
        finishStatistics: state.job.finishStatistics,
        chartKey: state.job.chartKey,
    }), shallowEqual);

    const isSame = isSameWithPrev(finishStatistics, chartKey);
    setPrev(finishStatistics, chartKey);

    return (
        <>
            {
                JobData.statisticsResult === null || isSame ?
                    null
                    :
                    <>
                        <Grid item xs={12}>
                            <p style={{marginTop: "20px"}}></p>
                            <div className='header'>
                                <h5 style={{fontWeight: "bold", color: "#3B82F6"}}
                                    className='title'>{ChartMap[chartKey].title}</h5>
                            </div>
                        </Grid>
                        {createChartMap(chartKey)}
                        <Grid item xs={12}>

                        </Grid>
                    </>
            }
        </>
    )
}
