import React from "react";
import JobData, {SelectedCategoryId, SelectedCompanySets, SelectedCountryId} from "../../job/JobData";
import Style from "../../Style.module.css";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {addUrlParameter, deleteUrlParamaters, logger} from "../../Util";
import {changeCountry, doQuery} from "../../store/job-reducer";
import {config} from "../../Config";
import {Link} from "react-router-dom";

export default function CountryFilter() {
    const links = [];

    useSelector((state) => {
        return {
            selectedCountryId: state.job.country
        }
    }, shallowEqual);

    const selectedCountryId = SelectedCountryId.value;

    const dispatch = useDispatch();

    logger.trace("CountryFilter rendered selectedCountryId:", selectedCountryId);

    const onClick = (e) => {
        SelectedCountryId.value = e.currentTarget.getAttribute('idkey');
        SelectedCategoryId.value = config.CT_ID_ALL;
        for (let company of Object.values(JobData.company)) {
            company.category.forEach(categoryId => SelectedCompanySets[categoryId].add(company.companyId))
            SelectedCompanySets[config.CT_ID_ALL].add(company.companyId);
        }
        dispatch(changeCountry(SelectedCountryId.value));
        dispatch(doQuery());
    };

    const getPageUrl = (id) => {
        let url = deleteUrlParamaters("page", window.location.search);
        if (id === "1")
            url = deleteUrlParamaters("country", url)
        else
            url = addUrlParameter("country", id, url);
        return window.location.pathname + (url.length === 0 ? "" : "?" + url.toString());

    }


    for (const country of JobData.sortedCountry) {
        const id = country.countryId;
        if (selectedCountryId === id)
            links.push(<Link onClick={onClick} style={{marginBottom: "10px"}} className={Style.FilterASelected}
                             idkey={id} key={id} to={getPageUrl(id)}>{country['publicNameKor']}</Link>)
        else
            links.push(<Link onClick={onClick} style={{marginBottom: "10px"}} className={Style.FilterAUnselected}
                             idkey={id} key={id} to={getPageUrl(id)}>{country['publicNameKor']}</Link>)
    }

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            {links}
        </div>
    )
}
