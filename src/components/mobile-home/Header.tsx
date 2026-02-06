import { Download, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/lib/auth-actions";

export function Header({ session }: { session: Session | null }) {
  const username = session?.user?.username;
  // Format username: petugas1 -> ptg1
  const formattedUsername = username?.startsWith("petugas")
    ? username.replace("petugas", "ptg")
    : username;

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
                <span className="text-sm font-medium text-gray-700">
                  {formattedUsername}
                </span>
                <div className="relative">
                  <Avatar className="h-9 w-9 border-2 border-green-100">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      {formattedUsername
                        ? formattedUsername.substring(0, 2).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {session.user.role === "admin" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/download" className="cursor-pointer">
                      <Download className="mr-2 h-4 w-4" />
                      <span>Download Data</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
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
