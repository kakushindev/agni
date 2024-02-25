import { logger } from "hono/logger";
import injectController from "App/Function/InjectController.js";
import type { DefaultHonoApp } from "Controller/Controller.js";

export async function initialize(app: DefaultHonoApp): Promise<void> {
    /**
     * Here's the lies of initialize function.
     * You can add some middleware, handler, factories, or something
     * that you can initialize before route initialization.
     */

    // Initialize Logger
    app.use(logger());

    /**
     * The rest of initialize ends here. After this, system will
     * collecting all of Controllers files.
     */
    await injectController(app);
}
