function generateSubjects() {
    const num = document.getElementById("numSubjects").value;
    const table = document.getElementById("subjectsTable");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    table.classList.remove("hidden");

    for (let i = 0; i < num; i++) {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td data-label="Classes Held"><input type="number" class="held" min="0" oninput="calculateAttendance(this)"></td>
            <td data-label="Classes Attended"><input type="number" class="attended" min="0" oninput="calculateAttendance(this)"></td>
            <td data-label="Attendance %" class="percentage">0%</td>
            <td data-label="Classes You Can Skip" class="skipable">0</td>
            <td data-label="Skipped" class="skipped">0</td>
            <td data-label="Attended Count" class="attendedCount">0</td>
            <td data-label="Actions">
                <button onclick="skipClass(this)">Skip</button>
                <button onclick="undoSkip(this)" disabled>Undo Skip</button>
                <button onclick="attendClass(this)">Attend</button>
                <button onclick="undoAttend(this)" disabled>Undo Attend</button>
            </td>
        `;
    }
}


function removeTable() {
    document.getElementById("numSubjects").value = "";
    const table = document.getElementById("subjectsTable");
    table.querySelector("tbody").innerHTML = "";
    table.classList.add("hidden");
}

function calculateAttendance(el) {
    const row = el.closest("tr");
    const held = parseInt(row.querySelector(".held").value) || 0;
    const attended = parseInt(row.querySelector(".attended").value) || 0;
    const percentageEl = row.querySelector(".percentage");
    const skipableEl = row.querySelector(".skipable");
    const headerEl = document.querySelector(".dynamic-header"); // Table header for desktop
    const skipableLabel = skipableEl.closest("td"); // Get the parent <td> for mobile

    // Calculate Attendance Percentage
    const percentage = held > 0 ? (attended / held * 100).toFixed(2) : 0;

    let requiredClasses = 0; // If attendance is below 75%, how many classes to attend
    let skipable = 0; // If attendance is above 75%, how many classes can be skipped

    if (percentage >= 75) {
        // Calculate how many classes can be skipped while staying above 75%
        while ((attended / (held + skipable) * 100) >= 75) {
            skipable++;
        }
        skipable--; // Subtract 1 because the last added class went below 75%

        // Update Header for Desktop & Label for Mobile
        headerEl.innerText = "Classes You Can Skip";
        skipableLabel.setAttribute("data-label", "Classes You Can Skip");

        skipableEl.innerText = skipable;
    } else {
        // Calculate required classes to reach 75%
        requiredClasses = Math.ceil((0.75 * held - attended) / 0.25);
        requiredClasses = requiredClasses < 0 ? 0 : requiredClasses;

        // Update Header for Desktop & Label for Mobile
        headerEl.innerText = "Required Classes to 75%";
        skipableLabel.setAttribute("data-label", "Required Classes to 75%");

        skipableEl.innerText = requiredClasses;
    }

    // Update UI
    percentageEl.innerText = percentage + "%";
}


function skipClass(el) {
    const row = el.closest("tr");
    const held = row.querySelector(".held");
    const skipped = row.querySelector(".skipped");
    held.value = parseInt(held.value) + 1;
    skipped.innerText = parseInt(skipped.innerText) + 1;
    calculateAttendance(held);
    row.querySelector("button[onclick='undoSkip(this)']").disabled = false;
}

function undoSkip(el) {
    const row = el.closest("tr");
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
    const row = el.closest("tr");
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
    const row = el.closest("tr");
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
