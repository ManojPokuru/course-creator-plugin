// js/audience.js
(function () {
  const section = document.getElementById("audience-section");

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
              Step 3: Target Audience
            </span>
            <span class="text-yellow-500 animate-pulse text-2xl ml-2">✨</span>
          </div>

          <span class="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-6 py-3 rounded-full text-sm font-medium border border-blue-200">
            ✨ Creating course on "<span id="audience-course-title"></span>"
          </span>
        </div>

        <div class="max-w-4xl mx-auto space-y-8">

          <h2 class="text-4xl font-bold text-gray-900 flex items-center justify-center">
            👥 Who's Your Target Audience?
          </h2>

          <p class="text-xl text-gray-600 text-center leading-relaxed">
            Help us tailor the content difficulty and teaching approach to perfectly match your learners' needs.
          </p>

          <div id="audience-ai-banner"
            class="hidden bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-3xl p-6 shadow-lg">
            <div class="flex items-center justify-center space-x-3 mb-3">
              🤖 <span class="text-2xl font-bold text-blue-800">AI will decide!</span> ✨
            </div>
            <p class="text-blue-700 text-center text-lg">
              I’ll analyze your course topic and automatically select the best audience.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${renderCard("beginners","🌱","Beginners","New to the topic, need foundational knowledge","from-green-500 to-emerald-600")}
            ${renderCard("intermediate","📚","Intermediate","Some experience, ready for deeper concepts","from-blue-500 to-cyan-600")}
            ${renderCard("advanced","🚀","Advanced","Experienced learners, need expert-level content","from-purple-500 to-pink-600")}
          </div>

          <div class="text-center">
            <button id="audience-ai-btn"
              class="px-8 py-4 rounded-3xl font-bold text-lg transition-all duration-300 transform hover:scale-105
              bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-2 border-gray-300">
              🤖 Let AI Decide
            </button>
          </div>

          <div class="flex justify-between items-center pt-8">
            <button id="audience-skip"
              class="px-8 py-4 text-gray-600 hover:text-gray-800 font-semibold rounded-2xl hover:bg-gray-100 transition-all hover:scale-105">
              ⏭️ Skip this step
            </button>

            <button id="audience-continue"
              class="px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all
              bg-gradient-to-r from-gray-600 to-gray-700 text-white">
              Continue
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
  `;

  function syncAudienceTitle() {
  const el = document.getElementById("audience-course-title");
  if (el) el.textContent = AppState.topic || "";
}


  const cards = section.querySelectorAll(".audience-card");
  const aiBtn = document.getElementById("audience-ai-btn");
  const aiBanner = document.getElementById("audience-ai-banner");
  const continueBtn = document.getElementById("audience-continue");

  let selected = null;
  let aiDecide = false;

  function resetCards() {
    cards.forEach(c => {
      c.className = c.dataset.base;
      c.querySelector(".selected-badge").classList.add("hidden");
      c.querySelector(".desc").className = "desc text-sm text-gray-600";
    });
  }

  function updateContinueBtn() {
    if (aiDecide) {
      continueBtn.textContent = " Continue with AI Choice";
      continueBtn.className =
        "px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white";
    } else if (selected) {
  const labelMap = {
    beginners: "Beginners",
    intermediate: "Intermediate",
    advanced: "Advanced"
  };

  continueBtn.textContent = `✅ Continue with ${labelMap[selected]}`;

      continueBtn.className =
        "px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white";
    } else {
      continueBtn.textContent = "Continue";
      continueBtn.className =
        "px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all bg-gradient-to-r from-gray-600 to-gray-700 text-white";
    }
  }

  cards.forEach(card => {
    card.addEventListener("click", () => {
      aiDecide = false;
      aiBanner.classList.add("hidden");

      aiBtn.className =
        "px-8 py-4 rounded-3xl font-bold text-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-2 border-gray-300";

      resetCards();

      const gradient = card.dataset.gradient;
      card.classList.add(
        "scale-105",
        "text-white",
        "border-transparent",
        "bg-gradient-to-r",
        ...gradient.split(" ")
      );

      card.querySelector(".selected-badge").classList.remove("hidden");
      card.querySelector(".desc").className = "desc text-sm text-white/90";

      selected = card.dataset.audience;

      updateContinueBtn(); // ✅ REQUIRED
    });
  });

  aiBtn.addEventListener("click", () => {
    aiDecide = true;
    selected = null;

    resetCards();
    aiBanner.classList.remove("hidden");

    aiBtn.className =
      "px-8 py-4 rounded-3xl font-bold text-lg transition-all duration-300 transform scale-105 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl";

    updateContinueBtn(); // ✅ REQUIRED
  });

  continueBtn.addEventListener("click", () => {
    AppState.audience = {
      audience: aiDecide ? "ai-decided" : selected,
      letAiDecide: aiDecide
    };

    section.classList.add("hidden");

const durationSection = document.getElementById("duration-section");
durationSection.classList.remove("hidden");

if (window.syncDurationHeader) {
  window.syncDurationHeader();
}

  });

  document.getElementById("audience-skip").addEventListener("click", () => {
    section.classList.add("hidden");
    document.getElementById("duration-section").classList.remove("hidden");
  });

  updateContinueBtn();

  function renderCard(id, emoji, title, desc, gradient) {
    return `
      <button
        data-audience="${id}"
        data-gradient="${gradient}"
        data-base="audience-card group relative p-8 rounded-3xl border-2 font-medium transition-all duration-300 transform hover:scale-105 border-gray-200 bg-white/60 backdrop-blur-sm text-gray-700 hover:border-blue-300 hover:shadow-xl"
        class="audience-card group relative p-8 rounded-3xl border-2 font-medium transition-all duration-300 transform hover:scale-105 border-gray-200 bg-white/60 backdrop-blur-sm text-gray-700 hover:border-blue-300 hover:shadow-xl">

        <div class="text-center space-y-4">
          <div class="text-6xl group-hover:scale-110 transition-transform">${emoji}</div>
          <h3 class="text-2xl font-bold">${title}</h3>
          <p class="desc text-sm text-gray-600">${desc}</p>

          <div class="selected-badge hidden flex items-center justify-center space-x-2 mt-4">
            ⭐ <span class="font-semibold">Selected</span> ⭐
          </div>
        </div>
      </button>
    `;
  }
})();
