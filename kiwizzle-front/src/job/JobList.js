import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {List, ListItem, ListItemText} from '@material-ui/core';
import {JobData} from "./JobData";
import {logger} from '../Util';
import {Link, useRouteMatch} from "react-router-dom";
import {shallowEqual, useSelector} from "react-redux";


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

const itemStyle = {
    paddingLeft: "0px",
    paddingRight: "0px",
    textDecoration: "none",
    color: "black"
}


function ListItemLink(props) {
    const {job, to} = props;

    const CustomLink = React.useMemo(
        () =>
            React.forwardRef((linkProps, ref) => (
                <Link style={{color: 'inherit', textDecoration: 'inherit'}} ref={ref} to={to} {...linkProps} />
            )),
        [to],
    );


    return (
        <>
            <div>
                <ListItem style={itemStyle} component={CustomLink}>
                    <ListItemText
                        primary={
                            job.detailComponent
                        }

                    />
                </ListItem>
                <hr style={{
                    width: "100%"
                }}/>
            </div>
        </>
    );
}


export default function JobList(props) {
    const classes = useStyles();
    const match = useRouteMatch();

    useSelector((state) => ({
        finishSearch: state.job.finishSearch,
    }), shallowEqual);

    logger.trace("#### JobList listing Descs rendered");
    const itemList = [];


    JobData.sortedJob.forEach(job => {
        itemList.push(<ListItemLink to={match.url + "/detail/" + job.descId} key={job.descId} job={job}/>);
    })

    return (
        <div className={classes.root}>
            <List disablePadding={true} component="nav" aria-label="secondary mailbox folders">
                {itemList}
            </List>
        </div>
    );
}
