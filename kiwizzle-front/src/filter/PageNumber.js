import Pagination from "@material-ui/lab/Pagination";
import {shallowEqual, useSelector} from "react-redux";
import JobData, {ToFrontPageNumber, ToGeneralPageNumber} from "../job/JobData";
import {config} from "../Config"
import {Grid, useMediaQuery} from "@material-ui/core";
import React from "react";
import useTheme from "@material-ui/core/styles/useTheme";
import {Link} from 'react-router-dom';
import PaginationItem from "@material-ui/lab/PaginationItem";
import {addUrlParameter, deleteUrlParamaters} from "../Util";

export default function PageNumber(props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const {isBotton} = props;


    useSelector((state) => {
        return {
            finishSearch: state.job.finishSearch,
        }
    }, shallowEqual);

    const search = window.location.search;
    const params = new URLSearchParams(search);
    const page = params.get('page') === null ? 0 : ToGeneralPageNumber(parseInt(params.get('page')));

    let length = 0;

    if (JobData.searchResult) {
        length = Math.ceil(JobData.searchResult.totalCnt / JobData.searchQuery.searchPageSize);
    }
    const onChange = (event, value) => {
        if (ToGeneralPageNumber(value) !== page)
            window.scrollTo(0, 0);
    };

    const getPageUrl = (item) => {
        let url = window.location.search;
        if (item.page === 1)
            url = deleteUrlParamaters("page", url)
        else
            url = addUrlParameter("page", item.page, url);
        return window.location.pathname + (url.length === 0 ? "" : "?" + url.toString());
    }


    return (
        <>
            <Grid container direction={"column"} alignContent={"center"}>
                {
                    (isBotton && JobData.sortedJob.length < (isMobile === true ? config.DOWN_MOBILE_PAGE_NUM_PRINT : config.DOWN_PAGE_NUM_PRINT)) ?
                        null :
                        <Pagination
                            size={isMobile ? "small" : "medium"} count={length} page={ToFrontPageNumber(page)}
                            onChange={onChange}
                            renderItem={(item) => (
                                <PaginationItem
                                    component={Link}
                                    to={getPageUrl(item)}
                                    {...item}
                                />
                            )}
                        />
                }
            </Grid>
        </>
    )
}
