class EquipmentHistoryException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class EquipmentHistoryExpiredException extends EquipmentHistoryException {
  constructor() {
    super("errors.sessionExpired");
  }
}

export class EquipmentHistoryForbiddenException extends EquipmentHistoryException {
  constructor() {
    super("errors.equipmentHistoryForbidden");
  }
}

export class EquipmentHistoryErrorException extends EquipmentHistoryException {
  constructor() {
    super("errors.equipmentHistoryError");
  }
}
