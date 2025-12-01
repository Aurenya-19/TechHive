import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  score: number;
  submissions: number;
  status: string;
}

export default function CompetitionLeaderboard() {
  const { id } = useParams<{ id: string }>();
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: [`/api/competitions/${id}/leaderboard`],
  });

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />;
    return null;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank against other competitors</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Scorers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : leaderboard && leaderboard.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">Rank</th>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-right">Score</th>
                    <th className="px-4 py-2 text-right">Submissions</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leaderboard.map((entry) => (
                    <tr key={entry.userId} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getMedalIcon(entry.rank)}
                          <span className="font-semibold"># {entry.rank}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{entry.userName}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-yellow-600">{entry.score}</span>
                      </td>
                      <td className="px-4 py-3 text-right">{entry.submissions}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize">{entry.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No submissions yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
