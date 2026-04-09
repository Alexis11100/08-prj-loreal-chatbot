export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405 });
    }

    const { messages } = await request.json();

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7
      })
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "No response.";

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
