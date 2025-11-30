import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Award } from "lucide-react";

export default function TechWorld() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/world/1"],
    queryFn: async () => {
      const res = await fetch("/api/world/1/leaderboard");
      return res.json();
    },
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Interactive Tech World</h1>
        <p className="text-muted-foreground">Explore zones and battle AI</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Frontend Island
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Master React, Vue, Angular</p>
            <Button size="sm" className="mt-4 w-full">Explore Zone</Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" /> Backend Mountain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Node, Python, Go</p>
            <Button size="sm" className="mt-4 w-full">Explore Zone</Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> DevOps Desert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Kubernetes, Docker, Cloud</p>
            <Button size="sm" className="mt-4 w-full">Explore Zone</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>World Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Loading...</p> : (
            <div className="space-y-2">
              {data?.map((user: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-accent rounded">
                  <span>{user.user}</span>
                  <Badge>{user.exploration}%</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
