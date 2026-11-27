class CategoryException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class CategoryExpiredException extends CategoryException {
  constructor() {
    super("errors.sessionExpired");
  }
}

export class CategoryForbiddenException extends CategoryException {
  constructor() {
    super("errors.categoryForbidden");
  }
}

export class CategoryNotFoundException extends CategoryException {
  constructor() {
    super("errors.categoryNotFound");
  }
}

export class CategoryErrorException extends CategoryException {
  constructor() {
    super("errors.categoryError");
  }
}
