export type ListingContactEvent =
  | "whatsapp_click"
  | "phone_click"
  | "website_click";

export function trackListingContact(
  listingId: string,
  eventType: ListingContactEvent,
) {
  void fetch("/api/listing-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({ listingId, eventType }),
  }).catch(() => {
    // Conversion telemetry must never block the user's action.
  });
}
