export type AttributionInput = {
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  landingPath?: unknown;
  referrer?: unknown;
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function normalizeAttribution(value: unknown) {
  const input =
    value && typeof value === "object"
      ? (value as AttributionInput)
      : {};

  return {
    utm_source: clean(input.utmSource, 120) || null,
    utm_medium: clean(input.utmMedium, 120) || null,
    utm_campaign: clean(input.utmCampaign, 160) || null,
    landing_path: clean(input.landingPath, 240) || null,
    referrer: clean(input.referrer, 500) || null,
  };
}
