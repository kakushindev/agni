import type { StatusCode } from "hono/utils/http-status";

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

    private setProps<P extends keyof this>(prop: P, val: this[P]): this {
        this[prop] = val;
        return this;
    }

    /**
     * Set additional fields on error query
     */
    public setKind<D extends T>(data: D): ErrorBuilder<D> {
        return this.setProps("kind", data) as unknown as ErrorBuilder<D>;
    }

    /**
     * Set instance or path where error raised on error query
     */
    public setInstance(instance: string): this {
        return this.setProps("instance", instance);
    }

    /**
     * Set code error type on error query
     */
    public setMDNCodeType(code: StatusCode): this {
        return this.setProps("type", `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${code}`);
    }

    /**
     * Set type of error URI on error query
     */
    public setType(type: string): this {
        return this.setProps("type", type);
    }

    /**
     * Set the title on error query
     */
    public setTitle(title: string): this {
        return this.setProps("title", title);
    }

    /**
     * Set the detail on error query
     */
    public setDetail(detail: string): this {
        return this.setProps("detail", detail);
    }

    /**
     * Generate the error query
     */
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

