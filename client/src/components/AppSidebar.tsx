import { LogOut, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Swords,
  FolderGit2,
  Shield,
  Newspaper,
  Github,
  Globe,
  Zap,
  Sparkles,
  Map,
  GraduationCap,
  Target,
  Trophy,
  Users,
  MessageSquare,
  User,
  Flame,
  BarChart3,
  Microphone,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function AppSidebar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { data: profile } = useQuery({ queryKey: ["/api/user/profile"] });

  const menuItems = [
    { title: t("navigation.dashboard"), url: "/", icon: LayoutDashboard },
    { title: t("navigation.arenas"), url: "/arenas", icon: Swords },
    { title: t("navigation.projects"), url: "/projects", icon: FolderGit2 },
    { title: t("navigation.clans"), url: "/clans", icon: Shield },
    { title: t("navigation.feed"), url: "/feed", icon: Newspaper },
    { title: t("navigation.github"), url: "/github", icon: Github },
    { title: t("navigation.techworld"), url: "/tech-world", icon: Globe },
    { title: t("navigation.swarm"), url: "/swarm", icon: Zap },
    { title: t("navigation.spotlight"), url: "/spotlight", icon: Sparkles },
    { title: t("navigation.roadmaps"), url: "/roadmaps", icon: Map },
    { title: t("navigation.courses"), url: "/courses", icon: GraduationCap },
    { title: t("navigation.quests"), url: "/quests", icon: Target },
    { title: "Competitions", url: "/competitions", icon: Flame },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Podcasts", url: "/podcasts", icon: Microphone },
    { title: t("navigation.leaderboard"), url: "/leaderboards", icon: Trophy },
    { title: t("navigation.mentors"), url: "/mentors", icon: Users },
    { title: t("navigation.messages"), url: "/messages", icon: MessageSquare },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>CodeVerse</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/profile">
                  <User />
                  <span>{t("navigation.profile")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={logout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
                {t("navigation.logout")}
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
