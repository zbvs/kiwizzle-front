import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {List} from '@material-ui/core';
import {logger} from '../Util';
import {
    getRealCidAll,
    getRealCidSelected,
    getRealLidSelected,
    getRealPidAll,
    getRealPidSelected,
} from "../job/JobData";
import {globalQueryState} from "../query/Query";
import Subscription from "./Subscription";
import {config} from "../Config"
import {HTTP_CODE, requestDelete, requestGet, requestPost, requestPut} from "../api/api";
import {getUserId, USER_PATH} from "../auth/Auth";
import {SUBSCRIPTION_API_PATH} from "./Subscribe";
import {FORM_STATUS_MESSAGE} from "../form/Form";


const useStyles = makeStyles((theme) => ({
    buttonSubscription: {
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        backgroundColor: config.COLOR_WHITE,
        color: config.COLOR_LIGHT_BLUE,
        border: "1px solid " + config.COLOR_LIGHT_BLUE,
        padding: "5px !important"
    },
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));


export default function SubscriptionList(props) {
    const classes = useStyles();

    const [fetched, setFetched] = useState(false);
    const [fetchedSubscriptions, setFetchedSubscriptions] = useState([]);
    const [message, setMessage] = useState("");

    const languageOption = globalQueryState.languageSearchType;
    const requireOnly = languageOption === config.SEARCH_LANGUAGE_REQUIRE_ONLY;

    const toViewData = (data) => {
        data = JSON.parse(JSON.stringify(data))
        data.company = (data.company.length === getRealCidAll().length || data.company.length === 0)
            ? [config.CP_ID_ROOT] : data.company;
        data.position = (data.position.length === getRealPidAll().length || data.position.length === 0)
            ? [config.PS_ID_ROOT] : data.position;
        data.language = data.language.length === 0 ? [] : data.language;
        data.experienceAbove = typeof data.experienceAbove === "string" ? data.experienceAbove
            : data.experienceAbove ? data.experienceAbove.toString() : "";

        data.experienceBelow = typeof data.experienceBelow === "string" ? data.experienceBelow
            : data.experienceBelow ? data.experienceBelow.toString() : "";
        return data;
    }


    const subscribtionRealData = {
        company: getRealCidSelected(),
        position: getRealPidSelected(),
        language: getRealLidSelected(),
        requireOnly: requireOnly,
        experienceAbove: globalQueryState.experienceAbove,
        experienceBelow: globalQueryState.experienceBelow,
        enabled: false,
    };

    const subscribtionViewData = toViewData(subscribtionRealData);


    const fetchRerender = () => {
        requestGet(USER_PATH + `/${getUserId()}` + SUBSCRIPTION_API_PATH).then((result) => {
            setFetched(true);
            if (result.status !== HTTP_CODE.OK) {
                setMessage(FORM_STATUS_MESSAGE.SERVER_ERROR);
            } else {
                for (const index in result.data) {
                    result.data[index] = toViewData(result.data[index]);
                }
                setFetchedSubscriptions([...result.data]);
            }
        })
    }


    if (!fetched) {
        fetchRerender();
    }

    const deleteButtonHandler = (viewData) => {
        requestDelete(USER_PATH + `/${getUserId()}` + SUBSCRIPTION_API_PATH + `/${viewData.subscriptionId}`).then((result) => {
            if (result.status !== HTTP_CODE.OK) {
                setMessage(FORM_STATUS_MESSAGE.SERVER_ERROR);
            }
            fetchRerender();
        })
    }

    const addButtonHandler = () => {
        requestPost(USER_PATH + `/${getUserId()}` + SUBSCRIPTION_API_PATH, subscribtionRealData).then((result) => {
            if (result.status !== HTTP_CODE.OK) {
                setMessage(FORM_STATUS_MESSAGE.SERVER_ERROR);
            }
            fetchRerender();
        })
    }

    const checkBoxHandler = (viewData, enabled) => {
        viewData.enabled = enabled;
        requestPut(USER_PATH + `/${getUserId()}` + SUBSCRIPTION_API_PATH + `/${viewData.subscriptionId}`, viewData).then((result) => {
            if (result.status !== HTTP_CODE.OK) {
                setMessage(FORM_STATUS_MESSAGE.SERVER_ERROR);
            }
            fetchRerender();
        })
    }

    logger.trace("#### JobList listing Descs rendered");
    const itemList = [];

    for (const fetchedSubscription of fetchedSubscriptions) {
        itemList.push(<Subscription isAddComponent={false} key={itemList.length} subscribtionData={fetchedSubscription}
                                    buttonText={"Delete"}
                                    onCheckBoxChange={checkBoxHandler} onButtonClick={deleteButtonHandler}/>)
    }
    if (itemList.length < 5)
        itemList.push(<Subscription on isAddComponent={true} style={{border: `1px solid #3B82F6`}} key={itemList.length}
                                    subscribtionData={subscribtionViewData} buttonText={"Add"}
                                    onButtonClick={addButtonHandler}/>)


    return (
        <div className={classes.root}>
            <span style={{color: config.COLOR_RED}}>{message}</span>
            <List disablePadding={true} component="nav" aria-label="secondary mailbox folders">
                {itemList}
            </List>
        </div>
    );
}
