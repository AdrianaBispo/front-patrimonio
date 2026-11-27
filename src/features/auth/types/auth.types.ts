export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginFormErrors = {
  email?: string;
  password?: string;
};

export type User = {
  name: string;
  email: string;
};

export type AuthResult = {
  user: User;
  token: string;
};
