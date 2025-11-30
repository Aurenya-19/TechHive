import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Trophy,
  Swords,
  Clock,
  Users,
  Zap,
  Rocket,
  Target,
} from "lucide-react";
import type { Competition } from "@shared/schema";

function CompetitionCard({ competition }: { competition: Competition }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const joinCompetition = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/competitions/${competition.id}/join`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competitions"] });
      toast({
        title: "Competition joined!",
        description: `You've joined "${competition.name}"!`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join competition",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case "upcoming":
        return "bg-yellow-500/10 text-yellow-600";
      case "active":
        return "bg-green-500/10 text-green-600";
      case "completed":
        return "bg-blue-500/10 text-blue-600";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getDifficultyIcon = (difficulty: string | null | undefined) => {
    switch (difficulty) {
      case "beginner":
        return "⭐";
      case "intermediate":
        return "⭐⭐";
      case "advanced":
        return "⭐⭐⭐";
      default:
        return "⭐⭐";
    }
  };

  const startDate = competition.startDate ? new Date(competition.startDate) : null;
  const endDate = competition.endDate ? new Date(competition.endDate) : null;

  return (
    <Card className="hover-elevate">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {competition.type === "hackathon" ? (
                <Rocket className="h-5 w-5 text-chart-1" />
              ) : competition.type === "code-race" ? (
                <Swords className="h-5 w-5 text-chart-2" />
              ) : (
                <Trophy className="h-5 w-5 text-chart-3" />
              )}
              <h3 className="font-display text-lg font-semibold">{competition.name}</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{competition.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(competition.status)}>
            {competition.status}
          </Badge>
          <Badge variant="outline">
            {getDifficultyIcon(competition.difficulty)} {competition.difficulty}
          </Badge>
          {competition.type && (
            <Badge variant="secondary" className="capitalize">
              {competition.type}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground">Participants</span>
            <div className="flex items-center gap-1 font-semibold">
              <Users className="h-4 w-4" />
              {competition.participantCount || 0}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Prize Pool</span>
            <div className="flex items-center gap-1 font-semibold">
              <Zap className="h-4 w-4" />
              ${competition.prizePool || 0}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Deadline</span>
            <div className="text-xs font-semibold">
              {endDate ? endDate.toLocaleDateString() : "TBA"}
            </div>
          </div>
        </div>

        {competition.rules && (
          <div className="space-y-2 border-t pt-4">
            <p className="text-sm font-medium">Rules</p>
            <p className="text-xs text-muted-foreground line-clamp-3">{competition.rules}</p>
          </div>
        )}

        <Button
          onClick={() => joinCompetition.mutate()}
          disabled={joinCompetition.isPending || competition.status === "completed"}
          className="w-full"
          data-testid={`button-join-competition-${competition.id}`}
        >
          {joinCompetition.isPending ? "Joining..." : "Join Competition"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Competitions() {
  const { data: competitions, isLoading, isError, error: errorMsg } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Failed to load competitions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {errorMsg instanceof Error ? errorMsg.message : "Unable to load competitions"}
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  const upcomingCompetitions = competitions?.filter((c) => c.status === "upcoming") || [];
  const activeCompetitions = competitions?.filter((c) => c.status === "active") || [];
  const completedCompetitions = competitions?.filter((c) => c.status === "completed") || [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Competitions & Hackathons</h1>
        <p className="mt-1 text-muted-foreground">
          Compete with developers worldwide and earn prizes in specialized skill arenas
        </p>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active" data-testid="tab-competitions-active">
            <Swords className="mr-2 h-4 w-4" />
            Active ({activeCompetitions.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" data-testid="tab-competitions-upcoming">
            <Clock className="mr-2 h-4 w-4" />
            Upcoming ({upcomingCompetitions.length})
          </TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-competitions-completed">
            <Trophy className="mr-2 h-4 w-4" />
            Completed ({completedCompetitions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6 space-y-4">
          {activeCompetitions.length > 0 ? (
            activeCompetitions.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Swords className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No active competitions</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {upcomingCompetitions.length > 0 ? (
            upcomingCompetitions.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No upcoming competitions</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6 space-y-4">
          {completedCompetitions.length > 0 ? (
            completedCompetitions.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No completed competitions yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
