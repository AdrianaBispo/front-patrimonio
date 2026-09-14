export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface User {
    name: string;
    email: string;
  }
  
  export interface AuthResult {
    user: User;
    token: string;
  }