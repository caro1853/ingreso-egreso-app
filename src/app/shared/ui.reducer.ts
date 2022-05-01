import { createReducer, on } from '@ngrx/store';
import * as actionsUI from './ui.actions';

export interface State {
    isLoading: Boolean; 
}

export const initialState: State = {
   isLoading: false,
}

export const uiReducer = createReducer(initialState,

    on(actionsUI.isLoading, state => ({ ...state, isLoading: true})),
    on(actionsUI.stopLoading, state => ({ ...state, isLoading: false})),

);
