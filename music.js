(function() {
  const audio = document.getElementById("bg-audio");
  const musicToggle = document.getElementById("music-toggle");
  if (!audio || !musicToggle) return;

  const musicIcon = musicToggle.querySelector("i");
  const storageKey = "lionthippila-music-state";
  audio.volume = 0.05;

  function updateMusicControl() {
    const isPlaying = !audio.paused;
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
    musicToggle.title = isPlaying ? "Pause background music" : "Play background music";
    musicIcon.className = isPlaying ? "bi bi-pause-fill" : "bi bi-play-fill";
  }

  function playAudio() {
    audio.play().catch(error => {
      console.error("Could not play background music.", error);
      updateMusicControl();
    });
  }

  let savedState = null;
  try {
    const storedState = sessionStorage.getItem(storageKey);
    if (storedState) {
      const state = JSON.parse(storedState);
      if (Number.isFinite(state.currentTime) && typeof state.isPlaying === "boolean") {
        savedState = state;
      }
    }
  } catch (error) {
    console.error("Could not restore background music state.", error);
  }

  musicToggle.addEventListener("click", function() {
    if (audio.paused) {
      playAudio();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", updateMusicControl);
  audio.addEventListener("pause", updateMusicControl);
  audio.addEventListener("error", function() {
    musicToggle.setAttribute("aria-label", "Background music could not be loaded");
    musicToggle.title = "Background music could not be loaded";
    console.error("Could not load background music.", audio.error);
  });

  window.addEventListener("pagehide", function() {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({
        currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
        isPlaying: !audio.paused && !audio.ended
      }));
    } catch (error) {
      console.error("Could not save background music state.", error);
    }
  });

  updateMusicControl();

  if (!savedState) {
    audio.play().catch(() => {
      updateMusicControl();
    });
    return;
  }

  function restorePlayback() {
    const savedTime = Math.max(0, savedState.currentTime);
    audio.currentTime = Number.isFinite(audio.duration) && audio.duration > 0
      ? savedTime % audio.duration
      : savedTime;

    if (savedState.isPlaying) {
      playAudio();
    }
  }

  if (audio.readyState >= 1) {
    restorePlayback();
  } else {
    audio.addEventListener("loadedmetadata", restorePlayback, { once: true });
  }
})();
