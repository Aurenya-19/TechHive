import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, Flame, Zap, Clock, Trophy, Users, Brain, Shield, Code, Cpu, Gamepad2, Sparkles, Plus } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Arena, Challenge } from "@shared/schema";

const createChallengeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  xpReward: z.number().min(10, "XP must be at least 10"),
  timeLimit: z.number().optional(),
});

type CreateChallengeForm = z.infer<typeof createChallengeSchema>;

const arenaColors: Record<string, string> = {
  ai: "from-purple-500 to-pink-500",
  cyber: "from-green-500 to-emerald-500",
  web: "from-blue-500 to-cyan-500",
  "app-dev": "from-orange-500 to-amber-500",
  robotics: "from-red-500 to-rose-500",
  "game-dev": "from-indigo-500 to-violet-500",
  devops: "from-pink-500 to-orange-500",
};

const arenaIcons: Record<string, typeof Brain> = {
  ai: Brain,
  cyber: Shield,
  web: Code,
  "app-dev": Cpu,
  robotics: Cpu,
  "game-dev": Gamepad2,
  devops: Sparkles,
};

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
    <Card className="hover-elevate">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="font-display">{challenge.title}</CardTitle>
            <CardDescription className="mt-2">{challenge.description}</CardDescription>
          </div>
          <Badge variant="outline">{challenge.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {challenge.isDaily && (
            <Badge variant="secondary">
              <Flame className="mr-1 h-3 w-3" />
              Daily
            </Badge>
          )}
          {challenge.isWeekly && (
            <Badge variant="secondary">
              <Trophy className="mr-1 h-3 w-3" />
              Weekly
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-4 w-4 text-chart-4" />
            <span>{challenge.xpReward} XP</span>
          </div>
          {challenge.timeLimit && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{challenge.timeLimit}m</span>
            </div>
          )}
        </div>

        <Button className="w-full" asChild>
          <Link href={`/challenges/${challenge.id}`}>Start Challenge</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ArenaDetail() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const slug = location.split("/").pop();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<CreateChallengeForm>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "medium",
      xpReward: 100,
    },
  });

  const { data: arena, isLoading: arenaLoading } = useQuery<Arena>({
    queryKey: [`/api/arenas/${slug}`],
  });

  const { data: challenges, isLoading: challengesLoading } = useQuery<Challenge[]>({
    queryKey: [`/api/challenges?arenaId=${arena?.id || slug}`],
    enabled: !!arena?.id,
  });

  const createChallenge = useMutation({
    mutationFn: async (data: CreateChallengeForm) => {
      return apiRequest("POST", `/api/challenges`, {
        ...data,
        arenaId: arena?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/challenges?arenaId=${arena?.id || slug}`] });
      toast({
        title: "Challenge created!",
        description: "New challenge added to arena",
      });
      form.reset();
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create challenge",
        variant: "destructive",
      });
    },
  });

  if (arenaLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  if (!arena) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <h2 className="font-display text-2xl font-bold">Arena not found</h2>
        <p className="text-muted-foreground">The arena you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/arenas">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Arenas
          </Link>
        </Button>
      </div>
    );
  }

  const Icon = arenaIcons[arena.slug] || Sparkles;
  const colorClass = arenaColors[arena.slug] || arenaColors.ai;

  return (
    <div className="space-y-6 p-6">
      {/* Hero Section */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClass} p-8 text-white`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative">
          <Button variant="ghost" className="mb-6 text-white hover:bg-white/20" asChild>
            <Link href="/arenas">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Arenas
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Icon className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <h1 className="font-display text-4xl font-bold">{arena.name}</h1>
              <p className="mt-2 text-lg text-white/80">{arena.description}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{(arena.activeUsers || 0).toLocaleString()} Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <span>{arena.totalMissions} Missions</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span>Earn XP & Badges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Missions</p>
              <p className="mt-2 font-display text-3xl font-bold text-primary">{arena.totalMissions}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="mt-2 font-display text-3xl font-bold text-primary">{(arena.activeUsers || 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Your Progress</p>
              <div className="mt-3 space-y-2">
                <Progress value={35} className="h-2" />
                <p className="text-xs text-muted-foreground">7/20 Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenges Section */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Available Challenges</h2>
            <p className="mt-1 text-muted-foreground">Complete challenges to earn XP and climb the leaderboard</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Challenge</DialogTitle>
                <DialogDescription>Add a new challenge to {arena?.name}</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => createChallenge.mutate(data))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Challenge title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Challenge description..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="xpReward"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>XP Reward</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="100" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="timeLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Limit (minutes, optional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="30" {...field} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={createChallenge.isPending}>
                    {createChallenge.isPending ? "Creating..." : "Create Challenge"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {challengesLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : challenges && challenges.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No challenges available in this arena yet</p>
              <p className="text-sm text-muted-foreground">Check back soon!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Leaderboard Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-chart-4" />
            Arena Leaderboard
          </CardTitle>
          <CardDescription>Top performers in {arena.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="w-8 text-center">#{i}</Badge>
                  <div>
                    <p className="font-medium">Player {i}</p>
                    <p className="text-xs text-muted-foreground">{1000 + i * 250} XP</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold text-primary">Level {15 - i}</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-6 w-full" variant="outline" asChild>
            <Link href="/leaderboards">View Full Leaderboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
