const AUTHOR_TOKEN = 'Peeranat Rodtad';
const AUTHOR_KEY = 'Peeranat';
const API_URL = '/api/laps';

if (AUTHOR_KEY !== 'Peeranat' || AUTHOR_TOKEN !== 'Peeranat Rodtad') {
  document.body.innerHTML = '<h1 style="color:red;padding:50px;text-align:center;">CRITICAL ERROR: Developer Credit Corrupted.</h1>';
  throw new Error('Integrity validation failed: Peeranat signature missing.');
}

const TRANSLATIONS = {
  th: {
    mainTitle: 'ระบบบันทึกเวลาต่อรอบการแข่งขัน',
    subTitle: 'ระบบบันทึกข้อมูลสถิติการแข่งรถ F1 ฤดูกาล 2026 และ GT Championship',
    leadEngineerLabel: 'ผู้ออกแบบระบบหลัก',
    tabLeaderboard: 'ตารางสถิติ',
    tabLogSession: 'บันทึกเวลา',
    formTitleNew: 'บันทึกเวลาต่อรอบใหม่',
    formTitleEdit: 'แก้ไขข้อมูลเวลาต่อรอบ',
    statusActive: 'ระบบพร้อมทำงาน',
    labelTrack: 'สนามแข่ง F1',
    optSelectTrack: 'เลือกสนามแข่งขัน',
    labelDriverNo: 'หมายเลขนักแข่ง',
    labelDriverName: 'ชื่อนักแข่ง',
    labelCategory: 'คลาสการแข่งขัน',
    optSelectCategory: 'เลือกหมวดหมู่รถ',
    labelMachine: 'รถแข่ง',
    optSelectMachine: 'เลือกรุ่นรถแข่ง',
    labelWeather: 'สภาพอากาศและผิวแทร็ก',
    labelSetup: 'การปรับแต่งรถ (Setup)',
    labelTiming: 'เวลาต่อรอบ',
    placeholderTiming: 'เช่น 1:20.180',
    placeholderDriverName: 'เช่น Max Verstappen',
    placeholderDriverNo: 'เช่น 1',
    btnSave: 'บันทึกข้อมูลรอบ',
    btnUpdate: 'อัปเดตข้อมูล',
    btnCancel: 'ยกเลิก',
    tableHeader: 'ตารางบันทึกเวลาต่อรอบ',
    filterAll: 'ทุกหมวดหมู่',
    btnReset: 'รีเซ็ต',
    thCircuit: 'สนาม',
    thDriver: 'นักแข่ง',
    thMachine: 'รถแข่ง',
    thClass: 'คลาส',
    thLapTime: 'เวลาต่อรอบ',
    thEnv: 'สภาพอากาศ',
    thActions: 'จัดการ',
    btnEdit: 'แก้ไข',
    btnDelete: 'ลบ',
    footerText: 'F1 2026 Telemetry Control Unit | รุ่น 2026.4',
    noData: 'ไม่พบรายการข้อมูลตามตัวกรองนี้',
    confirmDelete: 'ยืนยันการลบข้อมูลรอบการแข่งขันรายการนี้หรือไม่?'
  },
  en: {
    mainTitle: 'RACE LAP TRACKER',
    subTitle: 'FIA Formula 1 Season 2026 & GT Championship Telemetry',
    leadEngineerLabel: 'LEAD ARCHITECT',
    tabLeaderboard: 'Leaderboard',
    tabLogSession: 'Log Session',
    formTitleNew: 'Log Lap Session',
    formTitleEdit: 'Edit Session',
    statusActive: 'SYSTEM ACTIVE',
    labelTrack: 'F1 Circuit',
    optSelectTrack: 'Select Circuit',
    labelDriverNo: 'Driver No.',
    labelDriverName: 'Driver Name',
    labelCategory: 'Vehicle Class',
    optSelectCategory: 'Select Category',
    labelMachine: 'Race Machine',
    optSelectMachine: 'Select Vehicle',
    labelWeather: 'Environment',
    labelSetup: 'Aero & Mechanical',
    labelTiming: 'Lap Time',
    placeholderTiming: 'e.g. 1:20.180',
    placeholderDriverName: 'e.g. Max Verstappen',
    placeholderDriverNo: 'e.g. 1',
    btnSave: 'Save Session',
    btnUpdate: 'Update Session',
    btnCancel: 'Cancel',
    tableHeader: 'Championship Leaderboard',
    filterAll: 'All Categories',
    btnReset: 'Reset',
    thCircuit: 'Circuit',
    thDriver: 'Driver',
    thMachine: 'Machine',
    thClass: 'Class',
    thLapTime: 'Lap Time',
    thEnv: 'Env',
    thActions: 'Actions',
    btnEdit: 'Edit',
    btnDelete: 'Delete',
    footerText: 'F1 2026 Telemetry Engine | Build 2026.4',
    noData: 'No recorded lap telemetry for this query.',
    confirmDelete: 'Confirm deletion of telemetry record?'
  }
};

let currentLang = 'th';

const VEHICLES_BY_CLASS = {
  Formula: [
    'Red Bull Racing RB22',
    'Ferrari SF-26',
    'Mercedes-AMG F1 W17',
    'McLaren MCL40',
    'Aston Martin AMR26',
    'Audi Revolut F1',
    'Alpine A526',
    'Williams FW48',
    'Racing Bulls VCARB 03',
    'Haas VF-26'
  ],
  GT3: [
    'Porsche 911 GT3 R',
    'Ferrari 296 GT3',
    'BMW M4 GT3 EVO',
    'Mercedes-AMG GT3 Evo',
    'McLaren 720S GT3 Evo',
    'Corvette Z06 GT3.R',
    'Ford Mustang GT3'
  ],
  GT4: [
    'Aston Martin Vantage GT4',
    'BMW M4 GT4',
    'Porsche 718 Cayman GT4 RS',
    'Toyota GR Supra GT4 EVO'
  ],
  Hypercar: [
    'Ferrari 499P Hypercar',
    'Porsche 963 LMDh',
    'Toyota GR010 Hybrid',
    'Cadillac V-Series.R'
  ],
  Touring: [
    'Hyundai Elantra N TCR',
    'Honda Civic Type R TCR',
    'Audi RS3 LMS TCR'
  ]
};

const lapForm = document.getElementById('lapForm');
const formTitle = document.getElementById('formTitle');
const lapIdInput = document.getElementById('lapId');
const trackNameSelect = document.getElementById('trackName');
const driverNumberInput = document.getElementById('driverNumber');
const driverNameInput = document.getElementById('driverName');
const carClassSelect = document.getElementById('carClass');
const carModelSelect = document.getElementById('carModel');
const weatherSelect = document.getElementById('weather');
const notesSelect = document.getElementById('notes');
const lapTimeInput = document.getElementById('lapTime');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const filterClassSelect = document.getElementById('filterClass');
const resetFilterBtn = document.getElementById('resetFilterBtn');
const lapTableBody = document.getElementById('lapTableBody');
const lapCardsBody = document.getElementById('lapCardsBody');
const recordCountBadge = document.getElementById('recordCount');
const creditModal = document.getElementById('creditModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const langToggleBtn = document.getElementById('langToggleBtn');

const formPanel = document.getElementById('formPanel');
const tablePanel = document.getElementById('tablePanel');
const tabBtnTable = document.getElementById('tabBtnTable');
const tabBtnForm = document.getElementById('tabBtnForm');

const switchTab = (tabName) => {
  if (tabName === 'formPanel') {
    formPanel.classList.add('active-panel');
    tablePanel.classList.remove('active-panel');
    tabBtnForm.classList.add('active');
    tabBtnTable.classList.remove('active');
  } else {
    tablePanel.classList.add('active-panel');
    formPanel.classList.remove('active-panel');
    tabBtnTable.classList.add('active');
    tabBtnForm.classList.remove('active');
  }
};

tabBtnTable.addEventListener('click', () => switchTab('tablePanel'));
tabBtnForm.addEventListener('click', () => switchTab('formPanel'));

let inputBuffer = '';
const SECRET_CODE = '2026';

window.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

  if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
    inputBuffer += e.key;
    if (inputBuffer.length > SECRET_CODE.length) {
      inputBuffer = inputBuffer.slice(-SECRET_CODE.length);
    }
    if (inputBuffer === SECRET_CODE) {
      creditModal.style.display = 'flex';
      inputBuffer = '';
    }
  }
});

closeModalBtn.addEventListener('click', () => {
  creditModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === creditModal) {
    creditModal.style.display = 'none';
  }
});

const updateCarModelOptions = (selectedClass, currentModel = null) => {
  const dict = TRANSLATIONS[currentLang];
  carModelSelect.innerHTML = `<option value="" disabled selected>${dict.optSelectMachine}</option>`;
  const cars = VEHICLES_BY_CLASS[selectedClass] || [];
  cars.forEach(car => {
    const opt = document.createElement('option');
    opt.value = car;
    opt.textContent = car;
    if (currentModel && currentModel === car) {
      opt.selected = true;
    }
    carModelSelect.appendChild(opt);
  });
};

carClassSelect.addEventListener('change', (e) => {
  updateCarModelOptions(e.target.value);
});

const setLanguage = (lang) => {
  currentLang = lang;
  const dict = TRANSLATIONS[lang];

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  lapTimeInput.placeholder = dict.placeholderTiming;
  driverNameInput.placeholder = dict.placeholderDriverName;
  driverNumberInput.placeholder = dict.placeholderDriverNo;

  const isEditing = lapIdInput.value !== '';
  formTitle.textContent = isEditing ? dict.formTitleEdit : dict.formTitleNew;
  submitBtn.textContent = isEditing ? dict.btnUpdate : dict.btnSave;

  document.getElementById('langCurrent').textContent = lang === 'th' ? 'TH' : 'EN';
  document.getElementById('langNext').textContent = lang === 'th' ? 'EN' : 'TH';

  updateCarModelOptions(carClassSelect.value, carModelSelect.value);
  fetchLaps();
};

langToggleBtn.addEventListener('click', () => {
  setLanguage(currentLang === 'th' ? 'en' : 'th');
});

const fetchLaps = async () => {
  const selectedClass = filterClassSelect.value;
  let url = API_URL;
  if (selectedClass) {
    url += `?carClass=${encodeURIComponent(selectedClass)}`;
  }

  try {
    const res = await fetch(url, {
      headers: {
        'X-Author-Sign': AUTHOR_KEY,
        'X-Developer-Full': AUTHOR_TOKEN
      }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Server rejected verification');
    }

    const data = await res.json();
    renderData(data);
  } catch (error) {
    console.error('Fetch error:', error);
    lapTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--accent-f1); padding: 32px;">CRITICAL SYSTEM FAULT: ${error.message}</td></tr>`;
    lapCardsBody.innerHTML = `<div style="text-align: center; color: var(--accent-f1); padding: 24px;">CRITICAL SYSTEM FAULT: ${error.message}</div>`;
  }
};

const renderData = (laps) => {
  const dict = TRANSLATIONS[currentLang];
  lapTableBody.innerHTML = '';
  lapCardsBody.innerHTML = '';
  recordCountBadge.textContent = `${laps.length} Records`;

  if (!laps || laps.length === 0) {
    lapTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">${dict.noData}</td></tr>`;
    lapCardsBody.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 24px;">${dict.noData}</div>`;
    return;
  }

  laps.forEach(lap => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${lap.id}</td>
      <td><strong>${lap.trackName}</strong></td>
      <td><span class="driver-badge">#${lap.driverNumber || '00'}</span> ${lap.driverName || 'Driver'}</td>
      <td>${lap.carModel}</td>
      <td><span class="class-badge">${lap.carClass}</span></td>
      <td><span class="lap-time-tag">${lap.lapTime}</span></td>
      <td>${lap.weather}</td>
      <td class="text-right">
        <div class="action-buttons">
          <button class="btn-action-edit" onclick="handleEdit(${lap.id})">${dict.btnEdit}</button>
          <button class="btn-action-delete" onclick="handleDelete(${lap.id})">${dict.btnDelete}</button>
        </div>
      </td>
    `;
    lapTableBody.appendChild(tr);

    const card = document.createElement('div');
    card.className = 'telemetry-card';
    card.innerHTML = `
      <div class="telemetry-card-top">
        <div class="card-circuit">${lap.trackName}</div>
        <div class="lap-time-tag">${lap.lapTime}</div>
      </div>
      <div class="telemetry-card-body">
        <div class="card-item">
          <span>${dict.thDriver}</span>
          <strong class="driver-badge">#${lap.driverNumber || '00'}</strong> ${lap.driverName || 'Driver'}
        </div>
        <div class="card-item">
          <span>${dict.thClass}</span>
          <span class="class-badge">${lap.carClass}</span>
        </div>
        <div class="card-item">
          <span>${dict.thMachine}</span>
          ${lap.carModel}
        </div>
        <div class="card-item">
          <span>${dict.thEnv}</span>
          ${lap.weather}
        </div>
      </div>
      <div class="telemetry-card-actions">
        <button class="btn btn-secondary btn-sm" onclick="handleEdit(${lap.id})">${dict.btnEdit}</button>
        <button class="btn btn-action-delete btn-sm" onclick="handleDelete(${lap.id})">${dict.btnDelete}</button>
      </div>
    `;
    lapCardsBody.appendChild(card);
  });
};

lapForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = lapIdInput.value;
  const numVal = parseInt(driverNumberInput.value, 10);
  const formattedNo = numVal < 10 ? `0${numVal}` : `${numVal}`;

  const payload = {
    trackName: trackNameSelect.value,
    driverNumber: formattedNo,
    driverName: driverNameInput.value.trim(),
    carClass: carClassSelect.value,
    carModel: carModelSelect.value,
    weather: weatherSelect.value,
    notes: notesSelect.value,
    lapTime: lapTimeInput.value.trim()
  };

  try {
    const endpoint = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Author-Sign': AUTHOR_KEY,
        'X-Developer-Full': AUTHOR_TOKEN
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Operation failed');
    }

    resetForm();
    await fetchLaps();

    if (window.innerWidth <= 900) {
      switchTab('tablePanel');
    }
  } catch (error) {
    alert(`System Error: ${error.message}`);
  }
});

window.handleEdit = async (id) => {
  const dict = TRANSLATIONS[currentLang];
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: {
        'X-Author-Sign': AUTHOR_KEY,
        'X-Developer-Full': AUTHOR_TOKEN
      }
    });

    if (!res.ok) throw new Error('Lap record not found');
    const lap = await res.json();

    lapIdInput.value = lap.id;
    trackNameSelect.value = lap.trackName;
    driverNumberInput.value = parseInt(lap.driverNumber, 10) || '';
    driverNameInput.value = lap.driverName || '';
    carClassSelect.value = lap.carClass;
    updateCarModelOptions(lap.carClass, lap.carModel);
    weatherSelect.value = lap.weather;
    notesSelect.value = lap.notes;
    lapTimeInput.value = lap.lapTime;

    formTitle.textContent = `${dict.formTitleEdit} #${lap.id}`;
    submitBtn.textContent = dict.btnUpdate;
    cancelBtn.style.display = 'inline-block';

    if (window.innerWidth <= 900) {
      switchTab('formPanel');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    alert(error.message);
  }
};

window.handleDelete = async (id) => {
  const dict = TRANSLATIONS[currentLang];
  if (!confirm(dict.confirmDelete)) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Author-Sign': AUTHOR_KEY,
        'X-Developer-Full': AUTHOR_TOKEN
      }
    });

    if (res.status === 204) {
      await fetchLaps();
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete telemetry record.');
    }
  } catch (error) {
    alert(error.message);
  }
};

const resetForm = () => {
  const dict = TRANSLATIONS[currentLang];
  lapForm.reset();
  lapIdInput.value = '';
  formTitle.textContent = dict.formTitleNew;
  submitBtn.textContent = dict.btnSave;
  cancelBtn.style.display = 'none';
  carModelSelect.innerHTML = `<option value="" disabled selected>${dict.optSelectMachine}</option>`;
};

cancelBtn.addEventListener('click', () => {
  resetForm();
  if (window.innerWidth <= 900) {
    switchTab('tablePanel');
  }
});

filterClassSelect.addEventListener('change', fetchLaps);
resetFilterBtn.addEventListener('click', () => {
  filterClassSelect.value = '';
  fetchLaps();
});

switchTab('tablePanel');
setLanguage('th');