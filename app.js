const circle = document.getElementById("circle");

const timerDisplay = document.getElementById("timerDisplay");
const statusDisplay = document.getElementById("statusDisplay");

const patternSelect = document.getElementById("patternSelect");
const patternName = document.getElementById("patternName");
const sequenceInput = document.getElementById("sequence");
const repeatInput = document.getElementById("repeatCount");

const saveButton = document.getElementById("saveButton");
const deleteButton = document.getElementById("deleteButton");

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");

function loadPatterns() {

    try {

        return JSON.parse(
            localStorage.getItem("patterns")
        ) || [];

    }

    catch {

        return [];

    }

}

function savePatterns() {

    localStorage.setItem(
        "patterns",
        JSON.stringify(patterns)
    );

}

let patterns = loadPatterns();

let running = false;
let paused = false;

function sleep(seconds) {
    return new Promise(resolve =>
        setTimeout(resolve, seconds * 1000));
}

function refreshPatternList() {

    patternSelect.innerHTML =
        '<option value="">Select Pattern</option>';

    patterns.forEach((pattern, index) => {

        let option = document.createElement("option");

        option.value = index;
        option.textContent = pattern.name;

        patternSelect.appendChild(option);

    });

}

patternSelect.onchange = () => {

    if (patternSelect.value === "")
        return;

    const pattern = patterns[patternSelect.value];

    patternName.value = pattern.name;
    sequenceInput.value = pattern.sequence;
    repeatInput.value = pattern.repeatCount;

};

saveButton.onclick = () => {

    const pattern = {

        name: patternName.value,

        sequence: sequenceInput.value,

        repeatCount: Number(repeatInput.value)

    };

    const existing = patterns.findIndex(
        p => p.name === pattern.name
    );

    if (existing >= 0)
        patterns[existing] = pattern;
    else
        patterns.push(pattern);

   savePatterns();
    );

    refreshPatternList();

};

deleteButton.onclick = () => {

    patterns = patterns.filter(
        p => p.name !== patternName.value
    );

  savePatterns();
    );

    refreshPatternList();

};

pauseButton.onclick = () => {

    paused = !paused;

    pauseButton.textContent =
        paused ? "Resume" : "Pause";

};

stopButton.onclick = () => {

document.body.classList.remove("running");
    
    running = false;
    paused = false;

    timerDisplay.textContent = "Ready";

    statusDisplay.innerHTML =
        "Cycle 0<br>Step 0";

    circle.style.opacity = "0";
    circle.style.transform = "scale(.7)";

};

async function countdown(seconds) {

    let remaining = seconds;

    while (remaining > 0 && running) {

        while (paused)
            await sleep(.1);

        timerDisplay.textContent =
            remaining.toFixed(1);

        await sleep(.1);

        remaining -= .1;

    }

}

startButton.onclick = async () => {

document.body.classList.add("running");
    
    if (running)
        return;

    running = true;

    const sequence =
        sequenceInput.value
            .trim()
            .split(/\s+/)
            .map(Number);

    let repeatCount =
        Number(repeatInput.value);

    let cycle = 1;

    while (
        running &&
        (repeatCount < 0 || cycle <= repeatCount)
    ) {

        for (let i = 0; i < sequence.length; i += 2) {

            if (!running)
                break;

            const onTime = sequence[i];
            const offTime = sequence[i + 1] || 0;

            statusDisplay.innerHTML =
                `Cycle ${cycle}<br>
                 Step ${i / 2 + 1}`;

            circle.style.opacity = "1";
            circle.style.transform = "scale(1)";

            await countdown(onTime);

            circle.style.opacity = "0";
            circle.style.transform = "scale(.7)";

            await countdown(offTime);

        }

        cycle++;

    }

    running = false;
document.body.classList.remove("running");
};

refreshPatternList();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        try {
            const reg = await navigator.serviceWorker.register("./service-worker.js");
            console.log("SW registered:", reg);
        } catch (err) {
            console.log("SW failed:", err);
        }
    });
}
