document.addEventListener("DOMContentLoaded", function () {
    const mediaElements = document.querySelectorAll("img, video");

    mediaElements.forEach(function (media) {
        media.style.cursor = "zoom-in";

        media.addEventListener("click", function () {
            openMedia(media);
        });
    });

    function openMedia(sourceMedia) {
        const overlay = document.createElement("div");
        overlay.className = "image-full";

        let media;

        if (sourceMedia.tagName === "VIDEO") {
            media = document.createElement("video");
            media.src = sourceMedia.currentSrc || sourceMedia.src;
            media.controls = true;
            media.autoplay = true;
            media.loop = sourceMedia.loop;
            media.muted = sourceMedia.muted;
            media.playsInline = true;

            media.addEventListener("loadedmetadata", function () {
                setOrientation(
                    media,
                    media.videoWidth,
                    media.videoHeight
                );
            });
        } else {
            media = document.createElement("img");
            media.src = sourceMedia.currentSrc || sourceMedia.src;
            media.alt = sourceMedia.alt || "";

            media.addEventListener("load", function () {
                setOrientation(
                    media,
                    media.naturalWidth,
                    media.naturalHeight
                );
            });

            if (media.complete) {
                setOrientation(
                    media,
                    media.naturalWidth,
                    media.naturalHeight
                );
            }
        }

        overlay.appendChild(media);
        document.body.appendChild(overlay);
        document.body.classList.add("media-open");

        requestAnimationFrame(function () {
            overlay.classList.add("open");
        });

        function closeOverlay() {
            document.removeEventListener("keydown", handleKeydown);

            if (media.tagName === "VIDEO") {
                media.pause();
            }

            overlay.remove();
            document.body.classList.remove("media-open");
        }

        function handleKeydown(event) {
            if (event.key === "Escape") {
                closeOverlay();
            }
        }

        overlay.addEventListener("click", function (event) {
            if (!event.target.closest("img, video")) {
                closeOverlay();
            }
        });

        document.addEventListener("keydown", handleKeydown);
    }

    function setOrientation(media, width, height) {
        media.classList.toggle("portrait", height > width);
    }
});
