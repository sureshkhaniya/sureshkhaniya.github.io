document.addEventListener("DOMContentLoaded", () => {
  const choices = [...document.querySelectorAll(".incident-choice")];
  const output = document.getElementById("incidentOutput");
  const progress = [...document.querySelectorAll(".incident-progress span")];
  const reset = document.getElementById("incidentReset");

  if (!choices.length || !output) return;

  let step = 0;
  const maxSteps = 3;
  const history = [];

  const responses = {
    logs: {
      text: "[logs] Error rate rises only on requests that touch the database. Application startup and routing look healthy.\n\nNext thought: narrow the failure boundary before changing code.",
      score: 1
    },
    database: {
      text: "[database] Connection pool saturation appears immediately after the deploy. Query latency is normal, but active connections spike.\n\nNext thought: inspect the change that altered connection lifecycle behavior.",
      score: 1
    },
    diff: {
      text: "[diff] The deploy introduced a helper that opens a database connection but does not release it on one exception path.\n\nLikely root cause found. Fix the leak, test the failure path, then verify pool recovery under load.",
      score: 1
    },
    rollback: {
      text: "[rollback] A rollback may restore service, but it hides the mechanism. I would use it if user impact is severe, while still preserving evidence and continuing root-cause analysis.",
      score: 0
    },
    restart: {
      text: "[restart] Restarting clears the symptom temporarily, but the connection pool begins climbing again. That suggests a recurring resource leak rather than a one-time startup issue.",
      score: 0
    },
    guess: {
      text: "[guess] Changing code before collecting evidence increases the chance of creating a second problem. I prefer to reduce uncertainty first.",
      score: 0
    }
  };

  const renderProgress = () => {
    progress.forEach((item, index) => item.classList.toggle("done", index < step));
  };

  const finishIfReady = () => {
    const goodMoves = history.filter((item) => responses[item]?.score === 1).length;
    if (step < maxSteps) return;

    choices.forEach((button) => button.disabled = true);
    if (goodMoves >= 2) {
      output.textContent += "\n\n✓ INCIDENT APPROACH COMPLETE\nEvidence → isolate boundary → inspect change → fix → verify.\n\nThat sequence is how I prefer to debug: reduce uncertainty, avoid random changes, and verify the real cause.";
    } else {
      output.textContent += "\n\nINCIDENT REVIEW\nThe quickest-looking action is not always the safest engineering action. My default is to collect evidence, isolate the failing boundary, then make the smallest verified change.";
    }
  };

  choices.forEach((button) => {
    button.addEventListener("click", () => {
      if (step >= maxSteps) return;
      const action = button.dataset.action;
      const result = responses[action];
      if (!result) return;

      step += 1;
      history.push(action);
      choices.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      output.textContent = result.text;
      renderProgress();
      finishIfReady();
    });
  });

  if (reset) {
    reset.addEventListener("click", () => {
      step = 0;
      history.length = 0;
      choices.forEach((button) => {
        button.disabled = false;
        button.classList.remove("active");
      });
      output.textContent = "Choose your first move. There is no trick—the point is to see how an engineer reduces uncertainty.";
      renderProgress();
    });
  }
});