import {combineReducers} from 'redux';
import initReducer from './init-reducer';
import jobReducer from './job-reducer';
import authReducer from './auth-reducer';

const rootReducer = combineReducers({init: initReducer, job: jobReducer, auth: authReducer});

export default rootReducer;
