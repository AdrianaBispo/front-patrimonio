import axios from "axios";

abstract class PermissionException extends Error {}


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