"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import type { Place, Mode } from "@/types";
import { useMemo, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import { MapClickHandler, TargetViewManager } from "./map/MapComponents";
import { IdentifyMarker, AnswerMarker } from "./map/MapMarkers";
import { MAP_CONFIG, TILE_LAYER } from "@/lib/constants";

const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false }
);

interface MapViewProps {
  mode: Mode;
  places: Place[];
  target: Place | null;
  lastTarget: Place | null;
  lastResult: string;
  onGuess: (lat: number, lng: number) => void;
  onIdentify: (p: Place) => void;
  toleranceKm: number;
}

export default function MapView({
  mode,
  places,
  target,
  lastTarget,
  lastResult,
  onGuess,
  onIdentify,
  toleranceKm,
}: MapViewProps) {
  const center = useMemo<[number, number]>(() => MAP_CONFIG.DEFAULT_CENTER, []);
  const mapRef = useRef<LeafletMap | null>(null);

  // Use target (not lastTarget) for view management to ensure new questions trigger adjustment
  const viewTarget = mode === "guess-location" ? target : null;
  const identifyPlaces = mode === "identify-marker" ? places : [];

  return (
    <div className="h-[calc(100dvh-280px)] md:h-[75vh] w-full rounded-xl md:rounded-2xl overflow-hidden shadow">
      <MapContainer
        center={center}
        zoom={MAP_CONFIG.DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <MapClickHandler mode={mode} onGuess={onGuess} />
        <TargetViewManager
          target={viewTarget}
          places={identifyPlaces}
          mode={mode}
        />

        <TileLayer url={TILE_LAYER.URL} attribution={TILE_LAYER.ATTRIBUTION} />

        {/* Render markers for identify mode */}
        {mode === "identify-marker" &&
          places.map((p) => (
            <IdentifyMarker key={p.id} place={p} onIdentify={onIdentify} />
          ))}

        {/* Render answer marker for guess mode */}
        {mode === "guess-location" && lastResult && lastTarget && (
          <AnswerMarker place={lastTarget} toleranceKm={toleranceKm} />
        )}
      </MapContainer>
    </div>
  );
}
