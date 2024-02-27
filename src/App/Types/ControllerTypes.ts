import type { Hono, Context, Env } from "hono";
import type { BlankSchema, H, BlankInput, Input, ValidationTargets } from "hono/types";

export type AgniRoutingMetadata = {
    path: string;
    method: AgniSupportedMethod;
};

export type AgniSupportedMethod = "delete" | "get" | "patch" | "post" | "put";
export type DefaultHonoApp = Hono<Env, BlankSchema, string>;
export type DefaultHonoContext = Context<Env, string, BlankInput>;
export type DefaultHonoFunctionContext = H<Env, string, BlankInput, Response>;

export type AgniInput<V> = Input & {
    in: { [K in keyof ValidationTargets]: V };
    out: { [K in keyof ValidationTargets]: V };
};
export type HonoInputContext<V> = Context<Env, string, AgniInput<V>>;
