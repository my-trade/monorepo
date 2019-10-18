import { getToken } from '../../../../shared/auth/token';
import Alert from './Alert';
import AlertBuilder from './AlertBuilder';
import ClayButton from '@clayui/button';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import Client from '@my-trade/client';
import DashboardContext, { UPDATE_ALERTS } from '../../DashboardContext';
import React, { useEffect, useContext, useState } from 'react';

const client = new Client();

export default () => {
    const [{ alerts }, dispatch] = useContext(DashboardContext);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const fetchAlerts = async () => {
        const token = getToken();

        setLoading(true);

        const alerts = await client.listAlerts(token);

        setLoading(false);
        dispatch({ type: UPDATE_ALERTS, payload: { alerts } });
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const onClose = () => {
        setSelectedAlert(null);
        setVisible(false);
    };

    const [selectedAlert, setSelectedAlert] = useState(null);

    const onEdit = (alert) => {
        setSelectedAlert(alert);
        setVisible(true);
    };

    const onRemove = async (alertId) => {
        const token = getToken();

        await client.removeAlert(token, alertId);

        await fetchAlerts();
    };

    const onSave = async () => {
        await fetchAlerts();
    };

    return (
        <div className="alert-list mt-3">
            <h4>Alertas</h4>

            {visible && (
                <AlertBuilder alert={selectedAlert} onClose={onClose} onSave={onSave} />
            )}

            <ClayButton displayType="primary" onClick={() => setVisible(true)}>
                {"Adicionar Alerta"}
            </ClayButton>

            <div className="mt-3">
                {loading ? (
                    <ClayLoadingIndicator />
                ): alerts.map((alert, index) => (
                    <Alert
                    alert={alert}
                    key={`alert_${index}`}
                    onEdit={onEdit}
                    onRemove={onRemove}
                />
                ))}
            </div>
        </div>
    );
}