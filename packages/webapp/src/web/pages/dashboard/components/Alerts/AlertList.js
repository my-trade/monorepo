import { getToken } from '../../../../shared/auth/token';
import Alert from './Alert';
import AlertBuilder from './AlertBuilder';
import ClayButton from '@clayui/button';
import Client from '@my-trade/client';
import DashboardContext, { UPDATE_ALERTS } from '../../DashboardContext';
import React, { useEffect, useContext, useState } from 'react';

const client = new Client();

export default () => {
    const [{ alerts }, dispatch] = useContext(DashboardContext);
    const [visible, setVisible] = useState(false);

    const fetchAlerts = async () => {
        const token = getToken();
        const alerts = await client.listAlerts(token);

        dispatch({ type: UPDATE_ALERTS, payload: { alerts } });
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const onClose = () => setVisible(false);

   const onRemove = async (alertId) => {
        const token = getToken();

        await client.removeAlert(token, alertId);

        await fetchAlerts();
    }

    const onSave = async () => {
        await fetchAlerts();
    }

    return (
        <div className="alert-list mt-3">
            <h4>Alertas</h4>

            {visible && (
                <AlertBuilder onClose={onClose} onSave={onSave} />
            )}

            <ClayButton displayType="primary" onClick={() => setVisible(true)}>
                {"Adicionar Alerta"}
            </ClayButton>

            <div className="mt-3">
                {alerts.map((alert, index) => (
                    <Alert key={`alert_${index}`} alert={alert} onRemove={onRemove} />
                ))}
            </div>
        </div>
    );
}