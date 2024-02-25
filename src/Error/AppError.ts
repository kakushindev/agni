export class SampleError extends Error {
    public constructor() {
        super("This is sample error");

        this.name = "SampleError";
        Object.setPrototypeOf(this, SampleError.prototype);
    }
}
