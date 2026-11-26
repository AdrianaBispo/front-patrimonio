abstract class PermissionException extends Error {
    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;
    }
}

export class PermissionExpiredException extends PermissionException {
    constructor() {
        super('errors.sessionExpired');
    }
}

export class PermissionForbiddenException extends PermissionException {
    constructor() {
        super('errors.permissionForbidden');
    }
}

export class PermissionErrorException extends PermissionException {
    constructor() {
        super('errors.permissionError');
    }
}
