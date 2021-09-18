import {shallowEqual, useDispatch, useSelector} from "react-redux";
import JobData, {
    aesDecryptData,
    getJobDetailComponent,
    getRealCidSelected,
    getRealLidSelected,
    getRealPidSelected,
    recursiveStringifyId,
    ToGeneralPageNumber
} from "../job/JobData";
import {finishSearch, job_state} from "../store/job-reducer";
import {globalQueryState, handleQueryAPI, setJobCntFromQueryResult} from "./Query";
import {initPositionFilterAfterQuery} from "../filter/PositionFilter";
import {useHistory} from "react-router-dom";


const refineSearchResults = (searchResult) => {
    JobData.job = {};
    JobData.sortedJob = [];
    searchResult.jobs.forEach(x => {
        x.document.title = aesDecryptData(x.document.title);
        recursiveStringifyId(x);
        JobData.job[x["descId"]] = x;
        JobData.sortedJob.push(x);
    })
}


const setJobListMetadataComponents = (isMobile) => {
    //sort by companyId
    Object.values(JobData.job).forEach(x => {
        x.detailComponent = getJobDetailComponent(x, isMobile);
    })
}

export default function SearchQuery(props) {
    const {isMobile} = props;
    useSelector((state) => {
        return {doSearch: state.job.doQuery}
    }, shallowEqual);

    const search = window.location.search;
    const params = new URLSearchParams(search);
    globalQueryState.searchPage = params.get('page') === null ? 0 : ToGeneralPageNumber(parseInt(params.get('page')));

    const dispatch = useDispatch();
    const history = useHistory();

    const doSearchQuery = async (cidSelected, pidSelected, lidSelected, searchState) => {
        //When it is job from Enter key typing, or Search button, then we have reset page to zero.
        JobData.searchQuery = Object.assign({
            company: cidSelected,
            position: pidSelected,
            language: lidSelected
        }, searchState)
        const result = await handleQueryAPI(JobData.searchQuery, "/query/search");
        if (result.status !== 200)
            history.push("/error")
        else {
            const searchResult = result.data;
            refineSearchResults(searchResult)
            JobData.searchResult = searchResult;

            setJobListMetadataComponents(isMobile);
            setJobCntFromQueryResult(searchResult);
            initPositionFilterAfterQuery(searchResult);
            dispatch(finishSearch(++job_state.finishSearch));
        }
    }

    doSearchQuery(getRealCidSelected(), getRealPidSelected(), getRealLidSelected(), globalQueryState);
    return (<>
        </>
    )
}
