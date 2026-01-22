const docSection = document.getElementById("document-upload-section");

docSection.innerHTML = `
<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center px-4 relative overflow-hidden">

  <!-- Background blobs -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
  </div>

  <div class="max-w-3xl mx-auto relative z-10 w-full">
    <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 text-center">

      <!-- Step header -->
      <div class="flex items-center justify-center mb-4">
        <span class="text-yellow-500 animate-pulse text-xl mr-2">✨</span>
        <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
          Step 2: Document Upload
        </span>
        <span class="text-yellow-500 animate-pulse text-xl ml-2">✨</span>
      </div>

      <!-- Course pill -->
      <div class="mb-6">
        <span class="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-5 py-2 rounded-full text-sm font-medium border border-blue-200">
            ✨ Creating course on "<span id="doc-course-title"></span>"
        </span>
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
        📄 Upload Course Materials
      </h2>
      <p class="text-gray-500 mb-4">(Optional but Recommended)</p>

      <!-- Description -->
      <p class="text-gray-600 mb-4 text-sm leading-relaxed">
        Have existing materials like PDFs, presentations, or documents?
        Upload them to enhance course generation with your specific content.
      </p>

      <!-- Info banner -->
      <div class="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-6">
        ✨ Don’t have materials? No problem! AI will generate everything from scratch.
      </div>

      <!-- Upload box -->
      <input type="file" id="doc-input" class="hidden" />

      <label for="doc-input"
        class="block border-2 border-dashed border-white-300 rounded-2xl p-12 cursor-pointer transition-all hover:border-blue-500 bg-white/60">
        <div class="flex flex-col items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg">
            ⬆️
          </div>
          <p class="font-semibold text-gray-700">Drop your files here</p>
          <p class="text-sm text-blue-600 underline">or click to browse</p>
          <p class="text-xs text-gray-400">
            Supports: PDF, PowerPoint, Word, Text files
          </p>
        </div>
      </label>

      <!-- Actions -->
      <div class="flex justify-between items-center mt-8">
        <button id="doc-skip"
          class="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2  hover:scale-105 transition ">
          ⏭️ Skip this step
        </button>

        <button id="doc-continue"
          class="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition">
          ✨ Continue without Document
        </button>
      </div>

    </div>
  </div>
</div>
`;

// File handling
document.getElementById("doc-input").addEventListener("change", (e) => {
  AppState.document = e.target.files[0] || null;

  const btn = document.getElementById("doc-continue");
  btn.textContent = AppState.document
    ? "📄 Continue with Document"
    : "✨ Continue without Document";
});

// Navigation
document.getElementById("doc-continue").addEventListener("click", () => {
  // Hide document
  docSection.classList.add("hidden");

  // Show audience
  const audienceSection = document.getElementById("audience-section");
  audienceSection.classList.remove("hidden");

  // ✅ SET COURSE TITLE HERE
  const audienceTitleEl = document.getElementById("audience-course-title");
  if (audienceTitleEl) {
    audienceTitleEl.textContent = AppState.topic;
  }
});


document.getElementById("doc-skip").addEventListener("click", () => {
  docSection.classList.add("hidden");

  const audienceSection = document.getElementById("audience-section");
  audienceSection.classList.remove("hidden");

  const audienceTitleEl = document.getElementById("audience-course-title");
  if (audienceTitleEl) {
    audienceTitleEl.textContent = AppState.topic;
  }
});

