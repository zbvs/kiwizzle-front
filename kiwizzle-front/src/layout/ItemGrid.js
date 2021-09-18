import {Grid} from "@material-ui/core";
import * as React from "react";
import Style from '../Style.module.css';


export default function ItemGrid(props) {

    return (
        <Grid item {...props} style={{width: "100%"}} className={Style.ItemGrid}>
            <Grid container className={Style.divFilter} direction="column">
                {props.children}
            </Grid>
        </Grid>
    );
}
