import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Microphone, Calendar, User } from "lucide-react";

interface Podcast {
  id: string;
  title: string;
  speaker: string;
  description: string;
  category: string;
  duration: number;
  date: string;
  listenerCount: number;
  rating: number;
  topics: string[];
  podcastUrl?: string;
  imageUrl?: string;
}

const podcasts: Podcast[] = [
  {
    id: 1,
    title: "The Future of AI: Opportunities & Challenges",
    speaker: "Dr. Yann LeCun (Meta AI Chief)",
    description: "Visionary discussion on artificial intelligence evolution, deep learning breakthroughs, and responsible AI development",
    category: "AI & Future",
    duration: 75,
    date: "2024-11-15",
    listenerCount: 125000,
    rating: 4.9,
    topics: ["AI", "Deep Learning", "Responsible AI", "Future Technology"]
  },
  {
    id: 2,
    title: "Building a Decentralized Future",
    speaker: "Vitalik Buterin (Ethereum Founder)",
    description: "Ethereum founder shares insights on blockchain technology, Web3, and decentralized systems shaping the future",
    category: "Blockchain",
    duration: 90,
    date: "2024-11-10",
    listenerCount: 98000,
    rating: 4.8,
    topics: ["Blockchain", "Ethereum", "Web3", "Decentralization"]
  },
  {
    id: 3,
    title: "The Art of Continuous Innovation",
    speaker: "Satya Nadella (Microsoft CEO)",
    description: "CEO of Microsoft discusses digital transformation, cloud computing, and fostering innovation in organizations",
    category: "Leadership",
    duration: 60,
    date: "2024-11-05",
    listenerCount: 156000,
    rating: 4.7,
    topics: ["Leadership", "Cloud", "Innovation", "Digital Transformation"]
  },
  {
    id: 4,
    title: "Quantum Computing: The Next Frontier",
    speaker: "Dr. Sundar Pichai (Google CEO)",
    description: "Exploring quantum computing breakthroughs, their applications, and impact on solving real-world problems",
    category: "Quantum Tech",
    duration: 85,
    date: "2024-10-28",
    listenerCount: 89000,
    rating: 4.8,
    topics: ["Quantum Computing", "Google", "Future Tech", "Research"]
  },
  {
    id: 5,
    title: "The Age of Artificial General Intelligence",
    speaker: "Sam Altman (OpenAI CEO)",
    description: "Deep dive into AGI, language models, ChatGPT's impact, and the future of AI-human collaboration",
    category: "AI & Future",
    duration: 78,
    date: "2024-10-20",
    listenerCount: 203000,
    rating: 4.9,
    topics: ["AGI", "ChatGPT", "Language Models", "AI Safety"]
  },
  {
    id: 6,
    title: "Cybersecurity in the Modern Age",
    speaker: "Sheryl Sandberg & Cybersecurity Experts",
    description: "Panel discussion on protecting data, cybersecurity strategies, and staying secure in digital world",
    category: "Security",
    duration: 65,
    date: "2024-10-15",
    listenerCount: 67000,
    rating: 4.6,
    topics: ["Cybersecurity", "Data Protection", "Privacy", "Security Strategy"]
  },
  {
    id: 7,
    title: "The Future of Work: Remote, Hybrid & Beyond",
    speaker: "Jensen Huang (NVIDIA CEO)",
    description: "Vision for future of work, AI-powered productivity, and new opportunities in tech careers",
    category: "Future of Work",
    duration: 72,
    date: "2024-10-10",
    listenerCount: 112000,
    rating: 4.7,
    topics: ["Future of Work", "AI", "Productivity", "Tech Careers"]
  },
  {
    id: 8,
    title: "Building Sustainable Technology",
    speaker: "Tim Cook (Apple CEO)",
    description: "Apple's environmental initiatives, sustainable tech, and responsible innovation for better future",
    category: "Sustainability",
    duration: 55,
    date: "2024-10-05",
    listenerCount: 98000,
    rating: 4.5,
    topics: ["Sustainability", "Environment", "Responsible Tech", "Innovation"]
  },
  {
    id: 9,
    title: "The Creator Economy & Digital Platforms",
    speaker: "Sarah Gooding (Tech Journalist)",
    description: "How creators monetize, influence of platforms, and emerging opportunities in digital economy",
    category: "Digital Economy",
    duration: 68,
    date: "2024-09-28",
    listenerCount: 76000,
    rating: 4.6,
    topics: ["Creator Economy", "Platforms", "Digital Business", "Monetization"]
  },
  {
    id: 10,
    title: "Life Lessons from Building Companies",
    speaker: "Naval Ravikant (Entrepreneur & Philosopher)",
    description: "Wisdom on building businesses, personal finance, and finding meaning in entrepreneurship",
    category: "Entrepreneurship",
    duration: 95,
    date: "2024-09-20",
    listenerCount: 145000,
    rating: 4.8,
    topics: ["Entrepreneurship", "Finance", "Philosophy", "Success"]
  }
];

export default function Podcasts() {
  const categories = ["All", ...Array.from(new Set(podcasts.map(p => p.category)))];

  const PodcastCard = ({ podcast }: { podcast: Podcast }) => (
    <Card className="hover-elevate flex flex-col">
      <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <Microphone className="h-16 w-16 text-primary/30" />
      </div>
      <CardContent className="flex-1 pt-4 space-y-3">
        <div>
          <Badge variant="secondary" className="mb-2">{podcast.category}</Badge>
          <h3 className="font-semibold line-clamp-2">{podcast.title}</h3>
          <p className="text-sm text-muted-foreground font-medium">{podcast.speaker}</p>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{podcast.description}</p>
        <div className="flex flex-wrap gap-1">
          {podcast.topics.slice(0, 2).map(topic => (
            <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-4">
            <span>⏱️ {podcast.duration} min</span>
            <span>👥 {(podcast.listenerCount / 1000).toFixed(0)}K listeners</span>
          </div>
          <span className="text-yellow-600">⭐ {podcast.rating}</span>
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <Button size="sm" className="w-full">Listen Now</Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Tech & Innovation Podcasts</h1>
        <p className="text-muted-foreground">Learn from visionary leaders, entrepreneurs, and thought leaders shaping the future</p>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="All">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="rounded-full">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {podcasts
                  .filter(p => category === "All" || p.category === category)
                  .map(podcast => (
                    <PodcastCard key={podcast.id} podcast={podcast} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Featured Speakers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from(new Set(podcasts.map(p => p.speaker))).slice(0, 6).map(speaker => (
              <div key={speaker} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg">
                <User className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{speaker}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
