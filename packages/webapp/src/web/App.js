import "@clayui/css/lib/css/atlas.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ClayIconSpriteContext } from '@clayui/icon';
import { ClayTooltipProvider } from '@clayui/tooltip';
import AppContextProvider from "./AppContextProvider";
import DashboardApp from './pages/dashboard/DashboardApp';
import HomeApp from './pages/home/HomeApp';
import React from 'react';

const spritemap = require('@clayui/css/lib/images/icons/icons.svg');

export default () => {
    return (
        <ClayIconSpriteContext.Provider value={`/js/${spritemap}`}>
            <ClayTooltipProvider>
                <AppContextProvider>
                    <Router>
                        <Route path="/" exact component={HomeApp} />
                        <Route path="/dashboard/" component={DashboardApp} />
                    </Router>
                </AppContextProvider>
            </ClayTooltipProvider>
        </ClayIconSpriteContext.Provider>
    );
};