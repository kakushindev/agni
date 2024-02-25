import { promises as fs } from "node:fs";
import { join } from "node:path";

export default async function traversalFileScan(targetDir: string): Promise<string[]> {
    const files: string[] = [];

    async function traverseDir(currentDir: string): Promise<void> {
        const dir = await fs.readdir(currentDir);
        for (const file of dir) {
            if (file === "Controller.ts") continue;
            const absolutePath = join(currentDir, file);
            // eslint-disable-next-line no-await-in-loop
            const statAbsolutePath = await fs.stat(absolutePath);
            if (statAbsolutePath.isDirectory()) {
                // eslint-disable-next-line no-await-in-loop
                await traverseDir(absolutePath);
            } else if (file.endsWith(".ts")) {
                files.push(absolutePath);
            }
        }
    }

    await traverseDir(targetDir);
    return files;
}
