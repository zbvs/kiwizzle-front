import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import JobData, {LanguageOptions, SelectedLanguageSet} from "../job/JobData";
import {logger} from "../Util";
import {useDispatch} from "react-redux";
import {config} from "../Config";
import {globalQueryState} from "../query/Query"
import {doQuery} from "../store/job-reducer";

const useStyles = makeStyles((theme) => ({
    spanSelected: {
        textDecoration: "none",
        cursor: "pointer",
        padding: "0px 15px 0px 0",
        display: "inline",
        fontSize: "medium",
        color: "rgba(51, 155, 240, 1)",
        "&:hover": {
            textDecoration: "underline"
        }
    },

    spanUnselected: {
        textDecoration: "none",
        cursor: "pointer",
        padding: "0px 15px 0px 0",
        display: "inline",
        fontSize: "medium",
        "&:hover": {
            textDecoration: "underline"
        }
    },
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
}));


const languageSearchType = {};
languageSearchType[config.SEARCH_LANGUAGE_TOTAL] = {title: "필수+우대", langSearchType: config.SEARCH_LANGUAGE_TOTAL};

languageSearchType[config.SEARCH_LANGUAGE_REQUIRE_ONLY] = {
    title: "필수",
    langSearchType: config.SEARCH_LANGUAGE_REQUIRE_ONLY
};

function LanguageAutocomplete(props) {
    const classes = useStyles();

    const setLanguage = props.setLanguage;
    const dispatch = useDispatch();
    const [value, setValue] = useState({publicNameEng: ""});
    const [langSearchSelected, setLangSearchSelected] = useState(globalQueryState.languageSearchType);

    const handleSearchClick = (e) => {
        const clickedKey = e.currentTarget.getAttribute('idkey');
        if (langSearchSelected !== clickedKey) {
            setLangSearchSelected(clickedKey);
            globalQueryState.languageSearchType = languageSearchType[clickedKey].langSearchType;
            if (SelectedLanguageSet.size > 0) {
                dispatch(doQuery());
            }
        }
    }

    const spans = [];
    Object.keys(languageSearchType).forEach(key => {
        if (langSearchSelected === key)
            spans.push(<span key={key} idkey={key} onClick={handleSearchClick}
                             className={classes.spanSelected}>{languageSearchType[key].title}</span>);
        else
            spans.push(<span key={key} idkey={key} onClick={handleSearchClick}
                             className={classes.spanUnselected}>{languageSearchType[key].title}</span>);
    })

    return (
        <Autocomplete
            value={value}
            options={LanguageOptions}
            selectOnFocus={true}
            getOptionLabel={(language) => language.publicNameEng}
            style={{width: 300}}
            // getOptionSelected is for checking if it really match with value
            // Use it to remove warn logs caused by setValue({publicNameEng:""});
            getOptionSelected={() => true}
            onChange={(event, language) => {
                if (language && language.languageId !== config.LANG_ID_ROOT && language.publicNameEng !== "" && !SelectedLanguageSet.has(language.languageId)) {
                    SelectedLanguageSet.add(language.languageId);
                    const selectedLanguage = [...SelectedLanguageSet];
                    setLanguage(selectedLanguage);
                    setValue({publicNameEng: ""});
                    dispatch(doQuery());
                }
            }}

            renderInput={
                (params) => {
                    return (
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}>
                            {spans}

                            <TextField style={{display: "block"}} {...params} label="Type..." variant="outlined"/>
                        </div>
                    )
                }
            }
        />
    );
}


export default function LanguageFilter() {

    const classes = useStyles();
    const [langSelected, setLanguage] = useState([...SelectedLanguageSet]);
    const dispatch = useDispatch();
    logger.trace("#### LanguageFilter rendnered ");

    //Note: <Chip> onDelete need function that returns a handling function,
    // So handleDelete should be
    // const handleDelete = (idToRemove) => () => { }
    const handleDelete = (idToRemove) => () => {
        SelectedLanguageSet.delete(idToRemove);
        const selectedLanguage = [...SelectedLanguageSet];
        setLanguage(selectedLanguage);
        dispatch(doQuery());
    };


    return (
        <>
            <div style={{padding: "10px"}}>

                <LanguageAutocomplete setLanguage={setLanguage}/>
            </div>
            <ul className={classes.root}>
                {langSelected.map((langId) => {
                    let language = JobData.language[langId];
                    return (
                        <li key={langId}>
                            <Chip
                                className={classes.chip}
                                label={language.publicNameEng}
                                onDelete={handleDelete(langId)}
                            />
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
