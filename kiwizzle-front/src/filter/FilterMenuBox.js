import {Grid} from "@material-ui/core";
import * as React from "react";
import {useEffect, useState} from "react";
import CompanyMenu from "./CompanyMenu/CompanyMenu";

import PositionFilter from "./PositionFilter";
import LanguageFilter from "./LanguageFilter";
import ExperienceFilter from "./ExperienceFilter";


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'font-awesome/css/font-awesome.min.css';
import $ from 'jquery';
import "./FilterMenuBox.css"


import {logger} from "../Util"
import {
    isDefaultCompanySet,
    isDefaultExperienceValue,
    isDefaultLanguageSet,
    isDefaultPositionSet
} from "../job/JobData";

const allFilterMenuCompoentClass = "filter-menu-component";

const filterMenuButtonClass = "filter-menu-button";
const filterMenuButtonSelectedClass = "filter-menu-button-selected";
const filterMenuButtonChangedClass = "filter-menu-button-changed"
const filterMenuButtonMobileClass = "filter-menu-button-mobile";

const filterMenuContentCompoentClass = "filter-menu-content-component";
const filterMenuContentCloseClass = "filter-menu-content-close";
const muiautocompleleteClass = "MuiAutocomplete-popper";
const muiPopclass = "MuiList-root";


const toCheckClasses = [
    allFilterMenuCompoentClass, muiautocompleleteClass, muiPopclass
]


const isTargetInFilterMenuComponent = (event) => {
    if ($("." + allFilterMenuCompoentClass).is(event.target))
        return true;

    for (const name of toCheckClasses) {
        if ($(event.target).parents("." + name).length !== 0)
            return true;
    }
    return false;
}

const isTargetInCloseButton = (event) => {
    const closeBootstrapSelector = "." + filterMenuContentCloseClass;
    if ($(closeBootstrapSelector).is(event.target) || $(event.target).parents(closeBootstrapSelector).length !== 0)
        return true;
    return false;
}

const FilterButton = (props) => {
    const {title, size, onClick, index, selected, isMobile, isDefault} = props;
    var buttonClassName;
    if (isMobile)
        buttonClassName = selected ? `${filterMenuButtonMobileClass} ${filterMenuButtonSelectedClass}` :
            isDefault ? `${filterMenuButtonMobileClass}` : `${filterMenuButtonMobileClass} ${filterMenuButtonChangedClass}`;
    else
        buttonClassName = selected ? `${filterMenuButtonClass} ${filterMenuButtonSelectedClass}` :
            isDefault ? `${filterMenuButtonClass}` : `${filterMenuButtonClass} ${filterMenuButtonChangedClass}`;

    return (
        <Grid item xs={size}>
            <div style={{margin: "5px", position: "relative"}} className={`${allFilterMenuCompoentClass}`}>
                <button index={index} style={{width: "100%", height: isMobile ? "30px" : "40px", padding: "5px"}}
                        onClick={onClick} className={buttonClassName}>
                    {title + " "}
                    <i className="fa fa-angle-down"></i>
                </button>
                {props.children}
            </div>
        </Grid>
    );
};


const BootstrapMenuContent = (props) => {
    return (
        <div style={{
            width: "500px",
            border: "1px solid #3B82F6",
            maxHeight: "60vh",
            right: props.reverse ? "0px" : null,
            position: "absolute",
            zIndex: "10"
        }} className={`${filterMenuContentCompoentClass} ${allFilterMenuCompoentClass}`}>
            <div style={{
                overflow: "auto",
                width: "100%",
                padding: "5px",
                maxHeight: "55vh",
                backgroundColor: "white",
                position: "relative"
            }}>
                {props.children}
            </div>
        </div>
    )
}

const MobileBootstrapMenuContent = (props) => {
    return (
        <div style={{width: "100%", bottom: "0", left: "0", maxHeight: "60vh", position: "fixed", zIndex: "10"}}
             className={`${filterMenuContentCompoentClass} ${allFilterMenuCompoentClass}`}>
            <div style={{
                display: "flex",
                maxHeight: "50px",
                height: "4.5vh",
                minHeight: "30px",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#3B82F6"
            }} className={filterMenuContentCloseClass}>
                <i className="fa fa-angle-down fa-lg fa-angle-down-close"></i>
            </div>
            <div style={{
                overflow: "auto",
                padding: "5px",
                maxHeight: "55vh",
                backgroundColor: "white",
                position: "relative"
            }}>
                {props.children}
            </div>
        </div>
    )
}


const CompanyMenuCreator = (isMobile, reverse) => {
    return (
        isMobile ?
            <MobileBootstrapMenuContent>
                <CompanyMenu/>
            </MobileBootstrapMenuContent>
            :
            <BootstrapMenuContent reverse={reverse}>
                <CompanyMenu/>
            </BootstrapMenuContent>)
}


const PositionFilterCreator = (isMobile, reverse) => {
    return (
        isMobile ?
            <MobileBootstrapMenuContent>
                <PositionFilter/>
            </MobileBootstrapMenuContent>
            :
            <BootstrapMenuContent reverse={reverse}>
                <PositionFilter/>
            </BootstrapMenuContent>)
}
const LanguageFilterCreator = (isMobile, reverse) => {
    return (
        isMobile ?
            <MobileBootstrapMenuContent>
                <LanguageFilter/>
            </MobileBootstrapMenuContent>
            :
            <BootstrapMenuContent reverse={reverse}>
                <LanguageFilter/>
            </BootstrapMenuContent>)
}
const ExperienceFilterCreator = (isMobile, reverse) => {

    return (
        isMobile ?
            <MobileBootstrapMenuContent>
                <ExperienceFilter/>
            </MobileBootstrapMenuContent>
            :
            <BootstrapMenuContent reverse={reverse}>
                <ExperienceFilter/>
            </BootstrapMenuContent>)
}


const createMenuItem = (title, creator, isDefault) => {
    return {title, creator, isDefault};
}
const filterMenuList = [
    createMenuItem("기업", CompanyMenuCreator, isDefaultCompanySet),
    createMenuItem("직무", PositionFilterCreator, isDefaultPositionSet),
    createMenuItem("기술", LanguageFilterCreator, isDefaultLanguageSet),
    createMenuItem("경력", ExperienceFilterCreator, isDefaultExperienceValue)
];


const MENU_INDEX_UNSELECT = -1;


const FilterMenuBox = (props) => {

    const {isMobile, useIndex, itemSize} = props;

    const menuList = useIndex !== undefined ? filterMenuList.slice(0, useIndex) : filterMenuList;
    const buttonSize = itemSize !== undefined ? itemSize : 3;

    const [menuIndex, setMenuIndex] = useState(MENU_INDEX_UNSELECT);

    useEffect(() => {
        $(document).mousedown(function (e) {
            if (!isTargetInFilterMenuComponent(e) || isTargetInCloseButton(e)) {
                setMenuIndex(MENU_INDEX_UNSELECT);
            }
        });
        return () => {
            $(document).off("mousedown");
        }
    })

    logger.trace("FilterMenuBox rendered");
    const onClickHandler = (e) => {
        const selected = e.currentTarget.getAttribute("index");
        if (selected === menuIndex) {
            setMenuIndex(MENU_INDEX_UNSELECT);
        } else
            setMenuIndex(selected);
    }

    const dropdownList = [];
    for (const index in menuList) {
        dropdownList.push(
            <FilterButton index={index} key={index} title={menuList[index].title} size={buttonSize}
                          onClick={onClickHandler}
                          selected={index === menuIndex} isMobile={isMobile} isDefault={menuList[index].isDefault()}>
                {index === menuIndex ? menuList[index].creator(isMobile, parseInt(index) === (menuList.length - 1)) : null}
            </FilterButton>
        );
    }

    return (
        <Grid container direction={"row"}>
            {dropdownList}
        </Grid>
    );
};

export default FilterMenuBox;

