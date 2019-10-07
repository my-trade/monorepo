import { ClayDropDownWithItems } from '@clayui/drop-down';
import { getToken } from '../../../../shared/auth/token';
import Alert from './Alert';
import ClayButton from '@clayui/button';
import ClayModal, { useModal } from '@clayui/modal';
import Client from '@my-trade/client';
import CurrencyInput from 'react-currency-input';
import DashboardContext, { UPDATE_ALERTS } from '../../DashboardContext';
import React, { useEffect, useContext, useState } from 'react';
import SymbolSelector from '../SymbolSelector/SymbolSelector';
import { getFieldLabel, getComparatorLabel } from './utils';

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

    const [comparator, setComparator] = useState('equals');
    const [field, setField] = useState('price');
    const [symbol, setSymbol] = useState('');
    const [value, setValue] = useState(0);

    const reset = () => {
        setComparator('equals');
        setField('price');
        setSymbol('');
        setValue(0);
    }; 

    const { observer, onClose } = useModal({
        onClose: () => {
            reset();
            setVisible(false);
        }
    });

    const onSave = async () => {
        const token = getToken();

        await client.saveAlert(token, {
            comparator,
            field,
            symbol,
            value
        });

        await fetchAlerts();

        onClose();
    }

   const onRemove = async (alertId) => {
        const token = getToken();

        await client.removeAlert(token, alertId);

        await fetchAlerts();
    }

    return (
        <div className="alert-list mt-3">
            <h4>Alertas</h4>

            {visible && (
                <ClayModal
                    observer={observer}
                    size="md"
                    status="info"
                >
                    <ClayModal.Header>{"Adicionar Alerta"}</ClayModal.Header>
                    <ClayModal.Body>
                        <div className="form-group">
                            <label>Ativo</label>

                            <SymbolSelector
                                onSelectSymbol={setSymbol}
                                symbol={symbol}
                            />
                        </div>
                        <div className="form-group">
                            <label>Alertar quando</label>

                            <div className="row">
                                <div className="col-md-4">
                                    <ClayDropDownWithItems
                                        trigger={
                                            <ClayButton displayType="secondary">
                                                {getFieldLabel(field)}
                                            </ClayButton>
                                        }
                                        items={[
                                            {
                                                onClick: () => setField('price'),
                                                label: getFieldLabel('price')
                                            },
                                            {
                                                onClick: () => setField('volume'),
                                                label: getFieldLabel('volume')
                                            }
                                        ]}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <ClayDropDownWithItems
                                        trigger={
                                            <ClayButton displayType="secondary">
                                                {getComparatorLabel(comparator)}
                                            </ClayButton>
                                        }
                                        items={[
                                            {
                                                onClick: () => setComparator('equals'),
                                                label: getComparatorLabel('equals')
                                            },
                                            {
                                                onClick: () => setComparator('above'),
                                                label: getComparatorLabel('above')
                                            },
                                            {
                                                onClick: () => setComparator('under'),
                                                label: getComparatorLabel('under')
                                            }
                                        ]}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <CurrencyInput
                                        className="form-control"
                                        onChange={() => {  }}
                                        onChangeEvent={(event, maskedValue, floatValue) => {
                                            setValue(floatValue);
                                        }}
                                        prefix="R$"
                                        value={value}
                                    />
                                </div>
                            </div>
                        </div>
                    </ClayModal.Body>
                    <ClayModal.Footer
                        first={<ClayButton displayType="secondary" onClick={onClose}>{"Cancelar"}</ClayButton>}
                        last={<ClayButton disabled={symbol === ''} onClick={onSave}>{"Salvar"}</ClayButton>}
                    />
                </ClayModal>
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