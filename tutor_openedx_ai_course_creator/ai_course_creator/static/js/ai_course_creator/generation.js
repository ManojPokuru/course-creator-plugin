// js/generation.js
(function () {
  const section = document.getElementById("generation-section");

  section.innerHTML = `
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/40 p-8">

        <div class="flex gap-8">

          <!-- LEFT MAIN -->
          <div class="flex-1 space-y-8">

            <!-- HEADER -->
            <div>
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-lg">🚀</span>
                </div>
                <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-lg">
                  Course Generation
                </span>
              </div>

              <span class="inline-block bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm border border-blue-200">
                ✨ Creating course on "<span id="gen-title"></span>"
              </span>
            </div>

            <!-- SUMMARY -->
            <div class="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                <h3 class="font-semibold text-lg">📋 Course Configuration Summary</h3>
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="bg-white rounded-xl p-4 border">
                  <strong>📚 Topic:</strong>
                  <p class="mt-1" id="gen-topic"></p>
                </div>

                <div class="bg-white rounded-xl p-4 border">
                  <strong>🎬 Components:</strong>
                  <p class="mt-1" id="gen-components"></p>
                </div>

                <div class="bg-white rounded-xl p-4 border">
                  <strong>👥 Audience:</strong>
                  <p class="mt-1" id="gen-audience"></p>
                </div>

                <div class="bg-white rounded-xl p-4 border">
                  <strong>📝 Assessments:</strong>
                  <p class="mt-1 text-xs" id="gen-assessments"></p>
                </div>

                <div class="bg-white rounded-xl p-4 border">
                  <strong>⏱️ Duration:</strong>
                  <p class="mt-1" id="gen-duration"></p>
                </div>

                <div class="bg-white rounded-xl p-4 border">
                  <strong>📄 Documents:</strong>
                  <p class="mt-1">None uploaded</p>
                </div>
              </div>

              <div class="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 font-medium">
                🎯 Everything looks perfect! Ready to generate your professional course?
              </div>
            </div>

            <!-- NOTES -->
            <div class="bg-white rounded-2xl p-6 border">
              <label class="font-semibold block mb-3">
                💭 Additional Notes & Requirements
              </label>
              <textarea
                id="gen-notes"
                rows="4"
                class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none"
                placeholder="Any additional requirements, specific topics to focus on, or preferences for your course..."
              ></textarea>
            </div>

            <!-- ACTION -->
            <div class="bg-white rounded-2xl p-6 border">
              <div class="flex justify-end">
                <button
                  id="gen-start"
                  class="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition">
                  ✨ Generate Course
                </button>
              </div>
            </div>

          </div>

          <!-- RIGHT SIDEBAR -->
          <div class="w-80">
            <div class="bg-white rounded-3xl p-6 shadow-xl border space-y-5">

              <div class="text-center border-b pb-4">
                <h3 class="font-bold">📊 Course Summary</h3>
                <p class="text-sm text-gray-500">Configuration overview</p>
              </div>

              <div class="bg-blue-50 rounded-xl p-4 border">
                <strong>👥 Target Audience</strong>
                <div class="mt-2 bg-white rounded-lg px-3 py-2 text-sm" id="side-audience"></div>
              </div>

              <div class="bg-green-50 rounded-xl p-4 border">
                <strong>⏱️ Duration</strong>
                <div class="mt-2 bg-white rounded-lg px-3 py-2 text-sm" id="side-duration"></div>
              </div>

              <div class="bg-purple-50 rounded-xl p-4 border">
                <strong>🎬 Content Types</strong>
                <div class="mt-2 space-y-2" id="side-components"></div>
              </div>

              <div class="bg-orange-50 rounded-xl p-4 border">
                <strong>📝 Assessment Types</strong>
                <div class="mt-2 space-y-1 text-xs" id="side-assessments"></div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
  `;

  /* ---------- STATE SYNC ---------- */
  function syncGenerationData() {
    if (!window.AppState) return;

    document.getElementById("gen-title").textContent = AppState.topic || "";
    document.getElementById("gen-topic").textContent = AppState.topic || "—";

    document.getElementById("gen-audience").textContent =
      AppState.audience?.letAiDecide ? "AI will decide" : AppState.audience?.audience || "—";

    document.getElementById("gen-duration").textContent =
      AppState.duration?.letAiDecide ? "AI will decide" : AppState.duration?.duration || "—";

    document.getElementById("gen-components").textContent =
      (AppState.components?.components || []).join(", ") || "—";

    document.getElementById("gen-assessments").textContent =
      (AppState.assessments?.assessments || []).join(", ") || "—";

    document.getElementById("side-audience").textContent =
      AppState.audience?.audience || "AI decided";

    document.getElementById("side-duration").textContent =
      AppState.duration?.duration || "AI decided";

    document.getElementById("side-components").innerHTML =
      (AppState.components?.components || [])
        .map(c => `<div class="bg-white rounded-lg px-3 py-2">${c}</div>`)
        .join("");

    document.getElementById("side-assessments").innerHTML =
      (AppState.assessments?.assessments || []).map(a => `<div>✓ ${a}</div>`).join("");
  }

  window.syncGenerationData = syncGenerationData;
  syncGenerationData();

  /* ---------- ADDED: GENERATION STATUS UI ---------- */
  const statusContainer = document.createElement("div");
  statusContainer.id = "generation-status";
  statusContainer.className = "max-w-7xl mx-auto mt-10 px-4 space-y-6";
  section.appendChild(statusContainer);

  function renderStatus(html) {
    statusContainer.innerHTML = html;
  }

  function renderLoading(progress) {
    renderStatus(`
      <div class="bg-white rounded-2xl p-6 border shadow">
        <div class="flex items-center gap-4 mb-4">
          <div class="animate-spin w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <div class="flex-1">
            <div class="flex justify-between text-sm font-semibold">
              <span>🚀 Generating your course…</span>
              <span>${progress}%</span>
            </div>
            <div class="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-all"
                   style="width:${progress}%"></div>
            </div>
          </div>
        </div>
        <p class="text-xs text-gray-500 text-center">
          This usually takes 4–5 minutes. Please wait ✨
        </p>
      </div>
    `);
  }

  function renderError(message) {
    renderStatus(`
      <div class="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h4 class="font-semibold text-red-800 mb-2">❌ Generation Failed</h4>
        <p class="text-red-700 text-sm">${message}</p>
      </div>
    `);
  }

  function renderSuccess(course) {
    renderStatus(`
      <div class="bg-green-50 border border-green-200 rounded-2xl p-6">
        <h4 class="font-semibold text-green-800 mb-2">🎉 Course Generated Successfully!</h4>
        <p class="text-green-700 text-sm">Check console for full course JSON.</p>
      </div>
    `);
  }

  /* ---------- GENERATE BUTTON HANDLER (ENHANCED ONLY) ---------- */
  document.getElementById("gen-start").addEventListener("click", async () => {
    let progress = 10;
    renderLoading(progress);

    const progressTimer = setInterval(() => {
      progress = Math.min(progress + 10, 90);
      renderLoading(progress);
    }, 500);

    try {
      const res = await fetch("/ai-course-creator/api/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: AppState.topic,
          audience: AppState.audience,
          duration: AppState.duration,
          components: AppState.components?.components || [],
          assessments: AppState.assessments?.assessments || [],
          notes: document.getElementById("gen-notes").value || ""
        })
      });

      const data = await res.json();
      clearInterval(progressTimer);

      if (!res.ok) throw new Error(data.message || "Generation failed");

      renderLoading(100);
      console.log("✅ GENERATED COURSE:", data.json);

      setTimeout(() => renderSuccess(data.json), 500);

    } catch (err) {
      clearInterval(progressTimer);
      console.error("❌ Course generation failed:", err);
      renderError(err.message || "Something went wrong.");
    }
  });

})();
