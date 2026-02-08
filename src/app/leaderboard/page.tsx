import { Medal, Search, Trophy } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LeaderboardPagination } from "./LeaderboardPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLeaderboardData } from "@/lib/leaderboard-actions";
import { cn } from "@/lib/utils";

export default async function LeaderboardPage(
  props: {
    searchParams: Promise<{
      page?: string;
      q?: string;
    }>;
  },
) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const query = searchParams.q || "";
  const pageSize = 10;

  const { users, totalPages, totalUsers } = await getLeaderboardData({
    page,
    limit: pageSize,
    query,
  });

  return (
    <div className="container max-w-lg mx-auto pb-20 p-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Leaderboard</h1>
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-center gap-2 text-yellow-700">
            <Trophy className="h-6 w-6 text-yellow-600" />
            Top Contributors
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-yellow-800/80 font-medium">
             Total Users: {totalUsers}
          </p>
        </CardContent>
      </Card>

      <div className="mb-6">
        <form className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            name="q"
            defaultValue={query}
            placeholder="Cari user..."
            className="pl-9 bg-white rounded-xl border-gray-200"
          />
        </form>
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
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  Tidak ada user ditemukan
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => {
                const rank = (page - 1) * pageSize + index + 1;
                const isTop1 = rank === 1;
                const isTop3 = rank <= 3;

                return (
                  <TableRow key={user.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium text-center">
                        <div className="flex justify-center">
                        {isTop1 ? (
                            <div className="relative">
                                <span className="font-bold text-yellow-600 text-lg">1</span>
                                <Medal className="h-4 w-4 text-yellow-500 absolute -top-3 -right-3 animate-bounce" />
                            </div>
                        ) : isTop3 ? (
                            <span
                              className={cn(
                                "font-bold text-lg",
                                rank === 2 ? "text-gray-400" : "text-amber-700"
                              )}
                            >
                              {rank}
                            </span>
                        ) : (
                            <span className="text-gray-500">{rank}</span>
                        )}
                        </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className={cn(
                            "h-8 w-8 border-2",
                            isTop1 ? "border-yellow-400" : "border-gray-100"
                        )}>
                          <AvatarImage src={`/placeholder-user.jpg`} />
                          <AvatarFallback className={cn(
                            "text-xs",
                            isTop1 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                          )}>
                             {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className={cn(
                                "font-medium text-sm",
                                isTop1 && "text-yellow-700 font-bold"
                            )}>
                                {user.username}
                            </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className={cn(
                        "font-bold",
                        isTop1 ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-gray-100 text-gray-700"
                      )}>
                        {user.points} pts
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 flex justify-center">
        <LeaderboardPagination
            page={page}
            totalPages={totalPages}
        />
      </div>
    </div>
  );
}
