// js/assessments.js
(function () {
  const section = document.getElementById("assessment-section");

  section.innerHTML = `
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center px-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">

        <!-- HEADER -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-4">
            ✨
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-lg">
              Step 6: Assessment Types
            </span>
            ✨
          </div>

          <span class="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-6 py-3 rounded-full text-sm font-medium border border-blue-200">
            ✨ Creating course on "<span id="assessments-course-title"></span>"
          </span>
        </div>

        <!-- PREVIOUS SELECTION SUMMARY -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div id="assessments-audience" class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200 text-center font-medium"></div>
          <div id="assessments-duration" class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200 text-center font-medium"></div>
          <div id="assessments-components" class="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200 text-center font-medium"></div>
        </div>

        <h2 class="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          📝 Choose Assessment Types
        </h2>

        <p class="text-xl text-gray-600 text-center mb-6 leading-relaxed">
          Select question types that will effectively test your learners' understanding.
        </p>

        <!-- SELECTED SUMMARY -->
        <div id="assessments-summary"
          class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 mb-8 shadow-lg">
          <div class="flex items-center justify-center space-x-3 mb-3">
            ✅
            <span class="text-2xl font-bold text-green-800">Selected Assessment Types</span>
            ✨
          </div>
          <div id="assessments-summary-items" class="flex flex-wrap justify-center gap-3"></div>
        </div>

        <!-- CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          ${renderAssessment("multiple-choice","🔘","Multiple Choice","Single correct answer","from-blue-500 to-cyan-600","What is 2+2?")}
          ${renderAssessment("checkbox","☑️","Multi-Select","Multiple correct answers","from-green-500 to-emerald-600","Select languages")}
          ${renderAssessment("text-input","✍️","Text Input","Free-form answers","from-purple-500 to-pink-600","Explain concept")}
          ${renderAssessment("dropdown","📋","Dropdown Select","Choose from list","from-orange-500 to-red-600","Select option")}
          ${renderAssessment("numerical","🔢","Numerical Problems","Math problems","from-indigo-500 to-purple-600","15% of 200")}
        </div>

        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200 text-center mb-8">
          🎯 <strong>Pro Tip:</strong> Mixing different question types keeps learners engaged and provides comprehensive assessment.
        </div>

        <div class="flex justify-between items-center pt-8">
          <button id="assessments-skip"
            class="px-8 py-4 text-gray-600 hover:text-gray-800 font-semibold rounded-2xl hover:bg-gray-100 transition-all">
            ⏭️ Skip this step
          </button>

          <button id="assessments-continue"
            class="px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all
            bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
            🚀 Generate Course
          </button>
        </div>

      </div>
    </div>
  </div>
  `;

  /* ---------- HEADER SYNC ---------- */
  function syncAssessmentsHeader() {
    document.getElementById("assessments-course-title").textContent = AppState.topic || "";

    document.getElementById("assessments-audience").textContent =
      "👥 Audience: " +
      (AppState.audience?.letAiDecide ? "AI will decide" : AppState.audience?.audience || "Not specified");

    document.getElementById("assessments-duration").textContent =
      "⏰ Duration: " +
      (AppState.duration?.letAiDecide ? "AI will decide" : AppState.duration?.duration || "Not specified");

    const map = { text: "Text", video: "Video", images: "Visual" };
    document.getElementById("assessments-components").textContent =
      "🎨 Content: " +
      ((AppState.components?.components || []).map(c => map[c]).join(", ") || "All");
  }

  window.syncAssessmentsHeader = syncAssessmentsHeader;
  syncAssessmentsHeader();

  /* ---------- STATE ---------- */
  let selected = ["multiple-choice","checkbox","text-input","dropdown","numerical"];
  const cards = section.querySelectorAll("[data-assessment]");
  const summaryItems = document.getElementById("assessments-summary-items");

  function updateSummary() {
    summaryItems.innerHTML = selected.map(id =>
      `<div class="bg-white/60 rounded-full px-4 py-2 border border-green-300 text-green-700 font-medium">${id}</div>`
    ).join("");
  }

  cards.forEach(card => {
    const id = card.dataset.assessment;
    const gradient = card.dataset.gradient;
    const example = card.querySelector(".example");

    function select() {
      card.className =
        `group p-6 rounded-3xl border-2 bg-gradient-to-r ${gradient} text-white scale-105 shadow-2xl`;

      card.querySelector(".badge").classList.remove("hidden");

      example.className =
        "example text-xs italic bg-white/20 text-white/80 p-2 rounded";
    }

    function unselect() {
      card.className =
        "group p-6 rounded-3xl border-2 border-gray-200 bg-white/60 text-gray-700 hover:scale-105 transition";

      card.querySelector(".badge").classList.add("hidden");

      example.className =
        "example text-xs italic bg-gray-100 text-gray-600 p-2 rounded";
    }

    select();

    card.addEventListener("click", () => {
      if (selected.includes(id)) {
        selected = selected.filter(x => x !== id);
        unselect();
      } else {
        selected.push(id);
        select();
      }
      updateSummary();
    });
  });

  updateSummary();

  document.getElementById("assessments-continue").onclick = () => {
  AppState.assessments = { assessments: selected };

  section.classList.add("hidden");

  const genSection = document.getElementById("generation-section");
  genSection.classList.remove("hidden");

  // ✅ FORCE refresh generation UI
  if (window.syncGenerationData) {
    window.syncGenerationData();
  }
};


  function renderAssessment(id, emoji, title, desc, gradient, example) {
    return `
      <button data-assessment="${id}" data-gradient="${gradient}"
        class="group p-6 rounded-3xl border-2 border-gray-200 bg-white/60 transition-all hover:scale-105">
        <div class="text-center space-y-4">
          <div class="text-4xl">${emoji}</div>
          <h3 class="font-bold">${title}</h3>
          <p class="text-xs">${desc}</p>
          <div class="example text-xs italic bg-gray-100 text-gray-600 p-2 rounded">
            Example: ${example}
          </div>
          <div class="badge hidden mt-3 font-semibold">✔ Selected</div>
        </div>
      </button>
    `;
  }
})();
