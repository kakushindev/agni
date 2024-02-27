import { logger } from "hono/logger";
import injectController from "App/Function/InjectController.js";
import type { DefaultHonoApp } from "App/Types/ControllerTypes.js";
import onError from "Function/OnError.js";
import { onNotFound } from "Function/OnNotFound.js";

export async function initialize(app: DefaultHonoApp): Promise<void> {
    /**
     * Here's the lies of initialize function.
     * You can add some middleware, handler, factories, or something
     * that you can initialize before route initialization.
     */

    // Initialize Logger
    app.use(logger());

    // When error is spawned
    app.onError(onError);

    // When is not found
    app.notFound(onNotFound);

    /**
     * The rest of initialize ends here. After this, system will
     * collecting all of Controllers files.
     */
    await injectController(app);
}
