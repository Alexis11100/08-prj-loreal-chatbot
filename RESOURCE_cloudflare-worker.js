export default {
  async fetch(request, env) {
    const { messages } = await request.json();
    
    const lastUser = messages[messages.length - 1].content.toLowerCase();
    const allowed = ["l'oreal", "loreal", "makeup", "skincare", "haircare", "beauty"];

    if (!allowed.some(word => lastUser.includes(word))) {
      return new Response(JSON.stringify({
        reply: "I can only answer questions about L'Oréal products, beauty routines, skincare, makeup, haircare, and fragrances."
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // ⭐ After this point, the question is allowed → call OpenAI
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
