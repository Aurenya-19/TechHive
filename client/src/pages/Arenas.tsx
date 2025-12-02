import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Shield,
  Code,
  Cpu,
  Gamepad2,
  Sparkles,
  Users,
  Trophy,
  ChevronRight,
  Flame,
  Clock,
  Zap,
  Star,
} from "lucide-react";
import type { Arena, Challenge } from "@shared/schema";
// Arena images now loaded from database (Unsplash free images)
const arenaImages: Record<string, string> = {};

const arenaColors: Record<string, string> = {
  ai: "from-purple-500 to-pink-500",
  cyber: "from-green-500 to-emerald-500",
  web: "from-blue-500 to-cyan-500",
  "app-dev": "from-orange-500 to-amber-500",
  robotics: "from-red-500 to-rose-500",
  "game-dev": "from-indigo-500 to-violet-500",
};

const arenaIcons: Record<string, typeof Brain> = {
  ai: Brain,
  cyber: Shield,
  web: Code,
  "app-dev": Cpu,
  robotics: Cpu,
  "game-dev": Gamepad2,
};

const arenaDescriptions: Record<string, string> = {
  ai: "Master machine learning, neural networks, and AI model development",
  cyber: "Learn ethical hacking, network security, and cryptography",
  web: "Build modern websites and web applications with latest technologies",
  "app-dev": "Create mobile and desktop applications",
  robotics: "Program robots and learn automation systems",
  "game-dev": "Design and build games using Unity, Unreal, and more",
};

function ArenaHeroCard({ arena }: { arena: Arena }) {
  const Icon = arenaIcons[arena.slug] || Sparkles;
  const colorClass = arenaColors[arena.slug] || arenaColors.ai;
  const description = arenaDescriptions[arena.slug] || arena.description;
  const backgroundImage = (arena as any).imageUrl || arenaImages[arena.slug];

  return (
    <Link href={`/arenas/${arena.slug}`}>
      <Card className="group cursor-pointer overflow-hidden hover-elevate border-primary/20 shadow-lg transition-all duration-300">
        <div className={`relative h-56 bg-gradient-to-br ${colorClass}`} style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/30 text-white backdrop-blur-md border border-white/20 font-semibold">
              <Users className="mr-2 h-4 w-4" />
              {(arena.activeUsers || 0).toLocaleString()} active
            </Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-white drop-shadow-lg">{arena.name}</h3>
                <p className="mt-1 text-sm text-white/90 drop-shadow">{arena.totalMissions} missions • {(arena.difficulty || "Beginner").split("-").join(" ")}</p>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-gradient-to-b from-transparent to-background/20">
          <p className="text-muted-foreground leading-relaxed">{description}</p>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-chart-4/20 text-chart-4 font-medium">
                <Trophy className="h-4 w-4" />
                Leaderboard
              </span>
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-chart-3/20 text-chart-3 font-medium">
                <Flame className="h-4 w-4" />
                Daily
              </span>
            </div>
            <Button variant="default" size="sm" className="gap-1 group-hover:gap-2 transition-all shadow-lg">
              Enter Arena
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ChallengeRow({ challenge }: { challenge: Challenge }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-primary/10 bg-gradient-to-r from-card to-card/50 p-5 hover-elevate shadow-sm transition-all">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-chart-4" />
          <h4 className="font-semibold text-foreground">{challenge.title}</h4>
          <Badge variant="outline" className="text-xs">
            {challenge.difficulty}
          </Badge>
          {challenge.isDaily && (
            <Badge variant="secondary" className="text-xs">
              <Flame className="mr-1 h-3 w-3" />
              Daily
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{challenge.description}</p>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Zap className="h-4 w-4 text-chart-4" />
          {challenge.xpReward}
        </span>
        {challenge.timeLimit && (
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {challenge.timeLimit}m
          </span>
        )}
      </div>
      <Button size="sm" asChild>
        <Link href={`/challenges/${challenge.id}`}>Start</Link>
      </Button>
    </div>
  );
}

export default function Arenas() {
  const { data: arenas, isLoading: arenasLoading, isError: arenasError, error: arenasErrorMsg } = useQuery<Arena[]>({
    queryKey: ["/api/arenas"],
  });

  const { data: challenges, isLoading: challengesLoading, isError: challengesError } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
  });

  const dailyChallenges = challenges?.filter((c) => c.isDaily) || [];
  const weeklyChallenges = challenges?.filter((c) => c.isWeekly) || [];

  if (arenasError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Failed to load arenas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {arenasErrorMsg instanceof Error ? arenasErrorMsg.message : "Unable to load skill arenas"}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (arenasLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Skill Arenas</h1>
        <p className="mt-1 text-muted-foreground">
          Choose your battlefield and conquer challenges to earn XP
        </p>
      </div>

      <Tabs defaultValue="arenas">
        <TabsList>
          <TabsTrigger value="arenas" data-testid="tab-arenas">All Arenas</TabsTrigger>
          <TabsTrigger value="daily" data-testid="tab-daily">Daily Challenges</TabsTrigger>
          <TabsTrigger value="weekly" data-testid="tab-weekly">Weekly Missions</TabsTrigger>
        </TabsList>

        <TabsContent value="arenas" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {arenas && arenas.length > 0 ? (
              arenas.map((arena) => <ArenaHeroCard key={arena.id} arena={arena} />)
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">Arenas are being prepared...</p>
                  <p className="text-sm text-muted-foreground">Check back soon for exciting challenges!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="daily" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-chart-3" />
                Daily Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dailyChallenges.length > 0 ? (
                dailyChallenges.map((challenge) => (
                  <ChallengeRow key={challenge.id} challenge={challenge} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Flame className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No daily challenges available</p>
                  <p className="text-sm text-muted-foreground">New challenges drop at midnight!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-chart-4" />
                Weekly Missions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weeklyChallenges.length > 0 ? (
                weeklyChallenges.map((challenge) => (
                  <ChallengeRow key={challenge.id} challenge={challenge} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Star className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No weekly missions available</p>
                  <p className="text-sm text-muted-foreground">New missions every Monday!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
