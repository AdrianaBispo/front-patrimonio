class AuthException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class AuthExpiredException extends AuthException {
  constructor() {
    super("errors.sessionExpired");
  }
}

export class AuthForbiddenException extends AuthException {
  constructor() {
    super("errors.authForbidden");
  }
}

export class AuthErrorException extends AuthException {
  constructor() {
    super("errors.authError");
  }
}
