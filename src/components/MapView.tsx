"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import type { Place, Mode } from "@/types";
import type { LeafletMouseEvent } from "leaflet";
import { useMemo, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import { useMapEvents } from "react-leaflet";

const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false }
);
const CircleMarker = dynamic(
  async () => (await import("react-leaflet")).CircleMarker,
  { ssr: false }
);
const Popup = dynamic(async () => (await import("react-leaflet")).Popup, {
  ssr: false,
});

function MapClickHandler({
  mode,
  onGuess,
}: {
  mode: Mode;
  onGuess: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e: LeafletMouseEvent) => {
      if (mode === "guess-location") {
        onGuess(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function MapView({
  mode,
  places,
  target,
  lastResult,
  onGuess,
  onIdentify,
}: {
  mode: Mode;
  places: Place[];
  target: Place | null;
  lastResult: string;
  onGuess: (lat: number, lng: number) => void;
  onIdentify: (p: Place) => void;
}) {
  const center = useMemo<[number, number]>(() => [32, 39], []);
  const zoom = 5;
  const mapRef = useRef<LeafletMap | null>(null);

  return (
    <div className="h-[70vh] md:h-[75vh] w-full rounded-2xl overflow-hidden shadow">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <MapClickHandler mode={mode} onGuess={onGuess} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        {mode === "identify-marker" &&
          places.map((p) => (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              pathOptions={{ color: "#2563eb", fillColor: "#60a5fa" }}
              radius={7}
              weight={2}
              fillOpacity={0.7}
              eventHandlers={{ click: () => onIdentify(p) }}
            >
              <Popup>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{p.era || ""}</div>
                <div style={{ fontSize: 12 }}>{p.note || ""}</div>
              </Popup>
            </CircleMarker>
          ))}

        {mode === "guess-location" && lastResult && target && (
          <CircleMarker
            center={[target.lat, target.lng]}
            pathOptions={{ color: "#16a34a", fillColor: "#86efac" }}
            radius={9}
            weight={3}
            fillOpacity={0.6}
          >
            <Popup>{target.name}</Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}
