document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("mainNav");
  const toggle = document.querySelector(".nav-toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in-view"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    reveals.forEach((el) => observer.observe(el));
  }

  if (!reducedMotion) {
    window.addEventListener("pointermove", (event) => {
      document.body.style.setProperty("--mx", `${event.clientX}px`);
      document.body.style.setProperty("--my", `${event.clientY}px`);
    }, { passive: true });
  }

  initPortfolioChatbot(reducedMotion);
});

function initPortfolioChatbot(reducedMotion) {
  const consoleEl = document.querySelector(".ai-console");
  const body = document.getElementById("consoleBody");
  const form = document.getElementById("consoleForm");
  const input = document.getElementById("consoleInput");
  const prompts = document.querySelector(".console-prompts");
  const promptButtons = document.querySelectorAll(".prompt-btn");
  const title = document.querySelector(".console-title strong");
  const subtitle = document.querySelector(".console-title span");
  const status = document.querySelector(".console-status");
  const note = document.querySelector(".console-note");

  if (!consoleEl || !body || !form || !input || !prompts) return;

  consoleEl.classList.add("lead-chat");
  if (title) title.textContent = "Suresh AI Concierge";
  if (subtitle) subtitle.textContent = "Portfolio chatbot + direct handoff";
  if (status) status.textContent = "ready · private";

  const progress = document.createElement("div");
  progress.className = "lead-progress";
  progress.innerHTML = `
    <div class="lead-step active" data-step="name"><span>01 Name</span></div>
    <div class="lead-step" data-step="email"><span>02 Email</span></div>
    <div class="lead-step" data-step="need"><span>03 Need</span></div>
    <div class="lead-step" data-step="chat"><span>04 Chat</span></div>
  `;
  const header = consoleEl.querySelector(".console-head");
  if (header) header.insertAdjacentElement("afterend", progress);

  const handoff = document.createElement("div");
  handoff.className = "handoff-row";
  handoff.innerHTML = `
    <button class="handoff-btn" type="button">Email this chat to Suresh ↗</button>
    <button class="restart-chat" type="button">Start over</button>
  `;
  form.insertAdjacentElement("beforebegin", handoff);

  if (note) {
    note.className = "lead-privacy";
    note.innerHTML = "<strong>Privacy:</strong> your name, email, and chat stay in this browser until you click “Email this chat to Suresh.” Gmail then opens a prepared draft for you to review and send.";
  }

  const state = {
    step: "name",
    name: "",
    email: "",
    need: "",
    transcript: []
  };

  const knowledge = {
    background: "Suresh combines software engineering with systems and infrastructure experience. His portfolio spans production engineering, backend services, healthcare technology, automation, Linux, cloud fundamentals, databases, and academic software projects.",
    impact: "Highlighted outcomes include work across 20+ healthcare facilities, a reported 40% performance improvement through implementation readiness, a 35% reduction in bug density through code-quality practices, and 95% software-platform adoption through training and guidance.",
    ai: "His AI/ML foundation includes Python tooling, data preprocessing, model training and evaluation, Conda and virtual environments, plus an engineering emphasis on reproducibility, reliability, APIs, and maintainable systems.",
    stack: "Technologies represented across the portfolio include Java, JavaScript, Node.js, Express, Python, C++, C#, .NET, SQL Server, MySQL, MongoDB, Linux, Azure, Git, GitHub, GitLab, EJS, WPF, Bootstrap, Stripe, and relational database tooling.",
    projects: "Featured work includes an airline reservation system built with C#/WPF/.NET, the MOAB Family RV Park reservation-system design using Node.js, Express, MySQL, Bootstrap, and Stripe, a Node.js/Express/EJS word-association application, a Java banking application, and relational database design work.",
    experience: "Professional experience shown on the portfolio covers healthcare technology consulting, software production engineering, and public-sector technical project leadership, including APIs, SQL, automation, Linux, Azure identity, deployments, troubleshooting, and team delivery.",
    strengths: "The recurring strengths across the portfolio are systems thinking, clean architecture, troubleshooting, automation, backend development, disciplined Git workflows, and translating technical work into measurable operational outcomes.",
    moab: "The MOAB Family RV Park project is a team-led software requirements and design effort with Suresh listed as Team Lead. It modernizes a paper-and-phone campground workflow with online reservations, Stripe payments, customer/employee/admin roles, reporting, audit logging, and no-double-booking rules. The design uses Node.js, Express, MySQL, and Bootstrap and includes UML use-case, activity, class and sequence diagrams, an ER diagram, and UI mockups.",
    contact: "If you want to discuss a role, collaboration, project, or technical question with Suresh directly, use the “Email this chat to Suresh” button below. It prepares your name, email, reason for reaching out, and chat transcript in Gmail for you to review and send."
  };

  const chooseAnswer = (question) => {
    const text = question.toLowerCase();
    if (/contact|email|reach|hire|interview|available|connect|talk/.test(text)) return knowledge.contact;
    if (/moab|rv park|campground|reservation system|stripe|double.?book/.test(text)) return knowledge.moab;
    if (/strength|best|standout|different/.test(text)) return knowledge.strengths;
    if (/ai|machine|model|python|ml/.test(text)) return knowledge.ai;
    if (/impact|metric|result|percent|performance|outcome/.test(text)) return knowledge.impact;
    if (/stack|tech|language|tool|framework/.test(text)) return knowledge.stack;
    if (/project|build|portfolio|airline|bank|rv/.test(text)) return knowledge.projects;
    if (/experience|role|work|career|healthcare|production/.test(text)) return knowledge.experience;
    if (/background|summary|about|who|suresh/.test(text)) return knowledge.background;
    return "I can help with Suresh's background, strengths, experience, projects, technologies, AI/ML foundation, impact, or the MOAB system-design project. You can also tell me more about what your team needs, and I’ll point you to the most relevant parts of the portfolio.";
  };

  const updateProgress = () => {
    const order = ["name", "email", "need", "chat"];
    const current = order.indexOf(state.step);
    progress.querySelectorAll(".lead-step").forEach((item, index) => {
      item.classList.toggle("active", index === current);
      item.classList.toggle("done", index < current);
    });
  };

  const addMessage = (text, user = false, system = false, record = true) => {
    const message = document.createElement("p");
    message.className = `message${user ? " user" : ""}${system ? " system" : ""}`;
    message.textContent = text;
    body.appendChild(message);
    body.scrollTop = body.scrollHeight;

    if (record) {
      state.transcript.push({ speaker: user ? "Visitor" : "Suresh AI", text });
    }
    return message;
  };

  const streamMessage = (text, record = true) => {
    const message = addMessage("", false, false, false);
    message.classList.add("typing");

    if (reducedMotion) {
      message.textContent = text;
      message.classList.remove("typing");
      if (record) state.transcript.push({ speaker: "Suresh AI", text });
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      message.textContent = text.slice(0, index);
      body.scrollTop = body.scrollHeight;
      if (index >= text.length) {
        clearInterval(timer);
        message.classList.remove("typing");
        if (record) state.transcript.push({ speaker: "Suresh AI", text });
      }
    }, 7);
  };

  const setInput = (placeholder, type = "text") => {
    input.type = type;
    input.placeholder = placeholder;
    input.value = "";
    input.classList.remove("input-error");
    window.setTimeout(() => input.focus({ preventScroll: true }), 50);
  };

  const setChatReady = () => {
    state.step = "chat";
    updateProgress();
    prompts.classList.remove("is-locked");
    handoff.classList.add("visible");
    setInput("Ask about projects, experience, systems, AI, or Suresh...", "text");
    streamMessage(`Thanks, ${state.name}. I’ve got the context. Ask me anything about Suresh’s work, or keep describing what you need. When you’re ready, use “Email this chat to Suresh” and I’ll prepare everything for his Gmail inbox.`);
  };

  const handleOnboarding = (value) => {
    if (state.step === "name") {
      if (value.length < 2) {
        input.classList.add("input-error");
        addMessage("Please enter your name so I know how to address you.", false, true, false);
        return;
      }
      state.name = value.slice(0, 80);
      addMessage(state.name, true);
      state.step = "email";
      updateProgress();
      setInput("Your email address", "email");
      streamMessage(`Nice to meet you, ${state.name.split(/\s+/)[0]}. What email should Suresh use if he follows up?`);
      return;
    }

    if (state.step === "email") {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
      if (!emailOk) {
        input.classList.add("input-error");
        addMessage("That email doesn’t look complete. Please enter a valid address such as name@example.com.", false, true, false);
        return;
      }
      state.email = value.slice(0, 160);
      addMessage(state.email, true);
      state.step = "need";
      updateProgress();
      setInput("Hiring, collaboration, project inquiry, question...", "text");
      streamMessage("Great. What brings you here today? Tell me what you’re hiring for, building, evaluating, or hoping to discuss with Suresh.");
      return;
    }

    if (state.step === "need") {
      if (value.length < 4) {
        input.classList.add("input-error");
        addMessage("Give me a little more context so Suresh knows what you need.", false, true, false);
        return;
      }
      state.need = value.slice(0, 500);
      addMessage(state.need, true);
      setChatReady();
    }
  };

  const answerQuestion = (question) => {
    const clean = question.trim();
    if (!clean) return;

    if (state.step !== "chat") {
      handleOnboarding(clean);
      return;
    }

    addMessage(clean, true);
    input.value = "";
    streamMessage(chooseAnswer(clean));
  };

  const buildEmailBody = () => {
    const transcriptText = state.transcript
      .map((entry) => `${entry.speaker}: ${entry.text}`)
      .join("\n\n");

    return [
      "Hello Suresh,",
      "",
      "I reached you through the AI chatbot on your portfolio website.",
      "",
      `Name: ${state.name}`,
      `Email: ${state.email}`,
      `What I need: ${state.need}`,
      "",
      "Chat transcript:",
      "------------------------------",
      transcriptText,
      "------------------------------",
      "",
      `Please follow up with me at ${state.email}.`
    ].join("\n");
  };

  const openGmailHandoff = () => {
    if (state.step !== "chat") return;
    const subject = `Portfolio inquiry from ${state.name}`;
    const bodyText = buildEmailBody();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent("khaniyasuresh12@gmail.com")}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    const popup = window.open(gmailUrl, "_blank", "noopener,noreferrer");

    if (!popup) {
      window.location.href = `mailto:khaniyasuresh12@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    }

    addMessage("I opened a prepared email to Suresh with your contact details and this chat. Review it, then press Send in Gmail so it reaches him.", false, true, false);
  };

  const resetChat = () => {
    state.step = "name";
    state.name = "";
    state.email = "";
    state.need = "";
    state.transcript = [];
    body.innerHTML = "";
    prompts.classList.add("is-locked");
    handoff.classList.remove("visible");
    updateProgress();
    setInput("Your name", "text");
    addMessage("Hi — I’m Suresh’s AI portfolio concierge. Before we chat, what’s your name?", false, false, false);
    addMessage("I’ll ask for an email and what you need, then I can answer portfolio questions and prepare a Gmail message to Suresh when you choose to send it.", false, true, false);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    answerQuestion(input.value);
  });

  promptButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (state.step !== "chat") return;
      answerQuestion(button.dataset.question || button.textContent || "");
    });
  });

  const handoffButton = handoff.querySelector(".handoff-btn");
  const restartButton = handoff.querySelector(".restart-chat");
  if (handoffButton) handoffButton.addEventListener("click", openGmailHandoff);
  if (restartButton) restartButton.addEventListener("click", resetChat);

  resetChat();
}
