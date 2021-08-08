import { createAction, props  } from "@ngrx/store";
import { User } from "src/app/shared/classes/user/user";

export const login = createAction(
  '[Auth] Login',
  props<{ user: User }>()
);
export const logout = createAction('[Auth] Logout');

export const setError = createAction(
  '[Auth] Set Error',
  props<{ error: string }>()
);
export const dismissError = createAction('[Auth] Dismiss Error');
export const verifyEmail = createAction('[Auth] Verify Email');

export const setLoading = createAction(
  '[Auth] Set Loading',
  props<{ loading: boolean }>()
);
