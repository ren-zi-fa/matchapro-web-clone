import { auth } from "@/auth";
import { MobileHome } from "@/components/mobile-home/MobileHome";

export default async function Home() {
  const session = await auth();
  return (
    <main className="min-h-screen bg-gray-100 flex justify-center">
      {/* Mobile wrapper to simulate mobile view on desktop if opened there */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl">
        <MobileHome session={session} />
      </div>
    </main>
  );
}
