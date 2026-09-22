let currentActiveTab = 'home';

// Inisialisasi Kalender Real-Time
const now = new Date();
let currentCalendarMonth = now.getMonth(); 
let currentCalendarYear = now.getFullYear();

let activeFolderCourseIdx = null;
let activeSessionIdx = null;

let appData = JSON.parse(localStorage.getItem('campus_dashboard_data')) || {
    profileName: 'RIZQI RIDWAN',
    themeColor: 'blue',
    fontStyle: 'font-sans',
    isDark: false,
    courses: [
        { 
            id: 'IF-601', name: 'Kecerdasan Buatan (AI)', deadline: '2026-10-15', 
            sessions: [true, false, false, false, false, false, false, false], 
            sessionData: Array(8).fill(0).map(() => ({ notes: '', files: [] })) 
        },
        { 
            id: 'IF-602', name: 'Pemrograman Web Lanjut', deadline: '2026-10-18', 
            sessions: [false, false, false, false, false, false, false, false], 
            sessionData: Array(8).fill(0).map(() => ({ notes: '', files: [] })) 
        },
        { 
            id: 'IF-603', name: 'Keamanan Jaringan Komputer', deadline: '2026-10-20', 
            sessions: [false, false, false, false, false, false, false, false], 
            sessionData: Array(8).fill(0).map(() => ({ notes: '', files: [] })) 
        },
        { 
            id: 'IF-604', name: 'Manajemen Proyek Perangkat Lunak', deadline: '2026-10-22', 
            sessions: [false, false, false, false, false, false, false, false], 
            sessionData: Array(8).fill(0).map(() => ({ notes: '', files: [] })) 
        },
        { 
            id: 'IF-605', name: 'Interaksi Manusia & Komputer', deadline: '2026-10-25', 
            sessions: [false, false, false, false, false, false, false, false], 
            sessionData: Array(8).fill(0).map(() => ({ notes: '', files: [] })) 
        },
        { 
            id: 'IF-606', name: 'Sistem Basis Data Lanjut', deadline: '2026-10-30', 
            sessions: [false, false, false, false, false, false, false, false], 
            sessionData: Array(8).fill(0).map(() => ({ notes: '', files: [] })) 
        }
    ],
    customSchedules: []
};

// Migration check
if (!appData.profileName) appData.profileName = 'RIZQI RIDWAN';
if (!appData.themeColor) appData.themeColor = 'blue';
if (!appData.fontStyle) appData.fontStyle = 'font-sans';
if (appData.isDark === undefined) appData.isDark = false;

appData.courses.forEach(c => {
    if (!c.sessionData) {
        c.sessionData = Array(8).fill(0).map(() => ({ notes: '', files: [] }));
    }
});
if (!appData.customSchedules) appData.customSchedules = [];

function saveData() {
    localStorage.setItem('campus_dashboard_data', JSON.stringify(appData));
}

function calculateDiligenceStats() {
    let totalSessions = appData.courses.length * 8; 
    let completedSessions = 0;
    let diligentCount = 0;

    appData.courses.forEach(course => {
        course.sessions.forEach((isDone) => {
            if (isDone) {
                completedSessions++;
                diligentCount++; 
            }
        });
    });

    let diligencePercent = totalSessions > 0 ? Math.round((diligentCount / totalSessions) * 100) : 0;
    return { diligencePercent, completedSessions, totalSessions };
}

function calculateSemesterScore() {
    let stats = calculateDiligenceStats();
    return stats.diligencePercent;
}

function switchTab(tab) {
    currentActiveTab = tab;
    
    // Highlight mobile buttons
    document.querySelectorAll('.sm\\:hidden .nav-btn').forEach(btn => {
        btn.classList.remove('text-primary-600', 'dark:text-blue-400', 'font-semibold');
        btn.classList.add('text-slate-400', 'dark:text-slate-500');
    });
    const activeMobileBtn = document.getElementById(`nav-${tab}`);
    if(activeMobileBtn) {
        activeMobileBtn.classList.remove('text-slate-400', 'dark:text-slate-500');
        activeMobileBtn.classList.add('text-primary-600', 'dark:text-blue-400', 'font-semibold');
    }

    // Highlight desktop buttons
    document.querySelectorAll('.hidden.sm\\:flex .nav-btn').forEach(btn => {
        btn.classList.remove('text-primary-600', 'dark:text-blue-400', 'font-semibold');
        btn.classList.add('text-slate-500', 'dark:text-slate-400');
    });
    const activePcBtn = document.getElementById(`nav-${tab}-pc`);
    if(activePcBtn) {
        activePcBtn.classList.remove('text-slate-500', 'dark:text-slate-400');
        activePcBtn.classList.add('text-primary-600', 'dark:text-blue-400', 'font-semibold');
    }

    const titles = {
        'home': 'Dashboard Utama Akademik',
        'courses': 'Matriks Sesi & Nilai Mata Kuliah',
        'calendar': 'Jadwal & Kalender',
        'tasks': 'Tugas & Deadline'
    };
    const titleEl = document.getElementById('page-title');
    if(titleEl) titleEl.innerText = titles[tab];

    renderContent();
}

function toggleSessionStatus(courseIdx, sIdx) {
    appData.courses[courseIdx].sessions[sIdx] = !appData.courses[courseIdx].sessions[sIdx];
    saveData();
    renderContent();
}

function updateCourseDeadline(courseIdx, newDate) {
    if (!newDate) return;
    appData.courses[courseIdx].deadline = newDate;
    saveData();
}

// ==========================================
// PENGATURAN / SETTING (WARNA, FONT, DARK MODE)
// ==========================================

function openSettingsModal() {
    document.getElementById('setting-username').value = appData.profileName;
    document.getElementById('setting-font-family').value = appData.fontStyle;
    updateDarkModeButtonsUI();
    document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettingsModal() {
    document.getElementById('settings-modal').classList.add('hidden');
}

function setThemeColor(color) {
    appData.themeColor = color;
    saveData();
    applyThemeSettings();
}

function setDarkMode(isDark) {
    appData.isDark = isDark;
    saveData();
    applyThemeSettings();
    updateDarkModeButtonsUI();
}

function updateDarkModeButtonsUI() {
    const btnLight = document.getElementById('btn-light-mode');
    const btnDark = document.getElementById('btn-dark-mode');
    if (!btnLight || !btnDark) return;

    if (appData.isDark) {
        btnDark.className = 'flex-1 py-2 bg-primary-600 text-white rounded-xl font-semibold border border-primary-600 transition flex items-center justify-center gap-1.5 shadow-sm';
        btnLight.className = 'flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-1.5';
    } else {
        btnLight.className = 'flex-1 py-2 bg-primary-600 text-white rounded-xl font-semibold border border-primary-600 transition flex items-center justify-center gap-1.5 shadow-sm';
        btnDark.className = 'flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-1.5';
    }
}

function saveAppSettings() {
    const nameInput = document.getElementById('setting-username').value.trim();
    const fontSelect = document.getElementById('setting-font-family').value;

    if (nameInput) appData.profileName = nameInput;
    appData.fontStyle = fontSelect;
    saveData();
    applyThemeSettings();
    closeSettingsModal();
    renderContent();
}

function applyThemeSettings() {
    const body = document.getElementById('app-body');
    const htmlEl = document.documentElement;

    if (!body) return;

    body.classList.remove('font-sans', 'font-serif', 'font-mono');
    body.classList.add(appData.fontStyle || 'font-sans');

    if (appData.isDark) {
        htmlEl.classList.add('dark');
    } else {
        htmlEl.classList.remove('dark');
    }

    body.classList.remove('theme-blue', 'theme-purple', 'theme-emerald', 'theme-orange');
    if (appData.themeColor && appData.themeColor !== 'blue') {
        body.classList.add(`theme-${appData.themeColor}`);
    }
}

// ==========================================
// KELOLA & EDIT MATA KULIAH
// ==========================================

function openCourseSettingsModal() {
    const container = document.getElementById('editable-courses-container');
    if (!container) return;

    container.innerHTML = appData.courses.map((course, idx) => `
        <div class="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2 course-edit-row">
            <div class="flex justify-between items-center">
                <span class="text-[10px] font-bold text-primary-600">Mata Kuliah #${idx + 1}</span>
                <button type="button" onclick="this.closest('.course-edit-row').remove()" class="text-red-500 hover:text-red-700 text-xs"><i class="fa-solid fa-trash"></i> Hapus</button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input type="text" value="${course.id}" placeholder="Kode (mis: IF-601)" class="edit-course-id bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500">
                <input type="text" value="${course.name}" placeholder="Nama Mata Kuliah" class="edit-course-name sm:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500">
            </div>
        </div>
    `).join('');

    document.getElementById('course-settings-modal').classList.remove('hidden');
}

function closeCourseSettingsModal() {
    document.getElementById('course-settings-modal').classList.add('hidden');
}

function addNewCourseItem() {
    const container = document.getElementById('editable-courses-container');
    if (!container) return;

    const newIdx = container.children.length + 1;
    const div = document.createElement('div');
    div.className = 'p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2 course-edit-row';
    div.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-primary-600">Mata Kuliah Baru</span>
            <button type="button" onclick="this.closest('.course-edit-row').remove()" class="text-red-500 hover:text-red-700 text-xs"><i class="fa-solid fa-trash"></i> Hapus</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input type="text" value="IF-60${newIdx}" placeholder="Kode" class="edit-course-id bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500">
            <input type="text" value="Mata Kuliah Baru" placeholder="Nama Mata Kuliah" class="edit-course-name sm:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500">
        </div>
    `;
    container.appendChild(div);
}

function saveAllCoursesChanges() {
    const rows = document.querySelectorAll('.course-edit-row');
    let updatedCourses = [];

    rows.forEach((row, idx) => {
        const idVal = row.querySelector('.edit-course-id').value.trim() || `IF-60${idx+1}`;
        const nameVal = row.querySelector('.edit-course-name').value.trim() || `Mata Kuliah ${idx+1}`;
        
        let existing = appData.courses[idx] || {
            sessions: Array(8).fill(false),
            sessionData: Array(8).fill(0).map(() => ({ notes: '', files: [] })),
            deadline: '2026-10-30'
        };

        existing.id = idVal;
        existing.name = nameVal;
        updatedCourses.push(existing);
    });

    if (updatedCourses.length === 0) {
        alert('Minimal harus ada 1 mata kuliah!');
        return;
    }

    appData.courses = updatedCourses;
    saveData();
    closeCourseSettingsModal();
    renderContent();
}

// ==========================================
// RENDER KONTEN UTAMA
// ==========================================

function renderContent() {
    const mainContainer = document.getElementById('main-content');
    if (!mainContainer) return;

    // Update Header Real-Time Date
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const dateHeaderEl = document.getElementById('current-date-header');
    if(dateHeaderEl) {
        dateHeaderEl.innerText = new Date().toLocaleDateString('id-ID', options);
    }

    if (currentActiveTab === 'home') {
        const stats = calculateDiligenceStats();
        const totalMatkul = appData.courses.length;
        const matkulSelesai = appData.courses.filter(c => c.sessions.every(Boolean)).length;
        const matkulBelum = totalMatkul - matkulSelesai;
        const semesterScore = calculateSemesterScore();
        const scorePercent = semesterScore;

        mainContainer.innerHTML = `
            <div class="bg-gradient-to-r from-primary-600 via-sky-600 to-indigo-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between space-y-4 transition-colors">
                <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                <div class="space-y-1 z-10">
                    <h2 class="text-base sm:text-lg font-extrabold tracking-wide">Halo, ${appData.profileName}</h2>
                    <p class="text-xs text-blue-100 font-medium">Selamat datang di dashboard akademik pribadimu. Tetap semangat!</p>
                </div>
                <div class="flex flex-wrap gap-2 pt-2 z-10">
                    <button onclick="switchTab('calendar')" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
                        <i class="fa-solid fa-calendar-days"></i> Kalender Akademik
                    </button>
                    <button onclick="switchTab('courses')" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
                        <i class="fa-solid fa-table-cells-large"></i> Matriks Nilai
                    </button>
                    <button onclick="openCourseSettingsModal()" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
                        <i class="fa-solid fa-gear"></i> Kelola Matkul
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center space-y-1">
                    <div class="relative w-40 h-24 overflow-hidden flex items-center justify-center">
                        <svg class="w-40 h-40 absolute top-1" viewBox="0 0 120 70">
                            <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="currentColor" class="text-slate-100 dark:text-slate-800" stroke-width="9" stroke-linecap="round" />
                            <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="currentColor" class="text-primary-600" stroke-width="9" stroke-linecap="round" stroke-dasharray="157" stroke-dashoffset="${157 - (157 * scorePercent) / 100}" style="transition: stroke-dashoffset 0.5s ease;" />
                        </svg>
                        <div class="absolute bottom-1 flex flex-col items-center">
                            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">Semester 1</span>
                            <span class="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">${semesterScore}</span>
                        </div>
                    </div>
                    <span class="text-xs font-semibold text-slate-600 dark:text-slate-300 pt-1">Skor Keaktifan</span>
                </div>

                <div class="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                        <h2 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <i class="fa-solid fa-chart-line text-primary-600"></i> Perkembangan Akademik
                        </h2>
                        <span class="text-[10px] text-slate-400 font-mono">Status: Aktif</span>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center text-center">
                        <div class="flex flex-col items-center justify-center p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                            <div class="text-base font-bold text-slate-800 dark:text-white">${stats.completedSessions}/${stats.totalSessions}</div>
                            <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Sesi Selesai</div>
                        </div>
                        <div class="flex flex-col items-center justify-center p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                            <div class="text-base font-bold text-slate-800 dark:text-white">${totalMatkul}</div>
                            <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Jumlah Matkul</div>
                        </div>
                        <div class="flex flex-col items-center justify-center p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                            <div class="text-base font-bold text-emerald-600 dark:text-emerald-400">${matkulSelesai}</div>
                            <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Matkul Tuntas</div>
                        </div>
                        <div class="flex flex-col items-center justify-center p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                            <div class="text-base font-bold text-amber-500 dark:text-amber-400">${matkulBelum}</div>
                            <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Matkul Belum</div>
                        </div>
                    </div>

                    <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                        <span>Kerajinan: <strong class="text-primary-600">${stats.diligencePercent}%</strong></span>
                        <span class="font-medium text-slate-700 dark:text-slate-300">Prinsip: Kerjakan di awal!</span>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                            <i class="fa-solid fa-calendar-days text-primary-600"></i> Kalender Deadline Akademik
                        </h2>
                        <p class="text-[10px] text-slate-500 dark:text-slate-400">Klik tanggal untuk melihat detail jadwal/deadline</p>
                    </div>
                    <div class="flex items-center space-x-1">
                        <button onclick="changeMonth(-1)" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200"><i class="fa-solid fa-chevron-left"></i></button>
                        <span id="calendar-month-label" class="text-[11px] font-semibold text-slate-900 dark:text-white px-1"></span>
                        <button onclick="changeMonth(1)" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>
                <div class="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 font-semibold">
                    <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
                </div>
                <div id="compact-calendar-grid" class="grid grid-cols-7 gap-1"></div>
            </div>
        `;
        updateMonthLabels();
        renderCompactCalendar();

    } else if (currentActiveTab === 'courses') {
        mainContainer.innerHTML = `
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 class="font-bold text-xs sm:text-sm flex items-center gap-2 text-slate-900 dark:text-white">
                        <i class="fa-solid fa-table-cells-large text-primary-600"></i> Matriks Sesi (1 – 8) Semua Mata Kuliah
                    </h3>
                    <button onclick="openCourseSettingsModal()" class="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm">
                        <i class="fa-solid fa-gear"></i> Atur & Edit Matkul
                    </button>
                </div>

                <div class="hidden md:block overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] bg-slate-50 dark:bg-slate-800/40">
                                <th class="py-2.5 px-3 font-semibold rounded-l-lg">Mata Kuliah</th>
                                <th class="py-2.5 px-1 text-center">S1</th>
                                <th class="py-2.5 px-1 text-center">S2</th>
                                <th class="py-2.5 px-1 text-center">S3</th>
                                <th class="py-2.5 px-1 text-center">S4</th>
                                <th class="py-2.5 px-1 text-center">S5</th>
                                <th class="py-2.5 px-1 text-center">S6</th>
                                <th class="py-2.5 px-1 text-center">S7</th>
                                <th class="py-2.5 px-1 text-center">S8</th>
                                <th class="py-2.5 px-3 text-right font-semibold rounded-r-lg">Deadline Utama</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                            ${appData.courses.map((course, cIdx) => `
                                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                                    <td class="py-3 px-3 flex items-center space-x-2">
                                        <span class="px-2 py-0.5 bg-primary-50 dark:bg-slate-800 text-primary-600 font-mono text-[10px] rounded font-bold">${course.id}</span>
                                        <span class="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs" title="${course.name}">${course.name}</span>
                                    </td>
                                    ${course.sessions.map((isDone, sIdx) => `
                                        <td class="py-3 px-1 text-center">
                                            <input type="checkbox" ${isDone ? 'checked' : ''} onclick="toggleSessionStatus(${cIdx}, ${sIdx})" class="w-4 h-4 accent-primary-600 rounded cursor-pointer transition">
                                        </td>
                                    `).join('')}
                                    <td class="py-3 px-3 text-right">
                                        <input type="date" value="${course.deadline}" onchange="updateCourseDeadline(${cIdx}, this.value)" class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[11px] font-mono text-slate-700 dark:text-slate-300 focus:outline-none focus:border-primary-500 cursor-pointer">
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="md:hidden space-y-3">
                    ${appData.courses.map((course, cIdx) => `
                        <div class="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-2.5 shadow-sm">
                            <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                                <div class="flex items-center space-x-2 truncate">
                                    <span class="px-2 py-0.5 bg-primary-50 dark:bg-slate-800 text-primary-600 font-mono text-[10px] rounded font-bold shrink-0">${course.id}</span>
                                    <h4 class="font-bold text-xs text-slate-900 dark:text-white truncate" title="${course.name}">${course.name}</h4>
                                </div>
                            </div>
                            <div class="grid grid-cols-4 gap-1.5 pt-1">
                                ${course.sessions.map((isDone, sIdx) => `
                                    <label class="flex flex-col items-center justify-center p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-primary-500 transition">
                                        <span class="text-[9px] font-semibold text-slate-500 dark:text-slate-400 mb-1">S${sIdx + 1}</span>
                                        <input type="checkbox" ${isDone ? 'checked' : ''} onclick="toggleSessionStatus(${cIdx}, ${sIdx})" class="w-4 h-4 accent-primary-600 rounded cursor-pointer transition">
                                    </label>
                                `).join('')}
                            </div>
                            <div class="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                                <span class="text-[10px] font-semibold text-slate-500">Deadline Utama:</span>
                                <input type="date" value="${course.deadline}" onchange="updateCourseDeadline(${cIdx}, this.value)" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[11px] font-mono text-slate-700 dark:text-slate-300 focus:outline-none focus:border-primary-500">
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="space-y-3">
                <h2 class="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <i class="fa-solid fa-book-open text-primary-600"></i> Daftar Mata Kuliah & Sub-Folder Sesi / Catatan
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${appData.courses.map((course, idx) => {
                        const completedCount = course.sessions.filter(Boolean).length;
                        const percent = Math.round((completedCount / 8) * 100);
                        return `
                            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow transition flex flex-col justify-between">
                                <div class="p-4 space-y-2">
                                    <div class="flex justify-between items-center">
                                        <span class="text-[10px] px-2 py-0.5 bg-primary-50 dark:bg-slate-800 text-primary-600 font-bold rounded">${course.id}</span>
                                        <button onclick="openFolderModal(${idx})" class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs transition">
                                            <i class="fa-solid fa-ellipsis-vertical"></i>
                                        </button>
                                    </div>
                                    <h3 class="font-bold text-slate-900 dark:text-white text-xs leading-snug">${course.name}</h3>
                                    <p class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Selesai ${percent}% (Sesi Terpenuhi)</p>
                                </div>
                                <div class="p-4 pt-0 space-y-2">
                                    <button onclick="openFolderModal(${idx})" class="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold shadow-sm transition">
                                        Buka Folder & Catatan Sesi
                                    </button>
                                    <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: ${percent}%"></div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    } else if (currentActiveTab === 'calendar') {
        mainContainer.innerHTML = `
            <div class="space-y-4">
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
                    <h2 class="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <i class="fa-solid fa-calendar-plus text-emerald-600"></i> Tambah Jadwal / Acara Pribadi
                    </h2>
                    <form onsubmit="handleCustomScheduleSubmit(event)" class="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input type="text" id="sched-title" placeholder="Nama Acara..." required class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500">
                        <input type="date" id="sched-date" required class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500">
                        <input type="time" id="sched-time" required class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500">
                        <button type="submit" class="bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold py-1.5 transition shadow">Simpan</button>
                    </form>
                </div>

                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 class="font-bold text-xs text-slate-900 dark:text-white">Kalender Akademik Real-Time</h2>
                            <p class="text-[10px] text-slate-500 dark:text-slate-400">Jadwal deadline & pengingat otomatis</p>
                        </div>
                        <div class="flex items-center space-x-1">
                            <button onclick="changeMonth(-1)" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200"><i class="fa-solid fa-chevron-left"></i></button>
                            <span id="full-calendar-month-label" class="text-xs font-semibold text-slate-900 dark:text-white px-1"></span>
                            <button onclick="changeMonth(1)" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200"><i class="fa-solid fa-chevron-right"></i></button>
                        </div>
                    </div>
                    <div class="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400">
                        <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
                    </div>
                    <div id="full-calendar-grid" class="grid grid-cols-7 gap-1.5"></div>
                </div>

                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2.5">
                    <h3 class="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">Daftar Jadwal Pribadi</h3>
                    <div id="custom-schedules-list" class="space-y-2"></div>
                </div>
            </div>
        `;
        updateMonthLabels();
        renderFullCalendar();
        renderCustomSchedulesList();
    } else if (currentActiveTab === 'tasks') {
        const totalTasks = appData.courses.length * 8;
        const completedTasks = appData.courses.reduce((acc, c) => acc + c.sessions.filter(Boolean).length, 0);
        const taskPercent = Math.round((completedTasks / totalTasks) * 100) || 0;

        mainContainer.innerHTML = `
            <div class="space-y-4 max-w-xl mx-auto">
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2.5">
                    <h2 class="font-bold text-xs text-slate-900 dark:text-white">Ringkasan Tugas & Sesi Kuliah</h2>
                    <div class="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                        <span>Sesi Selesai: ${completedTasks} dari ${totalTasks}</span>
                        <span class="font-bold text-emerald-600 dark:text-emerald-400">${taskPercent}%</span>
                    </div>
                    <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div class="bg-emerald-500 h-full transition-all duration-300" style="width: ${taskPercent}%"></div>
                    </div>
                </div>
                <div class="space-y-2">
                    <h3 class="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Deadline Utama Mata Kuliah</h3>
                    ${appData.courses.map(course => `
                        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex justify-between items-center shadow-sm">
                            <div>
                                <h4 class="font-bold text-xs text-slate-900 dark:text-white">${course.name}</h4>
                                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Deadline: <span class="text-amber-600 dark:text-amber-400 font-mono">${course.deadline}</span></p>
                            </div>
                            <span class="px-2.5 py-1 bg-primary-50 dark:bg-slate-800 text-primary-600 rounded-lg text-[10px] font-semibold">${course.id}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// ==========================================
// MODAL FOLDER & SESI
// ==========================================

function openFolderModal(courseIdx) {
    activeFolderCourseIdx = courseIdx;
    activeSessionIdx = null;
    const course = appData.courses[courseIdx];
    
    document.getElementById('modal-folder-id').innerText = course.id;
    document.getElementById('modal-folder-title').innerText = course.name;
    
    renderSessionsGrid();
    document.getElementById('sessions-grid-wrapper').classList.remove('hidden');
    document.getElementById('session-detail-container').classList.add('hidden');
    document.getElementById('folder-modal').classList.remove('hidden');
}

function renderSessionsGrid() {
    const gridEl = document.getElementById('sessions-grid');
    if (!gridEl || activeFolderCourseIdx === null) return;
    const course = appData.courses[activeFolderCourseIdx];

    gridEl.innerHTML = course.sessionData.map((session, sIdx) => {
        const isDone = course.sessions[sIdx];
        const fileCount = session.files.length;

        return `
            <div onclick="openSessionFolder(${sIdx})" class="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50/20 dark:hover:bg-slate-800 rounded-xl p-3 cursor-pointer transition flex flex-col items-center text-center group shadow-sm">
                <div class="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400 flex items-center justify-center text-lg shadow-inner group-hover:scale-105 transition mb-1.5">
                    <i class="fa-solid fa-folder"></i>
                </div>
                <h5 class="font-bold text-xs text-slate-900 dark:text-white group-hover:text-primary-600 transition">Sesi ${sIdx + 1}</h5>
                <span class="text-[9px] px-1.5 py-0.2 rounded font-medium mt-1 ${isDone ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}">
                    ${isDone ? 'Selesai' : 'Belum'}
                </span>
                <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-1">${fileCount} File</p>
            </div>
        `;
    }).join('');
}

function openSessionFolder(sIdx) {
    activeSessionIdx = sIdx;
    const session = appData.courses[activeFolderCourseIdx].sessionData[sIdx];

    document.getElementById('active-session-title').innerHTML = `<i class="fa-solid fa-folder-open text-amber-500 mr-1.5"></i> Sesi ${sIdx + 1}`;
    
    const notes = session.notes || '';
    const displayBox = document.getElementById('note-display-box');
    const textarea = document.getElementById('session-notes-input');
    const actionBtns = document.getElementById('note-action-btns');

    textarea.value = notes;

    if (notes.trim() !== '') {
        displayBox.innerText = notes;
        displayBox.classList.remove('hidden');
        textarea.classList.add('hidden');
        actionBtns.innerHTML = `
            <button onclick="enableNoteEdit()" class="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-400 rounded-lg text-[11px] font-semibold transition flex items-center gap-1">
                <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
        `;
    } else {
        displayBox.classList.add('hidden');
        textarea.classList.remove('hidden');
        actionBtns.innerHTML = `
            <button onclick="saveNote()" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold transition flex items-center gap-1 shadow-sm">
                <i class="fa-solid fa-floppy-disk"></i> Simpan
            </button>
        `;
    }

    renderSessionFilesList();

    document.getElementById('sessions-grid-wrapper').classList.add('hidden');
    document.getElementById('session-detail-container').classList.remove('hidden');
}

function enableNoteEdit() {
    const displayBox = document.getElementById('note-display-box');
    const textarea = document.getElementById('session-notes-input');
    const actionBtns = document.getElementById('note-action-btns');

    displayBox.classList.add('hidden');
    textarea.classList.remove('hidden');
    textarea.focus();

    actionBtns.innerHTML = `
        <button onclick="saveNote()" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold transition flex items-center gap-1 shadow-sm">
            <i class="fa-solid fa-floppy-disk"></i> Simpan
        </button>
    `;
}

function saveNote() {
    const textarea = document.getElementById('session-notes-input');
    const val = textarea.value.trim();

    if (activeFolderCourseIdx !== null && activeSessionIdx !== null) {
        appData.courses[activeFolderCourseIdx].sessionData[activeSessionIdx].notes = val;
        if(val.length > 0) {
            appData.courses[activeFolderCourseIdx].sessions[activeSessionIdx] = true;
        }
        saveData();
    }

    const displayBox = document.getElementById('note-display-box');
    const actionBtns = document.getElementById('note-action-btns');

    if (val !== '') {
        displayBox.innerText = val;
        displayBox.classList.remove('hidden');
        textarea.classList.add('hidden');
        actionBtns.innerHTML = `
            <button onclick="enableNoteEdit()" class="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-400 rounded-lg text-[11px] font-semibold transition flex items-center gap-1">
                <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
        `;
    } else {
        actionBtns.innerHTML = `
            <button onclick="saveNote()" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold transition flex items-center gap-1 shadow-sm">
                <i class="fa-solid fa-floppy-disk"></i> Simpan
            </button>
        `;
    }
}

function backToSessionsGrid() {
    activeSessionIdx = null;
    document.getElementById('session-detail-container').classList.add('hidden');
    document.getElementById('sessions-grid-wrapper').classList.remove('hidden');
    renderSessionsGrid();
}

function handleSessionFileUpload(event) {
    const file = event.target.files[0];
    if (!file || activeFolderCourseIdx === null || activeSessionIdx === null) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const fileObj = {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            date: new Date().toLocaleDateString('id-ID'),
            dataUrl: e.target.result
        };
        appData.courses[activeFolderCourseIdx].sessionData[activeSessionIdx].files.push(fileObj);
        appData.courses[activeFolderCourseIdx].sessions[activeSessionIdx] = true;
        saveData();
        renderSessionFilesList();
        event.target.value = '';
    };
    reader.readAsDataURL(file);
}

function renderSessionFilesList() {
    const listEl = document.getElementById('session-files-list');
    if (!listEl || activeFolderCourseIdx === null || activeSessionIdx === null) return;
    const files = appData.courses[activeFolderCourseIdx].sessionData[activeSessionIdx].files;

    if (files.length === 0) {
        listEl.innerHTML = `<p class="text-[10px] text-slate-400 text-center py-2 italic">Belum ada file di sub-folder sesi ini.</p>`;
        return;
    }

    listEl.innerHTML = files.map((file, fIdx) => `
        <div class="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between items-center text-xs">
            <div class="flex items-center space-x-2 truncate">
                <i class="fa-solid fa-file-lines text-primary-600"></i>
                <div class="truncate">
                    <p class="font-semibold text-slate-800 dark:text-slate-200 truncate text-[11px]" title="${file.name}">${file.name}</p>
                    <span class="text-[9px] text-slate-400">${file.size} • ${file.date}</span>
                </div>
            </div>
            <div class="flex items-center space-x-1 shrink-0">
                <a href="${file.dataUrl}" download="${file.name}" class="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-semibold transition">
                    Unduh
                </a>
                <button onclick="deleteSessionFile(${fIdx})" class="px-1.5 py-1 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded text-[10px]">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function deleteSessionFile(fileIdx) {
    if (activeFolderCourseIdx !== null && activeSessionIdx !== null) {
        appData.courses[activeFolderCourseIdx].sessionData[activeSessionIdx].files.splice(fileIdx, 1);
        saveData();
        renderSessionFilesList();
    }
}

function closeFolderModal() {
    document.getElementById('folder-modal').classList.add('hidden');
    activeFolderCourseIdx = null;
    activeSessionIdx = null;
    renderContent();
}

// ==========================================
// KALENDAR & JADWAL PRIBADI (REAL-TIME)
// ==========================================

function handleCustomScheduleSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('sched-title').value;
    const date = document.getElementById('sched-date').value;
    const time = document.getElementById('sched-time').value;

    if (!title || !date || !time) return;

    appData.customSchedules.push({ title, date, time });
    saveData();

    document.getElementById('sched-title').value = '';
    document.getElementById('sched-date').value = '';
    document.getElementById('sched-time').value = '';

    renderFullCalendar();
    renderCustomSchedulesList();
}

function renderCustomSchedulesList() {
    const listEl = document.getElementById('custom-schedules-list');
    if (!listEl) return;

    if (appData.customSchedules.length === 0) {
        listEl.innerHTML = `<p class="text-[10px] text-slate-400 italic py-1">Belum ada jadwal pribadi.</p>`;
        return;
    }

    listEl.innerHTML = appData.customSchedules.map((sched, idx) => `
        <div class="p-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between items-center text-xs">
            <div>
                <h4 class="font-bold text-slate-800 dark:text-slate-200 text-[11px]">${sched.title}</h4>
                <span class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">${sched.date} • ${sched.time}</span>
            </div>
            <button onclick="deleteCustomSchedule(${idx})" class="px-2 py-1 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded text-[10px]">
                Hapus
            </button>
        </div>
    `).join('');
}

function deleteCustomSchedule(idx) {
    appData.customSchedules.splice(idx, 1);
    saveData();
    renderFullCalendar();
    renderCustomSchedulesList();
}

function changeMonth(direction) {
    currentCalendarMonth += direction;
    if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    } else if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    }
    
    updateMonthLabels();
    if (currentActiveTab === 'home') renderCompactCalendar();
    if (currentActiveTab === 'calendar') renderFullCalendar();
}

function updateMonthLabels() {
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const labelText = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;
    
    const compactLabel = document.getElementById('calendar-month-label');
    if (compactLabel) compactLabel.innerText = labelText;
    const fullLabel = document.getElementById('full-calendar-month-label');
    if (fullLabel) fullLabel.innerText = labelText;
}

function getEventsForDate(year, month, day) {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    
    let events = [];
    const dateObj = new Date(year, month, day);
    
    if (dateObj.getDay() === 0) {
        events.push({ title: '⚠️ Cek tugas kuliah', time: '22:00', type: 'reminder' });
    }

    if (appData.customSchedules) {
        appData.customSchedules.forEach(sched => {
            if (sched.date === dateStr) {
                events.push({ title: sched.title, time: sched.time, type: 'custom' });
            }
        });
    }

    appData.courses.forEach((course) => {
        if (course.deadline === dateStr) {
            events.push({ title: `Deadline: ${course.name}`, time: '23:59', type: 'deadline' });
        }
    });

    return events;
}

function renderCompactCalendar() {
    const gridEl = document.getElementById('compact-calendar-grid');
    if (!gridEl) return;
    gridEl.innerHTML = '';

    const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
    const firstDayIndex = (new Date(currentCalendarYear, currentCalendarMonth, 1).getDay() + 6) % 7;

    for (let i = 0; i < firstDayIndex; i++) {
        gridEl.innerHTML += `<div class="h-8"></div>`;
    }

    const today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
        const events = getEventsForDate(currentCalendarYear, currentCalendarMonth, day);
        const hasEvent = events.length > 0;
        const isSunday = new Date(currentCalendarYear, currentCalendarMonth, day).getDay() === 0;
        
        const isToday = (day === today.getDate() && currentCalendarMonth === today.getMonth() && currentCalendarYear === today.getFullYear());

        let btnClass = 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100';
        if (isToday) {
            btnClass = 'bg-primary-600 text-white font-bold border-primary-600 shadow-sm';
        } else if (hasEvent) {
            btnClass = 'bg-primary-50 dark:bg-slate-800 border-primary-500 text-primary-600 dark:text-blue-300 font-bold';
        }

        gridEl.innerHTML += `
            <button onclick="openDateDetail(${currentCalendarYear}, ${currentCalendarMonth}, ${day})" 
                class="h-8 rounded-lg flex flex-col items-center justify-center relative transition border ${btnClass}">
                <span class="text-[10px] ${isSunday && !isToday ? 'text-red-500 font-bold' : ''}">${day}</span>
                ${hasEvent && !isToday ? '<span class="w-1 h-1 bg-primary-600 rounded-full mt-0.5"></span>' : ''}
            </button>
        `;
    }
}

function renderFullCalendar() {
    const gridEl = document.getElementById('full-calendar-grid');
    if (!gridEl) return;
    gridEl.innerHTML = '';

    const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
    const firstDayIndex = (new Date(currentCalendarYear, currentCalendarMonth, 1).getDay() + 6) % 7;

    for (let i = 0; i < firstDayIndex; i++) {
        gridEl.innerHTML += `<div class="h-12 sm:h-14 bg-slate-50 dark:bg-slate-800/20 rounded-lg border border-slate-100 dark:border-slate-800"></div>`;
    }

    const today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
        const events = getEventsForDate(currentCalendarYear, currentCalendarMonth, day);
        const isToday = (day === today.getDate() && currentCalendarMonth === today.getMonth() && currentCalendarYear === today.getFullYear());

        let borderClass = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40';
        if (isToday) {
            borderClass = 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/30 ring-1 ring-primary-500';
        }
        
        gridEl.innerHTML += `
            <div onclick="openDateDetail(${currentCalendarYear}, ${currentCalendarMonth}, ${day})" 
                class="h-12 sm:h-14 border ${borderClass} rounded-lg p-1 flex flex-col justify-between cursor-pointer hover:border-primary-500 transition overflow-hidden">
                <span class="text-[10px] font-bold ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}">${day} ${isToday ? '(Hari Ini)' : ''}</span>
                <div class="space-y-0.5 overflow-y-auto">
                    ${events.map(ev => `<div class="text-[8px] bg-primary-100 dark:bg-blue-900 text-primary-700 dark:text-blue-200 px-1 rounded truncate font-medium">${ev.title}</div>`).join('')}
                </div>
            </div>
        `;
    }
}

function openDateDetail(year, month, day) {
    const modal = document.getElementById('date-modal');
    const titleEl = document.getElementById('modal-date-title');
    const contentEl = document.getElementById('modal-date-content');
    
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    titleEl.innerText = `Agenda ${day} ${monthNames[month]} ${year}`;
    
    const events = getEventsForDate(year, month, day);
    if (events.length === 0) {
        contentEl.innerHTML = `<p class="text-xs text-slate-400 text-center py-3">Tidak ada agenda pada tanggal ini.</p>`;
    } else {
        contentEl.innerHTML = events.map(ev => `
            <div class="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between items-center text-xs">
                <div>
                    <h4 class="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">${ev.title}</h4>
                    <span class="text-[10px] text-slate-400 font-mono">${ev.time}</span>
                </div>
                <span class="px-2 py-0.5 text-[9px] rounded font-semibold bg-primary-100 dark:bg-blue-900 text-primary-700 dark:text-blue-200">${ev.type}</span>
            </div>
        `).join('');
    }

    modal.classList.remove('hidden');
}

function closeDateModal() {
    const modal = document.getElementById('date-modal');
    if(modal) modal.classList.add('hidden');
}

// Inisialisasi Saat Halaman Dimuat
document.addEventListener('DOMContentLoaded', () => {
    applyThemeSettings();
    switchTab('home');
});