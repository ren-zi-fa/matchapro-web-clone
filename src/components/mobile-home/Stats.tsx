import { LayoutGrid } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Stats() {
  return (
    <div className="px-4 pt-4">
      <Card className="bg-[#FFF8F0] border-none shadow-none">
        <CardContent className="flex items-start gap-4 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-400 text-white shadow-orange-200">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">Direktori Usaha</h2>
              <p className="text-xs text-gray-500 mt-1">51.536+ Usaha Terdaftar</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 font-medium border-0 px-2.5 py-0.5 text-[10px]">
                ● Aktif: 50.895
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 font-medium border-0 px-2.5 py-0.5 text-[10px]">
                ● Nonaktif: 641
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
