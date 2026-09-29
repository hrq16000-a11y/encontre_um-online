"use client";

export type TrafficAttribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  landingPath: string;
  referrer: string;
};

const KEY = "encontreum_attribution_v1";

function bounded(value: string | null, max: number) {
  return (value || "").trim().slice(0, max);
}

export function captureTrafficAttribution() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const current = getTrafficAttribution();
  const hasCampaign =
    params.has("utm_source") ||
    params.has("utm_medium") ||
    params.has("utm_campaign");

  if (current && !hasCampaign) return;

  const data: TrafficAttribution = {
    utmSource: bounded(params.get("utm_source"), 120),
    utmMedium: bounded(params.get("utm_medium"), 120),
    utmCampaign: bounded(params.get("utm_campaign"), 160),
    landingPath: bounded(
      window.location.pathname + window.location.search,
      240,
    ),
    referrer: bounded(document.referrer, 500),
  };

  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Attribution is optional and must never break navigation.
  }
}

export function getTrafficAttribution(): TrafficAttribution | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<TrafficAttribution>;
    return {
      utmSource: bounded(parsed.utmSource || "", 120),
      utmMedium: bounded(parsed.utmMedium || "", 120),
      utmCampaign: bounded(parsed.utmCampaign || "", 160),
      landingPath: bounded(parsed.landingPath || "", 240),
      referrer: bounded(parsed.referrer || "", 500),
    };
  } catch {
    return null;
  }
}
