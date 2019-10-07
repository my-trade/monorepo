import React from 'react';
import ClayButton from '@clayui/button';
import signIn from '../../../shared/auth/signIn';
import { withRouter } from 'react-router-dom'

export default withRouter(({history}) => {
    const onClick = async () => {
        await signIn(history);
    };

    return (
        <ClayButton onClick={onClick}>Entrar com Google</ClayButton>
    );
});