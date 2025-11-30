import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Star, GitFork, Eye, Code, ExternalLink, Github } from "lucide-react";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const [location] = useLocation();
  const projectId = location.split("/").pop();
  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <h2 className="font-display text-2xl font-bold">Project not found</h2>
        <Button asChild>
          <Link href="/projects">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/projects">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </Button>

      <div className="space-y-4">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold">{project.title}</h1>
              <p className="mt-2 text-muted-foreground">{project.description}</p>
            </div>
            {project.liveUrl && (
              <Button asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      <Code className="mr-1 h-3 w-3" />
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Language</h3>
                <Badge variant="outline">{project.language}</Badge>
              </div>

              {project.content && (
                <div>
                  <h3 className="font-medium mb-2">Details</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.content}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {project.repositoryUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  Repository
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                    <GitFork className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Stars</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-chart-4" />
                  <span className="font-medium">{project.stars || 0}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Forks</span>
                <div className="flex items-center gap-1">
                  <GitFork className="h-4 w-4" />
                  <span className="font-medium">{project.forks || 0}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Views</span>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">{project.views || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage 
                    src={project.creatorImage ? `${project.creatorImage}?w=64&h=64&fit=crop` : undefined}
                    srcSet={project.creatorImage ? `${project.creatorImage}?w=64&h=64&fit=crop 1x, ${project.creatorImage}?w=128&h=128&fit=crop 2x` : undefined}
                    className="object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <AvatarFallback>{project.creatorName?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{project.creatorName}</p>
                  <p className="text-xs text-muted-foreground">Project Owner</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
