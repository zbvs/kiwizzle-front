import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {initFunctions} from "./store/init-reducer";
import store from './store'
import {HelmetProvider} from "react-helmet-async";

initFunctions.forEach(f => store.dispatch(f()));

ReactDOM.render(
    // <React.StrictMode>
    <Provider store={store}>
        <HelmetProvider>
            <App/>
        </HelmetProvider>
    </Provider>,
    // </React.StrictMode>,
    document.getElementById('root')
);


reportWebVitals();
