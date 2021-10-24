import Style from "../Style.module.css";
import React from "react";
import JobData from "../job/JobData";
import {config} from "../Config";
import {subscribe_text} from "./Text";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    divSubscription: {
        padding: "10px 0px 0px 10px",
        display: "flex",
        flexDirection: "column"
    },
    divSubscriptionButtonBox: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
    },

    buttonSubscription: {
        width: "fit-content",
        height: "fit-content",
        borderRadius: "5px",
        backgroundColor: config.COLOR_WHITE,
        color: config.COLOR_LIGHT_BLUE,
        border: "1px solid " + config.COLOR_LIGHT_BLUE,

    },
}));

const ArrayItemsComponent = (props) => {
    const {spanName, subscriptionSetting, keyname} = props;

    const JobDataKey = keyname;
    let items = [];

    for (const id of subscriptionSetting[keyname]) {
        items.push(<span disabled key={items.length}
                         className={Style.spanTagItem}>{JobData[JobDataKey][id]["publicNameEng"]}</span>)
    }

    return (
        <div>
            <span className={Style.spanTagColumn}>
                {`${spanName}: `}
            </span>
            {items}
        </div>
    )
}


const ExperiencePairComponent = (props) => {
    const {subscriptionSetting} = props;

    const experienceAbove = subscriptionSetting.experienceAbove;
    const experienceBelow = subscriptionSetting.experienceBelow;

    if (!experienceAbove && !experienceBelow) {
        return (
            <span className={Style.spanTagColumn}>{"Experience: "}</span>
        )
    } else {

        const above = experienceAbove.length > 0 ?
            <span disabled className={Style.spanTagItem}>{experienceAbove + subscribe_text.YEAR_ABOVE}</span>
            : null;

        const below = experienceBelow.length > 0 ?
            <span disabled className={Style.spanTagItem}>{experienceBelow + subscribe_text.YEAR_BELOW}</span>
            : null;

        return (
            <div>
                <span className={Style.spanTagColumn}>{"Experience: "}</span>
                {above}
                {below}
            </div>
        )
    }
}


export default function Subscription(props) {
    const {isAddComponent, subscription, style, buttonText, onButtonClick} = props;
    const classes = useStyles();
    const subscriptionSetting = subscription.subscriptionSetting;
    const langOptionText = subscriptionSetting.requireOnly === true ?
        subscribe_text.LANGUAGE_REQUIRE_ONLY : subscribe_text.LANGUAGE_TOTAL;

    const buttonClick = () => {
        onButtonClick(subscription);
    }

    const checkBoxChange = (event) => {
        props.onCheckBoxChange(subscription, event.target.checked);
    }

    return (
        <>

            <div style={style} className={classes.divSubscription}>

                <ArrayItemsComponent spanName={"Company"} subscriptionSetting={subscriptionSetting}
                                     keyname={"company"}/>
                <ArrayItemsComponent spanName={"Position"} subscriptionSetting={subscriptionSetting}
                                     keyname={"position"}/>
                <ArrayItemsComponent spanName={`Language ${langOptionText}`} subscriptionSetting={subscriptionSetting}
                                     keyname={"language"}/>
                <ExperiencePairComponent subscriptionSetting={subscriptionSetting}/>

                <div className={classes.divSubscriptionButtonBox}>
                    {isAddComponent ?
                        null
                        :
                        <div className="form-check" style={{marginRight: "10px"}}>

                            <input onChange={checkBoxChange} className="form-check-input" type="checkbox" value=""
                                   id="flexCheckChecked" checked={subscriptionSetting.enabled}/>
                            <label className="form-check-label" htmlFor="flexCheckChecked">
                                Enable
                            </label>
                        </div>
                    }


                    <button className={classes.buttonSubscription} onClick={buttonClick}>
                        {buttonText}
                    </button>
                </div>

                <hr style={{
                    margin: "0px 0px 0px 0",
                    width: "100%"
                }}/>
            </div>
        </>

    )
}


