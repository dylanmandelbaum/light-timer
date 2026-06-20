const nextProfile = document.getElementById("nextProfile");
const currentProfile = document.getElementById("currentProfile");
const patternTimerDisplay = document.getElementById("patternTimerDisplay");
const homeScreen = document.getElementById("homeScreen");
const runScreen = document.getElementById("runScreen");
const profileDots = document.getElementById("profileDots");
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

Object.entries(PATTERNS).forEach(([key, pattern]) => {

    const option = document.createElement("option");

    option.value = key;
    option.textContent = pattern.name;

    patternSelect.appendChild(option);

});

pauseButton.onclick = () => {

    paused = !paused;

    pauseButton.textContent =
        paused ? "▶" : "❚❚";

};

stopButton.onclick = () => {

    running = false;
    paused = false;

    homeScreen.style.display = "flex";
    runScreen.style.display = "none";

};

async function countdown(seconds) {

    for (let remaining = seconds; remaining > 0 && running; remaining--) {

        timerDisplay.textContent = remaining;

        while (paused)
            await sleep(.1);

        await sleep(1);

    }

}


function renderDots(count) {
    profileDots.innerHTML = "";

    for (let i = 0; i < count; i++) {
        const d = document.createElement("div");
        d.className = "dot";
        profileDots.appendChild(d);
    }
}

function setDot(index) {
    const dots = profileDots.children;

    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.toggle("active", i === index);
    }
}
startButton.onclick = async () => {

    if (running)
        return;

    running = true;

    homeScreen.style.display = "none";
    runScreen.style.display = "flex";

  const key = patternSelect.value;
const pattern = PATTERNS[key];

if (!pattern) return;

    const profileKeys =
        pattern.profiles;
    renderDots(profileKeys.length);
const patternTotalTime =
    profileKeys.reduce(

        (sum, key) =>

            sum +

            PROFILES[key]
                .sequence
                .reduce((a,b)=>a+b,0),

        0

    );

let patternRemaining =
    patternTotalTime;
    const profileNames =
        profileKeys.map(
            key => PROFILES[key].name
        );

    for (let p = 0; p < profileKeys.length && running; p++) {
currentProfile.textContent = PROFILES[profileKeys[p]].name;
     const next = profileKeys[p + 1];

    nextProfile.textContent = next
        ? "Next: " + PROFILES[next].name
        : "Next: —";

        setDot(p);

        const sequence =
            PROFILES[
                profileKeys[p]
            ].sequence;

        const totalTime =
            sequence.reduce(
                (a, b) => a + b,
                0
            );

        let elapsed = 0;

        for (let i = 0; i < sequence.length && running; i += 2) {

            const onTime = sequence[i];
            const offTime = sequence[i + 1] || 0;

            circle.classList.add("on");

            for (let t = 0; t < onTime && running; t++) {

                timerDisplay.textContent =
                    totalTime - elapsed;

                elapsed++;
patternRemaining--;

patternTimerDisplay.textContent =
    patternRemaining;
                while (paused)
                    await sleep(.1);

                await sleep(1);

            }

            circle.classList.remove("on");

            for (let t = 0; t < offTime && running; t++) {

                timerDisplay.textContent =
                    totalTime - elapsed;

                elapsed++;
patternRemaining--;

patternTimerDisplay.textContent =
    patternRemaining;
                while (paused)
                    await sleep(.1);

                await sleep(1);

            }

        }

    }

    running = false;

    homeScreen.style.display = "flex";
    runScreen.style.display = "none";

};

if ("serviceWorker" in navigator) {

    window.addEventListener("load", async () => {

        try {

            const reg = await navigator.serviceWorker.register("./service-worker.js");

            console.log("SW registered:", reg);

            reg.update();

        } catch (err) {

            console.log("SW failed:", err);

        }

    });

}
