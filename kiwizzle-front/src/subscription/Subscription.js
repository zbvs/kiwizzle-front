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
    const {spanName, subscribtionData, keyname} = props;

    const JobDataKey = keyname;
    const JobDataNameKey = keyname + "Code"
    let items = [];

    for (const id of subscribtionData[keyname]) {
        items.push(<span disabled key={items.length}
                         className={Style.spanTagItem}>{JobData[JobDataKey][id][JobDataNameKey]}</span>)
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
    const {subscribtionData} = props;

    const experienceAbove = subscribtionData.experienceAbove;
    const experienceBelow = subscribtionData.experienceBelow;

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
    const {isAddComponent, subscribtionData, style, buttonText, onButtonClick} = props;
    const classes = useStyles();

    const langOptionText = subscribtionData.requireOnly === true ?
        subscribe_text.LANGUAGE_REQUIRE_ONLY : subscribe_text.LANGUAGE_TOTAL;

    const buttonClick = () => {
        onButtonClick(subscribtionData);
    }

    const checkBoxChange = (event) => {
        props.onCheckBoxChange(subscribtionData, event.target.checked);
    }

    return (
        <>

            <div style={style} className={classes.divSubscription}>

                <ArrayItemsComponent spanName={"Company"} subscribtionData={subscribtionData} keyname={"company"}/>
                <ArrayItemsComponent spanName={"Position"} subscribtionData={subscribtionData} keyname={"position"}/>
                <ArrayItemsComponent spanName={`Language ${langOptionText}`} subscribtionData={subscribtionData}
                                     keyname={"language"}/>
                <ExperiencePairComponent subscribtionData={subscribtionData}/>

                <div className={classes.divSubscriptionButtonBox}>
                    {isAddComponent ?
                        null
                        :
                        <div className="form-check" style={{marginRight: "10px"}}>

                            <input onChange={checkBoxChange} className="form-check-input" type="checkbox" value=""
                                   id="flexCheckChecked" checked={subscribtionData.enabled}/>
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


