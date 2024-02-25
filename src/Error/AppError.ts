export class InsufficientControllerMethodError extends Error {
    public constructor() {
        super("Insufficient methods in the controller.");

        this.name = "InsufficientControllerMethodError";
        Object.setPrototypeOf(this, InsufficientControllerMethodError.prototype);
    }
}

export class NotSupportedMethodError extends Error {
    public constructor() {
        super("This method is not supported.");

        this.name = "NotSupportedMethodError";
        Object.setPrototypeOf(this, NotSupportedMethodError.prototype);
    }
}
