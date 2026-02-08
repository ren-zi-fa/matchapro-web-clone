import LeaderboardPage from "@/views/leaderboard/ui/LeaderboardPage";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return <LeaderboardPage searchParams={searchParams} />;
}
