import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { I18nextProvider } from "react-i18next";
import i18n from "@/config/i18n";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Arenas from "@/pages/Arenas";
import ArenaDetail from "@/pages/ArenaDetail";
import ChallengeDetail from "@/pages/ChallengeDetail";
import ProjectDetail from "@/pages/ProjectDetail";
import Projects from "@/pages/Projects";
import ClanDetail from "@/pages/ClanDetail";
import QuestDetail from "@/pages/QuestDetail";
import CourseDetail from "@/pages/CourseDetail";
import RoadmapDetail from "@/pages/RoadmapDetail";
import Clans from "@/pages/Clans";
import Feed from "@/pages/Feed";
import Quests from "@/pages/Quests";
import Courses from "@/pages/Courses";
import Leaderboards from "@/pages/Leaderboards";
import Messages from "@/pages/Messages";
import Mentors from "@/pages/Mentors";
import Roadmaps from "@/pages/Roadmaps";
import CodeMentor from "@/pages/CodeMentor";
import Profile from "@/pages/Profile";
import TechWorld from "@/pages/TechWorld";
import SwarmProjects from "@/pages/SwarmProjects";
import TechSpotlight from "@/pages/TechSpotlight";
import GitHub from "@/pages/GitHub";
import Resources from "@/pages/Resources";
import ResourceDetail from "@/pages/ResourceDetail";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Metaverse from "@/pages/Metaverse";
import CodeFusion from "@/pages/CodeFusion";
import Competitions from "@/pages/Competitions";
import CompetitionDetail from "@/pages/CompetitionDetail";
import CompetitionLeaderboard from "@/pages/CompetitionLeaderboard";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center justify-between border-b border-border px-4 gap-2">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/landing" />;
  }

  return (
    <AuthenticatedLayout>
      <Component />
    </AuthenticatedLayout>
  );
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/landing" component={Landing} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      
      <Route path="/">
        {user ? <ProtectedRoute component={Dashboard} /> : <Redirect to="/landing" />}
      </Route>
      <Route path="/arenas">
        <ProtectedRoute component={Arenas} />
      </Route>
      <Route path="/arenas/:slug">
        <ProtectedRoute component={ArenaDetail} />
      </Route>
      <Route path="/challenges/:id">
        <ProtectedRoute component={ChallengeDetail} />
      </Route>
      <Route path="/projects">
        <ProtectedRoute component={Projects} />
      </Route>
      <Route path="/projects/:id">
        <ProtectedRoute component={ProjectDetail} />
      </Route>
      <Route path="/clans">
        <ProtectedRoute component={Clans} />
      </Route>
      <Route path="/clans/:id">
        <ProtectedRoute component={ClanDetail} />
      </Route>
      <Route path="/feed">
        <ProtectedRoute component={Feed} />
      </Route>
      <Route path="/quests">
        <ProtectedRoute component={Quests} />
      </Route>
      <Route path="/quests/:id">
        <ProtectedRoute component={QuestDetail} />
      </Route>
      <Route path="/courses">
        <ProtectedRoute component={Courses} />
      </Route>
      <Route path="/courses/:courseId">
        <ProtectedRoute component={CourseDetail} />
      </Route>
      <Route path="/leaderboards">
        <ProtectedRoute component={Leaderboards} />
      </Route>
      <Route path="/messages">
        <ProtectedRoute component={Messages} />
      </Route>
      <Route path="/mentors">
        <ProtectedRoute component={Mentors} />
      </Route>
      <Route path="/roadmaps">
        <ProtectedRoute component={Roadmaps} />
      </Route>
      <Route path="/roadmaps/:slug">
        <ProtectedRoute component={RoadmapDetail} />
      </Route>
      <Route path="/code-mentor">
        <ProtectedRoute component={CodeMentor} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      <Route path="/tech-world">
        <ProtectedRoute component={TechWorld} />
      </Route>
      <Route path="/swarm">
        <ProtectedRoute component={SwarmProjects} />
      </Route>
      <Route path="/spotlight">
        <ProtectedRoute component={TechSpotlight} />
      </Route>
      <Route path="/github">
        <ProtectedRoute component={GitHub} />
      </Route>
      <Route path="/resources">
        <ProtectedRoute component={Resources} />
      </Route>
      <Route path="/resources/:resourceId">
        <ProtectedRoute component={ResourceDetail} />
      </Route>
      <Route path="/metaverse">
        <ProtectedRoute component={Metaverse} />
      </Route>
      <Route path="/codefusion">
        <ProtectedRoute component={CodeFusion} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

export default App;
