document.addEventListener("DOMContentLoaded", () => {
  const aiRoot = document.getElementById("ai-root");
  if (!aiRoot) return;

  // Container
  const aiContainer = document.createElement("div");
  aiContainer.style.maxWidth = "900px";
  aiContainer.style.margin = "120px auto";
  aiContainer.style.background = "#020617";
  aiContainer.style.borderRadius = "16px";
  aiContainer.style.boxShadow = "0 30px 80px rgba(0,0,0,0.5)";
  aiContainer.style.fontFamily = "monospace";
  aiContainer.style.color = "#e5e7eb";
  aiContainer.style.overflow = "hidden";

  // Header
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.padding = "14px 18px";
  header.style.background = "#0f172a";

  const dot = document.createElement("span");
  dot.style.width = "10px";
  dot.style.height = "10px";
  dot.style.background = "#22c55e";
  dot.style.borderRadius = "50%";
  dot.style.marginRight = "10px";

  const title = document.createElement("span");
  title.textContent = "AI Assistant";
  title.style.fontWeight = "600";

  const status = document.createElement("span");
  status.textContent = "online";
  status.style.marginLeft = "auto";
  status.style.fontSize = "0.8rem";
  status.style.color = "#94a3b8";

  header.append(dot, title, status);

  // Chat window
  const chat = document.createElement("div");
  chat.style.padding = "22px";
  chat.style.minHeight = "260px";

  function addMessage(text, isUser = false) {
    const msg = document.createElement("div");
    msg.textContent = text;
    msg.style.maxWidth = "75%";
    msg.style.padding = "12px 14px";
    msg.style.marginBottom = "14px";
    msg.style.borderRadius = "12px";
    msg.style.fontSize = "0.95rem";

    if (isUser) {
      msg.style.background = "#2563eb";
      msg.style.color = "#fff";
      msg.style.marginLeft = "auto";
    } else {
      msg.style.background = "#1e293b";
    }

    chat.appendChild(msg);
  }

  addMessage("Hello. Welcome to SureshChatBot.");
  addMessage("Suresh is my Successful Boss.Any misuse within this interface will be flagged within this simulated environment for review.", true);

  const typing = document.createElement("div");
  typing.textContent = "Thinking ▍";
  typing.style.fontStyle = "italic";
  typing.style.color = "#94a3b8";
  chat.appendChild(typing);

  let visible = true;
  setInterval(() => {
    typing.textContent = visible ? "AI Version of Suresh is in progress!!! ▍" : "Suresh likes Yadi, who is ghosting him, and yet he finds her attractive and WIFE Material";
    visible = !visible;
  }, 600);

  const inputRow = document.createElement("div");
  inputRow.style.display = "flex";
  inputRow.style.gap = "12px";
  inputRow.style.padding = "16px";
  inputRow.style.background = "#0f172a";

  const input = document.createElement("input");
  input.placeholder = "Ask something...";
  input.disabled = true;
  input.style.flex = "1";

  const button = document.createElement("button");
  button.textContent = "Send";
  button.disabled = true;

  inputRow.append(input, button);

  aiContainer.append(header, chat, inputRow);
  aiRoot.appendChild(aiContainer);
});
