export class EngineError extends Error {
    constructor(public translationKey: string) {
        super()
    }
}

export class NoPermissionError extends EngineError {
    constructor() {
        super('errors:noInteractionPermission')
    }
}

export class ExpiredError extends EngineError {
    constructor() {
        super('errors:expiredInteraction')
    }
}

export class UnknownError extends EngineError {
    constructor() {
        super('errors:unknown')
    }
}
