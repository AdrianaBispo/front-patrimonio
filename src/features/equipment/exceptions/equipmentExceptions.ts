class EquipmentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class EquipmentExpiredException extends EquipmentException {
  constructor() {
    super("errors.sessionExpired");
  }
}

export class EquipmentForbiddenException extends EquipmentException {
  constructor() {
    super("errors.equipmentForbidden");
  }
}

export class EquipmentNotFoundException extends EquipmentException {
  constructor() {
    super("errors.equipmentNotFound");
  }
}

export class EquipmentErrorException extends EquipmentException {
  constructor() {
    super("errors.equipmentError");
  }
}
