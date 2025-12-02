import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Send, Lightbulb, Code } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AIMentor() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [responses, setResponses] = useState<Array<{ question: string; answer: string; timestamp: string }>>([]);

  const askMutation = useMutation({
    mutationFn: async (q: string) => {
      const res = await fetch("/api/ai/mentorship/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context }),
      });
      if (!res.ok) throw new Error("Failed to get mentor response");
      return res.json();
    },
    onSuccess: (data) => {
      setResponses(prev => [...prev, { 
        question, 
        answer: data.answer, 
        timestamp: new Date().toLocaleTimeString() 
      }]);
      setQuestion("");
      setContext("");
    },
    onError: (error: any) => handleError(error),
  });

  const feedbackMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch("/api/ai/mentorship/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "javascript" }),
      });
      if (!res.ok) throw new Error("Failed to get code feedback");
      return res.json();
    },
    onSuccess: (data) => {
      setResponses(prev => [...prev, { 
        question: "Code Review", 
        answer: data.feedback, 
        timestamp: new Date().toLocaleTimeString() 
      }]);
      setQuestion("");
    },
    onError: (error: any) => handleError(error),
  });

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          AI Mentor
        </h1>
        <p className="text-muted-foreground">Get personalized guidance and code feedback from your AI mentor</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ask Question Section */}
        <Card className="lg:col-span-2 hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Ask a Question
            </CardTitle>
            <CardDescription>Get expert guidance on any tech topic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Context (optional)</label>
              <Input
                placeholder="e.g., I'm learning React hooks..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                disabled={askMutation.isPending}
                data-testid="input-context"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Question</label>
              <Textarea
                placeholder="Ask me anything about coding, architecture, best practices..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={askMutation.isPending}
                className="min-h-24"
                data-testid="textarea-question"
              />
            </div>
            <Button
              onClick={() => askMutation.mutate(question)}
              disabled={!question.trim() || askMutation.isPending}
              className="w-full"
              data-testid="button-ask-mentor"
            >
              <Send className="mr-2 h-4 w-4" />
              {askMutation.isPending ? "Thinking..." : "Ask Mentor"}
            </Button>
          </CardContent>
        </Card>

        {/* Code Review Section */}
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Code className="h-5 w-5" />
              Code Review
            </CardTitle>
            <CardDescription className="text-xs">Get AI feedback on your code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Paste your code here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={feedbackMutation.isPending}
              className="min-h-32 text-xs"
              data-testid="textarea-code"
            />
            <Button
              onClick={() => feedbackMutation.mutate(question)}
              disabled={!question.trim() || feedbackMutation.isPending}
              size="sm"
              className="w-full"
              data-testid="button-review-code"
            >
              {feedbackMutation.isPending ? "Analyzing..." : "Review Code"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Responses */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Mentor Responses</h2>
        {responses.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              No responses yet. Ask a question to get started!
            </CardContent>
          </Card>
        ) : (
          responses.map((resp, idx) => (
            <Card key={idx} className="hover-elevate">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{resp.question}</CardTitle>
                  <Badge variant="outline" className="text-xs">{resp.timestamp}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{resp.answer}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
