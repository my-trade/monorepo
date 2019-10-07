import { Route } from 'react-router-dom'
import Configurations from '../configurations/Configurations';
import DashboardContent from './DashboardContent';
import DashboardContext, { reducer, initialState, UPDATE_SYMBOLS } from './DashboardContext';
import NavigationBar from './components/NavigationBar';
import React, { useReducer, useEffect } from 'react';
import Client from '@my-trade/client';

const client = new Client();

export default () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchSymbols = async () => {
        const symbols = await client.listSymbols();

        dispatch({type: UPDATE_SYMBOLS, payload: {symbols}});
    };

    useEffect(() => {
        fetchSymbols();
    }, []);

    return (
        <DashboardContext.Provider value={[state, dispatch]}>
           <NavigationBar />

            <div className="container">
                <div className="sheet">
                    <div className="sheet-section">
                        <Route path="/dashboard/" component={DashboardContent} />
                        <Route path="/dashboard/configurar/" component={Configurations} />
                    </div>
                </div>
            </div>
        </DashboardContext.Provider>
    );
}