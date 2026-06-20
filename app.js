const homeScreen = document.getElementById("homeScreen");
const runScreen = document.getElementById("runScreen");

const patternSelect = document.getElementById("patternSelect");

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");

const timerDisplay = document.getElementById("timerDisplay");
const patternTimerDisplay = document.getElementById("patternTimerDisplay");
const profileBar = document.getElementById("profileBar");
const circle = document.getElementById("circle");

let running = false;
let paused = false;

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

/* ---------------- SAFE INIT ---------------- */

if (typeof PATTERNS === "undefined" || typeof PROFILES === "undefined") {
    console.error("Missing PATTERNS or PROFILES");
}

/* ---------------- DROPDOWN ---------------- */

Object.entries(PATTERNS || {}).forEach(([key, pattern]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = pattern.name;
    patternSelect.appendChild(option);
});

/* ---------------- CONTROLS ---------------- */

pauseButton.onclick = () => {
    paused = !paused;
};

stopButton.onclick = () => {
    running = false;
    paused = false;

    homeScreen.style.display = "flex";
    runScreen.style.display = "none";

    timerDisplay.textContent = "0";
    patternTimerDisplay.textContent = "0";
    profileBar.innerHTML = "";
};

/* ---------------- DOTS ---------------- */

function renderDots(count) {
    profileBar.innerHTML = "";

    for (let i = 0; i < count; i++) {
        const d = document.createElement("div");
        d.className = "dot";
        profileBar.appendChild(d);
    }
}

function setActiveDot(i) {
    [...profileBar.children].forEach((d, idx) => {
        d.classList.toggle("active", idx === i);
    });
}

/* ---------------- TIMER ---------------- */

async function countdown(seconds) {
    for (let i = seconds; i > 0 && running; i--) {
        while (paused) await sleep(100);
        timerDisplay.textContent = i;
        await sleep(1000);
    }
}

/* ---------------- START ---------------- */

startButton.onclick = async () => {
    if (running) return;

    const patternKey = patternSelect.value;
    const pattern = PATTERNS?.[patternKey];

    if (!pattern) return;

    const profiles = pattern.profiles || [];

    running = true;
    paused = false;

    homeScreen.style.display = "none";
    runScreen.style.display = "flex";

    renderDots(profiles.length);

    let total = 0;

    profiles.forEach(p => {
        const seq = PROFILES?.[p]?.sequence || [];
        total += seq.reduce((a, b) => a + b, 0);
    });

    patternTimerDisplay.textContent = total;

    for (let i = 0; i < profiles.length && running; i++) {

        setActiveDot(i);

        const seq = PROFILES?.[profiles[i]]?.sequence || [];

        for (let j = 0; j < seq.length && running; j += 2) {

            circle.classList.add("on");
            await countdown(seq[j]);

            circle.classList.remove("on");
            await countdown(seq[j + 1] || 0);
        }
    }

    running = false;
};
