
"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import dynamic from "next/dynamic";

const MapPicker = dynamic(
  () => import("@/components/ui/MapPicker").then((mod) => mod.MapPicker),
  { 
    ssr: false,
    loading: () => <div className="h-[200px] w-full bg-gray-100 flex items-center justify-center text-gray-400">Loading Map...</div>
  }
);


interface TandaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; // Business Data
  onSuccess: () => void;
}

export function TandaiModal({ isOpen, onClose, data, onSuccess }: TandaiModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    idsbr: "",
    nama_usaha: "",
    alamat_usaha: "",
    kdprov: "",
    kdkab: "",
    gc_status: "",
    latitude: "",
    longitude: "",
  });

  const [position, setPosition] = useState<[number, number] | null>(null);

  // Permission state monitoring
  const [permissionState, setPermissionState] = useState<PermissionState | 'unknown'>('unknown');
  
  // Field Edit States
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isAddressEditable, setIsAddressEditable] = useState(false);

  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
       navigator.permissions.query({ name: 'geolocation' as any }).then((result) => {
          setPermissionState(result.state);
          result.onchange = () => {
             setPermissionState(result.state);
          };
       }).catch(() => {
          setPermissionState('unknown');
       });
    }
  }, []);



  // Determine if we have existing valid coordinates (either from GC or seed)
  const hasExistingCoordinates = !!((data.gcData?.latitude && data.gcData?.longitude) || 
                                   (data.initialLatitude && data.initialLongitude));

  useEffect(() => {
    if (isOpen) {
      // Initialize form
      setFormData({
        idsbr: data.details?.idsbr || "",
        nama_usaha: data.name || "",
        alamat_usaha: data.address || "",
        kdprov: data.details?.kdprov || "",
        kdkab: data.details?.kdkab || "",
        gc_status: data.isGC ? "Ada" : "",
        // Prioritize GC data, then initial seed data
        latitude: data.gcData?.latitude || data.initialLatitude || "",
        longitude: data.gcData?.longitude || data.initialLongitude || "",
      });
      
      // Determine initial map position
      const latStr = data.gcData?.latitude || data.initialLatitude;
      const lngStr = data.gcData?.longitude || data.initialLongitude;
      
      if (latStr && lngStr) {
         try {
             const lat = parseFloat(latStr);
             const lng = parseFloat(lngStr);
             if (!isNaN(lat) && !isNaN(lng)) {
                 setPosition([lat, lng]);
             }
         } catch(e) {}
      }
    }
  }, [isOpen, data]);


  const handleSubmit = async () => {
    if (!formData.gc_status) {
        toast.error("Pilih keberadaan usaha terlebih dahulu!");
        return;
    }

    setSubmitting(true);
    try {
        const res = await fetch(`/api/businesses/${formData.idsbr}/mark`,{
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                gc_status: formData.gc_status,
                nama_usaha: formData.nama_usaha,
                alamat_usaha: formData.alamat_usaha,
                latitude: formData.latitude,
                longitude: formData.longitude
            })
        });

        if(!res.ok) throw new Error("Failed to update");
        
        toast.success("Berhasil Menandai Usaha!");
        onSuccess();
        onClose();
    } catch (e) {
        console.error(e);
        toast.error("Terjadi kesalahan saat menyimpan data.");
    } finally {
        setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
    {/* Permission Instruction Modal Removed - Using MapPicker's internal handling handled by user interaction */}
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-0">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
            Tandai Usaha Sudah Dicek!
          </h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-5 overflow-y-auto custom-scrollbar">
            
            {/* Status Dropdown */}
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase">Keberadaan Usaha Hasil GC</label>
                <Select
                    value={formData.gc_status}
                    onValueChange={(val) => setFormData({...formData, gc_status: val})}
                >
                    <SelectTrigger className="h-11 bg-white border-gray-200 shadow-sm focus:ring-orange-500">
                        <SelectValue placeholder="-- Pilih --" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Tidak Ditemukan">Tidak Ditemukan</SelectItem>
                        <SelectItem value="Tutup">Tutup</SelectItem>
                        <SelectItem value="Duplikat">Duplikat</SelectItem>
                    
                    </SelectContent>
                </Select>
            </div>

            {/* Nama Usaha */}
            <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                     <label className="text-xs font-semibold text-gray-500 uppercase">Nama Usaha</label>
                     <div className="flex items-center gap-2">
                        <div 
                             className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors"
                             onClick={() => setIsNameEditable(!isNameEditable)}
                        >
                             <div className={cn(
                                "w-8 h-4 rounded-full relative transition-colors duration-200",
                                isNameEditable ? "bg-orange-500" : "bg-gray-200"
                             )}>
                                 <div className={cn(
                                    "absolute top-0.5 bg-white w-3 h-3 rounded-full shadow-sm transition-all duration-200",
                                    isNameEditable ? "left-4.5 translate-x-3.5" : "left-0.5"
                                 )}></div>
                             </div>
                             <span className={cn(
                                "text-[10px] font-medium transition-colors",
                                isNameEditable ? "text-orange-600" : "text-gray-400"
                             )}>
                                {isNameEditable ? "Edit" : "Edit"}
                             </span>
                        </div>
                     </div>
                </div>
                <Input 
                    value={formData.nama_usaha} 
                    readOnly={!isNameEditable}
                    onChange={(e) => setFormData({...formData, nama_usaha: e.target.value})}
                    className={cn(
                        "transition-all duration-200",
                        isNameEditable 
                            ? "bg-white border-orange-200 focus:ring-orange-500 text-gray-900 shadow-sm"
                            : "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed text-sm"
                    )}
                />
            </div>

            {/* Alamat Usaha */}
             <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                     <label className="text-xs font-semibold text-gray-500 uppercase">Alamat Usaha</label>
                     <div className="flex items-center gap-2">
                         <div 
                             className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors"
                             onClick={() => setIsAddressEditable(!isAddressEditable)}
                         >
                             <div className={cn(
                                "w-8 h-4 rounded-full relative transition-colors duration-200",
                                isAddressEditable ? "bg-orange-500" : "bg-gray-200"
                             )}>
                                 <div className={cn(
                                    "absolute top-0.5 bg-white w-3 h-3 rounded-full shadow-sm transition-all duration-200",
                                    isAddressEditable ? "left-4.5 translate-x-3.5" : "left-0.5"
                                 )}></div>
                             </div>
                             <span className={cn(
                                "text-[10px] font-medium transition-colors",
                                isAddressEditable ? "text-orange-600" : "text-gray-400"
                             )}>
                                {isAddressEditable ? "Edit" : "Edit"}
                             </span>
                         </div>
                     </div>
                </div>
                <div className="relative">
                    <Input 
                        value={formData.alamat_usaha} 
                        readOnly={!isAddressEditable}
                        onChange={(e) => setFormData({...formData, alamat_usaha: e.target.value})}
                        className={cn(
                            "pr-8 transition-all duration-200",
                             isAddressEditable 
                            ? "bg-white border-orange-200 focus:ring-orange-500 text-gray-900 shadow-sm"
                            : "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed text-sm"
                        )}
                    />
                </div>
            </div>

            {/* Location Section */}
             <div className="space-y-3 pt-2">
                <div className="flex justify-between items-end">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Lokasi Usaha</label>
                </div>

                {/* MapPicker handles Geolocation, Drag, and Tile Layers */}
                <MapPicker 
                    latitude={formData.latitude} 
                    longitude={formData.longitude} 
                    onLocationSelect={(lat, lng) => {
                        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
                    }} 
                />

                <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-medium">Latitude</label>
                        <Input 
                            value={formData.latitude} 
                            onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                            placeholder="-0.xxxx" 
                            className="bg-white text-xs h-9 border-gray-200 focus:ring-orange-500"
                        />
                    </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-medium">Longitude</label>
                        <Input 
                            value={formData.longitude} 
                            onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                            placeholder="99.xxxx" 
                            className="bg-white text-xs h-9 border-gray-200 focus:ring-orange-500"
                        />
                    </div>
                </div>
                <p className="text-[10px] text-gray-400 text-center">
                    *Anda dapat mengisi koordinat secara manual atau geser pin pada peta.
                </p>
             </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2 z-10 sticky bottom-0">
             <Button 
                onClick={handleSubmit} 
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 shadow-blue-200 shadow-md rounded-xl"
             >
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {!submitting && <Save className="h-4 w-4 mr-2" />}
                TANDAI USAHA SUDAH DICEK!
             </Button>
             <Button 
                variant="ghost" 
                onClick={onClose}
                className="w-full h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
            >
                Batal
            </Button>
        </div>

      </div>
    </div>
    </>
  );
}
