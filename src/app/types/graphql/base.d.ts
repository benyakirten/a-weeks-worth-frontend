type ExpectedError = {
  fieldName?: Array<ErrorItem>;
  otherField?: Array<ErrorItem>;
  nonFieldErrors?: Array<ErrorItem>;
  password2?: Array<ErrorItem>;
  newPassword2?: Array<ErrorItem>;
  username?: Array<ErrorItem>;
  email?: Array<ErrorItem>;
}

type ErrorItem = {
  message: string;
  code: string;
}
