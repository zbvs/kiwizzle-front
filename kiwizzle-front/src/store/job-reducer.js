import {
    CHANGE_CATEGORY,
    CHANGE_CHART,
    CHANGE_COUNTRY,
    CHANGE_TOP_MENU,
    DO_QUERY,
    FINISH_SEARCH,
    FINISH_STATISTICS,
} from "./action_types";
import {deleteUrlParamaters} from "../Util";

export const job_state = {
    chartKey: "1",

    doQuery: 0,
    finishSearch: 0,

    finishStatistics: 0
}


export const changeTopMenu = (topMenu) => {
    return {type: CHANGE_TOP_MENU, topMenu: topMenu};
}
export const changeCategory = (category) => {
    return {type: CHANGE_CATEGORY, category: category};
}

export const changeCountry = (country) => {
    return {type: CHANGE_COUNTRY, country: country};
}

export const changeChart = (chartKey) => {
    job_state.chartKey = chartKey;
    return {type: CHANGE_CHART, chartKey: chartKey};
}


export const doQuery = () => {
    //When do query, reset our page number
    //Only page number
    let url = deleteUrlParamaters("page", window.location.search);
    url = window.location.pathname + (url.length === 0 ? "" : "?" + url.toString());
    window.history.pushState({}, "", url);
    return {type: DO_QUERY, doQuery: ++job_state.doQuery};
}

export const finishSearch = () => ({type: FINISH_SEARCH, finishSearch: ++job_state.finishSearch});
export const finishStatistics = () => ({type: FINISH_STATISTICS, finishStatistics: ++job_state.finishStatistics});

export default function jobReducer(state = job_state, action) {

    switch (action.type) {
        case CHANGE_TOP_MENU: {
            return {...state, topMenu: action.topMenu, type: action.type}
        }
        case CHANGE_CATEGORY: {
            return {...state, category: action.category, type: action.type}
        }
        case CHANGE_COUNTRY: {
            return {...state, country: action.country, type: action.type}
        }
        case CHANGE_CHART: {
            return {...state, chartKey: action.chartKey, type: action.type}
        }

        case DO_QUERY: {
            return {...state, doQuery: action.doQuery, type: action.type}
        }
        case FINISH_SEARCH: {
            return {...state, finishSearch: action.finishSearch, type: action.type}
        }

        case FINISH_STATISTICS: {
            return {...state, finishStatistics: action.finishStatistics, type: action.type}
        }
        default:
            return state;
    }
}
