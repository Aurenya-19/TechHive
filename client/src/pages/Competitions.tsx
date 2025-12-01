import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { Trophy, Users, Calendar, Zap, Filter } from "lucide-react";

interface Competition {
  id: string;
  title: string;
  description?: string;
  type: string;
  difficulty: string;
  status: string;
  startDate: string;
  endDate: string;
  participantCount: number;
  prizePool: number;
  tags?: string[];
  imageUrl?: string;
}

export default function Competitions() {
  const [, navigate] = useLocation();
  const { data: competitions, isLoading } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  const upcoming = competitions?.filter(c => c.status === "upcoming") || [];
  const active = competitions?.filter(c => c.status === "active") || [];
  const ended = competitions?.filter(c => c.status === "ended") || [];

  const difficultyColor = {
    medium: "bg-blue-500/10 text-blue-500",
    hard: "bg-orange-500/10 text-orange-500",
    extreme: "bg-red-500/10 text-red-500",
  };

  const CompetitionCard = ({ comp }: { comp: Competition }) => (
    <Card className="hover-elevate cursor-pointer" onClick={() => navigate(`/competitions/${comp.id}`)}>
      {comp.imageUrl && (
        <div className="h-32 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <img src={comp.imageUrl} alt={comp.title} className="h-full w-full object-cover" />
        </div>
      )}
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold line-clamp-2">{comp.title}</h3>
            <Trophy className="h-4 w-4 text-yellow-500 shrink-0" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{comp.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className={`text-xs ${difficultyColor[comp.difficulty as keyof typeof difficultyColor]}`}>
              {comp.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">{comp.type}</Badge>
          </div>
          <div className="flex items-center justify-between pt-2 border-t text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              {comp.participantCount} joined
            </div>
            <div className="font-semibold text-yellow-600">{comp.prizePool} XP</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Competitions</h1>
        <p className="text-muted-foreground">Join competitions, solve challenges, and win amazing prizes</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="ended">Ended ({ended.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-72" />
              ))}
            </div>
          ) : active.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {active.map(comp => <CompetitionCard key={comp.id} comp={comp} />)}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No active competitions right now</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-72" />
              ))}
            </div>
          ) : upcoming.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map(comp => <CompetitionCard key={comp.id} comp={comp} />)}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No upcoming competitions</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ended" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-72" />
              ))}
            </div>
          ) : ended.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ended.map(comp => <CompetitionCard key={comp.id} comp={comp} />)}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No ended competitions</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
