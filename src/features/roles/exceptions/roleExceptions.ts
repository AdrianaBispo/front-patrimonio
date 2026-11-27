class RoleException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class RoleExpiredException extends RoleException {
  constructor() {
    super("errors.sessionExpired");
  }
}

export class RoleForbiddenException extends RoleException {
  constructor() {
    super("errors.roleForbidden");
  }
}

export class RoleNotFoundException extends RoleException {
  constructor() {
    super("errors.roleNotFound");
  }
}

export class RoleErrorException extends RoleException {
  constructor() {
    super("errors.roleError");
  }
}
