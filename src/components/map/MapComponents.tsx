"use client";
import type { Place, Mode } from "@/types";
import type { LeafletMouseEvent } from "leaflet";
import { useMapEvents, useMap } from "react-leaflet";
import { useEffect } from "react";
import { MAP_CONFIG } from "@/lib/constants";

/**
 * Handles map click events for guessing
 */
export function MapClickHandler({
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

/**
 * Ensures the target location is always visible on the map
 */
export function TargetViewManager({
  target,
  places,
  mode,
}: {
  target: Place | null;
  places: Place[];
  mode: Mode;
}) {
  const map = useMap();

  useEffect(() => {
    if (!target || !map) return;

    // Wait for map to be ready
    const adjustView = () => {
      // In identify mode, make sure all markers are visible
      if (mode === "identify-marker" && places.length > 0) {
        const bounds = places.map((p) => [p.lat, p.lng] as [number, number]);
        map.fitBounds(bounds, {
          padding: MAP_CONFIG.PADDING_IDENTIFY,
          maxZoom: MAP_CONFIG.MAX_ZOOM_IDENTIFY,
        });
        return;
      }

      // In guess mode, ensure target is visible but don't reveal exact location
      if (mode === "guess-location") {
        try {
          const mapBounds = map.getBounds();
          const targetLatLng = { lat: target.lat, lng: target.lng };

          // Check if target is visible
          if (!mapBounds.contains(targetLatLng)) {
            // Calculate bounds that include both current center and target
            const currentCenter = map.getCenter();
            const bounds = [
              [currentCenter.lat, currentCenter.lng],
              [target.lat, target.lng],
            ] as [number, number][];

            // Ensure bounds stay within Middle East region
            const constrainedBounds = [
              [
                Math.max(
                  MAP_CONFIG.REGION_BOUNDS.south,
                  Math.min(bounds[0][0], bounds[1][0])
                ),
                Math.max(
                  MAP_CONFIG.REGION_BOUNDS.west,
                  Math.min(bounds[0][1], bounds[1][1])
                ),
              ],
              [
                Math.min(
                  MAP_CONFIG.REGION_BOUNDS.north,
                  Math.max(bounds[0][0], bounds[1][0])
                ),
                Math.min(
                  MAP_CONFIG.REGION_BOUNDS.east,
                  Math.max(bounds[0][1], bounds[1][1])
                ),
              ],
            ] as [number, number][];

            map.fitBounds(constrainedBounds, {
              padding: MAP_CONFIG.PADDING_GUESS,
              maxZoom: MAP_CONFIG.MAX_ZOOM_GUESS,
              animate: true,
              duration: MAP_CONFIG.ANIMATION_DURATION,
            });

            // Ensure we don't zoom out too much after fitting bounds
            setTimeout(() => {
              const currentZoom = map.getZoom();
              if (currentZoom < MAP_CONFIG.MIN_ZOOM) {
                map.setZoom(MAP_CONFIG.MIN_ZOOM, { animate: true });
              }
            }, MAP_CONFIG.ANIMATION_DURATION * 1000);
          }
        } catch {
          // Map might not be fully initialized yet, try again
          setTimeout(adjustView, 100);
        }
      }
    };

    // Small delay to ensure map is ready
    const timeoutId = setTimeout(adjustView, 50);

    return () => clearTimeout(timeoutId);
  }, [target, map, places, mode]);

  return null;
}
