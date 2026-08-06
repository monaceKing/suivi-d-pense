"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silencieux : l'app fonctionne sans SW, juste sans mise en cache du shell.
      });
    }
  }, []);
  return null;
}
