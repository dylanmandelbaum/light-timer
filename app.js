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

/* -------------------------
   BUILD DROPDOWN
-------------------------- */
Object.entries(PATTERNS).forEach(([key, pattern]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = pattern.name;
    patternSelect.appendChild(option);
});

/* -------------------------
   PAUSE / STOP
-------------------------- */
pauseButton.onclick = () => {
    paused = !paused;
    pauseButton.textContent = paused ? "▶" : "❚❚";
};

stopButton.onclick = () => {
    running = false;
    paused = false;

    runScreen.style.display = "none";
    homeScreen.style.display = "flex";

    timerDisplay.textContent = "0";
    patternTimerDisplay.textContent = "0";
    profileBar.innerHTML = "";
};

/* -------------------------
   DOTS (profiles)
-------------------------- */
function renderDots(count) {
    profileBar.innerHTML = "";

    for (let i = 0; i < count; i++) {
        const dot = document.createElement("div");
        dot.className = "dot";
        profileBar.appendChild(dot);
    }
}

function setActiveDot(index) {
    const dots = profileBar.children;

    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.toggle("active", i === index);
    }
}

/* -------------------------
   COUNTDOWN (seconds)
-------------------------- */
async function countdown(seconds) {
    for (let i = seconds; i > 0 && running; i--) {
        while (paused) await sleep(100);
        timerDisplay.textContent = i;
        await sleep(1000);
    }
}

/* -------------------------
   START
-------------------------- */
startButton.onclick = async () => {
    if (running) return;

    const pattern = PATTERNS[patternSelect.value];
    if (!pattern) return;

    running = true;
    paused = false;

    homeScreen.style.display = "none";
    runScreen.style.display = "flex";

    const profileKeys = pattern.profiles;

    renderDots(profileKeys.length);

    let totalTime = 0;

    for (const key of profileKeys) {
        totalTime += PROFILES[key].sequence.reduce((a, b) => a + b, 0);
    }

    let remainingPatternTime = totalTime;

    for (let p = 0; p < profileKeys.length && running; p++) {

        setActiveDot(p);

        const sequence = PROFILES[profileKeys[p]].sequence;
        const profileTime = sequence.reduce((a, b) => a + b, 0);

        for (let i = 0; i < sequence.length && running; i += 2) {

            const onTime = sequence[i];
            const offTime = sequence[i + 1] || 0;

            circle.classList.add("on");
            await countdown(onTime);

            circle.classList.remove("on");
            await countdown(offTime);
        }

        remainingPatternTime -= profileTime;
        patternTimerDisplay.textContent = remainingPatternTime;
    }

    running = false;
};
