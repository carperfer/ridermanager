
export class AuthUser {
  constructor(
    public email: string,
    public password: string
  ) { }
}

export class RecoverUser {
  constructor(
    public email: string,
  ) { }
}

export class SignCompanyUser {
  constructor(
    public first_name?: string,
    public last_name?: string,
    public phone?: string,
    public company_id?: number,
    public role_id?: number,
    public email?: string,
    public password?: string,
    public password_confirmation?: string,
  ) { }
}

export class RegisterUser {
  constructor(
    public email: string,
    public password: string,
    public password_confirmation: string,
    public first_name: string,
    public last_name: string,
    public phone: string,
    public name: string
  ) { }
}

export class RegisterUserInvite {
  constructor(
    public email: string,
    public password: string,
    public password_confirmation: string,
    public first_name: string,
    public last_name: string,
    public phone: string,
    public token: string
  ) { }
}

export class UserInfo {
  constructor(
    public company_id: number,
    public created_at: Date,
    public deleted_at: null,
    public email: string,
    public first_name: string,
    public id: number,
    public last_name: string,
    public phone: string,
    public role_id: number,
    public updated_at: Date,
    public permissions: string[],
    public companies: Company[]
  ) { }
}

export class LoginParams {
  constructor(
    token_type: string,
    expires_in: number,
    public access_token: string,
    public user_id: number,
    refresh_token: string,
  ) {

  }
  public getToken() { return this.access_token }
  public getUID() { return this.user_id }
}

export class LoginCredentials {
  email: string;
  password: string;
}

export class LoginData {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export class Company {
  public id: number;
  public name: string;
  created_at: Date | null;
  updated_at: Date | null;
  deleted_at: Date | null;
  public role: {
    id: number;
    name: string;
    permissions: string[];
  };
  verified?: boolean;
  constructor(

  ) { }
}

export interface TokenData {
  id: number,
  company_id: number,
  company: Company,
  email: string,
  role: {
    id: number,
    name: string
  }
  role_id: number,
  token: string,
  user: RegisterUser,
  created_at: Date,
  updated_at: Date
}
