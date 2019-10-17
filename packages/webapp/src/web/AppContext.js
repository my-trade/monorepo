import {createContext} from 'react';
import { hasCEI, getCEI } from './shared/auth/cei';

export const CEI_LOADING = 'CEI_LOADING';
export const CEI_SAVE = 'CEI_SAVE';

export const AppContext = createContext();

export const initialState = {
	cei: {
        data: getCEI(),
        hasCEI: hasCEI(),
        loading: false
    }
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        default: {
            return state;
        }
    }
};

export default AppContext;