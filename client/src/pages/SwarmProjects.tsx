import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, GitBranch, Zap } from "lucide-react";

export default function SwarmProjects() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/swarm/leaderboard"],
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Swarm Projects</h1>
        <p className="text-muted-foreground">Global collaborative mega-projects with AI orchestration</p>
      </div>

      <Button size="lg" className="w-full">+ Create New Swarm Project</Button>

      <div className="grid gap-4">
        {isLoading ? (
          <p>Loading projects...</p>
        ) : (
          data?.leaderboard?.map((project: any, idx: number) => (
            <Card key={idx} className="hover-elevate">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      {project.projectName}
                    </CardTitle>
                  </div>
                  <Badge>Rank #{project.rank}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Contributors</p>
                    <p className="text-2xl font-bold flex items-center gap-1">
                      <Users className="h-4 w-4" /> {project.contributors}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Commits</p>
                    <p className="text-2xl font-bold flex items-center gap-1">
                      <GitBranch className="h-4 w-4" /> {project.commits}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quality</p>
                    <p className="text-2xl font-bold">{project.codeQuality}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
