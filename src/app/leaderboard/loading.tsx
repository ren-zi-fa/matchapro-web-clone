import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Loading() {
  return (
    <div className="container max-w-lg mx-auto pb-20 p-4">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-48" />
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
            <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>

      <div className="mb-6">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[50px] text-center">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-gray-50/50">
                <TableCell className="text-center">
                   <div className="flex justify-center">
                     <Skeleton className="h-6 w-6 rounded" />
                   </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                   <div className="flex justify-end">
                      <Skeleton className="h-5 w-16 rounded-full" />
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
       <div className="mt-6 flex justify-center">
         <Skeleton className="h-10 w-64 rounded-md" />
      </div>
    </div>
  );
}
