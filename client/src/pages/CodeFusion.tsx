import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Zap, Plus, Trash2, Copy } from "lucide-react";

interface CodeSnippet {
  id: string;
  code: string;
  language: string;
}

export default function CodeFusion() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [newCode, setNewCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [title, setTitle] = useState("");
  const [blendedCode, setBlendedCode] = useState("");
  const { toast } = useToast();

  const addSnippet = () => {
    if (!newCode.trim()) {
      toast({ title: "Error", description: "Please enter code", variant: "destructive" });
      return;
    }
    setSnippets([...snippets, { id: Date.now().toString(), code: newCode, language }]);
    setNewCode("");
  };

  const removeSnippet = (id: string) => {
    setSnippets(snippets.filter((s) => s.id !== id));
  };

  const blendSnippets = () => {
    if (snippets.length < 2) {
      toast({ title: "Error", description: "Add at least 2 snippets to blend", variant: "destructive" });
      return;
    }
    const combined = snippets.map((s, i) => `// Snippet ${i + 1}\n${s.code}`).join("\n\n");
    setBlendedCode(combined);
    toast({ title: "Success", description: "Code blended successfully!" });
  };

  const copyBlended = () => {
    navigator.clipboard.writeText(blendedCode);
    toast({ title: "Copied", description: "Blended code copied to clipboard" });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/20">
          <Zap className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold font-display">CodeFusion</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Blend multiple code snippets into one powerful solution</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Add Code Snippets</CardTitle>
            <CardDescription>Mix code from different sources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="e.g. React + TailwindCSS Blend" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full border rounded p-2 text-sm">
                <option>javascript</option>
                <option>typescript</option>
                <option>python</option>
                <option>react</option>
                <option>css</option>
                <option>html</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Code Snippet</label>
              <Textarea placeholder="Paste code here..." value={newCode} onChange={(e) => setNewCode(e.target.value)} className="min-h-[120px]" />
            </div>
            <Button onClick={addSnippet} className="w-full gap-2">
              <Plus className="h-4 w-4" /> Add Snippet ({snippets.length}/5)
            </Button>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Snippets Added</CardTitle>
            <CardDescription>Added {snippets.length} snippets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {snippets.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No snippets yet. Add your first code snippet!</p>
            ) : (
              <>
                {snippets.map((snippet, idx) => (
                  <div key={snippet.id} className="p-3 rounded-lg bg-muted border">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs">Snippet {idx + 1} • {snippet.language}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => removeSnippet(snippet.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <code className="text-xs break-all">{snippet.code.substring(0, 80)}...</code>
                  </div>
                ))}
                <Button onClick={blendSnippets} variant="default" className="w-full gap-2 mt-4">
                  <Zap className="h-4 w-4" /> Blend Snippets
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Blended Result */}
      {blendedCode && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Blended Code</CardTitle>
                <CardDescription>{title || "Your combined solution"}</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={copyBlended} className="gap-2">
                <Copy className="h-4 w-4" /> Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs sm:text-sm">
              <code>{blendedCode}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
