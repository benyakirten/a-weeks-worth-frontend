import { Action, createReducer, on } from "@ngrx/store";

import { User } from "src/app/shared/classes/user/user";
import * as AuthActions from './auth.actions';

export interface State {
  user?: User;
  error?: string;
};

const initialState: State = {
  user: undefined,
  error: undefined
}

const _authReducer = createReducer(
  initialState,
  on(
    AuthActions.login,
    (state, action) => ({
      ...state,
      user: action.user,
      error: undefined
    })
  ),

  on(
    AuthActions.logout,
    (state) => ({
      ...state,
      user: undefined,
      error: undefined
    })
  ),

  on(
    AuthActions.setError,
    (state, action) => ({
      ...state,
      error: action.error
    })
  ),

  on(
    AuthActions.dismissError,
    (state) => ({
      ...state,
      error: undefined
    })
  ),

  on(
    AuthActions.verifyEmail,
    (state) => ({
      ...state,
      user: new User(
        state.user!.email,
        state.user!.username,
        state.user!.token,
        state.user!.refreshToken,
        true
      )
    })
  )
)

export const authReducer = (state: State | undefined, action: Action) => _authReducer(state, action);
