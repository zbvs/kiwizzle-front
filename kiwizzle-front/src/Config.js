const SCHEMA = window.location.protocol + "//"
const DOMAIN = window.location.host;
const API_PATH = "/api/v1"


export const config = {
    HOST: SCHEMA + window.location.host,
    API_HOST: `${SCHEMA}${DOMAIN}${API_PATH}`,
    DEBUG: true,
    SEARCH_TEXT_TITLE: "SEARCH_TEXT_TITLE",
    SEARCH_TEXT_ALL: "SEARCH_TEXT_ALL",
    SEARCH_ORDER_COMPANY: "SEARCH_ORDER_COMPANY",
    SEARCH_ORDER_REGISTRATION_DATE_DESC: "SEARCH_ORDER_REGISTRATION_DATE_ASC",
    SEARCH_ORDER_REMAIN_TIME_ASC: "SEARCH_ORDER_REMAIN_TIME_ASC",
    SEARCH_LANGUAGE_REQUIRE_ONLY: "SEARCH_LANGUAGE_REQUIRE_ONLY",
    SEARCH_LANGUAGE_TOTAL: "SEARCH_LANGUAGE_TOTAL",

    CT_ID_ALL: "-10",
    CT_NAME_ALL: "전체",
    CT_PUBLIC_NAME_KOR: "전체",
    CT_PUBLIC_NAME_ENG: "Total",
    CP_ID_ROOT: "-20",
    CP_NAME_ROOT: "전체*",
    CP_TYPE_REAL: "real",
    CP_TYPE_VIRTUAL: "virtual",

    PS_ID_ROOT: "-30",
    PS_NAME_ROOT: "전체*",
    PS_NAME_ROOT_ENG: "Total*",
    PS_TYPE_REAL: "real",
    PS_TYPE_VIRTUAL: "virtual",

    LANG_ID_ETC: "-1",
    LANG_ID_ROOT: "-40",
    LANG_NAME_ROOT: "전체*",
    LANG_TYPE_REAL: "real",
    LANG_TYPE_VIRTUAL: "virtual",

    DOWN_PAGE_NUM_PRINT: 2,
    DOWN_MOBILE_PAGE_NUM_PRINT: 2,
    mid: 3,
    SEARCH_DEFAULT_PAGE_SIZE: 100,
    SEARCH_MOBILE_DEFAULT_PAGE_SIZE: 20,

    DTECTING_MOBILE_SCREEN_SIZE: 1000,

    NO_CHART_KEY: "-1",
    COLOR_BLACK: "#000000",
    COLOR_BLUE: "#4d4dff",
    COLOR_GREEN: "#14ad3b",
    COLOR_RED: "#ff2509",
    COLOR_LIGHT_GREEN: "#7ECE93",
    COLOR_WHITE: "#FFFFFF",
    COLOR_GRAY: "#808080",
    COLOR_LIGHT_BLUE: "#3B82F6",
    COLOR_PURPLE: "#9704C4",
}


const default_size = window.screen.width > config.DTECTING_MOBILE_SCREEN_SIZE ? config.SEARCH_DEFAULT_PAGE_SIZE : config.SEARCH_MOBILE_DEFAULT_PAGE_SIZE;
export const defaultQueryState = {
    searchText: "",
    searchOrder: config.SEARCH_ORDER_REGISTRATION_DATE_DESC,
    experienceBelow: "",
    experienceAbove: "",
    searchPage: 0,
    searchPageSize: default_size,
    stringSearchType: config.SEARCH_TEXT_TITLE,
    languageSearchType: config.SEARCH_LANGUAGE_TOTAL
};

