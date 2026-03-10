import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, X, Minimize2, Maximize2, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`;

async function streamChat({
  messages,
  mode,
  onDelta,
  onDone,
}: {
  messages: Message[];
  mode: string;
  onDelta: (text: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, mode }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Something went wrong" }));
    throw new Error(err.error || "Failed to connect to AI tutor");
  }

  if (!resp.body) throw new Error("No response body");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  onDone();
}

interface AiTutorChatProps {
  contextHint?: string;
}

export function AiTutorChat({ contextHint }: AiTutorChatProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isLoading) return;
    if (!user) {
      toast.error("Please log in to chat with CodeBuddy!");
      return;
    }

    const userMsg: Message = { role: "user", content: input };
    const allMessages = [...messages, userMsg];
    if (contextHint) {
      allMessages.unshift({ role: "user", content: `[Context: Student is working on: ${contextHint}]` });
    }

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: allMessages,
        mode: "chat",
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
      });
    } catch (e: any) {
      console.error(e);
      setIsLoading(false);
      toast.error(e.message || "AI tutor error");
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--badge-purple))] text-white shadow-lg hover:scale-110 transition-transform flex items-center justify-center animate-bounce-in"
      >
        <Bot className="w-7 h-7" />
      </button>
    );
  }

  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-72 shadow-xl border-2 border-secondary/30 cursor-pointer" onClick={() => setMinimized(false)}>
          <CardHeader className="p-3 flex-row items-center justify-between bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--badge-purple))] rounded-t-xl">
            <div className="flex items-center gap-2 text-white">
              <Bot className="w-5 h-5" />
              <span className="font-fredoka font-bold text-sm">CodeBuddy</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon-sm" className="text-white/80 hover:text-white h-6 w-6" onClick={(e) => { e.stopPropagation(); setMinimized(false); }}>
                <Maximize2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon-sm" className="text-white/80 hover:text-white h-6 w-6" onClick={(e) => { e.stopPropagation(); setOpen(false); }}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-2 border-secondary/30 flex flex-col h-[520px]">
        {/* Header */}
        <CardHeader className="p-3 flex-row items-center justify-between bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--badge-purple))] rounded-t-xl shrink-0">
          <div className="flex items-center gap-2 text-white">
            <Bot className="w-5 h-5" />
            <span className="font-fredoka font-bold">CodeBuddy</span>
            <Sparkles className="w-4 h-4 text-[hsl(var(--star-yellow))]" />
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-sm" className="text-white/80 hover:text-white h-7 w-7" onClick={() => setMinimized(true)}>
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" className="text-white/80 hover:text-white h-7 w-7" onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <span className="text-5xl block mb-3">🤖</span>
              <p className="font-fredoka font-bold text-lg text-foreground">Hi! I'm CodeBuddy!</p>
              <p className="text-sm text-muted-foreground mt-1">Ask me coding questions, paste code for explanations, or ask for hints! 🚀</p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {["How do loops work?", "Explain my code", "I'm stuck!"].map((q) => (
                  <Badge
                    key={q}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary/10 text-xs"
                    onClick={() => { setInput(q); }}
                  >
                    {q}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border shrink-0">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask CodeBuddy anything... 🎮"
              className="min-h-[42px] max-h-[100px] resize-none text-sm"
              rows={1}
            />
            <Button
              size="icon"
              onClick={send}
              disabled={!input.trim() || isLoading}
              className="shrink-0 h-[42px] w-[42px]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
