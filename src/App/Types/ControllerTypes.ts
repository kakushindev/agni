import type { Hono, Context, Env } from "hono";
import type { BlankSchema, H, BlankInput } from "hono/types";

export type AgniRoutingMetadata = {
    path: string;
    method: AgniSupportedMethod;
};

export type AgniSupportedMethod = "delete" | "get" | "patch" | "post" | "put";
export type DefaultHonoApp = Hono<Env, BlankSchema, string>;
export type DefaultHonoContext = Context<Env, string, BlankInput>;
export type DefaultHonoFunctionContext = H<Env, string, BlankInput, Response>;
