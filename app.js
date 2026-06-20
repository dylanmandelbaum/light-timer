

const profileDots = document.getElementById("profileBar");

const homeScreen = document.getElementById("homeScreen");
const runScreen = document.getElementById("runScreen");

const patternSelect = document.getElementById("patternSelect");

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");

const timerDisplay = document.getElementById("timerDisplay");
const profileBar = document.getElementById("profileBar");

const circle = document.getElementById("circle");

let running = false;
let paused = false;

function sleep(seconds) {
    return new Promise(resolve =>
        setTimeout(resolve, seconds * 1000));
}

/* -------------------------
   BUILD PATTERN DROPDOWN
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

    homeScreen.style.display = "flex";
    runScreen.style.display = "none";
};

/* -------------------------
   DOT SYSTEM
-------------------------- */
function renderDots(count) {
    profileDots.innerHTML = "";

    for (let i = 0; i < count; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        profileDots.appendChild(dot);
    }
}

function setActiveDot(index) {
    const dots = profileDots.children;

    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("done", "active");

        if (i < index) {
            dots[i].classList.add("done");
        } else if (i === index) {
            dots[i].classList.add("active");
        }
    }
}

/* -------------------------
   TIMER
-------------------------- */
async function countdown(seconds) {
    for (let remaining = seconds; remaining > 0 && running; remaining--) {

        timerDisplay.textContent = remaining;

        while (paused)
            await sleep(0.1);

        await sleep(1);
    }
}

/* -------------------------
   MAIN RUN
-------------------------- */
startButton.onclick = async () => {
    if (running) return;

    running = true;

    homeScreen.style.display = "none";
    runScreen.style.display = "flex";
const key = patternSelect.value;
const pattern = PATTERNS[key];

if (!pattern) {
    console.log("No pattern selected or invalid key:", key);
    return;
}
    const profileKeys = pattern.profiles;

    const profileNames = profileKeys.map(
        key => PROFILES[key].name
    );

    /* -------------------------
       INIT DOTS (STEP 6)
    -------------------------- */
    renderDots(profileKeys.length);
    setActiveDot(0);

    let patternRemaining = profileKeys.reduce(
        (sum, key) =>
            sum +
            PROFILES[key].sequence.reduce((a, b) => a + b, 0),
        0
    );

    /* -------------------------
       PROFILE LOOP
    -------------------------- */
    for (let p = 0; p < profileKeys.length && running; p++) {

        updateProfileBar(profileNames, p);

        /* DOT UPDATE (STEP 7) */
        setActiveDot(p);

        const sequence =
            PROFILES[profileKeys[p]].sequence;

        let elapsed = 0;

        const totalTime =
            sequence.reduce((a, b) => a + b, 0);

        for (let i = 0; i < sequence.length && running; i += 2) {

            const onTime = sequence[i];
            const offTime = sequence[i + 1] || 0;

            circle.classList.add("on");

            for (let t = 0; t < onTime && running; t++) {

                timerDisplay.textContent = totalTime - elapsed;

                elapsed++;
                patternRemaining--;

                while (paused)
                    await sleep(0.1);

                await sleep(1);
            }

            circle.classList.remove("on");

            for (let t = 0; t < offTime && running; t++) {

                timerDisplay.textContent = totalTime - elapsed;

                elapsed++;
                patternRemaining--;

                while (paused)
                    await sleep(0.1);

                await sleep(1);
            }
        }
    }

    running = false;

    homeScreen.style.display = "flex";
    runScreen.style.display = "none";
};

/* -------------------------
   SERVICE WORKER
-------------------------- */
if ("serviceWorker" in navigator) {

    window.addEventListener("load", async () => {

        try {
            const reg = await navigator.serviceWorker.register(
                "./service-worker.js"
            );

            console.log("SW registered:", reg);

            reg.update();

        } catch (err) {
            console.log("SW failed:", err);
        }
    });
}
