import { logger } from "hono/logger";
import injectController from "App/Function/InjectController.js";
import onError from "App/Function/OnError.js";
import type { DefaultHonoApp } from "App/Types/ControllerTypes.js";

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

    /**
     * The rest of initialize ends here. After this, system will
     * collecting all of Controllers files.
     */
    await injectController(app);
}
