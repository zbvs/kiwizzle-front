import RowGrid from "../layout/RowGrid";
import React from "react";
import {shallowEqual, useSelector} from "react-redux";
import {Grid, useMediaQuery} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import SubscriptionList from "./SubscriptionList";

export const SUBSCRIPTION_PATH = "/subscribe"
export const SUBSCRIPTION_API_PATH = "/subscription"

export default function Subscribe() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const {finished} = useSelector((state) => ({
        finished: state.init.finish,
    }), shallowEqual);

    return (
        <>
            {finished ?
                <RowGrid>
                    <Grid item xl={6} md={8} xs={12}>
                        <Grid container direction={"row"} justify={"center"}>
                            <Grid container direction={"column"}>
                                <SubscriptionList isMobile={isMobile} item/>
                            </Grid>
                        </Grid>
                    </Grid>
                </RowGrid>
                : null}
        </>
    )
}

