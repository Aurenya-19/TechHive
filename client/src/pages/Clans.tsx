import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import {
  Shield,
  Plus,
  Users,
  Trophy,
  Zap,
  Crown,
  Search,
  ChevronRight,
  Star,
  Lightbulb,
  Hammer,
  Sparkles,
} from "lucide-react";
import type { Clan, User } from "@shared/schema";

const createClanSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["interest", "project"]),
  projectGoal: z.string().optional(),
});

type CreateClanForm = z.infer<typeof createClanSchema>;

function ClanCard({ clan, isMember }: { clan: Clan; isMember: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const joinClan = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/clans/${clan.id}/join`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/clans"] });
      toast({
        title: "Joined clan!",
        description: `Welcome to ${clan.name}!`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join clan.",
        variant: "destructive",
      });
    },
  });

  const xpProgress = ((clan.xp || 0) % 5000) / 50;
  const isProjectClan = clan.type === "project";

  return (
    <Card className="hover-elevate overflow-hidden">
      <div className="h-24 bg-gradient-to-br from-primary/20 to-chart-2/20">
        {clan.bannerImage && (
          <img
            src={clan.bannerImage}
            alt={clan.name}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, 100vw"
            srcSet={`${clan.bannerImage}?w=400 400w, ${clan.bannerImage}?w=800 800w, ${clan.bannerImage}?w=1200 1200w`}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-white ${
              isProjectClan 
                ? "bg-gradient-to-br from-chart-1 to-chart-3" 
                : "bg-primary/20 text-primary"
            }`}>
              {isProjectClan ? <Hammer className="h-7 w-7" /> : <Shield className="h-7 w-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-semibold">{clan.name}</h3>
                <Badge className="text-xs" variant={isProjectClan ? "default" : "secondary"}>
                  {isProjectClan ? "Project" : "Interest"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{clan.memberCount}/{clan.maxMembers} members</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary">
            <Star className="mr-1 h-3 w-3" />
            Lvl {clan.level}
          </Badge>
        </div>

        <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
          {clan.description}
        </p>

        {isProjectClan && clan.projectGoal && (
          <div className="mt-3 rounded-lg bg-accent/50 p-3">
            <p className="text-xs font-medium text-foreground">Project Goal</p>
            <p className="text-sm text-muted-foreground line-clamp-1">{clan.projectGoal}</p>
          </div>
        )}

        {(isProjectClan ? clan.skillsNeeded : clan.focus) && (isProjectClan ? clan.skillsNeeded : clan.focus).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(isProjectClan ? clan.skillsNeeded : clan.focus).slice(0, 3).map((item, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {item}
              </Badge>
            ))}
            {(isProjectClan ? clan.skillsNeeded : clan.focus).length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{(isProjectClan ? clan.skillsNeeded : clan.focus).length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Clan XP</span>
            <span className="flex items-center gap-1 text-chart-4">
              <Zap className="h-4 w-4" />
              {(clan.xp || 0).toLocaleString()}
            </span>
          </div>
          <Progress value={xpProgress} className="mt-2 h-2" />
        </div>

        <div className="mt-4 flex items-center justify-between">
          {isMember ? (
            <Badge variant="secondary" className="text-chart-5">
              <Crown className="mr-1 h-3 w-3" />
              Member
            </Badge>
          ) : (
            <div />
          )}
          <Button
            size="sm"
            variant={isMember ? "ghost" : "default"}
            onClick={() => !isMember && joinClan.mutate()}
            disabled={isMember || joinClan.isPending}
            asChild={isMember}
            data-testid={`button-${isMember ? "view" : "join"}-clan-${clan.id}`}
          >
            {isMember ? (
              <Link href={`/clans/${clan.id}`}>
                View Clan
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            ) : (
              <>
                {joinClan.isPending ? "Joining..." : "Join Clan"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Clans() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "interest" | "project">("all");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: clans, isLoading } = useQuery<Clan[]>({
    queryKey: ["/api/clans"],
  });

  const { data: userClans } = useQuery<Clan[]>({
    queryKey: ["/api/user/clans"],
  });

  const userClanIds = new Set(userClans?.map((c) => c.id) || []);

  const form = useForm<CreateClanForm>({
    resolver: zodResolver(createClanSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "interest",
      projectGoal: "",
    },
  });

  const createClan = useMutation({
    mutationFn: async (data: CreateClanForm) => {
      return apiRequest("POST", "/api/clans", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/clans"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Clan created!",
        description: "Your clan is now live. Invite members to join!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create clan.",
        variant: "destructive",
      });
    },
  });

  const filteredClans = clans?.filter((clan) => {
    const matchesSearch =
      clan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clan.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || clan.type === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Tech Clans</h1>
          <p className="mt-1 text-muted-foreground">
            Join interest-based communities or collaborate on projects with diverse skill sets
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-clan">
              <Plus className="mr-2 h-4 w-4" />
              Create Clan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Clan</DialogTitle>
              <DialogDescription>
                Create an interest-based community or a project-driven team.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => createClan.mutate(data))}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clan Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Code Warriors"
                          {...field}
                          data-testid="input-clan-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clan Type</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange}>
                          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                            <RadioGroupItem value="interest" id="type-interest" />
                            <label htmlFor="type-interest" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="font-medium">Interest-Based</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Group of developers with shared interests</p>
                            </label>
                          </div>
                          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                            <RadioGroupItem value="project" id="type-project" />
                            <label htmlFor="type-project" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2">
                                <Hammer className="h-4 w-4 text-chart-1" />
                                <span className="font-medium">Project-Driven</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Collaborate to build something together</p>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What's your clan about?"
                          {...field}
                          data-testid="input-clan-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("type") === "project" && (
                  <FormField
                    control={form.control}
                    name="projectGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Goal</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What will your team build?"
                            {...field}
                            data-testid="input-clan-project-goal"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createClan.isPending}
                  data-testid="button-submit-clan"
                >
                  {createClan.isPending ? "Creating..." : "Create Clan"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {userClans && userClans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-chart-4" />
              Your Clans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userClans.map((clan) => (
                <ClanCard key={clan.id} clan={clan} isMember={true} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-clans"
            />
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={filterType === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterType("all")}
              data-testid="filter-all-clans"
            >
              All
            </Badge>
            <Badge
              variant={filterType === "interest" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterType("interest")}
              data-testid="filter-interest-clans"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              Interest
            </Badge>
            <Badge
              variant={filterType === "project" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterType("project")}
              data-testid="filter-project-clans"
            >
              <Hammer className="mr-1 h-3 w-3" />
              Project
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClans && filteredClans.length > 0 ? (
            filteredClans.map((clan) => (
              <ClanCard
                key={clan.id}
                clan={clan}
                isMember={userClanIds.has(clan.id)}
              />
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No clans found</p>
                <p className="text-sm text-muted-foreground">
                  Create the first clan and start building your team!
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Clan
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
