const form = document.getElementById("taskForm");
const tbody = document.querySelector("#tasksTable tbody");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const task = document.getElementById("taskInput").value.trim();
  const deadline = document.getElementById("deadlineInput").value;
  const priority = document.getElementById("priorityInput").value;

  if (!task || !deadline || !priority) {
    alert("Semua field harus diisi!");
    return;
  }

  const taskData = { task, deadline, priority };

  try {
    const res = await fetch("http://127.0.0.1:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Error: ${err.error}`);
      return;
    }

    form.reset();
    loadTasks();
  } catch (error) {
    alert("Gagal terhubung ke backend.");
    console.error(error);
  }
});

async function loadTasks() {
  try {
    const res = await fetch("http://127.0.0.1:5000/tasks");
    const tasks = await res.json();

    tbody.innerHTML = "";

    tasks.forEach((task) => {
      const tr = document.createElement("tr");
      tr.classList.add("hover:bg-pink-100", "transition-colors");
      tr.innerHTML = `
        <td class="py-3 px-4 border-b border-pink-100">${task.task}</td>
        <td class="py-3 px-4 border-b border-pink-100">${task.deadline}</td>
        <td class="py-3 px-4 border-b border-pink-100 text-center font-bold text-pink-600">${task.priority}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Gagal load data tugas:", error);
  }
}

document.getElementById("sortPriorityBtn").addEventListener("click", () => {
  const sorted = [...tbody.children].sort(
    (a, b) =>
      parseInt(b.children[2].textContent) - parseInt(a.children[2].textContent)
  );
  tbody.innerHTML = "";
  sorted.forEach((row) => tbody.appendChild(row));
});

document.getElementById("sortDeadlineBtn").addEventListener("click", () => {
  const sorted = [...tbody.children].sort(
    (a, b) =>
      new Date(a.children[1].textContent) - new Date(b.children[1].textContent)
  );
  tbody.innerHTML = "";
  sorted.forEach((row) => tbody.appendChild(row));
});

document.getElementById("clearTasksBtn").addEventListener("click", async () => {
  if (!confirm("Yakin ingin menghapus semua tugas?")) return;

  try {
    const res = await fetch("http://127.0.0.1:5000/tasks", {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Error: ${err.error}`);
      return;
    }

    loadTasks();
  } catch (error) {
    alert("Gagal menghapus tugas.");
    console.error(error);
  }
});

// Load tugas saat halaman dibuka
loadTasks();
