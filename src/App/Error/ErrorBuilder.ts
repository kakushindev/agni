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

    public setKind<D extends T>(data: D): ErrorBuilder<D> {
        return this.setProps("kind", data) as unknown as ErrorBuilder<D>;
    }

    public setInstance(instance: string): this {
        return this.setProps("instance", instance);
    }

    public setMDNCodeType(code: StatusCode): this {
        return this.setProps("type", `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${code}`);
    }

    public setType(type: string): this {
        return this.setProps("type", type);
    }

    public setTitle(title: string): this {
        return this.setProps("title", title);
    }

    public setDetail(detail: string): this {
        return this.setProps("detail", detail);
    }

    public build(): any {
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

