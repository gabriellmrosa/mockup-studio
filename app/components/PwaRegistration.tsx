"use client";

import { useEffect } from "react";

const SERVICE_WORKER_URL = "/sw.js";

export default function PwaRegistration() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    window.addEventListener("load", () => {
      void navigator.serviceWorker.register(SERVICE_WORKER_URL);
    });
  }, []);

  return null;
}
