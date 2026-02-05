import { useSyncExternalStore } from "react";

const darkModeQuery = () =>
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

const subscribe = (callback: () => void) => {
  const mql = darkModeQuery();
  mql?.addEventListener("change", callback);
  return () => mql?.removeEventListener("change", callback);
};

const getSnapshot = () => darkModeQuery()?.matches ?? false;

const getServerSnapshot = () => false;

export const useDarkMode = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
