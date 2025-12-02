import { useQuery } from "@tanstack/react-query";
import { useErrorHandler } from "@/hooks/useErrorHandler";
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
  ArrowRight,
} from "lucide-react";
import type { Quest, Challenge, Arena, UserProfile } from "@shared/schema";

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
  color = "bg-primary" 
}: { 
  icon: typeof Flame; 
  label: string; 
  value: string | number;
  trend?: string;
  color?: string;
}) {
  return (
    <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover-elevate transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className={`rounded-lg p-2.5 ${color}/10`}>
            <Icon className={`h-5 w-5 ${color}/70`} />
          </div>
          {trend && (
            <Badge variant="outline" className="text-xs font-medium">
              <TrendingUp className="mr-1 h-3 w-3" />
              {trend}
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1.5 uppercase tracking-wide">{label}</p>
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
    <Card className={`border-border/50 hover-elevate transition-all ${isCompleted ? 'bg-gradient-to-r from-chart-5/5 to-chart-5/10' : 'bg-card/50'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0 ${isCompleted ? "bg-chart-5/20 text-chart-5" : "bg-accent/50 text-muted-foreground"}`}>
            <Target className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="font-medium text-sm truncate">{quest.title}</p>
              <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs flex-shrink-0">
                +{quest.xpReward}
              </Badge>
            </div>
            <div className="flex items-center gap-2.5">
              <Progress value={progressPercent} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground font-medium">{Math.round(progressPercent)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover-elevate transition-all group overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{challenge.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
              {challenge.description}
            </p>
          </div>
          <Badge variant="outline" className="text-xs flex-shrink-0 capitalize">
            {challenge.difficulty}
          </Badge>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <Zap className="h-3.5 w-3.5 text-chart-4" />
              {challenge.xpReward}
            </span>
            {challenge.timeLimit && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {challenge.timeLimit}m
              </span>
            )}
          </div>
          <Button size="sm" variant="ghost" className="h-7 px-2 group-hover:bg-primary/10" asChild>
            <Link href={`/challenges/${challenge.id}`}>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { handleErrorSilently } = useErrorHandler();
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const { data, isLoading, isError, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-80 lg:col-span-2" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="w-full max-w-md border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Unable to load dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = data?.stats || { streak: 0, challengesCompleted: 0, totalXp: 0, rank: 0 };
  const profile = data?.profile;
  const quests = data?.dailyQuests || [];
  const challenges = data?.dailyChallenges || [];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.firstName || "Developer"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Continue your learning journey and master new skills
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Level</p>
            <p className="text-2xl font-bold text-primary mt-0.5">
              {profile?.level || 1}
            </p>
          </div>
          <Avatar className="h-16 w-16 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
            <AvatarImage 
              src={user?.profileImageUrl ? `${user.profileImageUrl}?w=64&h=64&fit=crop` : undefined}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user?.firstName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Flame}
          label="Day Streak"
          value={stats.streak}
          trend={stats.streak > 0 ? "Active" : "Start today"}
          color="bg-chart-3"
        />
        <StatCard
          icon={Swords}
          label="Challenges"
          value={stats.challengesCompleted}
          trend={`+${Math.floor(Math.random() * 5)}`}
          color="bg-chart-1"
        />
        <StatCard
          icon={Zap}
          label="Total XP"
          value={stats.totalXp.toLocaleString()}
          trend={`${Math.floor(stats.totalXp / 100)}% level`}
          color="bg-chart-4"
        />
        <StatCard
          icon={Trophy}
          label="Rank"
          value={`#${stats.rank || 999}`}
          trend="Global"
          color="bg-chart-5"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quests & Challenges */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Quests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Daily Quests
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/quests">
                  View all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-2">
              {quests.slice(0, 3).map((quest) => (
                <QuestItem 
                  key={quest.id} 
                  quest={quest} 
                  progress={quest.progress} 
                  target={quest.target}
                  isCompleted={quest.isCompleted}
                />
              ))}
            </div>
          </div>

          {/* Recommended Challenges */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Recommended Challenges
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/arenas">
                  Explore
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {challenges.slice(0, 4).map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card/40">
            <CardHeader>
              <CardTitle className="text-base">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                <Link href="/courses">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Courses
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                <Link href="/competitions">
                  <Swords className="h-4 w-4 mr-2" />
                  Competitions
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                <Link href="/leaderboards">
                  <Trophy className="h-4 w-4 mr-2" />
                  Leaderboards
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                <Link href="/clans">
                  <Users className="h-4 w-4 mr-2" />
                  Communities
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-base">Progress</CardTitle>
              <CardDescription className="text-xs">This month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Challenges</p>
                  <p className="text-xs text-muted-foreground">{stats.challengesCompleted}/30</p>
                </div>
                <Progress value={(stats.challengesCompleted / 30) * 100} className="h-1.5" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">XP Gain</p>
                  <p className="text-xs text-muted-foreground">{Math.floor(stats.totalXp / 500)}/{Math.floor(stats.totalXp / 500) + 1}</p>
                </div>
                <Progress value={(stats.totalXp % 500) / 5} className="h-1.5" />
              </div>
              <Button className="w-full mt-2 h-8 text-sm" asChild>
                <Link href="/analytics">
                  View report
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
