import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import {
  Sparkles,
  Send,
  Code,
  Bug,
  Lightbulb,
  Map,
  BookOpen,
  Trash2,
  Copy,
  Check,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const quickActions = [
  { icon: Code, label: "Explain Code", prompt: "Can you explain this code?" },
  { icon: Bug, label: "Debug Help", prompt: "Help me debug this issue:" },
  { icon: Lightbulb, label: "Generate Ideas", prompt: "Give me project ideas for" },
  { icon: Map, label: "Create Roadmap", prompt: "Create a learning roadmap for" },
  { icon: BookOpen, label: "Teach Concept", prompt: "Teach me about" },
];

function MessageBubble({ message, isUser }: { message: ChatMessage; isUser: boolean }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect response type for badge
  const detectType = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes("debug")) return "debugging";
    if (lower.includes("algorithm")) return "algorithm";
    if (lower.includes("learn")) return "learning";
    if (lower.includes("optimi")) return "optimization";
    if (lower.includes("design") || lower.includes("system")) return "design";
    return "response";
  };

  const responseType = !isUser ? detectType(message.content) : "";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-2">
        {!isUser && responseType && (
          <Badge variant="outline" className="w-fit text-xs">
            {responseType.toUpperCase()}
          </Badge>
        )}
        <div
          className={`group relative max-w-[80%] rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <div className="whitespace-pre-wrap text-sm">{message.content}</div>
          {!isUser && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-10 top-0 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4 text-chart-5" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CodeMentor() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      try {
        console.log("[CodeMentor] Sending message:", content.substring(0, 50));
        
        // Use the test endpoint - simpler, no auth needed
        const encodedQuestion = encodeURIComponent(content);
        const response = await fetch(`/api/test-ai/${encodedQuestion}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log("[CodeMentor] Got response:", data);
        
        if (data?.error) {
          throw new Error(data.error);
        }
        return data;
      } catch (error: any) {
        console.error("[CodeMentor] Error:", error);
        throw new Error(error.message || "Failed to get response from CodeMentor");
      }
    },
    onMutate: async (content) => {
      setMessages((prev) => [...prev, { role: "user", content }]);
      setInput("");
    },
    onSuccess: (data: any) => {
      console.log("[CodeMentor] Success - data:", data);
      const responseText = data.response || data.message || "No response";
      console.log("[CodeMentor] Displaying response:", responseText.substring(0, 100));
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText },
      ]);
    },
    onError: (error: any) => {
      console.error("[CodeMentor] Mutation error:", error);
      setMessages((prev) => prev.slice(0, -1));
      toast({
        title: "CodeMentor Error",
        description: error?.message || "Failed to get response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !sendMessage.isPending) {
      sendMessage.mutate(input.trim());
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt + " ");
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "Your conversation has been cleared.",
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/20 backdrop-blur-sm">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold">CodeMentor</h1>
              <p className="text-sm text-muted-foreground">Your AI coding companion - uses best available model</p>
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="icon" onClick={clearChat} className="hover-elevate">
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden border-primary/20 bg-card/60 backdrop-blur-sm shadow-2xl">
        <CardContent className="flex flex-1 flex-col p-0">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mt-6 font-display text-2xl font-bold">
                  How can I help you today?
                </h2>
                <p className="mt-2 max-w-md text-muted-foreground">
                  I can explain code, help debug issues, generate ideas, create learning
                  roadmaps, and teach you new concepts.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      onClick={() => handleQuickAction(action.prompt)}
                      className="gap-2"
                      data-testid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <action.icon className="h-4 w-4" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <MessageBubble
                    key={index}
                    message={message}
                    isUser={message.role === "user"}
                  />
                ))}
                {sendMessage.isPending && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 rounded-2xl bg-muted px-4 py-3">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about coding, debugging, or learning..."
                className="min-h-[60px] flex-1 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                data-testid="input-ai-message"
              />
              <Button
                type="submit"
                size="icon"
                className="h-[60px] w-[60px]"
                disabled={!input.trim() || sendMessage.isPending}
                data-testid="button-send-ai-message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
