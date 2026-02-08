"use client";

import { Loader2, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";

// Dynamically import React Leaflet components to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const LayersControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.LayersControl),
  { ssr: false },
);
const BaseLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.LayersControl.BaseLayer),
  { ssr: false },
);

// We need to fix the default icon issue in Leaflet with Next.js/React
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Only run on client
if (typeof window !== "undefined") {
  // @ts-expect-error
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
}

// Map Updater Component to center map when coords change
const MapUpdater = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { useMap } = mod;
      return function MapUpdater({ center }: { center: [number, number] }) {
        const map = useMap();
        useEffect(() => {
          map.setView(center, map.getZoom());
        }, [center, map]);
        return null;
      };
    }),
  { ssr: false },
);

// Map Events Component for Click Handling
const MapEvents = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { useMapEvents } = mod;
      return function MapEvents({
        onClick,
      }: {
        onClick: (lat: number, lng: number) => void;
      }) {
        useMapEvents({
          click(e) {
            onClick(e.latlng.lat, e.latlng.lng);
          },
        });
        return null;
      };
    }),
  { ssr: false },
);

interface MapPickerProps {
  latitude?: string;
  longitude?: string;
  onLocationSelect: (lat: string, lng: string) => void;
}

export function MapPicker({
  latitude,
  longitude,
  onLocationSelect,
}: MapPickerProps) {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);

  // Initialize position from props if available
  useEffect(() => {
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const currentLat = position ? position[0] : null;
      const currentLng = position ? position[1] : null;

      // Only update if significantly different to prevent loop?
      // Or trust props are source of truth.
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        // Simple check to avoid loop if parent updates prop from child
        if (lat !== currentLat || lng !== currentLng) {
          setPosition([lat, lng]);
        }
      }
    }
  }, [latitude, longitude, position]); // Removing position from deps to avoid infinite loop if parent updates

  const handleGetLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const newPos: [number, number] = [lat, lng];
          setPosition(newPos);
          onLocationSelect(lat.toString(), lng.toString());
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert(
            `Gagal mengambil lokasi: ${error.message}. Pastikan GPS aktif.`,
          );
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        },
      );
    } else {
      alert("Geolocation tidak didukung oleh browser ini.");
      setLoading(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    const newPos: [number, number] = [lat, lng];
    setPosition(newPos);
    onLocationSelect(lat.toString(), lng.toString());
  };

  // biome-ignore lint/suspicious/noExplicitAny: Leaflet event type
  const handleMarkerDragEnd = (e: any) => {
    const marker = e.target;
    if (marker) {
      const { lat, lng } = marker.getLatLng();
      const newPos: [number, number] = [lat, lng];
      setPosition(newPos);
      onLocationSelect(lat.toString(), lng.toString());
    }
  };

  // Center: Default to coordinates of Pasaman Barat or similar if no pos
  // Pasaman Barat: 0.1568° N, 99.7899° E (Roughly)
  const defaultCenter: [number, number] = [0.1568, 99.7899];
  const center = position || defaultCenter;

  return (
    <div className="flex flex-col gap-3 w-full">
      <Button
        type="button"
        onClick={handleGetLocation}
        variant="secondary"
        className="w-full flex gap-2 items-center justify-center border border-gray-300"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
        Ambil Koordinat Saat Ini
      </Button>
      <span className="text-xs text-center text-gray-500">
        (Geser Icon Jika Tidak Akurat)
      </span>
      {/* Manual display of coords */}
      <div className="text-xs text-center text-gray-500">
        Lat: {latitude || "-"}, Long: {longitude || "-"}
      </div>

      <div className="h-[350px] w-full rounded-md overflow-hidden border border-gray-200 relative z-0">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <LayersControl position="topright">
            <BaseLayer checked name="OpenStreetMap">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            <BaseLayer name="Satelit (Esri)">
              <TileLayer
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </BaseLayer>
          </LayersControl>

          <MapEvents onClick={handleMapClick} />

          {position && (
            <>
              <Marker
                position={position}
                draggable={true}
                eventHandlers={{
                  dragend: handleMarkerDragEnd,
                }}
              >
                <Popup>Lokasi Terpilih (Geser untuk ubah)</Popup>
              </Marker>
              <MapUpdater center={position} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
