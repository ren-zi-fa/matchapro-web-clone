import { Hammer, Construction } from "lucide-react";
import React from "react";

interface MobileUnderConstructionProps {
  title?: string;
  message?: string;
  estimatedTime?: string;
}

export function MobileUnderConstruction({
  title = "Dalam Perbaikan",
  message = "Halaman ini sedang dalam perbaikan untuk memberikan pengalaman yang lebih baik. Silakan kembali lagi nanti.",
  estimatedTime,
}: MobileUnderConstructionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-yellow-100 rounded-full animate-ping opacity-75" />
        <div className="relative bg-yellow-100 p-4 rounded-full">
          <Construction className="w-12 h-12 text-yellow-600" />
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h2>
      
      <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto mb-6">
        {message}
      </p>

      {estimatedTime && (
        <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100 flex items-center gap-3">
          <Hammer className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">
            Estimasi selesai: <span className="text-gray-900">{estimatedTime}</span>
          </span>
        </div>
      )}
    </div>
  );
}
