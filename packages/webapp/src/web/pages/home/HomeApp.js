import React from 'react';
import SignInButton from './components/SignInButton';

export default () => {
    return (
        <div className="container">
            <div className="sheet">
                <div className="sheet-section">
                    <div className="sheet-header">
                        <h2 className="sheet-title">MyTrade</h2>
                        <div className="sheet-text">Gerencie suas Ações!</div>
                    </div>
                    <SignInButton />
                </div>
            </div>
        </div>
    );
}