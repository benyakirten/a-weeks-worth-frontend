import { User } from 'src/app/shared/classes/user/user';
import * as fromReducer from './auth.reducer';

describe('AuthReducer', () => {
  const initialState: fromReducer.State = {
    user: undefined,
    error: undefined,
    loading: false
  }

  it('should return the initial state in response to an unknown action', () => {
    const action = {
      type: 'test'
    };
    const state = fromReducer.authReducer(initialState, action);
    expect(state).toBe(initialState);
  });

  it('should set the user to the login action', () => {
    const user = new User('test@test.com', 'testymctestface', 'testtoken', 'testrefreshtoken', true);
    const action = {
      type: '[Auth] Login',
      user
    }
    const state = fromReducer.authReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      user,
    });
  });

  it('should make the user undefined in response to the logout action', () => {
    const action = {
      type: '[Auth] Logout',
    }
    const state = fromReducer.authReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      user: undefined
    });
  });

  it('should make the user undefined in response to the logout action after the user is logged in', () => {
    const user = new User('test@test.com', 'testymctestface', 'testtoken', 'testrefreshtoken', true);
    const loginAction = {
      type: '[Auth] Login',
      user
    }
    const loginState = fromReducer.authReducer(initialState, loginAction);
    expect(loginState).toEqual({
      ...initialState,
      user,
    });

    const logoutAction = {
      type: '[Auth] Logout',
    }
    const logoutState = fromReducer.authReducer(loginState, logoutAction);
    expect(logoutState).toEqual({
      ...initialState,
      user: undefined
    });
  });

  it('should set the error in response to the set error action', () => {
    const error = 'Test Error';
    const action = {
      type: '[Auth] Set Error',
      error
    };
    const state = fromReducer.authReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      error
    });
  });

  it('should set the error to undefined in response to the dismiss error action', () => {
    const action = {
      type: '[Auth] Dismiss Error',
    };
    const state = fromReducer.authReducer(initialState, action);
    expect(state).toEqual(initialState);
  });

  it('should set the error to undefined in response to the dismiss error action after an error has been dispatched', () => {
    const error = 'Test Error';
    const setErrorAction = {
      type: '[Auth] Set Error',
      error
    };
    const errorState = fromReducer.authReducer(initialState, setErrorAction);
    expect(errorState).toEqual({
      ...initialState,
      error
    });

    const dismissErrorAction = {
      type: '[Auth] Dismiss Error',
    };
    const dismissErrorState = fromReducer.authReducer(errorState, dismissErrorAction);
    expect(dismissErrorState).toEqual(initialState);
  });

  it('should set the user\'s verified status to true in response to the verify email action', () => {
    const user = new User('test@test.com', 'testymctestface', 'testtoken', 'testrefreshtoken', false);
    const loginAction = {
      type: '[Auth] Login',
      user
    }
    const loginState = fromReducer.authReducer(initialState, loginAction);
    expect(loginState).toEqual({
      ...initialState,
      user,
    });

    const verifiedUser = new User('test@test.com', 'testymctestface', 'testtoken', 'testrefreshtoken', true);
    const verifyEmailAction = {
      type: '[Auth] Verify Email'
    };
    const verifyEmailState = fromReducer.authReducer(loginState, verifyEmailAction);
    expect(verifyEmailState).toEqual({
      ...initialState,
      user: verifiedUser
    });
  });

  it('should set the loading property of the state based on the setLoading action\'s payload', () => {
    const loadingTrueAction = {
      type: '[Auth] Set Loading',
      loading: true
    };
    const loadingTrueState = fromReducer.authReducer(initialState, loadingTrueAction);
    expect(loadingTrueState).toEqual({
      ...initialState,
      loading: true
    });

    const loadingFalseAction = {
      type: '[Auth] Set Loading',
      loading: false
    };
    const loadingFalseState = fromReducer.authReducer(initialState, loadingFalseAction);
    expect(loadingFalseState).toEqual({
      ...initialState,
      loading: false
    });
  })
})
