// ===============================
// SIDEBAR TOGGLE (UNCHANGED)
// ===============================
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const sidebarLinks = document.querySelectorAll(".sidebar-link");
const urlInput = document.getElementById("urlInput");

const overlay = document.createElement("div");
overlay.classList.add("sidebar-overlay");
document.body.appendChild(overlay);

function toggleSidebar() {
  hamburger.classList.toggle("active");
  sidebar.classList.toggle("open");
  overlay.classList.toggle("active");
}

function closeSidebar() {
  hamburger.classList.remove("active");
  sidebar.classList.remove("open");
  overlay.classList.remove("active");
}

hamburger.addEventListener("click", toggleSidebar);
overlay.addEventListener("click", closeSidebar);
sidebarLinks.forEach(link => link.addEventListener("click", closeSidebar));

// ===============================
// INPUT BUTTONS (PASTE / CLEAR)
// ===============================
const clearBtn = document.getElementById("clearBtn");
const pasteBtn = document.getElementById("pasteBtn");

function offerInputButtons() {
  if (urlInput.value.trim() === "") {
    clearBtn.style.display = "none";
    pasteBtn.style.display = "flex";
  } else {
    clearBtn.style.display = "flex";
    pasteBtn.style.display = "none";
  }
}

offerInputButtons();
urlInput.addEventListener("input", offerInputButtons);

clearBtn.addEventListener("click", () => {
  urlInput.value = "";
  offerInputButtons();
  urlInput.focus();
});

pasteBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      urlInput.value = text;
      offerInputButtons();
    }
  } catch {
    alert("Clipboard permission denied");
  }
});

// ===============================
// 🔥 TIKTOK DOWNLOAD (RAILWAY)
// ===============================
const downloadBtn = document.querySelector(".download-btn");

// 🔴 CHANGE THIS TO YOUR REAL RAILWAY URL
const BACKEND_URL = "https://YOUR-PROJECT.up.railway.app";

downloadBtn.addEventListener("click", async () => {
  const tiktokUrl = urlInput.value.trim();

  if (!tiktokUrl.includes("tiktok.com")) {
    alert("Please paste a valid TikTok URL");
    return;
  }

  downloadBtn.disabled = true;
  downloadBtn.textContent = "Processing...";

  try {
    const res = await fetch(
      `${BACKEND_URL}/download?url=${encodeURIComponent(tiktokUrl)}`
    );

    const data = await res.json();

    if (!data.streamUrl) {
      throw new Error("No stream URL");
    }

    // ⬇️ Download video
    window.location.href = data.streamUrl;

  } catch (err) {
    console.error(err);
    alert("Failed to download TikTok video");
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.textContent = "Download Video";
  }
});
