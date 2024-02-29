import { join } from "node:path";
import { NoDefaultExportError, IsNotConstructorError } from "App/Error/AppError.js";
import type { DefaultHonoApp } from "App/Types/ControllerTypes.js";
import Controller from "Controller/Controller.js";
import Logger from "Logger.js";
import traversalFileScan from "./TraversalFileScan.js";

type ImportController = {
    [key: string]: any;
    default?: Controller;
};

export default async function injectController(app: DefaultHonoApp): Promise<void> {
    const folderPath = join(import.meta.dirname, "../../Controller");
    const files = await traversalFileScan(folderPath);
    const listFiles: Promise<any>[] = [];

    // Try to import file
    for (const file of files) {
        try {
            Logger.info(`Importing ${file.split("/").pop()?.split(".")[0]}`);
            listFiles.push(import(file));
        } catch {
            throw new NoDefaultExportError();
        }
    }

    for (const file of await Promise.all(listFiles) as ImportController[]) {
        const ControllerFile = file.default;
        if (!ControllerFile) throw new NoDefaultExportError();
        if (typeof ControllerFile !== "function") throw new IsNotConstructorError();

        // Skip the file if there's no Controller that inherit on it
        if (Object.getPrototypeOf(ControllerFile) !== Controller) continue;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const controller = new ControllerFile(app) as Controller;
        controller.prepareClass();
    }
}
