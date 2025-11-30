import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Swords,
  Users,
  FolderGit2,
  Shield,
  Newspaper,
  GraduationCap,
  Trophy,
  MessageSquare,
  Sparkles,
  Target,
  Map,
  LogOut,
  Hexagon,
  Github,
  Zap,
  Globe,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Skill Arenas", url: "/arenas", icon: Swords },
  { title: "Projects Hub", url: "/projects", icon: FolderGit2 },
  { title: "Tech Clans", url: "/clans", icon: Shield },
  { title: "TechPulse", url: "/feed", icon: Newspaper },
];

const explorNavItems = [
  { title: "GitHub Hub", url: "/github", icon: Github },
  { title: "Tech World", url: "/tech-world", icon: Globe },
  { title: "Swarm Projects", url: "/swarm", icon: Zap },
  { title: "Tech Spotlight", url: "/spotlight", icon: Sparkles },
];

const learningNavItems = [
  { title: "Roadmaps", url: "/roadmaps", icon: Map },
  { title: "Mini-Courses", url: "/courses", icon: GraduationCap },
  { title: "Daily Quests", url: "/quests", icon: Target },
];

const socialNavItems = [
  { title: "Leaderboards", url: "/leaderboards", icon: Trophy },
  { title: "MentorVerse", url: "/mentors", icon: Users },
  { title: "Messages", url: "/messages", icon: MessageSquare },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const xpProgress = 65;
  const currentLevel = 12;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Hexagon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold">TechHive</span>
            <span className="text-xs text-muted-foreground">Learn. Build. Grow.</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Learning</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {learningNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Social</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {socialNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Explore</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {explorNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>AI Assistant</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/ai-copilot"}>
                  <Link href="/ai-copilot" data-testid="nav-ai-copilot">
                    <Sparkles className="h-4 w-4" />
                    <span>AI Copilot</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Beta
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="rounded-lg border border-border bg-card/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Level {currentLevel}</span>
            <span className="text-xs text-muted-foreground">{xpProgress}%</span>
          </div>
          <Progress value={xpProgress} className="h-2" />
          <p className="mt-1 text-xs text-muted-foreground">350 XP to next level</p>
        </div>

        {user && (
          <div className="mt-4 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profileImageUrl || undefined} className="object-cover" />
              <AvatarFallback>
                {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">
                {user.firstName || user.email?.split("@")[0] || "User"}
              </p>
              <p className="truncate text-xs text-muted-foreground">Explorer Tier</p>
            </div>
            <a
              href="/api/logout"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </a>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
