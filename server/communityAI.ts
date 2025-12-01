// AI-Driven Community Recommendations
export function recommendCommunitiesForUser(userProfile: any, allGroups: any[]): { groupId: string; matchScore: number; reason: string }[] {
  const recommendations: { groupId: string; matchScore: number; reason: string }[] = [];
  
  const userInterests = userProfile?.interests || [];
  const userLevel = userProfile?.level || 1;
  const userXp = userProfile?.xp || 0;

  allGroups.forEach((group: any) => {
    let score = 0;
    let reasons: string[] = [];

    // Check level requirements
    if (userLevel >= (group.minLevel || 1)) {
      score += 20;
    }

    // Check interest match
    const interestMatch = (group.tags || []).filter((t: string) => userInterests.includes(t)).length;
    score += interestMatch * 15;
    if (interestMatch > 0) reasons.push(`Matches your ${interestMatch} interests`);

    // Check if user has required badge
    if (!group.requiredBadge) {
      score += 10;
      reasons.push("Open to all skill levels");
    }

    // Recommend elite groups for high-level users
    if (userLevel >= 5 && group.category === "elite") {
      score += 25;
      reasons.push("Perfect for advanced learners like you");
    }

    // Recommend research groups for experts
    if (userLevel >= 4 && group.category === "research") {
      score += 20;
      reasons.push("Great for deepening expertise");
    }

    // Recommend professional groups for established users
    if (userXp > 10000 && group.category === "professional") {
      score += 20;
      reasons.push("Ideal for professional growth");
    }

    if (score > 30) {
      recommendations.push({
        groupId: group.id,
        matchScore: Math.min(100, score),
        reason: reasons.length > 0 ? reasons[0] : "Recommended for you",
      });
    }
  });

  return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
}

// Generate AI-driven community suggestions (auto-create communities based on user gaps)
export function suggestAutoCommunitiesForGaps(knowledgeGaps: any[], allArenas: any[]): { name: string; description: string; category: string; tags: string[] }[] {
  const suggestions: { name: string; description: string; category: string; tags: string[] }[] = [];

  knowledgeGaps.forEach((gap: any) => {
    const arena = allArenas.find((a: any) => a.name.includes(gap.field));
    if (arena) {
      suggestions.push({
        name: `${gap.field} Mastery Elite Group`,
        description: `Private community for mastering advanced ${gap.field}. Focuses on ${gap.strength} skills improvement.`,
        category: "elite",
        tags: [gap.field, "advanced", gap.strength],
      });
    }
  });

  return suggestions;
}
