import { auth } from "@/auth";
import { HomePage } from "@/views/home/ui/HomePage";

export default async function Home() {
  const session = await auth();
  return (
    <main className="min-h-screen bg-gray-100 flex justify-center">
      {/* Mobile wrapper to simulate mobile view on desktop if opened there */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl">
        <HomePage session={session} />
      </div>
    </main>
  );
}
