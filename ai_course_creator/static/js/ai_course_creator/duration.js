// js/duration.js
(function () {
  const section = document.getElementById("duration-section");

  section.innerHTML = `
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center px-4 relative overflow-hidden">

    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <div class="max-w-6xl mx-auto relative z-10 w-full">
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">

        <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-4">
            <span class="text-yellow-500 animate-pulse text-2xl mr-2">✨</span>
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-lg">
              Step 4: Course Duration
            </span>
            <span class="text-yellow-500 animate-pulse text-2xl ml-2">✨</span>
          </div>

          <span class="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-6 py-3 rounded-full text-sm font-medium border border-blue-200">
            ✨ Creating course on "<span id="duration-course-title"></span>"
          </span>
        </div>

        <div id="duration-audience-summary"
          class="hidden bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200 mb-8 text-center text-emerald-800 font-medium">
        </div>

        <h2 class="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          ⏰ How Long Should Your Course Be?
        </h2>

        <p class="text-xl text-gray-600 text-center mb-8 leading-relaxed">
          Choose the perfect duration to match your learning goals and available time.
        </p>

        <div id="duration-ai-banner"
          class="hidden bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-3xl p-6 shadow-lg mb-8">
          <div class="flex items-center justify-center space-x-3 mb-3">
            🤖 <span class="text-2xl font-bold text-blue-800">AI will optimize duration!</span> ✨
          </div>
          <p class="text-blue-700 text-center text-lg">
            I’ll analyze your topic and audience to determine the ideal duration.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          ${renderCard("1-2 hours","⚡","Quick & Focused","Perfect for busy schedules","from-yellow-500 to-orange-600",["Core concepts","Quick wins","Easy to complete"])}
          ${renderCard("3-5 hours","🎯","Comprehensive","Balanced theory & practice","from-blue-500 to-purple-600",["Detailed explanations","Hands-on practice","Real examples"])}
          ${renderCard("6+ hours","🚀","In-Depth Mastery","Advanced topics & projects","from-green-500 to-teal-600",["Advanced topics","Multiple projects","Expert-level content"])}
        </div>

        <div class="text-center mb-8">
          <button id="duration-ai-btn"
            class="px-8 py-4 rounded-3xl font-bold text-lg transition-all duration-300 transform hover:scale-105
            bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-2 border-gray-300">
            🤖 Let AI Optimize Duration
          </button>
        </div>

        <div class="flex justify-between items-center pt-8">
          <button id="duration-skip"
            class="px-8 py-4 text-gray-600 hover:text-gray-800 font-semibold rounded-2xl hover:bg-gray-100 transition-all hover:scale-105">
            ⏭️ Skip this step
          </button>

          <button id="duration-continue"
            class="px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all
            bg-gradient-to-r from-gray-600 to-gray-700 text-white">
            Continue
          </button>
        </div>

      </div>
    </div>
  </div>
  `;

  function syncDurationHeader() {
    const titleEl = document.getElementById("duration-course-title");
    if (titleEl) titleEl.textContent = AppState.topic || "";

    const summary = document.getElementById("duration-audience-summary");
    if (!summary || !AppState.audience) return;

    summary.classList.remove("hidden");

    if (AppState.audience.letAiDecide) {
      summary.textContent = "👥 Target Audience: AI will decide";
    } else {
      const map = {
        beginners: "Beginners",
        intermediate: "Intermediate",
        advanced: "Advanced"
      };
      summary.textContent = `👥 Target Audience: ${map[AppState.audience.audience]}`;
    }
  }

  window.syncDurationHeader = syncDurationHeader;
  syncDurationHeader();

  const cards = section.querySelectorAll(".duration-card");
  const aiBtn = document.getElementById("duration-ai-btn");
  const aiBanner = document.getElementById("duration-ai-banner");
  const continueBtn = document.getElementById("duration-continue");

  let selected = null;
  let aiDecide = false;

  function resetCards() {
    cards.forEach(c => {
      c.className = c.dataset.base;
      c.querySelector(".selected-badge").classList.add("hidden");
      c.querySelectorAll(".benefit").forEach(b => {
        b.className = "benefit flex items-center space-x-2 text-xs text-gray-600";
      });
    });
  }

  function updateContinueBtn() {
    if (aiDecide) {
      continueBtn.textContent = "🤖 Continue with AI Choice";
    } else if (selected) {
      continueBtn.textContent = `⏰ Continue with ${selected}`;
    } else {
      continueBtn.textContent = "Continue";
    }

    continueBtn.className =
      "px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all " +
      ((aiDecide || selected)
        ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white"
        : "bg-gradient-to-r from-gray-600 to-gray-700 text-white");
  }

  cards.forEach(card => {
    card.addEventListener("click", () => {
      aiDecide = false;
      aiBanner.classList.add("hidden");
      resetCards();

      card.classList.add(
        "scale-105","text-white","border-transparent","bg-gradient-to-r",
        ...card.dataset.gradient.split(" ")
      );

      card.querySelector(".selected-badge").classList.remove("hidden");
      card.querySelectorAll(".benefit").forEach(b => {
        b.className = "benefit flex items-center space-x-2 text-xs text-white/80";
      });

      selected = card.dataset.duration;
      updateContinueBtn();
    });
  });

  aiBtn.addEventListener("click", () => {
    aiDecide = true;
    selected = null;
    resetCards();
    aiBanner.classList.remove("hidden");
    updateContinueBtn();
  });

  continueBtn.addEventListener("click", () => {
    AppState.duration = {
      duration: aiDecide ? "ai-decided" : selected,
      letAiDecide: aiDecide
    };

    section.classList.add("hidden");

    // ✅ ONLY FIX: correct next step trigger
    window.showComponentsStep?.();
  });

  updateContinueBtn();

  function renderCard(value, emoji, title, desc, gradient, benefits) {
    return `
      <button
        data-duration="${value}"
        data-gradient="${gradient}"
        data-base="duration-card group relative p-8 rounded-3xl border-2 transition-all duration-300 transform hover:scale-105 border-gray-200 bg-white/60 backdrop-blur-sm text-gray-700 hover:border-blue-300 hover:shadow-xl"
        class="duration-card group relative p-8 rounded-3xl border-2 transition-all duration-300 transform hover:scale-105 border-gray-200 bg-white/60 backdrop-blur-sm text-gray-700 hover:border-blue-300 hover:shadow-xl">

        <div class="text-center space-y-6">
          <div class="text-6xl group-hover:scale-110 transition-transform">${emoji}</div>
          <h3 class="text-2xl font-bold">${title}</h3>
          <div class="text-lg font-semibold text-blue-600">${value}</div>
          <p class="text-sm text-gray-600">${desc}</p>

          <div class="space-y-2">
            ${benefits.map(b => `
              <div class="benefit flex items-center space-x-2 text-xs text-gray-600">
                <span>•</span><span>${b}</span>
              </div>
            `).join("")}
          </div>

          <div class="selected-badge hidden flex items-center justify-center space-x-2 mt-4">
            ⭐ <span class="font-semibold">Selected</span> ⭐
          </div>
        </div>
      </button>
    `;
  }
})();
