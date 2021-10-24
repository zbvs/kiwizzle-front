import {config} from "../Config";
import React, {useEffect, useState} from "react";
import $ from "jquery";
import {isQueryStateDefaultWithKey} from "../job/JobData";
import {globalQueryState} from "../query/Query"
import {useDispatch} from "react-redux";
import {doQuery} from "../store/job-reducer";

const SearchTextTable = {}
SearchTextTable[config.SEARCH_TEXT_TITLE] = "제목";
SearchTextTable[config.SEARCH_TEXT_ALL] = "제목/본문";

export default function SearchFilter(props) {

    const dispatch = useDispatch();

    const onNewTextSearch = () => {
        dispatch(doQuery());
    }


    const [selectedStringSearchType, setBoxState] = useState(globalQueryState.stringSearchType);
    const [searchText, setSearchText] = useState(globalQueryState.searchText);
    const [forEnterRerenderCnt, onEnterRerender] = useState(0);

    const dropDownMenuClass = "dropdown-menu-search-text";
    useEffect(() => {
        const listener = function () {
            const value = $(this).attr("value");
            globalQueryState.stringSearchType = value;
            setBoxState(value);
            onNewTextSearch();
        }
        $(`.${dropDownMenuClass} li`).on('click', listener);
        return () => {
            $(`.${dropDownMenuClass} li`).off("click", listener)
        }
    })

    const query = (text) => {
        globalQueryState.searchText = text;
        onEnterRerender(forEnterRerenderCnt + 1);
        onNewTextSearch();
    }

    const onKeyUp = (event) => {
        if (event.key === "Enter") {
            query(event.target.value);
        }
    }

    const onChange = (event) => {
        if (event.target.value === "" && searchText !== "")
            query("");
        setSearchText(event.target.value);
    }


    return (
        <div className="input-group">
            <div className="input-group-prepend">
                <button style={isQueryStateDefaultWithKey("searchText") ? {borderColor: config.COLOR_GREEN} : {
                    color: "#9704C4",
                    borderColor: "#9704C4"
                }} className="btn btn-outline-secondary dropdown-toggle search-select-button" type="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {SearchTextTable[selectedStringSearchType] + " 검색"}
                </button>
                <ul className="dropdown-menu dropdown-menu-search-text" aria-labelledby="dLabel">
                    <li value={config.SEARCH_TEXT_TITLE}>{SearchTextTable[config.SEARCH_TEXT_TITLE]}</li>
                    <li value={config.SEARCH_TEXT_ALL}>{SearchTextTable[config.SEARCH_TEXT_ALL]}</li>
                </ul>
            </div>
            <input style={isQueryStateDefaultWithKey("searchText") ? {
                    color: config.COLOR_GREEN,
                    borderColor: config.COLOR_GREEN
                } :
                {color: "#9704C4", borderColor: "#9704C4"}} type="text"
                   value={searchText} onChange={onChange} onKeyUp={onKeyUp} className="form-control"
                   aria-label="Text input with dropdown button"/>
        </div>
    )
}
