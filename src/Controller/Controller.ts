import "reflect-metadata";
import type { Factory } from "hono/factory";
import { createFactory } from "hono/factory";
import type { HandlerInterface, MiddlewareHandler } from "hono/types";
import { InsufficientControllerMethodError, NotSupportedMethodError } from "App/Error/AppError.js";
import { MetadataConstant, MetadataValidatorConstant } from "App/Types/ControllerConstant.js";
import type {
    AgniRoutingMetadata,
    AgniSupportedMethod,
    DefaultHonoApp,
    DefaultHonoFunctionContext
} from "App/Types/ControllerTypes.js";

/**
 * Base of Controller class.
 */
export default class Controller {
    public _honoFactory: Factory = createFactory();
    public constructor(public app: DefaultHonoApp) {}

    public prepareClass(): void {
        const methodList = Object
            .getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(x => x !== "constructor");

        if (methodList.length <= 0) {
            throw new InsufficientControllerMethodError();
        }

        for (const method of methodList) {
            const func = (this as Record<string, any>)[method] as DefaultHonoFunctionContext | undefined;
            if (typeof func !== "function") return;
            if (!Reflect.hasMetadata(MetadataConstant, func)) return;

            const metadata = Reflect.getMetadata(MetadataConstant, func) as AgniRoutingMetadata;
            const metadataKeys = Reflect.getMetadataKeys(func);
            const honoApp = (this.app as Record<AgniSupportedMethod, any>)[metadata.method] as HandlerInterface | undefined;
            if (typeof honoApp !== "function") {
                throw new NotSupportedMethodError();
            }

            /**
             * TODO [2024-02-25]: Add support for middleware, multi handler/middleware
             */
            const ctx: any[] = [];
            if (metadataKeys.includes(MetadataValidatorConstant)) {
                const middleware = Reflect.getMetadata(MetadataValidatorConstant, func) as MiddlewareHandler;
                ctx.push(this._honoFactory.createMiddleware(middleware));
            }

            ctx.push(func);

            // TODO [2024-02-26]: How to bypass this?
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const handlers = this._honoFactory.createHandlers(...(ctx as DefaultHonoFunctionContext[]));
            honoApp(metadata.path, ...handlers);
        }
    }
}
