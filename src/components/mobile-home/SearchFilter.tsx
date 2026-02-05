import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchFilter() {
  return (
    <div className="px-4 py-3 space-y-4">
      <div className="flex gap-2 text-sm overflow-x-auto pb-2 scrollbar-hide">
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700 font-medium px-4 h-8"
        >
          ✓ Semua
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-full bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100 font-medium px-4 h-8"
        >
          Aktif
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-full bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100 font-medium px-4 h-8"
        >
          Nonaktif
        </Button>
      </div>

      <div className="relative">
        <Button 
          variant="outline" 
          className="w-full justify-between bg-white text-gray-700 font-medium border-gray-200 h-11 px-4 shadow-sm hover:bg-gray-50"
        >
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4 text-orange-500" />
            Pencarian & Filter
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </div>
    </div>
  );
}
