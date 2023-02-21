export interface IUser {
  isActivated: boolean;
  email: string;
  activatedLink: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}