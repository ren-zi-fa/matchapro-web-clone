import {
  ClipboardList,
  Download,
  LogOut,
  MapPin,
  Medal,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Session } from "next-auth";
import useSWR from "swr";
import { signOutAction } from "@/features/auth/model/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function Header({ session }: { session: Session | null }) {
  const username = session?.user?.username;

  const { data: pointsData } = useSWR(
    session ? "/api/user/points" : null,
    (url: string) => fetch(url).then((res) => res.json()),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const displayPoints = pointsData?.points ?? session?.user?.points ?? 0;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Logo BPS"
          width={40}
          height={40}
          className="object-contain"
          priority
        />
        <span className="text-xl font-bold text-green-600 tracking-tight">
          BPS Pasbar
        </span>
      </div>
      <div className="flex items-center gap-2">
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded-full border border-yellow-200">
                  <Medal className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs font-bold text-yellow-700">
                    {displayPoints} points
                  </span>
                </div>
                <div className="relative">
                  <Avatar className="h-9 w-9 border-2 border-green-100">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      {username ? username.substring(0, 2).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {session.user.role === "admin" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/download" className="cursor-pointer">
                      <Download className="mr-2 h-4 w-4" />
                      <span>Download Data</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin/new-businesses"
                      className="cursor-pointer"
                    >
                      <ClipboardList className="mr-2 h-4 w-4" />
                      <span>
                        Usaha Yang <br /> Ditambahkan{" "}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <Link
                  href="/leaderboard"
                  className="cursor-pointer text-yellow-600"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>Leaderboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/user/marked-locations"
                  className="cursor-pointer text-blue-600"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>Lokasi yang Ditandai</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={async () => {
                  await signOutAction();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
