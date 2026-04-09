/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// 🔗 Replace this with your Cloudflare Worker URL
const WORKER_URL = "https://08-prj-loreal-chatbot.alexisbentley564.workers.dev/";

// 🧠 Conversation history (LevelUp)
let messages = [
  {
    role: "system",
    content:
      "You are a helpful, friendly AI beauty advisor for L'Oréal. " +
      "You ONLY answer questions related to L'Oréal products, routines, " +
      "beauty concerns, ingredients, and recommendations. " +
      "If a question is unrelated, politely decline and guide the user back to beauty topics."
  }
];

// Initial greeting
chatWindow.innerHTML = `<div class="message bot">👋 Hello! How can I help you today?</div>`;

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  // Show user message
  addMessage(text, "user");

  // Add to history
  messages.push({ role: "user", content: text });

  // Clear input
  userInput.value = "";

  // Temporary "typing" bubble
  const thinking = addMessage("Typing…", "bot", true);

  // Send to Worker
  const reply = await sendToWorker(messages);

  // Remove typing bubble
  thinking.remove();

  // Show bot reply
  addMessage(reply, "bot");

  // Add to history
  messages.push({ role: "assistant", content: reply });
});

/* Add message bubble to chat */
function addMessage(text, sender, temporary = false) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;

  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  return div;
}

/* Send conversation to Cloudflare Worker */
async function sendToWorker(messages) {
  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.error(err);
    return "Sorry, I couldn’t reach the beauty assistant right now.";
  }
}
