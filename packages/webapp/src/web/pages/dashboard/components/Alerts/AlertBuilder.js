import { ClayDropDownWithItems } from '@clayui/drop-down';
import { getFieldLabel, getComparatorLabel, getFrequencyLabel } from './utils';
import { getToken } from '../../../../shared/auth/token';
import ClayButton from '@clayui/button';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayModal, { useModal } from '@clayui/modal';
import Client from '@my-trade/client';
import CurrencyInput from 'react-currency-input';
import InputRange from 'react-input-range';
import millify from 'millify';
import React, { useState } from 'react';
import SymbolSelector from '../SymbolSelector/SymbolSelector';

import 'react-input-range/lib/css/index.css';

const client = new Client();

export default ({
    alert,
    onClose,
    onSave
}) => {
    alert = alert || {
        comparator: 'equals',
        field: 'price',
        frequency: 'once',
        symbol: '',
        value: 0
    };

    const [comparator, setComparator] = useState(alert.comparator);
    const [field, setField] = useState(alert.field);
    const [frequency, setFrequency] = useState(alert.frequency || 'once');
    const [symbol, setSymbol] = useState(alert.symbol);
    const [value, setValue] = useState(alert.value);

    const reset = () => {
        setComparator('equals');
        setField('price');
        setSymbol('');
        setValue(0);
    };

    const { observer, onClose: handleClose } = useModal({
        onClose: () => {
            reset();
            onClose();
        }
    });

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        const token = getToken();

        setLoading(true);

        await client.saveAlert(token, {
            ...alert,
            comparator,
            field,
            frequency,
            symbol,
            value
        });

        setLoading(false);

        onSave();
        handleClose();
    }

    return (
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
                            {field === 'price' ? (
                                <CurrencyInput
                                    className="form-control"
                                    onChange={() => { }}
                                    onChangeEvent={(event, maskedValue, floatValue) => {
                                        setValue(floatValue);
                                    }}
                                    prefix="R$"
                                    value={value}
                                />
                            ) : (
                                    <InputRange
                                        formatLabel={value => millify(value)}
                                        minValue={0}
                                        maxValue={100000000}
                                        onChange={value => setValue(value)}
                                        step={1000000}
                                        value={value}
                                    />
                                )}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>Frequência de Envio</label>

                    <ClayDropDownWithItems
                        trigger={
                            <ClayButton displayType="secondary">
                                {getFrequencyLabel(frequency)}
                            </ClayButton>
                        }
                        items={[
                            {
                                onClick: () => setFrequency('once'),
                                label: getFrequencyLabel('once')
                            },
                            {
                                onClick: () => setFrequency('twice'),
                                label: getFrequencyLabel('twice')
                            },
                            {
                                onClick: () => setFrequency('always'),
                                label: getFrequencyLabel('always')
                            }
                        ]}
                    />
                </div>
            </ClayModal.Body>
            <ClayModal.Footer
                first={<ClayButton displayType="secondary" onClick={handleClose}>{"Cancelar"}</ClayButton>}
                last={
                    <ClayButton disabled={symbol === ''} onClick={handleSave}>
                        {"Salvar"}

                        {loading && (
                            <ClayLoadingIndicator className="d-inline-block ml-2" small />
                        )}
                    </ClayButton>}
            />
        </ClayModal>
    );
}