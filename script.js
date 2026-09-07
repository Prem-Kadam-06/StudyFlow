// ==============================
// STUDYFLOW JAVASCRIPT
// ==============================


// ---------- TASK MANAGEMENT ----------

let tasks = JSON.parse(localStorage.getItem("studyflowTasks")) || [];

function saveTasks() {
    localStorage.setItem("studyflowTasks", JSON.stringify(tasks));
}

function addTask() {

    const input = document.getElementById("taskInput");
    const priority = document.getElementById("priority");

    const taskName = input.value.trim();

    if (taskName === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        name: taskName,
        priority: priority.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    input.value = "";

    renderTasks();
}


function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();

    renderTasks();
}


function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}


function renderTasks() {

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        taskList.innerHTML = `
            <p style="text-align:center; padding:30px; color:#9ca3af;">
                No tasks yet. Add your first study task!
            </p>
        `;

    } else {

        tasks.forEach(task => {

            const taskElement = document.createElement("div");

            taskElement.className =
                task.completed ? "task completed" : "task";

            taskElement.innerHTML = `

                <div class="task-left">

                    <input
                        type="checkbox"
                        ${task.completed ? "checked" : ""}
                        onchange="toggleTask(${task.id})"
                    >

                    <span class="task-name">
                        ${escapeHTML(task.name)}
                    </span>

                    <span class="priority">
                        ${task.priority}
                    </span>

                </div>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                    aria-label="Delete task"
                >
                    🗑️
                </button>
            `;

            taskList.appendChild(taskElement);

        });
    }

    updateStatistics();
}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ---------- STATISTICS ----------

function updateStatistics() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent = completed;

    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }

    document.getElementById("goalPercent").textContent = percentage;

    document.getElementById("goalProgress").style.width =
        percentage + "%";
}


// ---------- POMODORO TIMER ----------

let timeLeft = 25 * 60;

let timerInterval = null;


function updateTimerDisplay() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;

    const formattedMinutes =
        String(minutes).padStart(2, "0");

    const formattedSeconds =
        String(seconds).padStart(2, "0");

    document.getElementById("timerDisplay").textContent =
        `${formattedMinutes}:${formattedSeconds}`;
}


function startTimer() {

    if (timerInterval !== null) {
        return;
    }

    timerInterval = setInterval(() => {

        if (timeLeft > 0) {

            timeLeft--;

            updateTimerDisplay();

        } else {

            clearInterval(timerInterval);

            timerInterval = null;

            alert("🎉 Focus session completed!");

            addStudyTime(25);
        }

    }, 1000);
}


function pauseTimer() {

    clearInterval(timerInterval);

    timerInterval = null;
}


function resetTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    timeLeft = 25 * 60;

    updateTimerDisplay();
}


function addStudyTime(minutes) {

    let studyTime =
        Number(localStorage.getItem("studyTime")) || 0;

    studyTime += minutes;

    localStorage.setItem(
        "studyTime",
        studyTime
    );

    document.getElementById("studyTime").textContent =
        studyTime;
}


// ---------- NOTES ----------

function saveNotes() {

    const notes =
        document.getElementById("notesArea").value;

    localStorage.setItem(
        "studyflowNotes",
        notes
    );

    document.getElementById("savedMessage").textContent =
        "✓ Notes saved!";
}


// ---------- THEME ----------

const themeBtn =
    document.getElementById("themeBtn");


themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.textContent = "☀️";

        localStorage.setItem(
            "studyflowTheme",
            "dark"
        );

    } else {

        themeBtn.textContent = "🌙";

        localStorage.setItem(
            "studyflowTheme",
            "light"
        );
    }
});


// ---------- LOAD SAVED DATA ----------

function loadSavedData() {

    const savedNotes =
        localStorage.getItem("studyflowNotes");

    if (savedNotes) {

        document.getElementById("notesArea").value =
            savedNotes;
    }


    const savedStudyTime =
        Number(localStorage.getItem("studyTime")) || 0;

    document.getElementById("studyTime").textContent =
        savedStudyTime;


    const savedTheme =
        localStorage.getItem("studyflowTheme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeBtn.textContent = "☀️";
    }


    renderTasks();

    updateTimerDisplay();
}


// Start application

loadSavedData();