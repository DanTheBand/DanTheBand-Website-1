// Contact form handling with Web3Forms (free service)
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Hide previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const formData = new FormData(form);
    
    // access_key is already present in the form as a hidden field

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            successMessage.style.display = 'block';
            successMessage.focus(); // Move focus to success message for screen readers
            form.reset();
        } else {
            errorMessage.style.display = 'block';
            errorMessage.focus(); // Move focus to error message for screen readers
        }
    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.focus(); // Move focus to error message for screen readers
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
});

// Audio Reel Player Functionality
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
    const artCache = new Map(); // cache data URLs per src

    /* ---- Load durations for all tracks ---- */

    function formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ":" + (secs < 10 ? "0" : "") + secs;
    }

    function loadTrackDurations() {
        trackItems.forEach(function (item) {
            const src = item.getAttribute("data-src");
            const durationEl = item.querySelector(".track-extra");
            
            if (!src || !durationEl) return;

            const tempAudio = new Audio();
            tempAudio.preload = "metadata";
            
            tempAudio.addEventListener("loadedmetadata", function () {
                if (tempAudio.duration && isFinite(tempAudio.duration)) {
                    durationEl.textContent = formatDuration(tempAudio.duration);
                }
            });

            tempAudio.addEventListener("error", function () {
                console.warn("Could not load duration for:", src);
            });

            tempAudio.src = src;
        });
    }

    // Load all durations on page load
    loadTrackDurations();

    /* ---- Helpers ---- */

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
        // Graceful fallback: if library or src missing, just show default gradient
        if (!artEl || !src) {
            console.log("Artwork: No element or source");
            applyCoverArt(null);
            return;
        }

        if (typeof window.jsmediatags === "undefined") {
            console.error("Artwork: jsmediatags library not loaded");
            applyCoverArt(null);
            return;
        }

        if (artCache.has(src)) {
            applyCoverArt(artCache.get(src));
            return;
        }

        console.log("Artwork: Attempting to read", src);

        // Fetch the file as a blob first to avoid CORS issues
        fetch(src)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("HTTP " + response.status);
                }
                return response.blob();
            })
            .then(function (blob) {
                window.jsmediatags.read(blob, {
                    onSuccess: function (tag) {
                        console.log("Artwork: Tags read successfully", tag.tags);
                        const picture = tag.tags && tag.tags.picture;
                        if (!picture || !picture.data || !picture.data.length) {
                            console.log("Artwork: No picture data in tags");
                            artCache.set(src, null);
                            applyCoverArt(null);
                            return;
                        }

                        let base64String = "";
                        const data = picture.data;
                        for (let i = 0; i < data.length; i++) {
                            base64String += String.fromCharCode(data[i]);
                        }
                        const base64 =
                            "data:" +
                            (picture.format || "image/jpeg") +
                            ";base64," +
                            btoa(base64String);

                        console.log("Artwork: Successfully extracted image");
                        artCache.set(src, base64);
                        applyCoverArt(base64);
                    },
                    onError: function (error) {
                        console.error("Artwork: jsmediatags error", error);
                        artCache.set(src, null);
                        applyCoverArt(null);
                    }
                });
            })
            .catch(function (error) {
                console.error("Artwork: Fetch error", error);
                artCache.set(src, null);
                applyCoverArt(null);
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

    /* ---- Track list behavior ---- */

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

            // Clear active states
            trackItems.forEach(function (el) {
                el.classList.remove("active");
            });
            item.classList.add("active");

            // Mark that we have a selected track (for mini-player)
            if (miniPlayer) {
                miniPlayer.classList.add("has-track");
            }

            // Update audio source
            if (source && audio) {
                source.src = src || "";
                audio.load();
                audio
                    .play()
                    .catch(function () {
                        // Some browsers block autoplay from JS — ignore error.
                    });
            }

            // Update labels + cover art
            updateNowPlaying(title, meta, src);

            // Auto-scroll selected track into view within the scrollable list
            item.scrollIntoView({
                block: "nearest",
                behavior: "smooth"
            });
        });
    });

    /* ---- Mini-player & scroll detection ---- */

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
                    // Main player is on screen → hide mini-player
                    setMiniVisible(false);
                } else {
                    // Main player off screen → show mini-player
                    setMiniVisible(true);
                }
            },
            {
                threshold: 0.2
            }
        );

        observer.observe(audioSection);
    } else if (audioSection && miniPlayer) {
        // Fallback without IntersectionObserver
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
                audio
                    .play()
                    .catch(function () {
                        // ignore autoplay errors
                    });
            } else {
                audio.pause();
            }
        });

        // Keep the mini-player button icon in sync with audio state
        audio.addEventListener("play", function () {
            miniToggle.textContent = "⏸";
        });

        audio.addEventListener("pause", function () {
            miniToggle.textContent = "▶";
        });
    }

    // Initialize display
    updateNowPlaying("", "", "");
});
