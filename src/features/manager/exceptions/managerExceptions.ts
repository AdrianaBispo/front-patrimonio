class ManagerException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ManagerExpiredException extends ManagerException {
    constructor() {
        super('errors.sessionExpired');
    }
}

export class ManagerNotFoundException extends ManagerException {
    constructor() {
        super('errors.managerNotFound');
    }
}

export class ManagerAlreadyExistsException extends ManagerException {
    constructor() {
        super('errors.managerAlreadyExists');
    }
}

export class ManagerErrorException extends ManagerException {
    constructor() {
        super('errors.managerError');
    }
}