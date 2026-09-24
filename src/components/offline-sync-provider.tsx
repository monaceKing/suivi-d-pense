"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { localDB } from "@/lib/db/local-db";
import { pullAll, flushOutbox } from "@/lib/db/sync";

type OfflineSyncContextValue = {
  isOnline: boolean;
  pendingCount: number;
};

const OfflineSyncContext = createContext<OfflineSyncContextValue>({
  isOnline: true,
  pendingCount: 0,
});

export function OfflineSyncProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));

  const pendingCount = useLiveQuery(() => localDB.outbox.count(), [], 0) ?? 0;

  useEffect(() => {
    async function sync() {
      try {
        await flushOutbox();
        await pullAll();
      } catch {
        // Pas grave : on réessaiera au prochain passage en ligne.
      }
    }

    if (navigator.onLine) sync();

    function handleOnline() {
      setIsOnline(true);
      sync();
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <OfflineSyncContext.Provider value={{ isOnline, pendingCount }}>{children}</OfflineSyncContext.Provider>
  );
}

export function useOfflineSync() {
  return useContext(OfflineSyncContext);
}