window.addEventListener("DOMContentLoaded", () => {

const homeScreen = document.getElementById("homeScreen");
const runScreen = document.getElementById("runScreen");

const patternSelect = document.getElementById("patternSelect");

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const pauseButton = document.getElementById("pauseButton");

const timerDisplay = document.getElementById("timerDisplay");
const profileBar = document.getElementById("profileBar");

const circle = document.getElementById("circle");

let running = false;
let paused = false;

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// fill dropdown
Object.entries(PATTERNS).forEach(([key, p]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = p.name;
    patternSelect.appendChild(opt);
});
patternSelect.value = Object.keys(PATTERNS)[0];
// dots
function renderDots(n) {
    profileBar.innerHTML = "";
    for (let i = 0; i < n; i++) {
        const d = document.createElement("div");
        d.className = "dot";
        profileBar.appendChild(d);
    }
}

function setDot(i) {
    [...profileBar.children].forEach((d, idx) => {
        d.classList.toggle("active", idx === i);
    });
}

pauseButton.onclick = () => {
    paused = !paused;
};

stopButton.onclick = () => {
    running = false;
    homeScreen.style.display = "flex";
    runScreen.style.display = "none";
};

// main start
startButton.onclick = async () => {

    if (running) return;
    running = true;

    homeScreen.style.display = "none";
    runScreen.style.display = "flex";

const patternKey = patternSelect.value;
const pattern = PATTERNS[patternKey];

if (!pattern) return;

const profiles = pattern.profiles;

    renderDots(profiles.length);

    for (let i = 0; i < profiles.length && running; i++) {

        setDot(i);

        const seq = PROFILES[profiles[i]].sequence;

        for (let t of seq) {

            circle.classList.add("on");
            timerDisplay.textContent = t;

            await sleep(t * 1000);

            circle.classList.remove("on");
        }
    }

    running = false;
};

});
