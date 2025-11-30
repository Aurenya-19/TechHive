import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ExternalLink, Zap, BookOpen, Code, Award, ChevronRight, Info } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Resource {
  title: string;
  url: string;
  type: string;
}

interface TechResource {
  name: string;
  difficulty: string;
  popularity: string;
  resources: Resource[];
}

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  
  const { data: techData, isLoading } = useQuery({
    queryKey: ["/api/tech-resources", page],
    queryFn: async () => {
      const response = await fetch(`/api/tech-resources?page=${page}&limit=10`);
      return response.json();
    },
  });

  const resources: Record<string, TechResource> = techData?.resources || {};
  const filtered = Object.entries(resources).filter(([_, tech]) =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "expert":
        return "bg-red-500/20 text-red-700 dark:text-red-400";
      case "hard":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-400";
      default:
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "framework":
      case "tool":
      case "project":
        return <Code className="h-4 w-4" />;
      case "course":
      case "book":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Niche Tech Resources</h1>
        <p className="mt-1 text-muted-foreground">
          Learning paths for rare technologies - only {filtered.length} people specialize in these
        </p>
      </div>

      <Alert className="bg-blue-500/10 border-blue-500/20">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-sm text-blue-900 dark:text-blue-200">
          CodeVerse curates links to publicly available learning resources hosted by original creators. We do not host or redistribute any copyrighted content.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <Input
          placeholder="Search technologies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-resources"
        />
      </div>

      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map(([key, tech]) => (
            <Card key={key} className="hover-elevate overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{tech.name}</CardTitle>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge className={getDifficultyColor(tech.difficulty)}>
                        {tech.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {tech.popularity}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {tech.resources.map((resource, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getResourceIcon(resource.type)}
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{resource.title}</p>
                          <p className="text-xs text-muted-foreground">{resource.type}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="shrink-0"
                        data-testid={`button-resource-${key}-${idx}`}
                      >
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                <Button asChild variant="outline" className="w-full mt-2" data-testid={`button-explore-${key}`}>
                  <Link href={`/resources/${key}`}>
                    View Full Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Zap className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No technologies found</p>
              <p className="text-sm text-muted-foreground">
                Try a different search term
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="bg-accent/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            Master the Rare Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Only {techData?.raretechCount || 0} rare technologies are actively taught here. Specializing in any of these will make you stand out in the tech industry. Start learning and climb the specialized leaderboards!
          </p>
          <Button data-testid="button-start-learning">Start Your Journey</Button>
        </CardContent>
      </Card>
    </div>
  );
}
