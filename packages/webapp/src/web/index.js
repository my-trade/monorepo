import 'babel-polyfill';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

window.startApp = async () => {

	ReactDOM.render((
		<App />
	), document.querySelector('#app'));
};

window.startApp();