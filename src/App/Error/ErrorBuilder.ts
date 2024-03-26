export type IErrorBuilder<T> = {
    title: string;
    detail: string;
    type: string;
    instance?: string;
    kind?: T;
};

/**
 * Error builder for Agni based on IETF Error Convention.
 *
 * @see - RFC 9457
 */
export default class ErrorBuilder<T extends {}> implements IErrorBuilder<T> {
    public type: string = "about:blank";
    public instance?: string;
    public kind?: T;

    public constructor(public title: string, public detail: string) {}

    public setKind<D extends T>(data: D): ErrorBuilder<D> {
        this.kind = data;
        return this as unknown as ErrorBuilder<D>;
    }

    public setInstance(instance: string): ErrorBuilder<T> {
        this.instance = instance;
        return this as unknown as ErrorBuilder<T>;
    }

    public setType(type: string): ErrorBuilder<T> {
        this.type = type;
        return this as unknown as ErrorBuilder<T>;
    }

    public build(): IErrorBuilder<T> {
        const data: IErrorBuilder<T> = {
            type: this.type,
            title: this.title,
            detail: this.detail
        };

        if (this.instance !== undefined) {
            data.instance = this.instance;
        }

        if (this.kind !== undefined) {
            data.kind = this.kind;
        }

        return data;
    }
}

