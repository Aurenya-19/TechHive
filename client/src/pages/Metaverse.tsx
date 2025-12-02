import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Star, Trophy, Users } from "lucide-react";

interface Avatar {
  id: string;
  penName: string;
  level: number;
  xp: number;
  rank: number;
  avatarColor: string;
}

export default function Metaverse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [topPlayers] = useState<Avatar[]>([
    { id: "1", penName: "SkyWalker", level: 45, xp: 125000, rank: 1, avatarColor: "#00FFFF" },
    { id: "2", penName: "CodeNinja", level: 42, xp: 118000, rank: 2, avatarColor: "#FF00FF" },
    { id: "3", penName: "ByteMaster", level: 40, xp: 112000, rank: 3, avatarColor: "#FFD700" },
    { id: "4", penName: "TechGuru", level: 38, xp: 105000, rank: 4, avatarColor: "#00FF00" },
    { id: "5", penName: "DevWizard", level: 35, xp: 98000, rank: 5, avatarColor: "#FF6B9D" },
  ]);

  useEffect(() => {
    const initBabylon = async () => {
      if (!containerRef.current) return;
      
      try {
        const BABYLON = (await import("babylonjs")).default;
        
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.borderRadius = "0.5rem";
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(canvas);

        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        
        scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.25);
        
        const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light1.intensity = 0.7;
        light1.groundColor = new BABYLON.Color3(0.5, 0.25, 0.7);
        
        const light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(10, 20, 10), scene);
        light2.intensity = 0.8;
        light2.range = 100;
        
        const sphere = BABYLON.MeshBuilder.CreateSphere("skybox", { diameter: 1000 }, scene);
        const skyboxMat = new BABYLON.StandardMaterial("skybox", scene);
        skyboxMat.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.2);
        sphere.material = skyboxMat;

        topPlayers.forEach((player, index) => {
          const avatarSphere = BABYLON.MeshBuilder.CreateSphere(`avatar${index}`, { diameter: 2, segments: 32 }, scene);
          const angle = (index / topPlayers.length) * Math.PI * 2;
          avatarSphere.position = new BABYLON.Vector3(
            Math.cos(angle) * 15,
            index * 3 - 6,
            Math.sin(angle) * 15
          );

          const mat = new BABYLON.StandardMaterial(`mat${index}`, scene);
          mat.emissiveColor = BABYLON.Color3.FromHexString(player.avatarColor);
          mat.specularColor = new BABYLON.Color3(0.5, 0.8, 1);
          avatarSphere.material = mat;

          const glow = new BABYLON.GlowLayer("glow", scene);
          glow.addIncludedOnlyMesh(avatarSphere);
          glow.intensity = 0.8;
        });

        const camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 8, -30), scene);
        camera.attachControl(canvas, true);
        camera.speed = 0.1;
        camera.angularSensibility = 1000;
        camera.inertia = 0.8;
        camera.panningInertia = 0.7;

        engine.runRenderLoop(() => {
          scene.render();
        });

        window.addEventListener("resize", () => {
          engine.resize();
        });
      } catch (error) {
        console.error("Babylon.js initialization error:", error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: var(--foreground);">
              <p>3D Leaderboard visualization loading...</p>
              <p style="font-size: 0.875rem; color: var(--muted-foreground); margin-top: 0.5rem;">
                Creating galaxy-themed avatar spaces
              </p>
            </div>
          `;
        }
      }
    };

    initBabylon();
  }, [topPlayers]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Galaxy Metaverse
        </h1>
        <p className="text-muted-foreground">Step into the 3D virtual world and meet top learners</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="3d" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="3d">3D World</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="avatars">Avatars</TabsTrigger>
        </TabsList>

        {/* 3D Visualization */}
        <TabsContent value="3d" className="space-y-4">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Virtual Galaxy
              </CardTitle>
              <CardDescription>
                Explore a 3D universe of top performers. Drag to rotate, scroll to zoom.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                ref={containerRef}
                className="w-full rounded-md border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10"
                style={{ minHeight: "500px", height: "500px" }}
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/20">
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Total Galaxy Members</div>
                  <div className="text-3xl font-bold text-primary">2,847</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Active This Month</div>
                  <div className="text-3xl font-bold text-secondary">1,243</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Top Performers
              </CardTitle>
              <CardDescription>
                The most skilled learners in the CodeVerse galaxy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-4 hover-elevate"
                    data-testid={`leaderboard-player-${player.rank}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 font-bold">
                        #{player.rank}
                      </div>
                      <div>
                        <div className="font-semibold">{player.penName}</div>
                        <div className="text-sm text-muted-foreground">Level {player.level}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary/20">{player.xp.toLocaleString()} XP</Badge>
                      <Star className="h-5 w-5 fill-primary text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Avatars */}
        <TabsContent value="avatars" className="space-y-4">
          <Card className="border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                Avatar Customization
              </CardTitle>
              <CardDescription>
                Unlock avatar appearances by leveling up and completing achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3 rounded-lg border border-accent/20 bg-accent/5 p-4">
                  <h3 className="font-semibold">Your Avatar</h3>
                  <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="space-y-3 rounded-lg border border-accent/20 bg-accent/5 p-4">
                  <h3 className="font-semibold">Unlocked Customizations</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Hair Styles</span>
                      <Badge>5/12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Outfits</span>
                      <Badge>8/15</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Auras</span>
                      <Badge>3/8</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Accessories</span>
                      <Badge>6/20</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
