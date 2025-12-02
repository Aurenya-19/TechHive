import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const SKILL_INTERESTS = [
  "AI & Machine Learning", "Web Development", "Cybersecurity", "Blockchain",
  "DevOps", "Game Development", "IoT", "Physics", "Math", "Quantum Computing",
  "FPGA", "Verification", "Compilers", "HPC", "Biotech", "AR/VR", "Mobile Dev"
];

export default function ProfileSetup() {
  const [penName, setPenName] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { mutate: setupProfile, isPending } = useMutation({
    mutationFn: async () => {
      if (!penName.trim()) {
        throw new Error("Please enter a pen name");
      }
      if (selectedInterests.length === 0) {
        throw new Error("Please select at least one interest");
      }
      return apiRequest("/api/profile/setup", "POST", {
        penName: penName.trim(),
        interests: selectedInterests
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile Complete! 🎮",
        description: "Welcome to CodeVerse, " + penName + "!",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to setup profile",
        variant: "destructive"
      });
    }
  });

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl">Welcome to CodeVerse! 🎮</CardTitle>
          <CardDescription>
            Let's create your gaming persona and discover your tech interests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pen Name Input */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="penName" className="text-base font-semibold">
                Choose Your Gamer Pen Name
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                This is your gaming alias - make it unique, fun, or mysterious! (e.g., "ShadowCoder", "QuantumNinja", "ByteWizard")
              </p>
            </div>
            <Input
              id="penName"
              placeholder="e.g., NeuralNinja, CyberPhoenix, CodeWarrior"
              value={penName}
              onChange={(e) => setPenName(e.target.value)}
              disabled={isPending}
              className="text-lg"
              data-testid="input-pen-name"
            />
            {penName && (
              <div className="text-sm text-muted-foreground">
                Your CodeVerse alias: <span className="font-bold text-primary">{penName}</span>
              </div>
            )}
          </div>

          {/* Interests Selection */}
          <div className="space-y-3">
            <div>
              <Label className="text-base font-semibold">
                Select Your Learning Interests
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Choose at least one area you want to master. You can always change this later!
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SKILL_INTERESTS.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  disabled={isPending}
                  data-testid={`interest-${interest}`}
                  className="text-left"
                >
                  <Badge
                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                    className="w-full justify-start cursor-pointer hover-elevate"
                  >
                    {selectedInterests.includes(interest) && "✓ "}
                    {interest}
                  </Badge>
                </button>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              Selected: {selectedInterests.length > 0 ? selectedInterests.join(", ") : "None yet"}
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-2">
            <Button
              onClick={() => setupProfile()}
              disabled={isPending || !penName.trim() || selectedInterests.length === 0}
              size="lg"
              className="w-full"
              data-testid="button-setup-complete"
            >
              {isPending ? "Setting up..." : "Start Your CodeVerse Journey"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              This helps us personalize your learning experience
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
