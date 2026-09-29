const soundboard = document.getElementById('soundboard');
const audio = document.getElementById("audio");
const playAllButton = document.querySelector(".play-all-button");

const DOUBLE_TAP_MS = 400;
const LONG_PRESS_MS = 500;

let sounds = [];
let buttons = [];
let currentIndex = -1;
let playingAll = false;
let allIndex = -1;

fetch('getSounds.php')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        sounds = data;
        generateButtons();
    })
    .catch(error => {
        console.error("Geluiden konden niet worden geladen:", error);
        soundboard.innerText = "Geluiden konden niet worden geladen.";
    });

function soundUrl(sound) {
    return `sounds/${encodeURIComponent(sound.file)}`;
}

function generateButtons() {
    sounds.forEach((sound, i) => {
        const button = document.createElement('button');
        button.className = "sound-button";
        button.innerText = sound.title;
        button.setAttribute("aria-label", `Speel geluid: ${sound.title}`);
        button.title = "Tik om af te spelen of te stoppen. Dubbeltik om te downloaden.";

        let lastTap = 0;
        let pressTimer = null;
        let longPress = false;

        button.addEventListener("pointerdown", () => {
            longPress = false;
            clearTimeout(pressTimer);
            pressTimer = setTimeout(() => { longPress = true; }, LONG_PRESS_MS);
        });
        button.addEventListener("pointercancel", () => clearTimeout(pressTimer));
        button.addEventListener("pointerup", () => {
            clearTimeout(pressTimer);
            if (longPress) {
                return;
            }
            const now = Date.now();
            if (lastTap && now - lastTap < DOUBLE_TAP_MS) {
                // Dubbeltik op dezelfde knop: downloaden, afspeelstatus ongemoeid laten
                lastTap = 0;
                downloadSound(sound);
                return;
            }
            lastTap = now;
            if (playingAll) {
                stopAll();
            }
            if (currentIndex === i) {
                stopAudio();
            } else {
                playSound(i);
            }
        });
        button.addEventListener("contextmenu", (e) => e.preventDefault());

        buttons.push(button);
        soundboard.appendChild(button);
    });
}

function resetCurrentButton() {
    if (currentIndex >= 0) {
        const button = buttons[currentIndex];
        button.innerText = sounds[currentIndex].title;
        button.classList.remove("playing");
    }
    currentIndex = -1;
}

function stopAudio() {
    audio.pause();
    audio.currentTime = 0;
    resetCurrentButton();
}

// Wordt direct vanuit de gebruikersactie aangeroepen, zodat iOS het afspelen toestaat.
function playSound(i) {
    resetCurrentButton();

    currentIndex = i;
    buttons[i].innerText = "Stop";
    buttons[i].classList.add("playing");

    audio.src = soundUrl(sounds[i]);
    audio.play().catch(error => {
        // AbortError: een nieuwe src/pause onderbrak deze play(); dat is bedoeld.
        if (error.name === "AbortError" || currentIndex !== i) {
            return;
        }
        console.warn("Audio kon niet worden afgespeeld:", error);
        handleEnded();
    });
}

function handleEnded() {
    resetCurrentButton();
    if (playingAll) {
        playNext();
    }
}

function playNext() {
    allIndex++;
    if (allIndex < sounds.length) {
        playSound(allIndex);
    } else {
        stopAll();
    }
}

function stopAll() {
    playingAll = false;
    playAllButton.innerText = "Play All";
    playAllButton.classList.remove("playing-all");
    stopAudio();
}

function playAllSounds() {
    if (playingAll) {
        stopAll();
        return;
    }
    if (!sounds.length) {
        return;
    }
    stopAudio();
    playingAll = true;
    playAllButton.classList.add("playing-all");
    playAllButton.innerText = "Stop All";
    allIndex = 0;
    playSound(0);
}

function downloadSound(sound) {
    const link = document.createElement("a");
    link.href = soundUrl(sound);
    link.download = sound.file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

audio.addEventListener("ended", () => handleEnded());
audio.addEventListener("error", () => {
    if (audio.getAttribute("src")) {
        console.warn("Audiobestand kon niet worden geladen:", audio.src);
        handleEnded();
    }
});
