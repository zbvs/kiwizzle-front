import {Grid} from "@material-ui/core";
import * as React from "react";


//Note:
// RowGrid's layout is
// 2 : 8 : 2
export default function RowGrid(props) {


    return (
        <Grid {...props} container direction="row">
            <Grid item xl={3} md={2}></Grid>
            {props.children}
            <Grid item xl={3} md={2}></Grid>
        </Grid>
    );
}
