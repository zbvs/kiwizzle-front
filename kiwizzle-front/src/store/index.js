import {applyMiddleware, createStore} from "redux";
import rootReducer from "./rootRecucer";
import {composeWithDevTools} from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";
import logger from "redux-logger";
import {CHANGE_TOP_MENU} from "./action_types";
import {getDefaultCategoryId} from "../job/JobData";
import {changeCategory} from "./job-reducer";


const middleWares = process.env.NODE_ENV === 'production' ? [ReduxThunk] : [ReduxThunk, logger];

export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleWares))
);


store.subscribe(() => {
    switch (store.getState().job.type) {
        case CHANGE_TOP_MENU: {
            store.dispatch(changeCategory(getDefaultCategoryId()));
            break;
        }
        default:
            break;
    }
})


export default store;

