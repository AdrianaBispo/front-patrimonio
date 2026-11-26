class UserException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class UserExpiredException extends UserException {
    constructor() {
        super('errors.sessionExpired');
    }
}

export class UserNotFoundException extends UserException {
    constructor() {
        super('errors.userNotFound');
    }
}

export class UserErrorException extends UserException {
    constructor() {
        super('errors.userError');
    }
}