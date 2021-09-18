import {shallowEqual, useDispatch, useSelector} from "react-redux";
import JobData, {
    filterCategoryCountry,
    SelectedCategoryId,
    SelectedCompanySets,
    SelectedCountryId,
    SelectedPositionSet
} from "../job/JobData";

import {finishStatistics, job_state} from "../store/job-reducer";
import {logger} from "../Util";
import {globalQueryState, handleQueryAPI, setJobCntFromQueryResult} from "./Query";
import {initPositionFilterAfterQuery} from "../filter/PositionFilter";
import {useHistory} from "react-router-dom";
import {useState} from "react";

const refineStatisticsResults = (maps) => {
    if (maps.totalLanguageJobCnt.hasOwnProperty("-1"))
        delete maps.totalLanguageJobCnt["-1"];
    if (maps.requireLanguageJobCnt.hasOwnProperty("-1"))
        delete maps.requireLanguageJobCnt["-1"];

}

export default function StatisticsQuery(props) {
    useSelector((state) => {
        return {doSearch: state.job.doQuery};
    }, shallowEqual);
    const categoryId = SelectedCategoryId.value;
    const countryId = SelectedCountryId.value;
    const history = useHistory();
    logger.trace("#### StatisticsFilter rendered");

    const [localStatisticsState,] = useState(globalQueryState);
    const dispatch = useDispatch();


    const getCidSelected = () => [...SelectedCompanySets[categoryId]].filter(cid => filterCategoryCountry(cid, categoryId, countryId));
    const getPidSelected = () => [...SelectedPositionSet];


    const doStatisticsQuery = async (cidSelected, pidSelected, queryState) => {
        JobData.searchQuery = Object.assign({company: cidSelected, position: pidSelected}, queryState);
        const result = await handleQueryAPI({
            ...JobData.searchQuery,
            experienceAbove: "",
            experienceBelow: "",
            language: []
        }, "/query/statistics")
        if (result.status !== 200)
            history.push("/error")
        else {
            const statisticsResult = result.data;
            refineStatisticsResults(statisticsResult);
            JobData.statisticsResult = statisticsResult;

            setJobCntFromQueryResult(statisticsResult);
            initPositionFilterAfterQuery(statisticsResult);

            dispatch(finishStatistics(++job_state.finishStatistics));
        }
    }


    doStatisticsQuery(getCidSelected(), getPidSelected(), localStatisticsState);
    return (<>
        </>
    )
}
