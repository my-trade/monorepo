import { Redirect, Route, withRouter } from 'react-router-dom'
import ClayTabs from '@clayui/tabs';
import React, { useContext } from 'react';
import UserAssetList from './components/UserAssetList/UserAssetList';
import UserStockDetails from './components/UserStockDetails/UserStockDetails';
import TradeSimulator from './components/TradeSimulator/TradeSimulator';
import AppContext from '../../AppContext';
import AlertList from './components/Alerts/AlertList';

export default withRouter(({ history, location: { pathname } }) => {
    const [{ cei: { hasCEI, loading } }] = useContext(AppContext);

    return (
        <>
            <ClayTabs justified={false} modern={true}>
                <ClayTabs.Item
                    active={pathname === '/dashboard/' || pathname === '/dashboard/minhas-acoes/'}
                    onClick={() => history.push('/dashboard/minhas-acoes/')}
                >
                    {'Ações'}
                </ClayTabs.Item>
                <ClayTabs.Item
                    active={pathname === '/dashboard/trade-simulado/'}
                    onClick={() => history.push('/dashboard/trade-simulado/')}
                >
                    {'Trades'}
                </ClayTabs.Item>
                <ClayTabs.Item
                    active={pathname === '/dashboard/alertas/'}
                    onClick={() => history.push('/dashboard/alertas/')}
                >
                    {'Alertas'}
                </ClayTabs.Item>
            </ClayTabs>
            <ClayTabs.Content fade={false}>
                <ClayTabs.TabPane>
                    <Route path="/dashboard/" exact component={UserAssetList} />
                    <Route path="/dashboard/alertas/" exact component={AlertList} />
                    <Route path="/dashboard/minhas-acoes/" exact component={UserAssetList} />
                    <Route path="/dashboard/minhas-acoes/:symbol" component={UserStockDetails} />
                    <Route path="/dashboard/trade-simulado/" component={TradeSimulator} />

                    {!hasCEI && (
                        loading ? (
                            <p>Estamos sincronizando com sua conta do CEI. Esta operação pode levar alguns minutos.</p>
                        ) : (
                                <>
                                    <Redirect to='/dashboard/configurar/' />
                                </>
                            )
                    )}
                </ClayTabs.TabPane>
            </ClayTabs.Content>
        </>
    );
});