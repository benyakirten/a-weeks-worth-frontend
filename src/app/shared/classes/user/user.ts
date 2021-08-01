export class User {
  get token() {
    return this._token;
  }
  get refreshToken() {
    return this._refreshToken;
  }
  constructor(
    public email: string,
    public username: string,
    private _token: string,
    private _refreshToken: string,
    public verified: boolean
  ) {}
}
