import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Code, BookOpen, Lightbulb, Zap, Rocket } from "lucide-react";

export default function TechSpotlight() {
  const { data: github } = useQuery({ queryKey: ["/api/trending/github"] });
  const { data: papers } = useQuery({ queryKey: ["/api/research/papers"] });
  const { data: startups } = useQuery({ queryKey: ["/api/startup/intelligence"] });
  const { data: tools } = useQuery({ queryKey: ["/api/ai-tools/latest"] });
  const { data: releases } = useQuery({ queryKey: ["/api/tech/releases"] });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Tech Spotlight</h1>
        <p className="text-muted-foreground">Real-time AI analysis of what experts are building</p>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trending">
            <TrendingUp className="h-4 w-4 mr-2" /> GitHub
          </TabsTrigger>
          <TabsTrigger value="research">
            <BookOpen className="h-4 w-4 mr-2" /> Papers
          </TabsTrigger>
          <TabsTrigger value="startups">
            <Rocket className="h-4 w-4 mr-2" /> Startups
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Lightbulb className="h-4 w-4 mr-2" /> AI Tools
          </TabsTrigger>
          <TabsTrigger value="releases">
            <Zap className="h-4 w-4 mr-2" /> Releases
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-4">
          {github?.trending?.map((repo: any, idx: number) => (
            <Card key={idx} className="hover-elevate">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" /> {repo.name}
                  </CardTitle>
                  <Badge variant="secondary">{repo.language}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <p className="text-sm">⭐ {repo.stars}</p>
                  <p className="text-sm text-green-600 font-semibold">{repo.trend} this week</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="research" className="space-y-4">
          {papers?.papers?.map((paper: any, idx: number) => (
            <Card key={idx} className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-base">{paper.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">By {paper.authors}</p>
                <div className="mt-2 flex gap-2">
                  <Badge>{paper.citations} citations</Badge>
                  <Badge variant="secondary">{paper.relevance}% relevance</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="startups" className="space-y-4">
          {startups?.startups?.map((startup: any, idx: number) => (
            <Card key={idx} className="hover-elevate">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" /> {startup.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm">💰 {startup.funding}</p>
                  <p className="text-sm">🔧 {startup.tech}</p>
                  <Badge className="mt-2">{startup.traction}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          {tools?.tools?.map((tool: any, idx: number) => (
            <Card key={idx} className="hover-elevate">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" /> {tool.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{tool.capabilities}</p>
                <div className="flex gap-2">
                  <Badge>{tool.released}</Badge>
                  <Badge variant="secondary">{tool.adoption}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="releases" className="space-y-4">
          {releases?.releases?.map((release: any, idx: number) => (
            <Card key={idx} className="hover-elevate">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" /> {release.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{release.date}</p>
                <ul className="mt-2 text-sm space-y-1">
                  {release.features?.map((f: string, i: number) => (
                    <li key={i}>✓ {f}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
