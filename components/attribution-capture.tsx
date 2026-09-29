"use client";

import { useEffect } from "react";
import { captureTrafficAttribution } from "@/lib/attribution/client";

export function AttributionCapture() {
  useEffect(() => {
    captureTrafficAttribution();
  }, []);

  return null;
}
