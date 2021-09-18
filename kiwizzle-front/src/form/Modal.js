import {makeStyles} from "@material-ui/core/styles";
import {config} from "../Config";
import {authFontSize} from "../auth/Auth";

export const modalUseStyles = makeStyles((theme) => ({
    divPasswordBox: {},
    buttonStart: {
        fontSize: authFontSize.fontSize,
        width: "100%",
        height: "40px",
        borderRadius: "10px",
        backgroundColor: config.COLOR_BLUE,
        color: config.COLOR_WHITE,
        border: "1px solid " + config.COLOR_LIGHT_BLUE,

    },
    divLogin: {
        display: "flex",
        width: "100%",
        height: "40px",
        borderRadius: "10px",
        backgroundColor: config.COLOR_WHITE,
        border: "1px solid " + config.COLOR_GRAY,
        marginBottom: "10px"
    },
    linkLogin: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        display: "flex",
        padding: "5px",
        fontSize: authFontSize.fontSize,
        color: config.COLOR_GRAY,
        "&:hover": {
            color: config.COLOR_GRAY,
            textDecoration: 'none'
        }
    },
}));

export const defaultModalStyle = {
    zIndex: "9999",
}
