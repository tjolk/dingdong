const soundboard = document.getElementById('soundboard');
const audio = document.getElementById("audio");
const playAllButton = document.querySelector(".play-all-button");

let sounds = [];
let currentPlayingButton = null;
let playingAll = false;
let index = 0;
let pressTimer = null;
let longPressTriggered = false;

fetch('getSounds.php')
    .then(response => response.json())
    .then(data => {
        sounds = data;
        generateButtons();
    });

function generateButtons() {
    sounds.forEach(sound => {
        const button = document.createElement('button');
        button.className = "sound-button";
        button.innerText = sound.substring(3);
        button.setAttribute("aria-label", `Speel geluid: ${sound}`);
        button.title = "Tik om af te spelen of te stoppen. Houd ingedrukt om te downloaden.";

        button.addEventListener("pointerdown", (event) => startPress(event, sound, button));
        button.addEventListener("pointerup", (event) => endPress(event, sound, button));
        button.addEventListener("contextmenu", (e) => e.preventDefault());

        soundboard.appendChild(button);
    });
}

function toggleSound(button, soundName) {
    const soundSrc = `sounds/GF_${soundName}.mp3`;

    if (audio.src.includes(soundName) && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        button.innerText = soundName.substring(3);
        button.classList.remove("playing");
        currentPlayingButton = null;
        audio.src = "";
        return;
    }

    if (currentPlayingButton) {
        currentPlayingButton.innerText = currentPlayingButton.dataset.originalText;
        currentPlayingButton.classList.remove("playing");
    }

    audio.src = soundSrc;
    audio.load();

    const expectedSrc = audio.src;

    audio.oncanplaythrough = () => {
        if (audio.src === expectedSrc) {
            audio.play().catch(error => {
                console.warn("Audio kon niet worden afgespeeld:", error);
            });
        }
    };

    button.dataset.originalText = button.innerText;
    button.innerText = "Stop";
    button.classList.add("playing");
    currentPlayingButton = button;
}

function startPress(event, soundName, button) {
    longPressTriggered = false;
    pressTimer = setTimeout(() => {
        downloadSound(soundName);
        longPressTriggered = true;
    }, 1500);
}

function endPress(event, soundName, button) {
    clearTimeout(pressTimer);
    if (!longPressTriggered) {
        toggleSound(button, soundName);
    }
}

function downloadSound(name) {
    const link = document.createElement("a");
    link.href = `sounds/GF_${name}.mp3`;
    link.download = `GF_${name}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function playAllSounds() {
    if (playingAll) {
        playingAll = false;
        audio.pause();
        audio.currentTime = 0;
        playAllButton.innerText = "Play All";
        playAllButton.classList.remove("playing-all");
        audio.onended = null;
    } else {
        if (currentPlayingButton) {
            currentPlayingButton.innerText = currentPlayingButton.dataset.originalText;
            currentPlayingButton.classList.remove("playing");
            currentPlayingButton = null;
        }

        playingAll = true;
        playAllButton.classList.add("playing-all");
        index = 0;

        function playNextSound() {
            if (playingAll && index < sounds.length) {
                audio.src = `sounds/GF_${sounds[index++]}.mp3`;
                audio.load();
                audio.oncanplaythrough = () => {
                    audio.play();
                };
            } else {
                playingAll = false;
                playAllButton.innerText = "Play All";
                playAllButton.classList.remove("playing-all");
            }
        }

        audio.onended = playNextSound;
        playAllButton.innerText = "Stop All";
        playNextSound();
    }
}

audio.addEventListener("ended", () => {
    if (currentPlayingButton) {
        currentPlayingButton.innerText = currentPlayingButton.dataset.originalText;
        currentPlayingButton.classList.remove("playing");
        currentPlayingButton = null;
    }
});