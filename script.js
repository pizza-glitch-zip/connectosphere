/* ============================================
   Connectosphere — script.js
   ============================================
   - Handles Enter button → video playback → end scene transition
   - Wires the data hotspot to an external ngrok URL (editable below)
   - Adjusts hotspot positioning to match the actual image render box
   - Skips video for returning visitors (within same session)
   ============================================ */


/* ============================================
   CONFIG — Edit this when the ngrok URL changes
   ============================================ */
const CONFIG = {
  // 📌 박지원님 컴퓨터의 ngrok URL — 세션 만료 시 이 한 줄만 수정
  dataSiteUrl: " https://need-floppy-margin-solid.trycloudflare.com",

  // 데이터 사이트가 비활성일 때 보일 메시지 (선택사항)
  dataSiteOfflineMessage:
    "데이터 수집 사이트가 일시적으로 비활성 상태입니다.\n전시 기간 중 다시 시도해주세요.",
};


/* ============================================
   STORAGE KEY — 영상 시청 기록용
   탭이 닫히면 자동 초기화 (sessionStorage)
   → 새로운 관람객은 영상부터 다시 시청
   → 같은 세션에서 페이지 이동 시 영상 스킵
   ============================================ */
const INTRO_VIEWED_KEY = "connectosphere_intro_viewed";


/* ============================================
   MAIN — runs when DOM is ready
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
  const titleScreen = document.getElementById("titleScreen");
  if (titleScreen) {
    setupMainPage();
  }
});


/* ============================================
   MAIN PAGE — state machine
   ============================================ */
function setupMainPage() {
  const titleScreen = document.getElementById("titleScreen");
  const videoStage  = document.getElementById("videoStage");
  const endScene    = document.getElementById("endScene");
  const enterBtn    = document.getElementById("enterBtn");
  const video       = document.getElementById("introVideo");
  const dataHotspot = document.getElementById("dataHotspot");

  // Wire the data hotspot to the configurable ngrok URL
  if (dataHotspot) {
    dataHotspot.href = CONFIG.dataSiteUrl;
    dataHotspot.target = "_blank";
    dataHotspot.rel = "noopener noreferrer";
  }

  // ============================================
  // RETURNING VISITOR CHECK
  // 이미 영상을 본 사용자(같은 세션 내)는 바로 발굴 현장으로
  // ============================================
  const hasViewedIntro = sessionStorage.getItem(INTRO_VIEWED_KEY) === "true";

  if (hasViewedIntro) {
    skipToEndScene();
    return;
  }

  // ============================================
  // STATE TRANSITIONS (첫 방문자만 도달)
  // ============================================

  // [State 1 → State 2] Enter button clicked → play video
  enterBtn.addEventListener("click", () => {
    // Hide title, reveal video stage
    titleScreen.classList.add("is-hidden");
    videoStage.classList.add("is-active");
    videoStage.setAttribute("aria-hidden", "false");

    // Play the video — user click counts as user interaction,
    // so sound will play correctly (browser autoplay policy compliant)
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // If playback fails for any reason, skip directly to end scene
        console.warn("Video playback failed, skipping to end scene:", error);
        showEndScene();
      });
    }
  });

  // [State 2 → State 3] Video ended → show end scene
  video.addEventListener("ended", () => {
    showEndScene();
  });

  // [Optional] Press Escape to skip the video
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoStage.classList.contains("is-active")) {
      if (!endScene.classList.contains("is-active")) {
        showEndScene();
      }
    }
  });

  // ============================================
  // HELPERS
  // ============================================
  function showEndScene() {
    // 영상을 봤다는 사실을 sessionStorage에 저장
    // → 페이지 이동 후 돌아와도 영상이 다시 재생되지 않음
    sessionStorage.setItem(INTRO_VIEWED_KEY, "true");

    // Fade out video, fade in end scene
    videoStage.classList.remove("is-active");
    videoStage.setAttribute("aria-hidden", "true");

    // Brief delay so the crossfade feels natural
    setTimeout(() => {
      // Pause video and hide it fully (saves resources)
      video.pause();

      endScene.classList.add("is-active");
      endScene.setAttribute("aria-hidden", "false");
    }, 600);
  }

  function skipToEndScene() {
    // 영상을 건너뛰고 바로 정지 화면(발굴 현장)으로
    // 다른 페이지에서 돌아오는 경우에 호출됨
    titleScreen.classList.add("is-hidden");
    titleScreen.style.display = "none";

    videoStage.style.display = "none";
    videoStage.setAttribute("aria-hidden", "true");

    endScene.classList.add("is-active");
    endScene.setAttribute("aria-hidden", "false");
  }
}


/* ============================================
   ENHANCEMENT — make hotspots align with the
   *actual visible image area* (since the image
   uses object-fit: contain and may be letterboxed)
   ============================================ */
window.addEventListener("load", () => {
  const endSceneBg = document.querySelector(".end-scene__bg");
  if (!endSceneBg) return;

  const endScene = document.getElementById("endScene");
  if (!endScene) return;

  // Get the image's natural dimensions
  const naturalAspect = endSceneBg.naturalWidth / endSceneBg.naturalHeight;

  // Adjust the end scene to match the image's aspect ratio
  adjustEndSceneLayout();
  window.addEventListener("resize", adjustEndSceneLayout);

  function adjustEndSceneLayout() {
    const viewportAspect = window.innerWidth / window.innerHeight;

    // Compute the actual rendered image box (object-fit: contain logic)
    let renderedWidth, renderedHeight, offsetX, offsetY;

    if (viewportAspect > naturalAspect) {
      // Viewport is wider than image — letterbox on sides
      renderedHeight = window.innerHeight;
      renderedWidth = renderedHeight * naturalAspect;
      offsetX = (window.innerWidth - renderedWidth) / 2;
      offsetY = 0;
    } else {
      // Viewport is taller than image — letterbox on top/bottom
      renderedWidth = window.innerWidth;
      renderedHeight = renderedWidth / naturalAspect;
      offsetX = 0;
      offsetY = (window.innerHeight - renderedHeight) / 2;
    }

    // Apply these as CSS variables so hotspots can reposition
    endScene.style.setProperty("--img-width",  renderedWidth + "px");
    endScene.style.setProperty("--img-height", renderedHeight + "px");
    endScene.style.setProperty("--img-offset-x", offsetX + "px");
    endScene.style.setProperty("--img-offset-y", offsetY + "px");

    // Update each hotspot's position to be relative to the image box
    document.querySelectorAll(".hotspot").forEach((hotspot) => {
      const leftPct   = parseFloat(hotspot.dataset.left   || hotspot.style.left);
      const topPct    = parseFloat(hotspot.dataset.top    || hotspot.style.top);
      const widthPct  = parseFloat(hotspot.dataset.width  || hotspot.style.width);
      const heightPct = parseFloat(hotspot.dataset.height || hotspot.style.height);

      // Cache the original percentages on first run
      if (!hotspot.dataset.left) {
        hotspot.dataset.left   = leftPct;
        hotspot.dataset.top    = topPct;
        hotspot.dataset.width  = widthPct;
        hotspot.dataset.height = heightPct;
      }

      // Reposition using actual rendered image dimensions
      hotspot.style.left   = (offsetX + (renderedWidth  * leftPct   / 100)) + "px";
      hotspot.style.top    = (offsetY + (renderedHeight * topPct    / 100)) + "px";
      hotspot.style.width  =            (renderedWidth  * widthPct  / 100)  + "px";
      hotspot.style.height =            (renderedHeight * heightPct / 100)  + "px";
    });
  }
});
