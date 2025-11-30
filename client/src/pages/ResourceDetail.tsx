import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, ChevronLeft, BookOpen, Code, Zap, Star } from "lucide-react";

interface Resource {
  title: string;
  url: string;
  type: string;
}

interface DeepTopic {
  name: string;
  level: string;
  tools: string[];
}

interface TechResourceDetail {
  id: string;
  name: string;
  difficulty: string;
  popularity: string;
  resources: Resource[];
  deeperTopics?: DeepTopic[];
}

export default function ResourceDetail() {
  const [location] = useLocation();
  const resourceId = location.split("/").pop();
  
  const { data: resource, isLoading } = useQuery<TechResourceDetail>({
    queryKey: [`/api/tech-resources/${resourceId}`],
  });

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

  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "expert":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-400";
      case "advanced":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-400";
      default:
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <h2 className="font-display text-2xl font-bold">Resource not found</h2>
        <Button asChild>
          <Link href="/resources">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/resources">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Link>
      </Button>

      <div className="space-y-4">
        <div>
          <h1 className="font-display text-4xl font-bold">{resource.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className={getDifficultyColor(resource.difficulty)}>
              {resource.difficulty}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {resource.popularity}
            </Badge>
          </div>
          <p className="mt-4 text-lg text-muted-foreground">
            Master this rare specialization and stand out from the crowd
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resource.resources.map((res, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getResourceIcon(res.type)}
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{res.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {res.type}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="shrink-0"
                    data-testid={`button-visit-${idx}`}
                  >
                    <a href={res.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {resource.deeperTopics && resource.deeperTopics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Deeper Specializations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resource.deeperTopics.map((topic, idx) => (
                  <div key={idx} className="rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-semibold text-lg">{topic.name}</h3>
                      <Badge className={getLevelBadgeColor(topic.level)}>
                        {topic.level}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {topic.tools.map((tool, toolIdx) => (
                        <Badge key={toolIdx} variant="outline" className="text-xs">
                          <Code className="mr-1 h-3 w-3" />
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="bg-accent/50">
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Difficulty Level</p>
                <p className="mt-1 font-display text-xl font-bold">
                  {resource.difficulty}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Adoption Rate</p>
                <p className="mt-1 font-display text-xl font-bold">
                  {resource.popularity}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Resources</p>
                <p className="mt-1 font-display text-xl font-bold">
                  {resource.resources.length}
                </p>
              </div>
              {resource.deeperTopics && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Deeper Topics
                  </p>
                  <p className="mt-1 font-display text-xl font-bold">
                    {resource.deeperTopics.length}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Button className="w-full" size="lg" data-testid="button-start-learning">
            Start Learning
          </Button>
        </div>
      </div>
    </div>
  );
}
