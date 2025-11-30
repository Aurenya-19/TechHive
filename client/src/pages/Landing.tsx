import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Swords,
  Users,
  Trophy,
  Rocket,
  Code,
  Brain,
  Shield,
  Zap,
  ChevronRight,
  Star,
  Globe,
} from "lucide-react";
import techHiveLogo from "@assets/ChatGPT Image Nov 30, 2025, 03_04_43 PM_1764495927682.png";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const features = [
  {
    icon: Swords,
    title: "Skill Arenas",
    description: "Battle through AI, Cyber, Web, and GameDev arenas with time-bound challenges",
    color: "text-chart-1",
  },
  {
    icon: Brain,
    title: "AI Copilot",
    description: "Get personalized help with code, debugging, and learning from our AI assistant",
    color: "text-chart-2",
  },
  {
    icon: Users,
    title: "Tech Clans",
    description: "Join or create clans for hackathons, competitions, and collaborative projects",
    color: "text-chart-3",
  },
  {
    icon: Trophy,
    title: "Global Leaderboards",
    description: "Compete with developers worldwide and climb the ranks",
    color: "text-chart-4",
  },
  {
    icon: Code,
    title: "Projects Hub",
    description: "Build, share, and collaborate on open-source projects",
    color: "text-chart-5",
  },
  {
    icon: Shield,
    title: "MentorVerse",
    description: "Connect with mentors matched to your interests and skill level",
    color: "text-chart-1",
  },
];

const stats = [
  { value: "50K+", label: "Active Developers" },
  { value: "1M+", label: "Challenges Completed" },
  { value: "500+", label: "Tech Clans" },
  { value: "100+", label: "Learning Paths" },
];

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src={techHiveLogo} alt="CodeVerse Logo" className="h-10 w-10" />
            <span className="font-display text-xl font-bold">CodeVerse</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <a
              href="/api/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              data-testid="link-login"
            >
              {t("common.login")}
            </a>
            <Button asChild data-testid="button-get-started">
              <a href="/api/login">{t("common.getStarted")}</a>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-chart-2/10 blur-3xl" />
          
          <div className="relative mx-auto max-w-7xl px-4 text-center">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="mr-1 h-3 w-3" />
              {t("landing.poweredByAi")}
            </Badge>
            
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              {t("landing.heroTitle")}
              <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                {" "}
              </span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {t("landing.heroDescription")}
            </p>
            
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild className="h-12 px-8" data-testid="button-start-journey">
                <a href="/api/login">
                  {t("landing.startJourney")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8" data-testid="button-explore">
                <a href="#features">{t("landing.exploreFeatures")}</a>
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">Features</Badge>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Everything You Need to Excel
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                From personalized AI assistance to global competitions, CodeVerse provides all the 
                tools you need to become a top-tier developer.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="hover-elevate group cursor-default">
                  <CardContent className="p-6">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card/50 py-20">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 fill-chart-4 text-chart-4" />
              ))}
            </div>
            <blockquote className="mx-auto mt-6 max-w-3xl font-display text-2xl font-medium">
              "CodeVerse transformed how I learn programming. The gamified challenges and clan 
              competitions keep me motivated every day."
            </blockquote>
            <div className="mt-6">
              <p className="font-medium">Alex Chen</p>
              <p className="text-sm text-muted-foreground">Full Stack Developer, Level 42</p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-chart-2 p-8 sm:p-16">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-black/20 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Rocket className="h-6 w-6 text-white" />
                  <span className="font-medium text-white/80">Ready to Start?</span>
                </div>
                <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
                  Join the CodeVerse Community
                </h2>
                <p className="mt-4 max-w-xl text-white/80">
                  Create your free account and start your journey to becoming a top developer. 
                  Track your progress, earn badges, and compete globally.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-8 h-12 px-8"
                  asChild
                  data-testid="button-create-account"
                >
                  <a href="/api/login">
                    <Zap className="mr-2 h-4 w-4" />
                    Create Free Account
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <img src={techHiveLogo} alt="CodeVerse Logo" className="h-8 w-8" />
              <span className="font-display font-bold">CodeVerse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CodeVerse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
