import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Newspaper,
  ExternalLink,
  Heart,
  MessageSquare,
  Share2,
  Clock,
  Brain,
  Code,
  Shield,
  Cpu,
  Rocket,
  Sparkles,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import type { FeedItem } from "@shared/schema";

const categoryIcons: Record<string, typeof Brain> = {
  ai: Brain,
  web: Code,
  cybersecurity: Shield,
  robotics: Cpu,
  startups: Rocket,
  research: Sparkles,
  tutorials: BookOpen,
  trends: TrendingUp,
};

const categoryColors: Record<string, string> = {
  ai: "bg-purple-500/10 text-purple-500",
  web: "bg-blue-500/10 text-blue-500",
  cybersecurity: "bg-green-500/10 text-green-500",
  robotics: "bg-red-500/10 text-red-500",
  startups: "bg-orange-500/10 text-orange-500",
  research: "bg-pink-500/10 text-pink-500",
  tutorials: "bg-cyan-500/10 text-cyan-500",
  trends: "bg-yellow-500/10 text-yellow-500",
};

function FeedCard({ item }: { item: FeedItem }) {
  const Icon = categoryIcons[item.category || "ai"] || Newspaper;
  const colorClass = categoryColors[item.category || "ai"] || "bg-primary/10 text-primary";
  
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <Card className="hover-elevate overflow-hidden">
      {item.imageUrl && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs capitalize">
                {item.category}
              </Badge>
              {item.source && (
                <span className="text-xs text-muted-foreground">{item.source}</span>
              )}
            </div>
            <h3 className="mt-2 font-display text-lg font-semibold leading-tight">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.slice(0, 4).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {item.createdAt && timeAgo(item.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
            {item.sourceUrl && (
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const categories = [
  { value: "all", label: "All" },
  { value: "ai", label: "AI" },
  { value: "web", label: "Web Dev" },
  { value: "cybersecurity", label: "Security" },
  { value: "robotics", label: "Robotics" },
  { value: "startups", label: "Startups" },
  { value: "tutorials", label: "Tutorials" },
];

export default function Feed() {
  const { data: feedItems, isLoading } = useQuery<FeedItem[]>({
    queryKey: ["/api/feed"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-bold">TechPulse</h1>
        <p className="mt-1 text-muted-foreground">
          Stay updated with the latest in tech based on your interests
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="flex-wrap">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} data-testid={`tab-feed-${cat.value}`}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.value} value={cat.value} className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {feedItems && feedItems.length > 0 ? (
                feedItems
                  .filter((item) => cat.value === "all" || item.category === cat.value)
                  .map((item) => <FeedCard key={item.id} item={item} />)
              ) : (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Newspaper className="h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">No updates yet</p>
                    <p className="text-sm text-muted-foreground">
                      Fresh tech news will appear here!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
