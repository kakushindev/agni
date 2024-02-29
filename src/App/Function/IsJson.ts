export default function isJson(header: Record<string, string>): boolean {
    const ret = header["content-type"];
    if (!ret) return false;
    if (ret !== "application/json") return false;
    return true;
}
