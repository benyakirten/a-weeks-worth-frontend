import { createAction, props  } from "@ngrx/store";
import { User } from "src/app/shared/classes/user/user";

export const login = createAction(
  '[Auth] Set User',
  props<{ user: User }>()
);
export const logout = createAction('[Auth] Remove User');

export const setError = createAction(
  '[Auth] Set Error',
  props<{ error: string }>()
);
export const dismissError = createAction('[Auth] Dismiss Error');
export const verifyEmail = createAction('[Auth] Verify User');
