import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
      <Button variant="ghost" size="icon" className="-ml-2">
        <Menu className="h-6 w-6 text-gray-700" />
      </Button>
      <div className="flex items-center gap-2">
        <Avatar className="h-9 w-9 border-2 border-green-100">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback className="bg-gray-200 text-gray-600">U</AvatarFallback>
        </Avatar>
        <div className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></div>
      </div>
    </header>
  );
}
