"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const scope = `${basePath || ""}/` || "/";
    const scriptUrl = `${basePath}/sw.js`;

    navigator.serviceWorker.register(scriptUrl, { scope }).catch((error: unknown) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Service worker registration failed", error);
      }
    });
  }, []);

  return null;
}
