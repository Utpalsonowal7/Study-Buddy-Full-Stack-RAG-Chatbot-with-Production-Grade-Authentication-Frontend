import { matchPath } from "react-router";

const protectedPaths = ["/dashboard", "/home", "/chat", "/chat/:chatId", "/documents", "/settings"];

export function isProtectedPath(pathname: string): boolean {
     return protectedPaths.some((path) => matchPath({ path, end: true }, pathname) !== null);
}
