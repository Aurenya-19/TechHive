import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Users, Calendar, Zap, Code, ArrowRight } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Competition {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  status: string;
  startDate: string;
  endDate: string;
  participantCount: number;
  prizePool: number;
  rules?: string;
  judgesCriteria?: string[];
  resources?: string[];
  minLevel: number;
  imageUrl?: string;
  tags?: string[];
}

export default function CompetitionDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: competition, isLoading } = useQuery<Competition>({
    queryKey: [`/api/competitions/${id}`],
  });

  const joinMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/competitions/${id}/join`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/competitions/${id}`] });
      toast({ title: "Joined!", description: "You have successfully joined this competition" });
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/competitions/${id}/submit`, {}),
    onSuccess: () => {
      navigate(`/competitions/${id}/leaderboard`);
      toast({ title: "Submitted!", description: "Your submission has been recorded" });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (!competition) {
    return <div className="p-6 text-center">Competition not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {competition.imageUrl && (
        <div className="h-64 overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50">
          <img src={competition.imageUrl} alt={competition.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">{competition.title}</h1>
          <Trophy className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-lg text-muted-foreground">{competition.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center space-y-2">
              <Users className="h-6 w-6 mx-auto" />
              <div className="text-2xl font-bold">{competition.participantCount}</div>
              <p className="text-sm text-muted-foreground">Participants</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-center space-y-2">
              <Zap className="h-6 w-6 mx-auto" />
              <div className="text-2xl font-bold">{competition.prizePool}</div>
              <p className="text-sm text-muted-foreground">Prize Pool XP</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-center space-y-2">
              <Calendar className="h-6 w-6 mx-auto" />
              <div className="text-2xl font-bold uppercase">{competition.difficulty}</div>
              <p className="text-sm text-muted-foreground">Difficulty</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-center space-y-2">
              <Code className="h-6 w-6 mx-auto" />
              <div className="text-2xl font-bold capitalize">{competition.type}</div>
              <p className="text-sm text-muted-foreground">Type</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Competition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Rules</h3>
            <p className="text-muted-foreground">{competition.rules || "No rules specified"}</p>
          </div>

          {competition.judgesCriteria && competition.judgesCriteria.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Judging Criteria</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {competition.judgesCriteria.map((criteria, i) => (
                  <li key={i}>{criteria}</li>
                ))}
              </ul>
            </div>
          )}

          {competition.resources && competition.resources.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Resources</h3>
              <ul className="space-y-1">
                {competition.resources.map((resource, i) => (
                  <li key={i}>
                    <a href={resource} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {resource}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button size="lg" onClick={() => joinMutation.mutate()} disabled={joinMutation.isPending}>
          {joinMutation.isPending ? "Joining..." : "Join Competition"}
        </Button>
        <Button size="lg" variant="outline" onClick={() => navigate(`/competitions/${id}/submit`)}>
          <Code className="mr-2 h-4 w-4" />
          Submit Solution
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline" onClick={() => navigate(`/competitions/${id}/leaderboard`)}>
          <Trophy className="mr-2 h-4 w-4" />
          View Leaderboard
        </Button>
      </div>
    </div>
  );
}
