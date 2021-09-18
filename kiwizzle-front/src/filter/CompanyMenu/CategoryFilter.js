import React from 'react';
import {JobData, SelectedCategoryId} from '../../job/JobData';
import {changeCategory, doQuery} from '../../store/job-reducer'
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {logger} from "../../Util";
import Style from "../../Style.module.css"
import Grid from "@material-ui/core/Grid";


export default function CategoryFilter() {
    const spans = [];

    useSelector((state) => {
        return {
            selectedCategoryId: state.job.category,
        }
    }, shallowEqual);
    const selectedCategoryId = SelectedCategoryId.value;
    const dispatch = useDispatch();
    logger.trace("CategoryFilter rendered selectedCategoryId:", selectedCategoryId);

    const onClick = (e) => {
        SelectedCategoryId.value = e.currentTarget.getAttribute('idkey');
        dispatch(changeCategory(SelectedCategoryId.value));
        dispatch(doQuery());
    };

    for (const category of JobData.sortedCategory) {
        const id = category.categoryId;
        if (selectedCategoryId === id)
            spans.push(<span onClick={onClick} className={Style.FilterSpanSelected} idkey={id}
                             key={id}>{category['publicNameKor']}</span>)
        else
            spans.push(<span onClick={onClick} className={Style.FilterSpanUnselected} idkey={id}
                             key={id}>{category['publicNameKor']}</span>)
    }

    return (
        <Grid container>
            {spans}
        </Grid>
    )

}
