function generateSubjects() {
    const num = document.getElementById("numSubjects").value;
    const container = document.getElementById("subjectsContainer");
    const subjectsList = document.getElementById("subjectsList");

    subjectsList.innerHTML = ""; // Clear previous data
    container.classList.remove("hidden");

    for (let i = 0; i < num; i++) {
        let row = document.createElement("div");
        row.classList.add("row");

        row.innerHTML = `
            <div class="cell" data-label="Classes Held">
                <input type="number" class="held" min="0" oninput="calculateAttendance(this)">
            </div>
            <div class="cell" data-label="Classes Attended">
                <input type="number" class="attended" min="0" oninput="calculateAttendance(this)">
            </div>
            <div class="cell percentage" data-label="Attendance %">0%</div>
            <div class="cell skipable" data-label="Classes You Can Skip">0</div>
            <div class="cell skipped" data-label="Skipped">0</div>
            <div class="cell attendedCount" data-label="Attended Count">0</div>
            <div class="cell actions" data-label="Actions">
                <button onclick="skipClass(this)">Skip</button>
                <button onclick="undoSkip(this)" disabled>Undo Skip</button>
                <button onclick="attendClass(this)">Attend</button>
                <button onclick="undoAttend(this)" disabled>Undo Attend</button>
            </div>
        `;

        subjectsList.appendChild(row);
    }
}


function removeTable() {
    document.getElementById("numSubjects").value = "";
    document.getElementById("subjectsList").innerHTML = "";
    document.getElementById("subjectsContainer").classList.add("hidden");
}

function calculateAttendance(el) {
    const row = el.closest(".row");
    const held = parseInt(row.querySelector(".held").value) || 0;
    const attended = parseInt(row.querySelector(".attended").value) || 0;
    const percentageEl = row.querySelector(".percentage");
    const skipableEl = row.querySelector(".skipable");
    const headerEl = document.querySelector(".dynamic-header"); // Header for desktop
    const skipableLabel = skipableEl; // Mobile label

    // Calculate Attendance Percentage
    const percentage = held > 0 ? (attended / held * 100).toFixed(2) : 0;

    let requiredClasses = 0;
    let skipable = 0;

    if (percentage >= 75) {
        while ((attended / (held + skipable) * 100) >= 75) {
            skipable++;
        }
        skipable--;

        headerEl.innerText = "Classes You Can Skip";
        skipableLabel.setAttribute("data-label", "Classes You Can Skip");
        skipableEl.innerText = skipable;
    } else {
        requiredClasses = Math.ceil((0.75 * held - attended) / 0.25);
        requiredClasses = requiredClasses < 0 ? 0 : requiredClasses;

        headerEl.innerText = "Required Classes to 75%";
        skipableLabel.setAttribute("data-label", "Required Classes to 75%");
        skipableEl.innerText = requiredClasses;
    }

    percentageEl.innerText = percentage + "%";
}

function skipClass(el) {
    const row = el.closest(".row");
    const held = row.querySelector(".held");
    const skipped = row.querySelector(".skipped");

    held.value = parseInt(held.value) + 1;
    skipped.innerText = parseInt(skipped.innerText) + 1;

    calculateAttendance(held);
    row.querySelector("button[onclick='undoSkip(this)']").disabled = false;
}

function undoSkip(el) {
    const row = el.closest(".row");
    const held = row.querySelector(".held");
    const skipped = row.querySelector(".skipped");

    if (parseInt(skipped.innerText) > 0) {
        held.value = parseInt(held.value) - 1;
        skipped.innerText = parseInt(skipped.innerText) - 1;
        calculateAttendance(held);
    }
    el.disabled = parseInt(skipped.innerText) === 0;
}

function attendClass(el) {
    const row = el.closest(".row");
    const held = row.querySelector(".held");
    const attended = row.querySelector(".attended");
    const attendedCount = row.querySelector(".attendedCount");

    held.value = parseInt(held.value) + 1;
    attended.value = parseInt(attended.value) + 1;
    attendedCount.innerText = parseInt(attendedCount.innerText) + 1;

    calculateAttendance(held);
    row.querySelector("button[onclick='undoAttend(this)']").disabled = false;
}

function undoAttend(el) {
    const row = el.closest(".row");
    const held = row.querySelector(".held");
    const attended = row.querySelector(".attended");
    const attendedCount = row.querySelector(".attendedCount");

    if (parseInt(attendedCount.innerText) > 0) {
        held.value = parseInt(held.value) - 1;
        attended.value = parseInt(attended.value) - 1;
        attendedCount.innerText = parseInt(attendedCount.innerText) - 1;
        calculateAttendance(held);
    }
    el.disabled = parseInt(attendedCount.innerText) === 0;
}
