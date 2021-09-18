import React, {useEffect, useState} from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {
    availablePositionSet,
    JobData,
    positionIdCntMap,
    SelectedPositionSet,
    TreeSelectionHandler
} from "../job/JobData";
import {config} from "../Config";
import {logger} from '../Util'
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {doQuery} from "../store/job-reducer";
import Style from "../Style.module.css"


//** Position Global Variables;
//Jobs filtered by current position set
export const positionFilteredSet = new Set();


export const initPositionFilterAfterQuery = (queryResult) => {
    Object.values(JobData.position).forEach(position => {
        positionIdCntMap.set(position.positionId, position.countedJobCnt);
    })
    positionIdCntMap.set(config.PS_ID_ROOT, queryResult.totalCnt);

}


export default function PositionFilter() {

    //Position needs to listen to
    //1. pidSelected : to recalculate positionFilteredSet when selected psition changed
    useSelector((state) => ({
        finishSearch: state.job.finishSearch,
        finishStatistics: state.job.finishStatistics
    }), shallowEqual);

    const [, setPosition] = useState([]);
    const dispatch = useDispatch();
    logger.trace("#### PositionFilter rendered  pidSelected:");


    //After render company filter, we need to dispatch changePosition
    //so that searchFilter can set pidSelected
    useEffect(() => {
        const selectedPosition = [...SelectedPositionSet];
        setPosition(selectedPosition);
    }, []);

    const getCurrentChilds = (parent) => {
        const arr = [];
        availablePositionSet.forEach(id => {
            const position = JobData.position[id];
            if (parent.childs.includes(position))
                arr.push(position);
        })
        return arr;
    }

    //setTreeCntMap(positionIdCntMap,JobData.positionRoot, "positionId", "countedJobCnt",getCurrentChilds);
    const handlePositionChange = (e) => {
        //NOTE:
        // e.currentTarget.getAttribute('~~!~!'); not work in material ui from group
        const clickedPositionId = e.target.name;
        TreeSelectionHandler(JobData.position[clickedPositionId], SelectedPositionSet, "positionId", getCurrentChilds);
        const selectedPosition = [...SelectedPositionSet];
        setPosition(selectedPosition);
        dispatch(doQuery());
    };

    const getPositionItem = (checked, positionId, positionCnt) => {
        return (
            <FormControlLabel

                control={

                    <Checkbox
                        checked={checked}
                        onChange={handlePositionChange}
                        style={{color: "#3f51b5"}}
                        name={positionId}
                    />
                }
                key={positionId}

                label={
                    <span className={Style.spanFilterItem}>
                    {JobData.position[positionId].publicNameEng + " : " + positionCnt}
                    </span>}
            />)
    }

    const items = [];

    availablePositionSet.forEach(positionId => {
        if (SelectedPositionSet.has(positionId))
            items.push(getPositionItem(true, positionId, positionIdCntMap.get(positionId)));
        else
            items.push(getPositionItem(false, positionId, positionIdCntMap.get(positionId)));
    })

    return (

        <FormGroup row>
            {items}
        </FormGroup>
    );
}
