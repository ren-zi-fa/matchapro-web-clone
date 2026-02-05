
"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMap"), { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div> 
});

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: string;
  longitude: string;
  title?: string;
}

export function LocationModal({ isOpen, onClose, latitude, longitude, title = "Lokasi GC" }: LocationModalProps) {
  if (!isOpen) return null;

  let position: [number, number] | null = null;
  try {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
          position = [lat, lng];
      }
  } catch (e) {
      console.error("Invalid coordinates", e);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">
            <span className="bg-green-100 text-green-700 p-1 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
            </span>
            {title}
          </h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100" onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-0 h-[400px] w-full relative bg-gray-50">
             {position ? (
                  <LeafletMap position={position} scrollWheelZoom={true} />
             ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                    <X className="h-8 w-8 opacity-20" />
                    <p className="text-sm font-medium">Koordinat tidak valid</p>
                </div>
             )}
        </div>
        
        {/* Footer info */}
        <div className="p-3 bg-white border-t border-gray-100 text-xs text-gray-500 flex justify-between">
             <span>Lat: {latitude}</span>
             <span>Long: {longitude}</span>
        </div>
      </div>
    </div>
  );
}
