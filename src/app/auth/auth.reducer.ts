import { createReducer, on } from '@ngrx/store';
import { Usuario } from '../models/usuario.models';
import * as userActios from './auth.actions';

export interface State {
    user: Usuario | null;
}

export const initialState: State = {
   user: null,
}

export const userReducer = createReducer(initialState,

    on(userActios.setUser, (state, { user }) => (
         { ...state, user: {...user}})),
    on(userActios.unSetUser, (state) => ({ ...state, user: null})),

    on(userActios.getUser, (state)=>({...state}))

);
