// js/components.js
(function () {
  const section = document.getElementById("component-section");

  let rendered = false;

  /* ===============================
     RENDER (ONLY ON DEMAND)
     =============================== */
  function render() {
    if (rendered) return;
    rendered = true;

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
              ✨
              <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-lg">
                Step 5: Content Components
              </span>
              ✨
            </div>

            <span class="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-6 py-3 rounded-full text-sm font-medium border border-blue-200">
              ✨ Creating course on "<span id="components-course-title"></span>"
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div id="components-audience" class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200 text-center"></div>
            <div id="components-duration" class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200 text-center"></div>
          </div>

          <div id="components-summary"
            class="hidden bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 mb-8 shadow-lg">
            <div class="text-center text-2xl font-bold text-green-800 mb-3">
              ✅ Selected Components
            </div>
            <div id="components-summary-items" class="flex flex-wrap justify-center gap-3"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            ${renderComponent("text","📝","Rich Text Content","Comprehensive written explanations","from-blue-500 to-cyan-600")}
            ${renderComponent("video","🎥","Video Content","Engaging video tutorials","from-purple-500 to-pink-600")}
            ${renderComponent("images","🖼️","Visual Assets","Diagrams and illustrations","from-green-500 to-teal-600")}
          </div>

          <div class="flex justify-between items-center pt-8">
            <button id="components-skip"
              class="px-8 py-4 text-gray-600 hover:text-gray-800 font-semibold rounded-2xl hover:bg-gray-100 transition-all">
              ⏭️ Skip this step
            </button>

            <button id="components-continue"
              class="px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all
              bg-gradient-to-r from-gray-600 to-gray-700 text-white">
              Continue
            </button>
          </div>

        </div>
      </div>
    </div>
    `;

    attachLogic();
  }

  /* ===============================
     LOGIC (AFTER RENDER)
     =============================== */
  function attachLogic() {

    /* ---------- HEADER SYNC ---------- */
    function syncComponentsHeader() {
      document.getElementById("components-course-title").textContent =
        AppState.topic || "";

      document.getElementById("components-audience").textContent =
        "👥 Audience: " +
        (AppState.audience?.letAiDecide
          ? "AI will decide"
          : AppState.audience?.audience || "Not specified");

      document.getElementById("components-duration").textContent =
        "⏰ Duration: " +
        (AppState.duration?.letAiDecide
          ? "AI will decide"
          : AppState.duration?.duration || "Not specified");
    }

    window.syncComponentsHeader = syncComponentsHeader;
    syncComponentsHeader();

    /* ---------- STATE ---------- */
    let selected = ["text", "video", "images"];

    const cards = section.querySelectorAll("[data-component]");
    const summary = document.getElementById("components-summary");
    const summaryItems = document.getElementById("components-summary-items");
    const continueBtn = document.getElementById("components-continue");

    function updateSummary() {
      summary.classList.toggle("hidden", selected.length === 0);

      const map = {
        text: "📝 Rich Text Content",
        video: "🎥 Video Content",
        images: "🖼️ Visual Assets"
      };

      summaryItems.innerHTML = selected
        .map(id =>
          `<div class="bg-white/60 rounded-full px-4 py-2 border border-green-300 text-green-700 font-medium">${map[id]}</div>`
        )
        .join("");

      continueBtn.className =
        "px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all " +
        (selected.length
          ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white"
          : "bg-gradient-to-r from-gray-600 to-gray-700 text-white");
    }

    cards.forEach(card => {
      const id = card.dataset.component;
      const gradient = card.dataset.gradient;

      function select() {
        card.classList.add("scale-105", "text-white", "bg-gradient-to-r", ...gradient.split(" "));
        card.querySelector(".selected-badge").classList.remove("hidden");
      }

      function unselect() {
        card.className =
          "component-card group relative p-8 rounded-3xl border-2 transition-all hover:scale-105 border-gray-200 bg-white/60 text-gray-700";
        card.querySelector(".selected-badge").classList.add("hidden");
      }

      select();

      card.addEventListener("click", () => {
        selected.includes(id)
          ? (selected = selected.filter(x => x !== id), unselect())
          : (selected.push(id), select());

        updateSummary();
      });
    });

    updateSummary();

    /* ---------- NAV ---------- */
    document.getElementById("components-continue").onclick =
    document.getElementById("components-skip").onclick = () => {
      AppState.components = { components: selected };

      section.classList.add("hidden");

      const next = document.getElementById("assessment-section");
      if (next) {
        next.classList.remove("hidden");
        window.syncAssessmentsHeader?.();
      }
    };
  }

  /* ===============================
     PUBLIC API (CALLED FROM STEP 4)
     =============================== */
  window.showComponentsStep = function () {
    render();
    section.classList.remove("hidden");
    window.syncComponentsHeader?.();
  };

  function renderComponent(id, emoji, title, desc, gradient) {
    return `
      <button data-component="${id}" data-gradient="${gradient}"
        class="component-card group relative p-8 rounded-3xl border-2 transition-all hover:scale-105
        border-gray-200 bg-white/60 text-gray-700">

        <div class="text-center space-y-6">
          <div class="text-6xl">${emoji}</div>
          <h3 class="text-2xl font-bold">${title}</h3>
          <p class="desc text-sm">${desc}</p>
          <div class="selected-badge hidden mt-4 font-semibold">✅ Selected</div>
        </div>
      </button>
    `;
  }
})();
