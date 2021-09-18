import React, {useState} from 'react';

import {
    existingIdCntMap,
    filterCategoryCountry,
    JobData,
    searchedIdCntMap,
    SelectedCategoryId,
    SelectedCompanySets,
    SelectedCountryId,
    setTreeCntMap,
    TreeSelectionHandler
} from "../../job/JobData";
import {logger} from '../../Util'
import {doQuery} from '../../store/job-reducer';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {config} from '../../Config';
import CompanyFilter from "./DefaultFilter";
import CategoryFilter from "./CategoryFilter";
import CountryFilter from "./CountryFilter";

export default function CompanyMenu() {
    useSelector((state) => {
        return {
            categoryId: state.job.category,
            countryId: state.job.country,
            finishSearch: state.job.finishSearch,
            finishStatistics: state.job.finishStatistics
        }
    }, shallowEqual);

    const categoryId = SelectedCategoryId.value;
    const countryId = SelectedCountryId.value;
    //We don't use state but only use it for re-rendering.
    //We use selectedCompany as state instead.
    const [, setCompany] = useState([]);
    const dispatch = useDispatch();
    logger.trace("#### CompanyMenu rendered");


    //Currently, we use only one SelectedSet for all category.
    const SelectedIdSet = SelectedCompanySets[categoryId];

    const getCurrentChilds = (parent) => {
        return parent.childs.filter(company => company.countryId === countryId && (company.category.includes(categoryId) || categoryId === config.CT_ID_ALL))
    }

    //NOTE:
    // existingIdCntMap is IdMap to show All(unexpired) job count of company in DB
    // searchedIdCntMap is IdMap to calculate Searched job count within All jobs.
    // We print job count like : {searched job count} / { All unexpired job count }
    setTreeCntMap(existingIdCntMap, JobData.companyRoot, "companyId", "jobCnt", getCurrentChilds);
    setTreeCntMap(searchedIdCntMap, JobData.companyRoot, "companyId", "countedJobCnt", getCurrentChilds);

    const handleCompanyChange = (company) => {
        TreeSelectionHandler(company, SelectedIdSet, "companyId", getCurrentChilds);
        const selectedCompany = [...SelectedIdSet].filter(cid => filterCategoryCountry(cid, categoryId, countryId))
        setCompany(selectedCompany);
        dispatch(doQuery());
    }

    return (
        <>
            <div style={{display: "flex", flexDirection: "row"}}>
                <div style={{borderRight: "1px solid #BFBFBF", width: "100px"}}>
                    <CountryFilter/>
                </div>
                <div style={{paddingLeft: "5px"}}>
                    <CategoryFilter/>
                    <hr style={{width: "100%"}}/>
                    <CompanyFilter SelectedSet={SelectedIdSet} categoryId={categoryId} countryId={countryId}
                                   changeHandler={handleCompanyChange}/>
                </div>
            </div>
        </>
    )
}
