import {existingIdCntMap, getCompanyImgTag, JobData, searchedIdCntMap} from "../../job/JobData";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {config} from "../../Config";
import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {makeStyles} from "@material-ui/core/styles";
import {logger} from "../../Util";
import Style from "../../Style.module.css"

const useViewStyles = makeStyles({
    root: {
        height: "100%",
        maxWidth: "100%",

    },
});

const useItemStyles = makeStyles(theme => ({
    root: {
        "& > .MuiTreeItem-content > .MuiTreeItem-label": {
            display: "flex",
            alignItems: "center",
            padding: "0px 0",
            background: "transparent !important",
            pointerEvents: "none",
            maxWidth: "100%",
        },

        "& > .MuiTreeItem-content > .MuiTreeItem-iconContainer > .MuiSvgIcon-root": {
            width: "30px",
            height: "30px",

        }
    },
    label: {
        padding: 0
    },

}));

//** Company Local Variables
//Company Expand. will share just one ExpandSet in the whole category. TreeView will ignore expand ids that not exist in TreeItem ids.
const expandArray = [];
const initExpandSet = (expandArray) => {
    let rootCompany = JobData.company[config.CP_ID_ROOT];
    expandArray.push(rootCompany.companyId);
}

let inited = false;
export default function DefaultFilter(props) {
    const classesView = useViewStyles();
    const classesItem = useItemStyles();

    const SelectedSet = props.SelectedSet;
    const categoryId = props.categoryId;
    const countryId = props.countryId;
    const changeHandler = props.changeHandler;

    const [, setExpanded] = React.useState([...expandArray]);
    logger.trace("#### Company-DefaultFilter rendered");

    if (!inited) {
        inited = true
        initExpandSet(expandArray);
    }

    const handleExpand = (event, nodeIds) => {
        if (event.target.nodeName !== "svg") {
            return;
        }
        expandArray.length = 0;
        Object.assign(expandArray, nodeIds);
        setExpanded(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        if (event.target.nodeName === "svg") {
            return;
        }
        const company = JobData.company[nodeIds[0]];
        changeHandler(company);
    };

    var pcArray = [];


    const renderTree = (companies) => {
        const companyTree = [];
        for (let company of companies) {
            if (company.companyId === config.CP_ID_ROOT ||
                (company.countryId === countryId && (company.category.includes(categoryId) || categoryId === config.CT_ID_ALL))) {

                //https://codesandbox.io/s/typescript-data-driven-treeview-dhkx2?file=/src/App.tsx
                companyTree.push(
                    <TreeItem classes={classesItem} nodeId={company.companyId} key={company.companyId} label={
                        <FormControlLabel
                            control={
                                <>
                                    <Checkbox style={{color: "#3f51b5"}}
                                              checked={SelectedSet.has(company.companyId)}
                                        // onClick={e => e.stopPropagation()}
                                              name={company.companyId}
                                              key={company.companyId}
                                    />
                                    {company.companyId === config.CP_ID_ROOT || company.type === config.CP_TYPE_VIRTUAL ? null :
                                        getCompanyImgTag(company)
                                    }
                                    <span>&nbsp;</span>
                                </>
                            }
                            label={
                                <span className={Style.spanFilterItem}>
                                    {company.publicNameKor + " : " + searchedIdCntMap.get(company.companyId) + "/" + existingIdCntMap.get(company.companyId)}
                                    </span>
                            }
                        />
                    }>
                        {company.childs.length > 0 ? renderTree(company.childs) : null}

                    </TreeItem>
                )
            }
        }
        return companyTree;
    }
    pcArray = renderTree([JobData.companyRoot]);

    return (
        <div>
            <TreeView
                classes={classesView}
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpandIcon={<ChevronRightIcon/>}
                expanded={[...expandArray]}
                selected={[...SelectedSet]}
                onNodeToggle={handleExpand}
                onNodeSelect={handleSelect}
                multiSelect
            >
                {pcArray}
            </TreeView>
        </div>
    );
}

