import { gql } from "apollo-angular";

export const REGISTER = gql`
  mutation register($email: String!, $username: String!, $password1: String!, $password2: String!) {
    register(email: $email, username: $username, password1: $password1, password2: $password2) {
      success
      errors
      token
      refreshToken
    }
  }
`;

export const TOKEN_AUTH = gql`
  mutation tokenAuth($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      success
      errors
      token
      refreshToken
      user {
        id
        email
        username
        verified
      }
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation refreshToken($token: String!) {
    refreshToken(refreshToken: $token) {
      success
      errors
      token
      refreshToken
    }
  }
`;

export const VERIFY_ACCOUNT = gql`
  mutation verifyAccount($token: String!) {
    verifyAccount(token: $token) {
      success
      errors
    }
  }
`;

export const RESEND_ACTIVATION_EMAIL = gql`
  mutation resendActivationEmail($email: String!) {
    resendActivationEmail(email: $email) {
      success
      errors
    }
  }
`;

export const SEND_PASSWORD_RESET_EMAIL = gql`
  mutation sendPasswordResetEmail($email: String!) {
    sendPasswordResetEmail(email: $email) {
      success
      errors
    }
  }
`;

export const PASSWORD_RESET = gql`
  mutation passwordReset($token: String!, $newPassword1: String!, $newPassword2: String!) {
    passwordReset(token: $token, newPassword1: $newPassword1, newPassword2: $newPassword2) {
      success
      errors
    }
  }
`;

export const UPDATE_DETAILS = gql`
  mutation updateDetails($email: String, $username: String) {
    updateDetails(email: $email, username: $username) {
      user {
        email
        username
        verified
      }
    }
  }
`;
