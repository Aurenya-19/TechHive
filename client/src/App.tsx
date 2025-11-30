import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Arenas from "@/pages/Arenas";
import Projects from "@/pages/Projects";
import Clans from "@/pages/Clans";
import Feed from "@/pages/Feed";
import Quests from "@/pages/Quests";
import Courses from "@/pages/Courses";
import Leaderboards from "@/pages/Leaderboards";
import Messages from "@/pages/Messages";
import Mentors from "@/pages/Mentors";
import Roadmaps from "@/pages/Roadmaps";
import AICopilot from "@/pages/AICopilot";
import Profile from "@/pages/Profile";
import TechWorld from "@/pages/TechWorld";
import SwarmProjects from "@/pages/SwarmProjects";
import TechSpotlight from "@/pages/TechSpotlight";
import GitHub from "@/pages/GitHub";

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
          <header className="flex h-14 items-center justify-between border-b border-border px-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
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
      
      <Route path="/">
        {user ? <ProtectedRoute component={Dashboard} /> : <Redirect to="/landing" />}
      </Route>
      <Route path="/arenas">
        <ProtectedRoute component={Arenas} />
      </Route>
      <Route path="/projects">
        <ProtectedRoute component={Projects} />
      </Route>
      <Route path="/clans">
        <ProtectedRoute component={Clans} />
      </Route>
      <Route path="/feed">
        <ProtectedRoute component={Feed} />
      </Route>
      <Route path="/quests">
        <ProtectedRoute component={Quests} />
      </Route>
      <Route path="/courses">
        <ProtectedRoute component={Courses} />
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
      <Route path="/ai-copilot">
        <ProtectedRoute component={AICopilot} />
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
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
