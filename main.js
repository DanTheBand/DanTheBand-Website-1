// Contact form handling with Web3Forms (free service)
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        const formData = new FormData(form);
        formData.append('access_key', 'd55c85ff-16a6-4639-95b6-7584644f1c30');
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                successMessage.style.display = 'block';
                successMessage.focus();
                form.reset();
            } else {
                errorMessage.style.display = 'block';
                errorMessage.focus();
            }
        } catch (error) {
            errorMessage.style.display = 'block';
            errorMessage.focus();
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("reel-audio");
    const source = document.getElementById("reel-source");
    const titleEl = document.getElementById("current-title");
    const metaEl = document.getElementById("current-meta");
    const trackItems = document.querySelectorAll(".track-list li[data-src]");
    const trackList = document.querySelector(".track-list");
    const audioSection = document.getElementById("selected-game-cues");
    const miniPlayer = document.getElementById("mini-player");
    const miniTitle = document.getElementById("mini-title");
    const miniToggle = document.getElementById("mini-toggle");
    const artEl = document.getElementById("current-art");
    const artCache = new Map();

    function updateTrackListFades() {
        if (!trackList) return;
        const scrollTop = trackList.scrollTop;
        const maxScroll = trackList.scrollHeight - trackList.clientHeight - 1;
        trackList.classList.toggle("at-top", scrollTop <= 0);
        trackList.classList.toggle("at-bottom", scrollTop >= maxScroll);
    }

    function applyCoverArt(dataUrl) {
        if (!artEl) return;
        if (dataUrl) {
            artEl.style.backgroundImage = "url('" + dataUrl + "')";
            artEl.classList.add("has-art");
        } else {
            artEl.style.backgroundImage = "";
            artEl.classList.remove("has-art");
        }
    }

    function loadCoverArtForSrc(src) {
        if (!artEl || !src || typeof window.jsmediatags === "undefined") {
            applyCoverArt(null);
            return;
        }
        if (artCache.has(src)) {
            applyCoverArt(artCache.get(src));
            return;
        }
        // Use jsmediatags.read directly for same-origin files
        window.jsmediatags.read(src, {
            onSuccess: function (tag) {
                const picture = tag.tags && tag.tags.picture;
                if (!picture || !picture.data || !picture.data.length) {
                    artCache.set(src, null);
                    applyCoverArt(null);
                    return;
                }
                let binary = "";
                if (Array.isArray(picture.data)) {
                    for (let i = 0; i < picture.data.length; i++) {
                        binary += String.fromCharCode(picture.data[i]);
                    }
                } else if (picture.data instanceof Uint8Array) {
                    binary = String.fromCharCode.apply(null, picture.data);
                }
                function btoaSafe(str) {
                    try {
                        return btoa(str);
                    } catch (e) {
                        let CHUNK_SIZE = 0x8000;
                        let result = '';
                        for (let i = 0; i < str.length; i += CHUNK_SIZE) {
                            result += btoa(str.slice(i, i + CHUNK_SIZE));
                        }
                        return result;
                    }
                }
                const base64 =
                    "data:" +
                    (picture.format || "image/jpeg") +
                    ";base64," +
                    btoaSafe(binary);
                artCache.set(src, base64);
                applyCoverArt(base64);
            },
            onError: function () {
                artCache.set(src, null);
                applyCoverArt(null);
            }
        });
    }

    function updateNowPlaying(title, meta, src) {
        titleEl.textContent = title || "Select a cue to listen";
        metaEl.textContent = meta || "";
        if (miniTitle) {
            miniTitle.textContent = title || "Select a cue";
        }
        if (src) {
            loadCoverArtForSrc(src);
        } else {
            applyCoverArt(null);
        }
    }

    function setMiniVisible(visible) {
        if (!miniPlayer) return;
        if (visible) {
            miniPlayer.classList.add("visible");
            miniPlayer.setAttribute("aria-hidden", "false");
        } else {
            miniPlayer.classList.remove("visible");
            miniPlayer.setAttribute("aria-hidden", "true");
        }
    }

    if (trackList) {
        trackList.addEventListener("scroll", updateTrackListFades);
        window.addEventListener("resize", updateTrackListFades);
        updateTrackListFades();
    }

    trackItems.forEach(function (item) {
        item.addEventListener("click", function () {
            const src = item.getAttribute("data-src");
            const title = item.getAttribute("data-title") || "";
            const meta = item.getAttribute("data-meta") || "";
            trackItems.forEach(function (el) {
                el.classList.remove("active");
            });
            item.classList.add("active");
            if (miniPlayer) {
                miniPlayer.classList.add("has-track");
            }
            if (source && audio) {
                source.src = src || "";
                audio.load();
                audio.play().catch(function () {});
            }
            updateNowPlaying(title, meta, src);
            item.scrollIntoView({
                block: "nearest",
                behavior: "smooth"
            });
        });
    });

    if (audioSection && miniPlayer && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function (entries) {
                const entry = entries[0];
                const hasTrack = miniPlayer.classList.contains("has-track");
                if (!hasTrack) {
                    setMiniVisible(false);
                    return;
                }
                if (entry.isIntersecting) {
                    setMiniVisible(false);
                } else {
                    setMiniVisible(true);
                }
            },
            {
                threshold: 0.2
            }
        );
        observer.observe(audioSection);
    } else if (audioSection && miniPlayer) {
        function handleScrollFallback() {
            const rect = audioSection.getBoundingClientRect();
            const hasTrack = miniPlayer.classList.contains("has-track");
            if (!hasTrack) {
                setMiniVisible(false);
                return;
            }
            const isVisible =
                rect.bottom > 80 &&
                rect.top < window.innerHeight - 80;
            setMiniVisible(!isVisible);
        }
        window.addEventListener("scroll", handleScrollFallback);
        window.addEventListener("resize", handleScrollFallback);
        handleScrollFallback();
    }

    if (miniToggle && audio) {
        miniToggle.addEventListener("click", function () {
            if (audio.paused) {
                audio.play().catch(function () {});
            } else {
                audio.pause();
            }
        });
        audio.addEventListener("play", function () {
            miniToggle.textContent = "⏸";
        });
        audio.addEventListener("pause", function () {
            miniToggle.textContent = "▶";
        });
    }
    updateNowPlaying("", "", "");
});
// main.js - Main site JS for Dan Policar portfolio

document.addEventListener("DOMContentLoaded", function () {
    // Audio reel logic
    const audio = document.getElementById("reel-audio");
    const source = document.getElementById("reel-source");
    const titleEl = document.getElementById("current-title");
    const metaEl = document.getElementById("current-meta");
    const trackItems = document.querySelectorAll(".track-list li[data-src]");
    const trackList = document.querySelector(".track-list");
    const audioSection = document.getElementById("selected-game-cues");
    const miniPlayer = document.getElementById("mini-player");
    const miniTitle = document.getElementById("mini-title");
    const miniToggle = document.getElementById("mini-toggle");
    const artEl = document.getElementById("current-art");
    const artCache = new Map();

    function formatDuration(seconds) {
        if (isNaN(seconds) || seconds <= 0) return "";
        const m = Math.floor(seconds / 60);
        const s = Math.round(seconds % 60);
        return m + ":" + (s < 10 ? "0" : "") + s;
    }

    // Auto-calculate and display track durations
    trackItems.forEach(function (item) {
        const src = item.getAttribute("data-src");
        const extra = item.querySelector(".track-extra");
        if (!src || !extra) return;
        const audioProbe = document.createElement("audio");
        audioProbe.src = src;
        audioProbe.preload = "metadata";
        audioProbe.style.display = "none";
        document.body.appendChild(audioProbe);
        audioProbe.addEventListener("loadedmetadata", function () {
            extra.textContent = formatDuration(audioProbe.duration);
            audioProbe.remove();
        });
        audioProbe.addEventListener("error", function () {
            audioProbe.remove();
        });
    });

    // ...existing audio reel logic, refactored for clarity...

    // Contact form logic
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            const formData = new FormData(form);
            formData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY');
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.success) {
                    successMessage.style.display = 'block';
                    successMessage.focus();
                    form.reset();
                } else {
                    errorMessage.style.display = 'block';
                    errorMessage.focus();
                }
            } catch (error) {
                errorMessage.style.display = 'block';
                errorMessage.focus();
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }
});
