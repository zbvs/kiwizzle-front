import {changeChart} from "../store/job-reducer";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {logger} from "../Util";
import React from "react";
import {ChartMap} from "../statistics/Chart";


import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './FilterMenuBox.css'

function ChartDropBox(props) {


    const {isMobile} = props;
    const {chartKey} = useSelector((state) => ({
        chartKey: state.job.chartKey
    }), shallowEqual);

    const links = [];
    logger.trace("#### Chart redered")
    const dispatch = useDispatch();


    const onClick = (e) => {
        const clicked = e.currentTarget.getAttribute('idkey');
        dispatch(changeChart(clicked))
    };

    for (const key in ChartMap) {
        links.push(
            <li style={{color: "black"}} idkey={key} key={key} onClick={onClick}>{ChartMap[key].title}</li>
        )
    }
    const filterMenuButtonClass = "filter-menu-button";

    return (

        <div style={{margin: "5px"}} className="dropdown">
            <button style={{padding: "5px", height: isMobile ? "30px" : "40px", width: "100%", overflow: "hidden"}}
                    className={`${filterMenuButtonClass} dropdown-toggle`} type="button"
                    data-toggle="dropdown">
                {"차트선택: " + ChartMap[chartKey].title}
            </button>
            <ul style={{width: "100%"}} className="dropdown-menu dropdown-menu-chart-select" aria-labelledby="dLabel">
                {links}
            </ul>
        </div>

    )
}

export default function StatisticsFilter(props) {
    const {isMobile} = props;
    logger.trace("#### StatisticsFilter rendered");

    return (
        <ChartDropBox isMobile={isMobile}/>
    )
}
