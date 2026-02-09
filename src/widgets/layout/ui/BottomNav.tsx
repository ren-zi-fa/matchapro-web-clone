import { FileText, PlusCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function BottomNav({
  onAddClick,
  onViewResults,
}: {
  onAddClick?: () => void;
  onViewResults?: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 p-3 pb-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex gap-3 max-w-md mx-auto">
        <Button
          variant="outline"
          className="flex-1 h-12 rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50 flex flex-col items-center justify-center gap-1 shadow-sm"
          onClick={onViewResults}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-semibold leading-tight text-center">
              Lihat Hasil
              <br />
              Tambah Usaha
            </span>
          </div>
        </Button>
        <Button
          className="flex-1 h-12 rounded-lg bg-gray-900 hover:bg-gray-800 text-white flex flex-col items-center justify-center gap-1 shadow-sm"
         disabled
        >
          <div className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span className="text-xs font-semibold leading-tight text-center">
              Tambah   Usaha 
              <br />
            (fitur ini kami nonaktifkan)
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
}
