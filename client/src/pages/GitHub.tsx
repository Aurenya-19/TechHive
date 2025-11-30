import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Github, Star, GitBranch, Eye, Search } from "lucide-react";
import { useState } from "react";

interface Repository {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  language: string;
  url: string;
  trending: string;
}

export default function GitHub() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data, isLoading } = useQuery({
    queryKey: ["/api/trending/github"],
  });

  const repositories: Repository[] = data?.trending || [
    {
      id: "1",
      name: "NextJS",
      description: "React framework for production",
      stars: 15000,
      forks: 3200,
      watchers: 800,
      language: "TypeScript",
      url: "https://github.com/vercel/next.js",
      trending: "+2500"
    },
    {
      id: "2",
      name: "React 19",
      description: "A JavaScript library for building user interfaces",
      stars: 12000,
      forks: 2800,
      watchers: 750,
      language: "JavaScript",
      url: "https://github.com/facebook/react",
      trending: "+3000"
    },
    {
      id: "3",
      name: "Deno",
      description: "A modern runtime for JavaScript and TypeScript",
      stars: 8000,
      forks: 1500,
      watchers: 600,
      language: "Rust",
      url: "https://github.com/denoland/deno",
      trending: "+1500"
    },
  ];

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Github className="h-8 w-8" />
          GitHub Hub
        </h1>
        <p className="text-muted-foreground mt-2">Connect with trending repositories and collaborate on open source</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-github-search"
          />
        </div>
        <Button className="gap-2" data-testid="button-connect-github">
          <Github className="h-4 w-4" />
          Connect GitHub
        </Button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">Loading repositories...</p>
        ) : filteredRepos.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No repositories found</p>
        ) : (
          filteredRepos.map((repo) => (
            <Card key={repo.id} className="hover-elevate">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Github className="h-5 w-5" />
                      {repo.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>
                  </div>
                  {repo.trending && (
                    <Badge variant="secondary" className="ml-2">
                      {repo.trending} this week
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="h-3 w-3" /> Stars
                    </p>
                    <p className="text-lg font-bold">{repo.stars.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <GitBranch className="h-3 w-3" /> Forks
                    </p>
                    <p className="text-lg font-bold">{repo.forks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" /> Watches
                    </p>
                    <p className="text-lg font-bold">{repo.watchers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Language</p>
                    <p className="text-lg font-bold">{repo.language}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(repo.url, "_blank")}
                  data-testid={`button-visit-${repo.name.toLowerCase()}`}
                >
                  Visit Repository
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="bg-accent/50">
        <CardHeader>
          <CardTitle className="text-lg">Pro Tip: Earn XP with GitHub</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Connect your GitHub account to earn XP for contributions, get personalized project recommendations, and collaborate with TechHive community members on trending repositories.
          </p>
          <Button data-testid="button-github-integration">
            Set Up GitHub Integration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
