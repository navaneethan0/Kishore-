/* ===================== DATA ===================== */

const equipmentRequests = [
  {
    teamId: "TEAM-001",
    teamName: "Aman Verma",
    component: "3D Printer - Creality Ender 3",
    qty: 1,
    details: "Required for project prototype",
    requestDate: "02 Jul 2026",
  },
  {
    teamId: "TEAM-002",
    teamName: "Sneha Gupta",
    component: "Laser Cutter - 10W",
    qty: 1,
    details: "Required for enclosure cutting",
    requestDate: "02 Jul 2026",
  },
  {
    teamId: "TEAM-003",
    teamName: "Rohit Singh",
    component: "Oscilloscope - Digital",
    qty: 1,
    details: "Signal debugging for final demo",
    requestDate: "01 Jul 2026",
  },
  {
    teamId: "TEAM-004",
    teamName: "Neha Patel",
    component: "Arduino Uno R3",
    qty: 2,
    details: "Sensor integration testing",
    requestDate: "01 Jul 2026",
  },
  {
    teamId: "TEAM-005",
    teamName: "Vivek Kumar",
    component: "Multimeter - Digital",
    qty: 1,
    details: "Circuit continuity checks",
    requestDate: "30 Jun 2026",
  },
  {
    teamId: "TEAM-006",
    teamName: "Pooja Mehta",
    component: "Power Supply - 30V 5A",
    qty: 1,
    details: "Bench testing of motor driver",
    requestDate: "30 Jun 2026",
  },
  {
    teamId: "TEAM-007",
    teamName: "Karan Malhotra",
    component: "Stepper Motor - NEMA 17",
    qty: 3,
    details: "CNC axis assembly",
    requestDate: "29 Jun 2026",
  },
];

const serviceEquipment = [
  { id: "EQP-0001", name: "3D Printer - Creality Ender 3" },
  { id: "EQP-0002", name: "Laser Cutter - 10W" },
  { id: "EQP-0003", name: "Oscilloscope - Digital" },
  { id: "EQP-0004", name: "Arduino Uno R3" },
  { id: "EQP-0005", name: "Multimeter - Digital" },
  { id: "EQP-0006", name: "Power Supply - 30V 5A" },
  { id: "EQP-0007", name: "Stepper Motor - NEMA 17" },
  { id: "EQP-0008", name: "DC Motor - 12V" },
  { id: "EQP-0009", name: "Soldering Station - 60W" },
  { id: "EQP-0010", name: "Function Generator" },
  { id: "EQP-0011", name: "Digital Storage Oscilloscope" },
  { id: "EQP-0012", name: "Vacuum Pump" },
];

/* ===================== RENDER: EQUIPMENT LIST ===================== */

function renderEquipmentList() {
  const body = document.getElementById("equipment-list-body");
  body.innerHTML = "";

  equipmentRequests.forEach((req, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${req.teamId}</td>
      <td>${req.teamName}</td>
      <td>${req.component}</td>
      <td><button class="btn btn-view" data-index="${index}"><i class="fa-regular fa-eye"></i> View</button></td>
    `;
    body.appendChild(tr);
  });

  body.querySelectorAll(".btn-view").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index);
      openRequestModal(equipmentRequests[idx]);
    });
  });
}

/* ===================== RENDER: OUT FOR SERVICE LIST ===================== */

function renderServiceList() {
  const body = document.getElementById("service-list-body");
  body.innerHTML = "";

  serviceEquipment.forEach((eq, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${eq.id}</td>
      <td>${eq.name}</td>
      <td><input type="checkbox" data-id="${eq.id}" aria-label="Select ${eq.name}"></td>
    `;
    body.appendChild(tr);
  });
}

/* ===================== VIEW SWITCHING ===================== */

function showView(viewName) {
  document.querySelectorAll(".view").forEach((el) => {
    el.hidden = el.id !== `view-${viewName}`;
  });
}

document.getElementById("btn-goto-service").addEventListener("click", () => {
  showView("service");
});

/* ===================== MODAL ===================== */

const modal = document.getElementById("request-modal");
const rejectReason = document.getElementById("reject-reason");
const charCount = document.getElementById("char-count");
const submitFeedbackBtn = document.getElementById("btn-submit-feedback");

function openRequestModal(req) {
  document.getElementById("m-team-id").textContent = `: ${req.teamId}`;
  document.getElementById("m-date").textContent = `: ${req.requestDate}`;
  document.getElementById("m-team-name").textContent = `: ${req.teamName}`;
  document.getElementById("m-by").textContent = `: ${req.teamName}`;
  document.getElementById("m-component").textContent = req.component;
  document.getElementById("m-qty").textContent = req.qty;
  document.getElementById("m-details").textContent = req.details;

  rejectReason.value = "";
  updateCharCount();

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeRequestModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

document.getElementById("modal-close").addEventListener("click", closeRequestModal);
document.getElementById("btn-cancel").addEventListener("click", closeRequestModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeRequestModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeRequestModal();
});

function updateCharCount() {
  const len = rejectReason.value.length;
  charCount.textContent = len;
  submitFeedbackBtn.disabled = len === 0;
}

rejectReason.addEventListener("input", updateCharCount);

document.getElementById("btn-accept").addEventListener("click", () => {
  showToast("Request accepted.");
  closeRequestModal();
});

document.getElementById("btn-reject").addEventListener("click", () => {
  if (rejectReason.value.trim().length === 0) {
    rejectReason.focus();
    return;
  }
  showToast("Request rejected with feedback.");
  closeRequestModal();
});

submitFeedbackBtn.addEventListener("click", () => {
  if (rejectReason.value.trim().length === 0) return;
  showToast("Feedback submitted.");
  closeRequestModal();
});

/* ===================== OUT FOR SERVICE SUBMIT ===================== */

document.getElementById("btn-out-for-service").addEventListener("click", () => {
  const selected = Array.from(
    document.querySelectorAll("#service-list-body input[type='checkbox']:checked")
  ).map((cb) => cb.dataset.id);

  if (selected.length === 0) {
    showToast("Select at least one item to mark out for service.");
    return;
  }

  showToast(`${selected.length} item(s) marked out for service.`);
  showView("dashboard");
});

/* ===================== TOAST ===================== */

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

/* ===================== DATE ===================== */

function setToday() {
  const el = document.getElementById("today-date");
  if (!el) return;
  const d = new Date();
  const options = { day: "2-digit", month: "short", year: "numeric" };
  el.textContent = d.toLocaleDateString("en-GB", options).replace(",", "");
}

/* ===================== INIT ===================== */

renderEquipmentList();
renderServiceList();
setToday();
showView("dashboard");
