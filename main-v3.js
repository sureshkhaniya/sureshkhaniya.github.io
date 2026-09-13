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

  initPortfolioGuide(reducedMotion);
});

function initPortfolioGuide(reducedMotion) {
  const body = document.getElementById("consoleBody");
  const form = document.getElementById("consoleForm");
  const input = document.getElementById("consoleInput");
  const prompts = document.querySelectorAll(".prompt-btn");

  if (!body || !form || !input) return;

  const knowledge = {
    background: "Suresh combines software engineering with systems and infrastructure experience. His portfolio spans production engineering, backend services, healthcare technology, automation, Linux, cloud fundamentals, databases, and academic software projects.",
    impact: "Highlighted outcomes include work across 20+ healthcare facilities, a reported 40% performance improvement through implementation readiness, a 35% reduction in bug density through code-quality practices, and 95% software-platform adoption through training and guidance.",
    ai: "His AI/ML foundation includes Python tooling, data preprocessing, model training and evaluation, Conda and virtual environments, plus an engineering emphasis on reproducibility, reliability, APIs, and maintainable systems.",
    stack: "Technologies represented across the portfolio include Java, JavaScript, Node.js, Express, Python, C++, C#, .NET, SQL Server, MySQL, MongoDB, Linux, Azure, Git, GitHub, GitLab, EJS, WPF, Bootstrap, Stripe, and relational database tooling.",
    projects: "Featured work includes an airline reservation system built with C#/WPF/.NET, the MOAB Family RV Park reservation-system design using Node.js, Express, MySQL, Bootstrap, and Stripe, a Node.js/Express/EJS word-association application, a Java banking application, and relational database design work.",
    experience: "Professional experience shown on the portfolio covers healthcare technology consulting, software production engineering, and public-sector technical project leadership, including APIs, SQL, automation, Linux, Azure identity, deployments, troubleshooting, and team delivery.",
    strengths: "The recurring strengths across the portfolio are systems thinking, clean architecture, troubleshooting, automation, backend development, disciplined Git workflows, and translating technical work into measurable operational outcomes.",
    moab: "The MOAB Family RV Park project is a team-led software requirements and design effort with Suresh listed as Team Lead. It modernizes a paper-and-phone campground workflow with online reservations, Stripe payments, customer/employee/admin roles, reporting, audit logging, and no-double-booking rules. The design uses Node.js, Express, MySQL, and Bootstrap and includes UML use-case, activity, class and sequence diagrams, an ER diagram, and UI mockups."
  };

  const chooseAnswer = (question) => {
    const text = question.toLowerCase();
    if (/moab|rv park|campground|reservation system|stripe|double.?book/.test(text)) return knowledge.moab;
    if (/strength|best|standout|different/.test(text)) return knowledge.strengths;
    if (/ai|machine|model|python|ml/.test(text)) return knowledge.ai;
    if (/impact|metric|result|percent|performance|outcome/.test(text)) return knowledge.impact;
    if (/stack|tech|language|tool|framework/.test(text)) return knowledge.stack;
    if (/project|build|portfolio|airline|bank|rv/.test(text)) return knowledge.projects;
    if (/experience|role|work|career|healthcare|production/.test(text)) return knowledge.experience;
    if (/background|summary|about|who|suresh/.test(text)) return knowledge.background;
    return "I can summarize the factual portfolio information here. Try asking about Suresh's background, strengths, impact, AI/ML, technologies, projects, the MOAB RV Park system design, or professional experience.";
  };

  const addMessage = (text, user = false) => {
    const message = document.createElement("p");
    message.className = `message${user ? " user" : ""}`;
    message.textContent = text;
    body.appendChild(message);
    body.scrollTop = body.scrollHeight;
    return message;
  };

  const answerQuestion = (question) => {
    const clean = question.trim();
    if (!clean) return;

    addMessage(clean, true);
    input.value = "";

    const answer = chooseAnswer(clean);
    const message = addMessage("");
    message.classList.add("typing");

    if (reducedMotion) {
      message.textContent = answer;
      message.classList.remove("typing");
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      message.textContent = answer.slice(0, index);
      body.scrollTop = body.scrollHeight;

      if (index >= answer.length) {
        clearInterval(timer);
        message.classList.remove("typing");
      }
    }, 7);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    answerQuestion(input.value);
  });

  prompts.forEach((button) => {
    button.addEventListener("click", () => {
      answerQuestion(button.dataset.question || button.textContent || "");
    });
  });
}
