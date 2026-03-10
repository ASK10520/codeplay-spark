import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";

    if (mode === "explain") {
      systemPrompt = `You are a friendly AI coding tutor for kids aged 6-14. When a student pastes code:
- Explain what EACH line does in simple, fun language
- Use analogies kids understand (like building blocks, recipes, games)
- Use emojis to make it engaging
- Point out cool things they did well
- Gently suggest improvements without being harsh
- Keep explanations short and fun
- Format with markdown for readability`;
    } else if (mode === "review") {
      systemPrompt = `You are a kid-friendly AI code reviewer. When reviewing student code:
- Score the code on: Correctness (0-25), Logic (0-25), Creativity (0-25), Readability (0-25)
- Start with what they did well (be encouraging!)
- Use fun language and emojis
- Give specific, actionable improvement suggestions
- Format as a structured review with sections
- End with an encouraging message
- Return scores in this format at the start: [SCORES: correctness=X, logic=X, creativity=X, readability=X]`;
    } else {
      systemPrompt = `You are CodeBuddy 🤖, a friendly AI coding tutor for kids aged 6-14 learning Scratch, Python, and Web Development.

RULES:
- Be encouraging, patient, and fun! Use emojis 🎮✨🚀
- NEVER give complete solutions directly
- Give progressive hints: first a gentle nudge, then a bigger hint if they're still stuck
- Explain concepts with real-world analogies kids understand
- Use simple language - imagine explaining to a curious 10-year-old
- When they succeed, celebrate with them! 🎉
- Keep responses concise (under 150 words when possible)
- Format with markdown for code blocks and emphasis
- If they paste code, explain what it does step by step
- Suggest improvements gently: "What if we tried..." rather than "You should..."`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests! Take a breather and try again in a moment 😊" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits have run out. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI tutor is taking a nap. Try again!" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-tutor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
