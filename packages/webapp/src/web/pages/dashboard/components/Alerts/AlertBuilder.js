import { ClayDropDownWithItems } from '@clayui/drop-down';
import { getFieldLabel, getComparatorLabel, getFrequencyLabel } from './utils';
import { getToken } from '../../../../shared/auth/token';
import ClayButton from '@clayui/button';
import ClayModal, { useModal } from '@clayui/modal';
import Client from '@my-trade/client';
import CurrencyInput from 'react-currency-input';
import InputRange from 'react-input-range';
import millify from 'millify';
import React, { useState } from 'react';
import SymbolSelector from '../SymbolSelector/SymbolSelector';

import 'react-input-range/lib/css/index.css';

const client = new Client();

export default ({ onClose, onSave }) => {
    const [comparator, setComparator] = useState('equals');
    const [field, setField] = useState('price');
    const [frequency, setFrequency] = useState('once');
    const [symbol, setSymbol] = useState('');
    const [value, setValue] = useState(0);

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

    const handleSave = async () => {
        const token = getToken();

        await client.saveAlert(token, {
            comparator,
            field,
            frequency,
            symbol,
            value
        });

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
                last={<ClayButton disabled={symbol === ''} onClick={handleSave}>{"Salvar"}</ClayButton>}
            />
        </ClayModal>
    );
}