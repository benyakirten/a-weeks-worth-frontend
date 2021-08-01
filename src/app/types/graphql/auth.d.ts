// Mutations
interface BaseSuccess {
  success: boolean;
}

interface BaseResults extends BaseSuccess {
  errors?: ExpectedError;
}

interface BaseAuthResponse extends BaseResults {
  token: string;
  refreshToken: string;
}

interface BaseUser {
  user: {
    email: string;
    username: string;
    verified: boolean;
  }
}

interface AuthResponse extends BaseAuthResponse, BaseUser {}

interface TokenAuth {
  tokenAuth: AuthResponse;
}

interface RefreshToken {
  refreshToken: BaseAuthResponse
}

interface Register {
  register: BaseAuthResponse;
}

interface VerifyAccount {
  verifyAccount: BaseResults;
}

interface ResendActivationEmail {
  resendActivationEmail: BaseResults;
}

interface SendPasswordResetEmail {
  sendPasswordResetEmail: BaseResults;
}

interface PasswordReset {
  passwordReset: BaseResults;
}

interface UpdateDetails {
  updateDetails: BaseUser;
}

interface MessageMe {
  messageMe: BaseSuccess;
}
