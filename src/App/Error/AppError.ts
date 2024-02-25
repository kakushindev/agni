export class NoDefaultExportError extends Error {
    public constructor() {
        super("No default export of class/function on this file.");

        this.name = "NoDefaultExportError";
        Object.setPrototypeOf(this, NoDefaultExportError.prototype);
    }
}

export class IsNotConstructorError extends Error {
    public constructor() {
        super("This file/imported file is not constructor class.");

        this.name = "IsNotConstructorError";
        Object.setPrototypeOf(this, NoDefaultExportError.prototype);
    }
}
