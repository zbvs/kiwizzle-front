import {Grid} from '@material-ui/core';
import React from 'react';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    typoHead: {
        fontFamily: 'Helvetica',
        fontSize: 30,
        fontWeight: 'bold',
    },
    typoContent: {
        color: "#14ad3b",
        fontFamily: 'Helvetica',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    }
}));

const title = "Kiwizzle";
const content1 = "Kiwizzle";
const content2 = "가장 정확하고 유익한 채용정보 :)";

const Header = () => {
    const classes = useStyles();

    return (
        <>
            <Grid item>
                <p className={classes.typoHead}>
                    {title}
                </p>
                <p className={classes.typoContent}>
                    {content1}
                    <br/>
                    {content2}
                </p>
            </Grid>

        </>
    )
}

export default Header;
