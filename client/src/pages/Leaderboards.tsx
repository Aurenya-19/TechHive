import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import {
  Trophy,
  Medal,
  Crown,
  Zap,
  TrendingUp,
  Users,
  Globe,
  Clock,
  Star,
} from "lucide-react";
import type { User, UserProfile } from "@shared/schema";
import { useState } from "react";

interface LeaderboardEntry {
  user: User;
  profile: UserProfile;
  score: number;
  rank: number;
}

function PodiumCard({ entry, position }: { entry: LeaderboardEntry; position: 1 | 2 | 3 }) {
  const heights = { 1: "h-32", 2: "h-24", 3: "h-20" };
  const colors = {
    1: "from-yellow-500/20 to-amber-500/20 border-yellow-500/50",
    2: "from-gray-400/20 to-slate-400/20 border-gray-400/50",
    3: "from-orange-600/20 to-amber-700/20 border-orange-600/50",
  };
  const iconColors = { 1: "text-yellow-500", 2: "text-gray-400", 3: "text-orange-600" };
  const Icon = position === 1 ? Crown : Medal;

  return (
    <div className={`flex flex-col items-center ${position !== 1 ? "mt-4" : ""}`}>
      <div className="relative mb-2">
        <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-offset-background ring-primary">
          <AvatarImage 
            src={entry.user.profileImageUrl ? `${entry.user.profileImageUrl}?w=64&h=64&fit=crop` : undefined}
            srcSet={entry.user.profileImageUrl ? `${entry.user.profileImageUrl}?w=64&h=64&fit=crop 1x, ${entry.user.profileImageUrl}?w=128&h=128&fit=crop 2x` : undefined}
            className="object-cover"
            loading="lazy"
            decoding="async"
          />
          <AvatarFallback className="text-lg font-bold">
            {entry.user.firstName?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <div className={`absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-lg ${iconColors[position]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="font-display font-semibold">{entry.user.firstName || "Anonymous"}</p>
      <p className="text-sm text-muted-foreground">{entry.profile.techTier}</p>
      <Card className={`mt-2 w-full border bg-gradient-to-b ${colors[position]} ${heights[position]} flex items-center justify-center`}>
        <div className="text-center">
          <p className="font-display text-2xl font-bold">{entry.score.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">XP</p>
        </div>
      </Card>
    </div>
  );
}

function LeaderboardRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded-lg p-4 ${
        isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover-elevate"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center">
        <span className={`font-display text-lg font-bold ${entry.rank <= 3 ? "text-chart-4" : "text-muted-foreground"}`}>
          #{entry.rank}
        </span>
      </div>
      <Avatar className="h-10 w-10">
        <AvatarImage 
          src={entry.user.profileImageUrl ? `${entry.user.profileImageUrl}?w=40&h=40&fit=crop` : undefined}
          srcSet={entry.user.profileImageUrl ? `${entry.user.profileImageUrl}?w=40&h=40&fit=crop 1x, ${entry.user.profileImageUrl}?w=80&h=80&fit=crop 2x` : undefined}
          className="object-cover"
          loading="lazy"
          decoding="async"
        />
        <AvatarFallback>
          {entry.user.firstName?.[0] || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{entry.user.firstName || "Anonymous"}</p>
          {isCurrentUser && (
            <Badge variant="secondary" className="text-xs">You</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{entry.profile.techTier}</p>
      </div>
      <div className="text-right">
        <p className="font-display font-bold">{entry.score.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">XP</p>
      </div>
    </div>
  );
}

const categories = [
  { value: "xp", label: "Total XP", icon: Zap },
  { value: "challenges", label: "Challenges", icon: Trophy },
  { value: "projects", label: "Projects", icon: Star },
  { value: "streak", label: "Streak", icon: Clock },
];

const periods = [
  { value: "all_time", label: "All Time" },
  { value: "monthly", label: "This Month" },
  { value: "weekly", label: "This Week" },
];

const arenas = [
  { value: "global", label: "Global Rankings" },
  // Mainstream Tech
  { value: "ai", label: "AI & Machine Learning" },
  { value: "web", label: "Web Development" },
  { value: "mobile", label: "Mobile Development" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "blockchain", label: "Blockchain & Web3" },
  { value: "devops", label: "DevOps & Cloud" },
  { value: "gamedev", label: "Game Development" },
  // Niche/Rare Tech (Few People Specialize)
  { value: "physics", label: "⚛️ Applied Physics" },
  { value: "maths", label: "∑ Advanced Mathematics" },
  { value: "quantum", label: "🔬 Quantum Computing" },
  { value: "fpga", label: "⚡ FPGA & Hardware Design" },
  { value: "biotech", label: "🧬 Biotech & Bioinformatics" },
  { value: "vrar", label: "🥽 AR/VR Development" },
  { value: "robotics", label: "🤖 Robotics & Automation" },
  { value: "iot", label: "📡 IoT & Embedded Systems" },
  { value: "distributed", label: "🔗 Distributed Systems" },
  { value: "lowlevel", label: "⚙️ Low-Level Systems Programming" },
  { value: "wasm", label: "⚡ WebAssembly & Rust" },
  { value: "formalverif", label: "✓ Formal Verification" },
  { value: "compiler", label: "🔧 Compiler Design" },
  { value: "hpc", label: "⚛️ High-Performance Computing" },
  { value: "hardware", label: "🛰️ Hardware Hacking" },
];

export default function Leaderboards() {
  const [arena, setArena] = useState("global");
  const [category, setCategory] = useState("xp");
  const [period, setPeriod] = useState("all_time");
  const { user } = useAuth();

  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard", arena, category, period],
  });

  const topThree = leaderboard?.slice(0, 3) || [];
  const rest = leaderboard?.slice(3) || [];
  const orderedPodium = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Leaderboards</h1>
            <p className="mt-1 text-muted-foreground">
              Compete with developers worldwide
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40" data-testid="select-leaderboard-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <cat.icon className="h-4 w-4" />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32" data-testid="select-leaderboard-period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periods.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
            <Globe className="h-4 w-4" />
            View Leaderboard By Arena
          </p>
          <Select value={arena} onValueChange={setArena}>
            <SelectTrigger className="w-full sm:w-64" data-testid="select-leaderboard-arena">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {arenas.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {topThree.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-4 px-4">
            {orderedPodium.map((entry, idx) => {
              const position = idx === 0 ? 2 : idx === 1 ? 1 : 3;
              return entry ? (
                <PodiumCard key={entry.user.id} entry={entry} position={position as 1 | 2 | 3} />
              ) : null;
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-chart-4" />
                Rankings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {rest.length > 0 ? (
                rest.map((entry) => (
                  <LeaderboardRow
                    key={entry.user.id}
                    entry={entry}
                    isCurrentUser={entry.user.id === user?.id}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  More developers joining soon!
                </p>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No leaderboard data yet</p>
            <p className="text-sm text-muted-foreground">
              Complete challenges to climb the ranks!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
