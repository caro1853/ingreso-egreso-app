import { createAction, props } from '@ngrx/store';
import { Usuario } from '../models/usuario.models';

export const setUser = createAction('[User Component] setUser',
    props<{user: Usuario}>()
);

export const unSetUser = createAction('[User Component] unSetUser');

export const getUser = createAction('[User Component] getUser');

