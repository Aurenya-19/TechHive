import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import {
  Flame,
  Target,
  Trophy,
  Zap,
  ChevronRight,
  Swords,
  BookOpen,
  Users,
  Star,
  Clock,
  TrendingUp,
  Award,
  Code,
  Brain,
  Shield,
  Cpu,
  Sparkles,
} from "lucide-react";
import type { Quest, Challenge, Arena, UserProfile } from "@shared/schema";

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
  "game-dev": Sparkles,
};

interface DashboardData {
  profile: UserProfile;
  dailyQuests: (Quest & { progress: number; target: number; isCompleted: boolean })[];
  dailyChallenges: Challenge[];
  recentActivity: { type: string; description: string; xp: number; timestamp: string }[];
  arenas: Arena[];
  stats: {
    streak: number;
    challengesCompleted: number;
    totalXp: number;
    rank: number;
  };
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend,
  color = "text-primary" 
}: { 
  icon: typeof Flame; 
  label: string; 
  value: string | number;
  trend?: string;
  color?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={`rounded-lg bg-accent p-2 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="mr-1 h-3 w-3" />
              {trend}
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <p className="font-display text-3xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuestItem({ 
  quest, 
  progress, 
  target, 
  isCompleted 
}: { 
  quest: Quest; 
  progress: number; 
  target: number;
  isCompleted: boolean;
}) {
  const progressPercent = (progress / target) * 100;
  
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isCompleted ? "bg-chart-5/20 text-chart-5" : "bg-accent text-muted-foreground"}`}>
        <Target className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium">{quest.title}</p>
          <Badge variant={isCompleted ? "default" : "secondary"}>
            +{quest.xpReward} XP
          </Badge>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Progress value={progressPercent} className="h-2 flex-1" />
          <span className="text-xs text-muted-foreground">
            {progress}/{target}
          </span>
        </div>
      </div>
    </div>
  );
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const colorClass = arenaColors[challenge.arenaId || "ai"] || arenaColors.ai;
  
  return (
    <Card className="overflow-hidden hover-elevate">
      <div className={`h-2 bg-gradient-to-r ${colorClass}`} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">{challenge.title}</p>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {challenge.description}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0">
            {challenge.difficulty}
          </Badge>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-chart-4" />
              {challenge.xpReward} XP
            </span>
            {challenge.timeLimit && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {challenge.timeLimit}m
              </span>
            )}
          </div>
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/challenges/${challenge.id}`}>
              Start
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ArenaCard({ arena }: { arena: Arena }) {
  const Icon = arenaIcons[arena.slug] || Brain;
  const colorClass = arenaColors[arena.slug] || arenaColors.ai;
  
  return (
    <Link href={`/arenas/${arena.slug}`}>
      <Card className="group overflow-hidden hover-elevate cursor-pointer">
        <div className={`relative h-32 bg-gradient-to-br ${colorClass}`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">{arena.name}</h3>
              <p className="text-sm text-white/80">{arena.totalMissions} missions</p>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              <Users className="mr-1 inline-block h-4 w-4" />
              {arena.activeUsers?.toLocaleString()} active
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const { data, isLoading, isError, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Failed to load dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Unable to load your dashboard data"}
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

  const stats = data?.stats || { streak: 0, challengesCompleted: 0, totalXp: 0, rank: 0 };
  const profile = data?.profile;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">
            {t("dashboard.welcomeBack")}, {user?.firstName || "Developer"}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t("dashboard.readyToLevel")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{t("dashboard.yourLevel")}</p>
            <p className="font-display text-2xl font-bold text-primary">
              {profile?.level || 1}
            </p>
          </div>
          <div className="relative">
            <Avatar className="h-14 w-14 ring-2 ring-primary ring-offset-2 ring-offset-background">
              <AvatarImage 
                src={user?.profileImageUrl ? `${user.profileImageUrl}?w=56&h=56&fit=crop` : undefined}
                srcSet={user?.profileImageUrl ? `${user.profileImageUrl}?w=56&h=56&fit=crop 1x, ${user.profileImageUrl}?w=112&h=112&fit=crop 2x` : undefined}
                className="object-cover"
                loading="lazy"
                decoding="async"
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {user?.firstName?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-chart-4 text-xs font-bold text-white">
              {profile?.level || 1}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Flame}
          label={t("dashboard.dayStreak")}
          value={stats.streak}
          trend="+2 this week"
          color="text-chart-3"
        />
        <StatCard
          icon={Swords}
          label={t("dashboard.challengesDone")}
          value={stats.challengesCompleted}
          trend="+5 today"
          color="text-chart-1"
        />
        <StatCard
          icon={Zap}
          label={t("dashboard.totalXp")}
          value={stats.totalXp.toLocaleString()}
          trend="+250 today"
          color="text-chart-4"
        />
        <StatCard
          icon={Trophy}
          label={t("dashboard.globalRank")}
          value={`#${stats.rank || "—"}`}
          trend="Top 5%"
          color="text-chart-2"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="font-display">{t("dashboard.dailyQuests")}</CardTitle>
                <CardDescription>{t("dashboard.completeQuests")}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/quests">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.dailyQuests && data.dailyQuests.length > 0 ? (
                data.dailyQuests.slice(0, 3).map((quest) => (
                  <QuestItem
                    key={quest.id}
                    quest={quest}
                    progress={quest.progress}
                    target={quest.target}
                    isCompleted={quest.isCompleted}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Target className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">No active quests</p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/quests">Browse Quests</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="font-display">{t("dashboard.todaysChallenges")}</CardTitle>
                <CardDescription>{t("dashboard.freshChallenges")}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/arenas">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {data?.dailyChallenges && data.dailyChallenges.length > 0 ? (
                data.dailyChallenges.slice(0, 4).map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center">
                  <Swords className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">No daily challenges yet</p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/arenas">Explore Arenas</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">{t("dashboard.yourProgress")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <svg className="h-32 w-32 -rotate-90 transform">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray={352}
                      strokeDashoffset={352 - (352 * (profile?.xp || 0) % 1000) / 1000}
                      strokeLinecap="round"
                      className="text-primary transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-3xl font-bold">{profile?.level || 1}</span>
                    <span className="text-xs text-muted-foreground">{t("dashboard.level")}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {1000 - ((profile?.xp || 0) % 1000)} {t("dashboard.xpToNextLevel")} {(profile?.level || 1) + 1}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {profile?.badges?.slice(0, 4).map((badge, i) => (
                    <Badge key={i} variant="secondary">
                      <Award className="mr-1 h-3 w-3" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-display">Skill Arenas</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/arenas">
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.arenas && data.arenas.length > 0 ? (
                data.arenas.slice(0, 3).map((arena) => (
                  <ArenaCard key={arena.id} arena={arena} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Swords className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">Arenas coming soon</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
