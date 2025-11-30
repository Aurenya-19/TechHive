import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Target,
  CheckCircle2,
  Clock,
  Zap,
  Flame,
  Star,
  Calendar,
  Trophy,
  Sparkles,
  Plus,
} from "lucide-react";
import type { Quest, UserQuest } from "@shared/schema";

const createQuestSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["daily", "weekly", "monthly"]),
  xpReward: z.number().min(10, "XP must be at least 10"),
  difficulty: z.string().optional(),
});

type CreateQuestForm = z.infer<typeof createQuestSchema>;

function QuestCard({
  quest,
  userQuest,
}: {
  quest: Quest;
  userQuest?: UserQuest & { quest: Quest };
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const progress = userQuest?.progress || 0;
  const target = userQuest?.target || (quest.requirement as any)?.count || 1;
  const isCompleted = userQuest?.isCompleted || false;
  const isStarted = !!userQuest;
  const progressPercent = (progress / target) * 100;

  const startQuest = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/quests/${quest.id}/start`, { target });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/quests"] });
      toast({
        title: "Quest started!",
        description: `Good luck with "${quest.title}"!`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start quest.",
        variant: "destructive",
      });
    },
  });

  const getQuestIcon = () => {
    switch (quest.type) {
      case "daily":
        return <Flame className="h-5 w-5 text-chart-3" />;
      case "weekly":
        return <Star className="h-5 w-5 text-chart-4" />;
      case "monthly":
        return <Trophy className="h-5 w-5 text-chart-1" />;
      default:
        return <Target className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card className={`hover-elevate ${isCompleted ? "border-chart-5/50" : ""}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            isCompleted ? "bg-chart-5/20" : "bg-accent"
          }`}>
            {isCompleted ? (
              <CheckCircle2 className="h-6 w-6 text-chart-5" />
            ) : (
              getQuestIcon()
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-semibold">{quest.title}</h3>
              <Badge
                variant={
                  quest.type === "daily"
                    ? "default"
                    : quest.type === "weekly"
                    ? "secondary"
                    : "outline"
                }
                className="text-xs capitalize"
              >
                {quest.type}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{quest.description}</p>

            {isStarted && !isCompleted && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {progress}/{target}
                  </span>
                </div>
                <Progress value={progressPercent} className="mt-2 h-2" />
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <Badge variant="secondary" className="text-chart-4">
                <Zap className="mr-1 h-3 w-3" />
                +{quest.xpReward} XP
              </Badge>
              {!isStarted ? (
                <Button
                  size="sm"
                  onClick={() => startQuest.mutate()}
                  disabled={startQuest.isPending}
                  data-testid={`button-start-quest-${quest.id}`}
                >
                  {startQuest.isPending ? "Starting..." : "Start Quest"}
                </Button>
              ) : isCompleted ? (
                <Badge variant="outline" className="text-chart-5">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Completed
                </Badge>
              ) : (
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3" />
                  In Progress
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Quests() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<CreateQuestForm>({
    resolver: zodResolver(createQuestSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "daily",
      xpReward: 100,
    },
  });

  const { data: quests, isLoading: questsLoading } = useQuery<Quest[]>({
    queryKey: ["/api/quests"],
  });

  const { data: userQuests } = useQuery<(UserQuest & { quest: Quest })[]>({
    queryKey: ["/api/user/quests"],
  });

  const createQuest = useMutation({
    mutationFn: async (data: CreateQuestForm) => {
      return apiRequest("POST", `/api/quests`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quests"] });
      toast({
        title: "Quest created!",
        description: "New quest is now available",
      });
      form.reset();
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create quest",
        variant: "destructive",
      });
    },
  });

  const userQuestMap = new Map(
    userQuests?.map((uq) => [uq.questId, uq]) || []
  );

  const dailyQuests = quests?.filter((q) => q.type === "daily") || [];
  const weeklyQuests = quests?.filter((q) => q.type === "weekly") || [];
  const monthlyQuests = quests?.filter((q) => q.type === "monthly") || [];

  const completedToday = userQuests?.filter((uq) => uq.isCompleted && uq.quest.type === "daily").length || 0;
  const totalDaily = dailyQuests.length;

  if (questsLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-32 w-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Daily Quests</h1>
          <p className="mt-1 text-muted-foreground">
            Complete quests to earn XP and climb the leaderboard
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Quest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Quest</DialogTitle>
              <DialogDescription>Add a new quest for the community</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createQuest.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Quest title..." {...field} />
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
                        <Textarea placeholder="Quest description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
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
                <Button type="submit" className="w-full" disabled={createQuest.isPending}>
                  {createQuest.isPending ? "Creating..." : "Create Quest"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-chart-2/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Today's Progress</h3>
              <p className="text-sm text-muted-foreground">
                {completedToday} of {totalDaily} daily quests completed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <span className="font-display text-2xl font-bold text-primary">
                  {totalDaily > 0 ? Math.round((completedToday / totalDaily) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
          <Progress value={totalDaily > 0 ? (completedToday / totalDaily) * 100 : 0} className="mt-4 h-3" />
        </CardContent>
      </Card>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily" data-testid="tab-quests-daily">
            <Flame className="mr-2 h-4 w-4" />
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" data-testid="tab-quests-weekly">
            <Star className="mr-2 h-4 w-4" />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" data-testid="tab-quests-monthly">
            <Calendar className="mr-2 h-4 w-4" />
            Monthly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6 space-y-4">
          {dailyQuests.length > 0 ? (
            dailyQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                userQuest={userQuestMap.get(quest.id)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Flame className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No daily quests available</p>
                <p className="text-sm text-muted-foreground">Check back tomorrow!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="weekly" className="mt-6 space-y-4">
          {weeklyQuests.length > 0 ? (
            weeklyQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                userQuest={userQuestMap.get(quest.id)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Star className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No weekly quests available</p>
                <p className="text-sm text-muted-foreground">New quests every Monday!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monthly" className="mt-6 space-y-4">
          {monthlyQuests.length > 0 ? (
            monthlyQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                userQuest={userQuestMap.get(quest.id)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No monthly quests available</p>
                <p className="text-sm text-muted-foreground">Epic challenges coming soon!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
