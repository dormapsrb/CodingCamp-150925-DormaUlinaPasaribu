const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const errorMsg = document.getElementById("errorMsg");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progress = document.getElementById("progress");

const confirmModal = document.getElementById("confirmModal");
const modalMessage = document.getElementById("modalMessage");
const cancelDeleteBtn = document.getElementById("cancelDelete");
const confirmDeleteBtn = document.getElementById("confirmDelete");

const editModal = document.getElementById("editModal");
const editInput = document.getElementById("editInput");
const cancelEditBtn = document.getElementById("cancelEdit");
const saveEditBtn = document.getElementById("saveEdit");

const filterAllBtn = document.getElementById("filterAll");
const filterPendingBtn = document.getElementById("filterPending");
const filterCompletedBtn = document.getElementById("filterCompleted");
const deleteAllBtn = document.getElementById("deleteAll");

let tasks = [];
let deleteIndex = null;
let deleteAllMode = false;
let editIndex = null;
let currentFilter = "all";



function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks;

  // Apply filter
  if (currentFilter !== "all") {
    filteredTasks = tasks.filter(task => task.status === currentFilter);
  }

  // Apply search
  const searchText = searchInput.value.toLowerCase();
  if (searchText) {
    filteredTasks = filteredTasks.filter(task =>
      task.name.toLowerCase().includes(searchText)
    );
  }

  // Render rows
  filteredTasks.forEach((task, index) => {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50";
    
    //Date Format
    function formatDate(dateStr) {
      if (!dateStr) return "No due date";
      const options = { day: "2-digit", month: "long", year: "numeric" };
      return new Date(dateStr).toLocaleDateString("id-ID", options);
    }


    row.innerHTML = `
      <td class="border border-gray-300 text-center p-2">${task.name}</td>
      <td class="border border-gray-300 text-center p-2">${formatDate(task.dueDate) || "No due date"}</td>
      <td class="border border-gray-300 text-center p-2">
        <span class="${task.status === "completed" ? "text-green-500" : "text-yellow-500"} font-semibold">
          ${task.status}
        </span>
      </td>
      <td class="border border-gray-300 text-center p-2 space-x-2">
        <button onclick="toggleStatus(${index})" class="bg-blue-500 text-white px-2 py-1 rounded">✔</button>
        <button onclick="showEditModal(${index})" class="bg-yellow-500 text-white px-2 py-1 rounded">✎</button>
        <button onclick="showDeleteConfirm(${index}, false)" class="bg-red-500 text-white px-2 py-1 rounded">🗑</button>
      </td>
    `;
    taskList.appendChild(row);
  });

  if (filteredTasks.length === 0) {
    const row = document.createElement("tr");
    row.id = "emptyMessage";
    row.innerHTML = `
      <td colspan="4" class="text-center py-4 text-gray-500">
         No tasks yet. Please add a new task.
      </td>
    `;
    taskList.appendChild(row);
  }

  updateStats();
}

function updateStats() {
  totalTasks.textContent = tasks.length;
  completedTasks.textContent = tasks.filter(t => t.status === "completed").length;
  pendingTasks.textContent = tasks.filter(t => t.status === "pending").length;

  let percent = tasks.length
    ? Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100)
    : 0;
  progress.textContent = percent + "%";
}

addTaskBtn.addEventListener("click", () => {
  const taskName = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!taskName) {
    taskInput.classList.add("border-red-500");
    errorMsg.classList.remove("hidden");
    errorMsg.textContent = "Task name is required.";
    return;
  } else {
    taskInput.classList.remove("border-red-500");
    errorMsg.classList.add("hidden");
  }

  tasks.push({ name: taskName, dueDate: dueDate, status: "pending" });
  taskInput.value = "";
  dueDateInput.value = "";
  renderTasks();
});


function toggleStatus(index) {
  tasks[index].status = tasks[index].status === "pending" ? "completed" : "pending";
  renderTasks();
}

// Edit task
function showEditModal(index) {
  editIndex = index;
  editInput.value = tasks[index].name;
  editModal.classList.remove("hidden");
}
cancelEditBtn.addEventListener("click", () => {
  editModal.classList.add("hidden");
  editIndex = null;
});
saveEditBtn.addEventListener("click", () => {
  if (editInput.value.trim() !== "") {
    tasks[editIndex].name = editInput.value.trim();
    renderTasks();
  }
  editModal.classList.add("hidden");
  editIndex = null;
});

// Delete confirm
function showDeleteConfirm(index, all = false) {
  deleteIndex = index;
  deleteAllMode = all;
  modalMessage.textContent = all
    ? "Are you sure you want to delete ALL tasks?"
    : "Are you sure you want to delete this task?";
  confirmModal.classList.remove("hidden");
}
cancelDeleteBtn.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
  deleteIndex = null;
  deleteAllMode = false;
});
confirmDeleteBtn.addEventListener("click", () => {
  if (deleteAllMode) {
    tasks = [];
  } else if (deleteIndex !== null) {
    tasks.splice(deleteIndex, 1);
  }
  renderTasks();
  confirmModal.classList.add("hidden");
  deleteIndex = null;
  deleteAllMode = false;
});

// Delete All
deleteAllBtn.addEventListener("click", () => {
  if (tasks.length > 0) {
    showDeleteConfirm(null, true);
  }
});

// Search
searchInput.addEventListener("input", renderTasks);

// Filter
const filterToggle = document.getElementById("filterToggle");
const filterMenu = document.getElementById("filterMenu");

filterToggle.addEventListener("click", () => {
  filterMenu.classList.toggle("hidden");
});

// Event delegation untuk dropdown
filterMenu.addEventListener("click", (e) => {
  if (e.target.dataset.filter) {
    currentFilter = e.target.dataset.filter;

    // ubah tulisan tombol sesuai pilihan
    filterToggle.textContent =
      currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1);

    renderTasks();
    filterMenu.classList.add("hidden");
  }
});


// Klik luar dropdown untuk close
document.addEventListener("click", (e) => {
  if (!filterMenu.contains(e.target) && !filterToggle.contains(e.target)) {
    filterMenu.classList.add("hidden");
  }
});

renderTasks();
