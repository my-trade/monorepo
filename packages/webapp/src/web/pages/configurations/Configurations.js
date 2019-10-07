import { getToken } from '../../shared/auth/token';
import { withRouter } from 'react-router-dom'
import AppContext, { CEI_SAVE } from '../../AppContext';
import ClayButton from '@clayui/button';
import ClayForm, { ClayInput } from '@clayui/form';
import ClayIcon from '@clayui/icon';
import Client from '@my-trade/client';
import React, { useState, useContext } from 'react';

const client = new Client();

export default withRouter(({ history }) => {
    const [{ cei: { data } }, dispatch] = useContext(AppContext);
    const [cpf, setCPF] = useState(data.cpf);
    const [senha, setSenha] = useState(data.senha);

    const handleSubmit = async () => {
        dispatch({ type: CEI_SAVE, payload: { cpf, senha } });

        const token = getToken();

        await client.updateCEI(token, { cpf, senha });

        history.push('/dashboard/');
    }

    const onChangeCPF = ({ currentTarget }) => {
        setCPF(currentTarget.value);
    }

    const onChangeSenha = ({ currentTarget }) => {
        setSenha(currentTarget.value);
    }

    return (
        <ClayForm
            onSubmit={event => {
                event.preventDefault();

                handleSubmit();
            }}
        >
            <div
                className={`form-group mb-2`}
            >
                <label htmlFor="cpf">
                    {'CPF'}

                    <span className="reference-mark">
                        <ClayIcon symbol="asterisk" />
                    </span>
                </label>

                <ClayInput
                    className="form-control"
                    id="cpf"
                    onChange={onChangeCPF}
                    type="text"
                    value={cpf}
                />
            </div>
            <div
                className={`form-group mb-2`}
            >
                <label htmlFor="senha">
                    {'Senha'}

                    <span className="reference-mark">
                        <ClayIcon symbol="asterisk" />
                    </span>
                </label>

                <ClayInput
                    className="form-control"
                    id="senha"
                    onChange={onChangeSenha}
                    type="password"
                    value={senha}
                />
            </div>

            <ClayButton onClick={handleSubmit}>Salvar</ClayButton>
        </ClayForm>
    );
}); 