const heroSection = document.getElementById("hero-section");

heroSection.innerHTML = `
<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center px-4 relative overflow-hidden">

  <!-- Blobs -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
  </div>

  <div class="max-w-6xl mx-auto text-center relative z-10 text-gray-900">
    <div class="mb-8">
      <div class="flex items-center justify-center mb-4">
        <span class="text-yellow-500 animate-pulse text-2xl mr-2">✨</span>
        <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-lg">
          AI Course Creator
        </span>
        <span class="text-yellow-500 animate-pulse text-2xl ml-2">✨</span>
      </div>

      <h1 class="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
        Create professional
        <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          courses
        </span><br/>
        <span class="text-gray-700">in seconds using </span>
        <span class="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          AI ✨
        </span>
      </h1>
    </div>

    <!-- ✅ SUBTITLE -->
    <p class="text-2xl text-gray-600 mb-4 font-medium">
      🚀 Transform your ideas into professional courses instantly
    </p>

    <!-- ✅ DESCRIPTION -->
    <p class="text-lg text-gray-500 mb-8 leading-relaxed max-w-3xl mx-auto">
      Powered by advanced AI, create comprehensive courses with text, video content,
      assessments, and Unify.Care.Learn-ready exports. No technical expertise required!
    </p>

    <!-- ✅ FEATURE PILLS -->
    <div class="flex flex-wrap justify-center gap-4 mb-12">
      <div class="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-lg hover:shadow-xl hover:scale-105 transition">
        ⚡ <span class="font-medium">AI-Powered</span>
      </div>
      <div class="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-lg hover:shadow-xl hover:scale-105 transition">
        📘 <span class="font-medium">Professional Format</span>
      </div>
      <div class="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-lg hover:shadow-xl hover:scale-105 transition">
        🎯 <span class="font-medium">Assessment Ready</span>
      </div>
    </div>

    <!-- INPUT -->
    <form id="hero-form" class="max-w-2xl mx-auto mb-12">
      <div class="relative group">
        <input
          id="topic-input"
          type="text"
          placeholder="Start with a course topic... (e.g., Python Programming)"
          class="w-full px-8 py-6 text-xl border-2 border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-xl group-hover:shadow-2xl placeholder-gray-400"
        />
        <button
          id="hero-submit"
          disabled
          class="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
        >
          Create Course →
        </button>
      </div>
    </form>

    <!-- ✅ POPULAR TOPICS -->
    <p class="text-gray-500 mb-4 font-medium">💡 Popular course topics:</p>
    <div class="flex flex-wrap justify-center gap-3 ">
      ${["Python Programming","Digital Marketing","Data Science","Web Development","Machine Learning","Project Management","Graphic Design","Photography"]
        .map(t => `<button class="bg-white/60  backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 text-gray-600  transition hover:shadow-xl hover:scale-105">${t}</button>`)
        .join("")}
    </div>
  </div>
</div>
`;

// Logic (unchanged)
const topicInput = document.getElementById("topic-input");
const heroBtn = document.getElementById("hero-submit");

topicInput.addEventListener("input", () => {
  heroBtn.disabled = !topicInput.value.trim();
});

document.getElementById("hero-form").addEventListener("submit", (e) => {
  e.preventDefault();

  AppState.topic = topicInput.value.trim();

  // Hide hero, show document upload
  document.getElementById("hero-section").classList.add("hidden");
  document.getElementById("document-upload-section").classList.remove("hidden");

  // ✅ THIS IS THE MISSING PART
  const docTitleEl = document.getElementById("doc-course-title");
  if (docTitleEl) {
    docTitleEl.textContent = AppState.topic;
  }
});
