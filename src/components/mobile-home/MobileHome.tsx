import { Header } from "./Header";
import { Stats } from "./Stats";
import { SearchFilter } from "./SearchFilter";
import { BusinessList } from "./BusinessList";
import { BottomNav } from "./BottomNav";

export function MobileHome() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <Stats />
        <SearchFilter />
        <BusinessList />
      </div>
      <BottomNav />
    </div>
  );
}
