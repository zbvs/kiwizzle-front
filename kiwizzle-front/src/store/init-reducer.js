import * as ACTION_TYPES from './action_types'
import {logger} from '../Util'
import {CallbackAfterExtraction, JobInitDataExtractors} from '../job/JobData';
import {LoginInitDataExtractors} from "../auth/Auth";
import {requestGet} from "../api/api";


const allInitExtractors = Object.assign({}, JobInitDataExtractors, LoginInitDataExtractors);

let completed = 0;
const numInitExtractors = Object.keys(allInitExtractors).length;
const functions = [];


Object.keys(allInitExtractors).forEach(path => {
    functions.push(
        () => async (dispatch, getState) => {
            await requestGet(path)
                .then(result => {
                    allInitExtractors[path](result);

                    if (++completed === numInitExtractors) {
                        dispatch({
                            type: ACTION_TYPES.SUCCESS,
                        });
                    }
                }).catch(error => {
                    logger.error("error occured:\n", error);
                    dispatch({
                        type: ACTION_TYPES.ERROR
                    })
                });

        }
    )
})


const initialState = {
    finish: false
}
export const initFunctions = functions;


export default function initReducer(state = initialState, action) {
    logger.debug("init_reducer  state:", JSON.stringify(state), "  ,action:", JSON.stringify(action));
    switch (action.type) {
        case ACTION_TYPES.SUCCESS: {
            CallbackAfterExtraction();
            return {finish: true};
        }
        case ACTION_TYPES.ERROR:
            return state;
        default:
            return state;
    }
}










