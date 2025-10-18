"use client";
import dynamic from "next/dynamic";
import type { Place } from "@/types";
import { MARKER_STYLES } from "@/lib/constants";

const CircleMarker = dynamic(
  async () => (await import("react-leaflet")).CircleMarker,
  { ssr: false }
);
const Circle = dynamic(async () => (await import("react-leaflet")).Circle, {
  ssr: false,
});
const Popup = dynamic(async () => (await import("react-leaflet")).Popup, {
  ssr: false,
});

/**
 * Marker for places to identify
 */
export function IdentifyMarker({
  place,
  onIdentify,
}: {
  place: Place;
  onIdentify: (p: Place) => void;
}) {
  return (
    <CircleMarker
      key={place.id}
      center={[place.lat, place.lng]}
      pathOptions={{
        color: MARKER_STYLES.IDENTIFY.color,
        fillColor: MARKER_STYLES.IDENTIFY.fillColor,
      }}
      radius={MARKER_STYLES.IDENTIFY.radius}
      weight={MARKER_STYLES.IDENTIFY.weight}
      fillOpacity={MARKER_STYLES.IDENTIFY.fillOpacity}
      eventHandlers={{ click: () => onIdentify(place) }}
    >
      <Popup>
        <div style={{ fontWeight: 600 }}>{place.name}</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>{place.era || ""}</div>
        <div style={{ fontSize: 12 }}>{place.note || ""}</div>
      </Popup>
    </CircleMarker>
  );
}

/**
 * Shows the correct answer location with tolerance circle
 */
export function AnswerMarker({
  place,
  toleranceKm,
}: {
  place: Place;
  toleranceKm: number;
}) {
  return (
    <>
      {/* Tolerance circle */}
      <Circle
        center={[place.lat, place.lng]}
        radius={toleranceKm * 1000} // Convert km to meters
        pathOptions={{
          color: MARKER_STYLES.TOLERANCE_CIRCLE.color,
          fillColor: MARKER_STYLES.TOLERANCE_CIRCLE.fillColor,
          fillOpacity: MARKER_STYLES.TOLERANCE_CIRCLE.fillOpacity,
          weight: MARKER_STYLES.TOLERANCE_CIRCLE.weight,
          dashArray: MARKER_STYLES.TOLERANCE_CIRCLE.dashArray,
        }}
      />
      {/* Answer marker */}
      <CircleMarker
        center={[place.lat, place.lng]}
        pathOptions={{
          color: MARKER_STYLES.ANSWER.color,
          fillColor: MARKER_STYLES.ANSWER.fillColor,
        }}
        radius={MARKER_STYLES.ANSWER.radius}
        weight={MARKER_STYLES.ANSWER.weight}
        fillOpacity={MARKER_STYLES.ANSWER.fillOpacity}
      >
        <Popup>{place.name}</Popup>
      </CircleMarker>
    </>
  );
}
