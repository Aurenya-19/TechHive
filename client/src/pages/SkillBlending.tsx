import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Sparkles, Lock, ChevronRight, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SkillBlending() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();
  const [skill1, setSkill1] = useState("");
  const [skill2, setSkill2] = useState("");
  const [lastBlend, setLastBlend] = useState<any>(null);

  const { data: blends, isLoading } = useQuery({
    queryKey: ["/api/blend/available"],
    queryFn: async () => {
      const res = await fetch("/api/blend/available");
      if (!res.ok) throw new Error("Failed to load blending options");
      return res.json();
    },
  });

  const blendMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/blend/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill1, skill2 }),
      });
      if (!res.ok) throw new Error("Failed to blend skills");
      return res.json();
    },
    onSuccess: (data) => {
      setLastBlend(data);
      setSkill1("");
      setSkill2("");
    },
    onError: (error: any) => handleError(error),
  });

  const allSkills = blends?.blends?.flatMap((b: any) => [b.skill1, b.skill2]) || [];
  const uniqueSkills = [...new Set(allSkills)];

  const selectedBlend = blends?.blends?.find(
    (b: any) => (b.skill1 === skill1 && b.skill2 === skill2) || (b.skill1 === skill2 && b.skill2 === skill1)
  );

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Skill Blending
        </h1>
        <p className="text-muted-foreground">Combine two skills to unlock powerful new specializations</p>
      </div>

      {lastBlend?.success && (
        <Alert className="bg-green-500/10 border-green-500/30">
          <Zap className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700 dark:text-green-400">
            {lastBlend.message} Level {lastBlend.newLevel}
          </AlertDescription>
        </Alert>
      )}

      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle>Blend Your Skills</CardTitle>
          <CardDescription>Select two complementary skills to create a powerful fusion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Skill 1</label>
              <Select value={skill1} onValueChange={setSkill1}>
                <SelectTrigger data-testid="select-skill1">
                  <SelectValue placeholder="Select first skill" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueSkills.map((skill: string) => (
                    <SelectItem key={skill} value={skill}>
                      {skill.charAt(0).toUpperCase() + skill.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Skill 2</label>
              <Select value={skill2} onValueChange={setSkill2}>
                <SelectTrigger data-testid="select-skill2">
                  <SelectValue placeholder="Select second skill" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueSkills.map((skill: string) => (
                    <SelectItem key={skill} value={skill}>
                      {skill.charAt(0).toUpperCase() + skill.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedBlend && (
            <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Blend Result</h3>
                <Badge className="capitalize">{selectedBlend.result.replace(/-/g, " ")}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">XP Reward:</span>
                <Badge variant="outline" className="text-base font-bold">
                  +{selectedBlend.bonus} XP
                </Badge>
              </div>
            </div>
          )}

          <Button
            onClick={() => blendMutation.mutate()}
            disabled={!skill1 || !skill2 || !selectedBlend || blendMutation.isPending}
            size="lg"
            className="w-full"
            data-testid="button-blend-skills"
          >
            {blendMutation.isPending ? "Blending..." : "Blend Skills"}
          </Button>
        </CardContent>
      </Card>

      {/* Available Blends */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Available Blends</h2>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {blends?.blends?.map((blend: any) => (
              <Card
                key={blend.result}
                className={`cursor-pointer hover-elevate transition-all ${
                  selectedBlend?.result === blend.result ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  setSkill1(blend.skill1);
                  setSkill2(blend.skill2);
                }}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{blend.skill1}</Badge>
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <Badge variant="secondary">{blend.skill2}</Badge>
                    </div>
                    <p className="text-sm font-medium capitalize">→ {blend.result.replace(/-/g, " ")}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="mb-1">+{blend.bonus} XP</Badge>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          Each skill blend unlocks a new specialization and gives you bonus XP. Combine skills strategically to master powerful tech combinations!
        </AlertDescription>
      </Alert>
    </div>
  );
}
