import JobData from "../job/JobData";
import {config, defaultQueryState} from "../Config";
import {requestPost} from "../api/api";


export const globalQueryState = {...defaultQueryState};


export const setJobCntFromQueryResult = (searchResult) => {
    Object.keys(JobData.company).forEach(cid => {
        if (searchResult.companyJobCnt[cid])
            JobData.company[cid].countedJobCnt = searchResult.companyJobCnt[cid];
        else
            JobData.company[cid].countedJobCnt = 0;
    })
    Object.keys(JobData.position).forEach(pid => {
        if (searchResult.positionJobCnt[pid])
            JobData.position[pid].countedJobCnt = searchResult.positionJobCnt[pid];
        else
            JobData.position[pid].countedJobCnt = 0;
    })
    JobData.position[config.PS_ID_ROOT].countedJobCnt = searchResult.totalCnt;

}


export const handleQueryAPI = (query, endpoint) => {
    const data = {
        "searchOrder": query.searchOrder,
        "stringSearchType": query.stringSearchType,
        "languageSearchType": query.languageSearchType,
        "experienceAbove": query.experienceAbove,
        "experienceBelow": query.experienceBelow,
        "searchPageSize": query.searchPageSize,
        "searchPage": query.searchPage,
        "searchString": query.searchText,
        "company": query.company,
        "position": query.position,
        "language": query.language,

    };
    return requestPost(endpoint, data);
}
