/* ================================================================
   SANSOON YACHT SERVICES — Marine Survey Pro v6
   script.js  |  Dashboard · Project System · Surveyor Profile · Unified PDF
================================================================ */
'use strict';

// ───────────────────────────────────────────────────────────────
// §0  INDEXEDDB PROJECT DATABASE
// ───────────────────────────────────────────────────────────────
const PROJECT_DB_NAME = 'sansoon_projects_db';
const PROJECT_STORE   = 'projects';
const PROJECT_DB_VER  = 1;
let _projectDB = null;
let _currentProjectId = null;

function openProjectDB() {
  if (_projectDB) return Promise.resolve(_projectDB);
  return new Promise((res, rej) => {
    const req = indexedDB.open(PROJECT_DB_NAME, PROJECT_DB_VER);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(PROJECT_STORE)) {
        const store = db.createObjectStore(PROJECT_STORE, { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('date', 'date', { unique: false });
      }
    };
    req.onsuccess = e => { _projectDB = e.target.result; res(_projectDB); };
    req.onerror = () => rej(req.error);
  });
}

async function saveProject() {
  const db = await openProjectDB();
  const vesselName = document.getElementById('v-name') ? document.getElementById('v-name').value : 'Unnamed';
  const surveyorName = document.getElementById('v-surveyor') ? document.getElementById('v-surveyor').value : '';
  const date = document.getElementById('v-date') ? document.getElementById('v-date').value : new Date().toISOString().slice(0,10);

  // FIX #7: Calculate progress from current State.items so dashboard shows accurate %
  const allItemVals = Object.values(State.items);
  const totalItems = allItemVals.length;
  const doneItems = allItemVals.filter(i => i.status === 'done' || i.status === 'na').length;
  const progressPct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;

  const project = {
    id: _currentProjectId || 'proj-' + Date.now(),
    vesselName: vesselName,
    surveyorName: surveyorName,
    date: date,
    progress: progressPct,
    status: _currentProjectId ? (await loadProjectById(_currentProjectId)).status : 'in-progress',
    data: JSON.stringify({
      vesselFields: {
        'v-name': document.getElementById('v-name') ? document.getElementById('v-name').value : '',
        'v-hin': document.getElementById('v-hin') ? document.getElementById('v-hin').value : '',
        'v-ref': document.getElementById('v-ref') ? document.getElementById('v-ref').value : '',
        'v-surveyor': document.getElementById('v-surveyor') ? document.getElementById('v-surveyor').value : '',
        'v-client': document.getElementById('v-client') ? document.getElementById('v-client').value : '',
        'v-date': document.getElementById('v-date') ? document.getElementById('v-date').value : '',
        'v-type': document.getElementById('v-type') ? document.getElementById('v-type').value : '',
        'v-location': document.getElementById('v-location') ? document.getElementById('v-location').value : '',
        'v-weather': document.getElementById('v-weather') ? document.getElementById('v-weather').value : '',
        'v-scope': document.getElementById('v-scope') ? document.getElementById('v-scope').value : '',
      },
      items: State.items,
      vesselPhoto: State.vesselPhoto,
      customSections: customSections,
    }),
    updatedAt: Date.now(),
  };

  return new Promise((res, rej) => {
    const tx = db.transaction(PROJECT_STORE, 'readwrite');
    const store = tx.objectStore(PROJECT_STORE);
    const req = store.put(project);
    req.onsuccess = () => { _currentProjectId = project.id; res(project); };
    req.onerror = () => rej(req.error);
  });
}

async function loadProjects() {
  const db = await openProjectDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(PROJECT_STORE, 'readonly');
    const store = tx.objectStore(PROJECT_STORE);
    const req = store.getAll();
    req.onsuccess = () => res(req.result || []);
    req.onerror = () => rej(req.error);
  });
}

async function loadProjectById(id) {
  const db = await openProjectDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(PROJECT_STORE, 'readonly');
    const store = tx.objectStore(PROJECT_STORE);
    const req = store.get(id);
    req.onsuccess = () => res(req.result || null);
    req.onerror = () => rej(req.error);
  });
}

async function updateProjectStatus(id, status) {
  const db = await openProjectDB();
  const project = await loadProjectById(id);
  if (!project) return;
  project.status = status;
  project.updatedAt = Date.now();
  return new Promise((res, rej) => {
    const tx = db.transaction(PROJECT_STORE, 'readwrite');
    const store = tx.objectStore(PROJECT_STORE);
    const req = store.put(project);
    req.onsuccess = () => res();
    req.onerror = () => rej(req.error);
  });
}

async function deleteProject(id) {
  const db = await openProjectDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(PROJECT_STORE, 'readwrite');
    const store = tx.objectStore(PROJECT_STORE);
    const req = store.delete(id);
    req.onsuccess = () => res();
    req.onerror = () => rej(req.error);
  });
}

async function loadProjectIntoState(id) {
  const project = await loadProjectById(id);
  if (!project) return false;
  try {
    const data = JSON.parse(project.data);
    _currentProjectId = project.id;

    // Restore vessel fields
    if (data.vesselFields) {
      Object.keys(data.vesselFields).forEach(key => {
        const el = document.getElementById(key);
        if (el) el.value = data.vesselFields[key];
      });
    }

    // Restore items
    if (data.items) {
      Object.keys(data.items).forEach(id => {
        if (State.items[id]) {
          State.items[id] = data.items[id];
        }
      });
    }

    // Restore vessel photo
    if (data.vesselPhoto) State.vesselPhoto = data.vesselPhoto;

    // Restore custom sections
    if (data.customSections) {
      customSections = data.customSections;
      customSections.forEach(injectCustomSectionIntoDB);
    }

    return true;
  } catch (e) {
    console.warn('loadProjectIntoState failed:', e);
    return false;
  }
}

function renderDashboard() {
  const dash = document.getElementById('dashboard-panel');
  if (!dash) return;

  // Update welcome text with surveyor name
  const welcomeEl = document.getElementById('dashboard-welcome');
  if (welcomeEl) {
    try {
      const profile = JSON.parse(localStorage.getItem(PROFILE_LS_KEY) || '{}');
      if (profile.name) {
        welcomeEl.textContent = 'Welcome back, ' + profile.name;
      } else {
        welcomeEl.textContent = 'Welcome aboard';
      }
    } catch (e) {
      welcomeEl.textContent = 'Welcome aboard';
    }
  }

  loadProjects().then(projects => {
    // ── STATS ─────────────────────────────────────────────────
    const totalSurveys = projects.length;
    const activeSurveys = projects.filter(p => p.status === 'in-progress').length;
    const completedSurveys = projects.filter(p => p.status === 'completed').length;
    let totalFindings = 0;
    projects.forEach(p => {
      try {
        const data = JSON.parse(p.data || '{}');
        if (data.items) {
          Object.values(data.items).forEach(item => {
            if (item.finding && item.finding.active) totalFindings++;
          });
        }
      } catch (e) {}
    });

    // Update stat numbers
    const statTotal = document.getElementById('db-stat-total');
    const statActive = document.getElementById('db-stat-active');
    const statCompleted = document.getElementById('db-stat-completed');
    const statFindings = document.getElementById('db-stat-findings');
    if (statTotal) statTotal.textContent = totalSurveys;
    if (statActive) statActive.textContent = activeSurveys;
    if (statCompleted) statCompleted.textContent = completedSurveys;
    if (statFindings) statFindings.textContent = totalFindings;
    // ───────────────────────────────────────────────────────────

    const emptyState = document.getElementById('dashboard-empty-state');
    const listContainer = document.getElementById('dashboard-projects-list');

    if (!projects.length) {
      if (emptyState) emptyState.style.display = 'flex';
      if (listContainer) listContainer.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (listContainer) listContainer.style.display = 'flex';

    // Sort by updatedAt desc
    projects.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    // Build project rows
    const rows = projects.map(p => {
      const isCompleted = p.status === 'completed';
      const statusClass = isCompleted ? 'completed' : 'in-progress';
      const statusLabel = isCompleted ? 'Completed' : 'In Progress';

      // Calculate progress from items if available
      let progress = 0;
      try {
        const data = JSON.parse(p.data || '{}');
        if (data.items) {
          const items = Object.values(data.items);
          const total = items.length;
          const done = items.filter(i => i.status === 'done' || i.status === 'na').length;
          progress = total ? Math.round((done / total) * 100) : 0;
        }
      } catch (e) {}

      const actionBtn = isCompleted
        ? `<button class="dash-action-btn secondary" onclick="loadProjectAndViewReport('${p.id}')">View Report</button>`
        : `<button class="dash-action-btn primary" onclick="loadProjectAndContinue('${p.id}')">Continue</button>`;

      // Mobile meta row (hidden on desktop, shown via CSS on mobile)
      const mobileMeta = `
        <div class="dash-mobile-meta-row" style="display:none;">
          <div class="dash-date-cell">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${p.date || '—'}
          </div>
          <div class="dash-progress-cell">
            <div class="dash-progress-track"><div class="dash-progress-fill" style="width:${progress}%"></div></div>
            <span class="dash-progress-text">${progress}%</span>
          </div>
        </div>`;

      return `
        <div class="dash-project-row" onclick="event.target.closest('.dash-actions-cell') || ${isCompleted ? `loadProjectAndViewReport('${p.id}')` : `loadProjectAndContinue('${p.id}')`}">
          <div class="dash-status-badge ${statusClass}">
            <span class="status-dot"></span>
            ${statusLabel}
          </div>
          <div class="dash-vessel-cell">
            <div class="dash-vessel-name">${escapeHtml(p.vesselName || 'Unnamed Vessel')}</div>
            <div class="dash-vessel-meta">
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                ${escapeHtml(p.surveyorName || 'Unknown')}
              </span>
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                ${p.date || '—'}
              </span>
            </div>
          </div>
          <div class="dash-date-cell">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${p.date || '—'}
          </div>
          <div class="dash-progress-cell">
            <div class="dash-progress-track"><div class="dash-progress-fill" style="width:${progress}%"></div></div>
            <span class="dash-progress-text">${progress}%</span>
          </div>
          <div class="dash-actions-cell">
            ${actionBtn}
            <button class="dash-action-btn danger" onclick="event.stopPropagation(); deleteProjectAndRefresh('${p.id}')" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
          ${mobileMeta}
        </div>`;
    }).join('');

    if (listContainer) {
      listContainer.innerHTML = rows;
    }
  });
}

// Helper for HTML escaping in dashboard
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ── Start a new survey from dashboard ─────────────────────────
function startNewSurvey() {
  // Reset intake form fields
  const fieldIds = ['v-name','v-hin','v-ref','v-surveyor','v-client','v-date','v-type','v-location','v-weather','v-scope'];
  fieldIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === 'v-date') {
        el.valueAsDate = new Date();
      } else if (id === 'v-surveyor') {
        // Keep surveyor name from profile
        try {
          const profile = JSON.parse(localStorage.getItem(PROFILE_LS_KEY) || '{}');
          el.value = profile.name || '';
        } catch (e) { el.value = ''; }
      } else {
        el.value = '';
      }
    }
  });
  // Reset state for new survey
  _currentProjectId = null;
  State.vesselPhoto = null;
  initState();
  updateVesselPhotoPreview();
  // Set nav stack so back button returns to dashboard
  Nav.stack = ['dashboard', 'splash'];
  showView('splash');
}

async function loadProjectAndContinue(id) {
  await loadProjectIntoState(id);
  Nav.stack = ['hub'];
  showView('hub');
  renderHub(); renderProgress();
  showToast('Project loaded');
}

async function loadProjectAndViewReport(id) {
  await loadProjectIntoState(id);
  openReport();
}

async function deleteProjectAndRefresh(id) {
  if (!confirm('Delete this project? This cannot be undone.')) return;
  await deleteProject(id);
  renderDashboard();
  showToast('Project deleted');
}

// ───────────────────────────────────────────────────────────────
// §0b  SURVEYOR PROFILE
// ───────────────────────────────────────────────────────────────
const PROFILE_LS_KEY = 'sansoon_surveyor_profile';

function checkSurveyorProfile() {
  const profile = localStorage.getItem(PROFILE_LS_KEY);
  if (!profile) {
    showSurveyorProfileModal();
    return false;
  }
  try {
    const p = JSON.parse(profile);
    const el = document.getElementById('v-surveyor');
    if (el && !el.value) el.value = p.name || '';
    return true;
  } catch (e) { return false; }
}

function showSurveyorProfileModal() {
  const old = document.getElementById('profile-modal-overlay');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'profile-modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;z-index:10000;animation:fadeIn .3s ease;';
  overlay.innerHTML = `
    <div class="profile-modal" style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:32px 28px;max-width:420px;width:90%;text-align:center;box-shadow:0 12px 48px rgba(0,0,0,.5);animation:slideUp .4s cubic-bezier(.16,1,.3,1);">
      <div style="font-size:32px;margin-bottom:12px">👤</div>
      <div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:6px">Surveyor Profile</div>
      <div style="font-size:13px;color:var(--text-dim);margin-bottom:24px">Enter your details to auto-fill reports.</div>
      <input type="text" id="sp-name" placeholder="Full Name" style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--text);font-size:14px;margin-bottom:12px;box-sizing:border-box;">
      <input type="email" id="sp-email" placeholder="Email Address" style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--text);font-size:14px;margin-bottom:20px;box-sizing:border-box;">
      <button id="profile-save-btn" style="width:100%;padding:12px;border-radius:8px;border:none;background:var(--accent);color:#fff;cursor:pointer;font-size:14px;font-weight:600;">Save Profile</button>
    </div>`;
  document.body.appendChild(overlay);

  document.getElementById('profile-save-btn').addEventListener('click', () => {
    const nameInput = document.getElementById('sp-name');
    const emailInput = document.getElementById('sp-email');
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    if (!name) { showToast('Please enter your name'); return; }
    localStorage.setItem(PROFILE_LS_KEY, JSON.stringify({ name, email, createdAt: Date.now() }));
    const el = document.getElementById('v-surveyor');
    if (el) el.value = name;
    overlay.remove();
    showToast('Profile saved');
    // After saving profile, go to dashboard
    renderDashboard();
    showView('dashboard');
  });
}


// ───────────────────────────────────────────────────────────────
// §22b  AUTOSAVE ENGINE  —  sansoon_survey_draft
//        ► Draft uses sessionStorage (clears on tab/browser close)
//        ► Access tokens stay in localStorage (persist across sessions)
// ───────────────────────────────────────────────────────────────
const DRAFT_KEY = 'sansoon_survey_draft';

function saveAllProgress() {
  // Passively snapshot state into sessionStorage.
  // Does NOT touch, rebuild, or re-render any DOM elements.
  try {
    const draft = {
      vesselFields: {
        'v-name':     document.getElementById('v-name')     ? document.getElementById('v-name').value     : '',
        'v-hin':      document.getElementById('v-hin')      ? document.getElementById('v-hin').value      : '',
        'v-ref':      document.getElementById('v-ref')      ? document.getElementById('v-ref').value      : '',
        'v-surveyor': document.getElementById('v-surveyor') ? document.getElementById('v-surveyor').value : '',
        'v-client':   document.getElementById('v-client')   ? document.getElementById('v-client').value   : '',
        'v-date':     document.getElementById('v-date')     ? document.getElementById('v-date').value     : '',
        'v-type':     document.getElementById('v-type')     ? document.getElementById('v-type').value     : '',
        'v-location': document.getElementById('v-location') ? document.getElementById('v-location').value : '',
        'v-weather':  document.getElementById('v-weather')  ? document.getElementById('v-weather').value  : '',
        'v-scope':    document.getElementById('v-scope')    ? document.getElementById('v-scope').value    : '',
      },
      items: {},
    };

    // Serialize every item: status + finding object (no raw photo data)
    Object.keys(State.items).forEach(id => {
      const s = State.items[id];
      draft.items[id] = {
        status: s.status,
        finding: {
          active:   s.finding.active,
          note:     s.finding.note,
          priority: s.finding.priority,
          cost:     s.finding.cost,
          // photo blob lives in IndexedDB — store only the key reference
          photo: (s.finding.photo && s.finding.photo.length < 64) ? s.finding.photo : null,
        },
      };
    });

    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));

    // Also auto-save to project DB if we have an active project
    if (_currentProjectId) {
      saveProject().catch(() => {});
    }
  } catch (e) {
    // sessionStorage may be full; fail silently
    console.warn('saveAllProgress failed:', e);
  }
}

function loadAllProgress() {
  // Gently restore saved text values and status-button states on page reload.
  // Does NOT clear, rebuild, or re-render any HTML. Leaves click logic untouched.
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return false;
    const draft = JSON.parse(raw);

    // Restore vessel intake field values
    if (draft.vesselFields) {
      Object.keys(draft.vesselFields).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = draft.vesselFields[id];
      });
    }

    // Restore item state into the State object only.
    // The next renderAccordion() call (via refreshAll) picks this up automatically.
    if (draft.items) {
      Object.keys(draft.items).forEach(id => {
        if (!State.items[id]) return; // item may have been removed
        const saved = draft.items[id];
        State.items[id].status = saved.status || null;

        if (saved.finding) {
          State.items[id].finding.active   = !!saved.finding.active;
          State.items[id].finding.note     = saved.finding.note     || '';
          State.items[id].finding.priority = saved.finding.priority || null;
          State.items[id].finding.cost     = saved.finding.cost     || '';
          // Restore IDB photo key reference (actual blob lives in IndexedDB)
          State.items[id].finding.photo    = saved.finding.photo    || null;
        }
      });
    }

    return true;
  } catch (e) {
    console.warn('loadAllProgress failed:', e);
    return false;
  }
}

// ───────────────────────────────────────────────────────────────
// ACCESS GATE  (tokens stay in localStorage — persist on refresh)
// ───────────────────────────────────────────────────────────────
// ── SUPABASE SAFETY WRAPPER ───────────────────────────────────
let _SB = null;
try {
  if (typeof supabase !== 'undefined' && supabase.createClient) {
    const _SB_URL = 'https://xbqcagwzrqxgzwqiifpr.supabase.co';
    const _SB_KEY = 'sb_publishable_4RpcRJucZnMsSPZtNfJjxw_HUzdYG5b';
    _SB = supabase.createClient(_SB_URL, _SB_KEY);
  }
} catch (e) {
  console.warn('Supabase unavailable:', e);
}

const AG_LS         = 'sansoon_access_token_v1';
const AG_EXPIRES_LS = 'sansoon_key_expires_at';

async function checkAccessGate() {
  // If Supabase failed to load, skip gate for testing
  if (!_SB) {
    console.warn('Supabase not loaded — skipping access gate for testing');
    hideAccessGate();
    return;
  }

  const saved   = localStorage.getItem(AG_LS);
  const expires = localStorage.getItem(AG_EXPIRES_LS);

  if (saved) {
    if (expires && Date.now() > parseInt(expires, 10)) {
      localStorage.removeItem(AG_LS);
      localStorage.removeItem(AG_EXPIRES_LS);
      document.getElementById('access-gate').style.display = 'flex';
      showAgError('This access key has expired.');
      return;
    }
    hideAccessGate();
    if (expires) {
      const remaining = parseInt(expires, 10) - Date.now();
      if (remaining > 0) {
        setTimeout(() => {
          localStorage.removeItem(AG_LS);
          localStorage.removeItem(AG_EXPIRES_LS);
          document.getElementById('access-gate').style.display = 'flex';
          showAgError('This access key has expired.');
        }, remaining);
      }
    }
    return;
  }

  document.getElementById('access-gate').style.display = 'flex';
}

function hideAccessGate() {
  const gate = document.getElementById('access-gate');
  if (gate) gate.style.display = 'none';
  // Restore saved progress
  loadAllProgress();
  // Check surveyor profile after gate
  checkSurveyorProfile();
  // NOTE: refreshAll() is called in DOMContentLoaded after everything is ready
}

async function verifyAccessKey() {
  const input  = document.getElementById('ag-key-input');
  const errEl  = document.getElementById('ag-error');
  const btnLbl = document.getElementById('ag-btn-label');
  const key    = input ? input.value.trim() : '';
  if (!key) { showAgError('Please enter your access key.'); return; }

  btnLbl.textContent = 'Verifying…';
  document.getElementById('ag-verify-btn').disabled = true;
  errEl.style.display = 'none';

  try {
    const { data, error } = await _SB
      .from('access_keys')
      .select('key_code')
      .eq('key_code', key)
      .maybeSingle();

    if (error || !data) {
      showAgError('Invalid access key. Please try again.');
    } else {
      let expiresAt = null;
      if (key === 'TEST-1HOUR') {
        expiresAt = Date.now() + (1 * 60 * 60 * 1000);
      }
      localStorage.setItem(AG_LS, key);
      if (expiresAt !== null) {
        localStorage.setItem(AG_EXPIRES_LS, expiresAt.toString());
      }
      hideAccessGate();
      if (expiresAt !== null) {
        const remaining = expiresAt - Date.now();
        setTimeout(() => {
          localStorage.removeItem(AG_LS);
          localStorage.removeItem(AG_EXPIRES_LS);
          document.getElementById('access-gate').style.display = 'flex';
          showAgError('This access key has expired.');
        }, remaining);
      }
    }
  } catch (e) {
    showAgError('Network error. Check your connection and retry.');
  }

  btnLbl.textContent = 'Verify Key';
  document.getElementById('ag-verify-btn').disabled = false;
}

function showAgError(msg) {
  const errEl = document.getElementById('ag-error');
  if (!errEl) return;
  errEl.textContent = msg;
  errEl.style.display = 'block';
}

// ── COMPANY LOGO ──────────────────────────────────────────────
const COMPANY_LOGO_BASE64 = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCADIAMgDASIAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAUHAwQGAgEI/8QANxAAAQQCAAQDBgQGAQUAAAAAAAECAwQFEQYSITETUWEiMkGBkaEHFBZxFSNCUmKxM3Ki0fDx/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ALOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxWrMFOtJZtStihjbzPe5dIiAZTBZu1KjUdbswwIvZZZEb/s47iDijwIUlvWZsbVkTcVaFE/Nzp5rvpE37+qdjhp+M2xyquLwtCDa78Ww1bEy+qvcBcUebxErkZFlaL3L2Rthir/s30VFTaLtFKV/VGekxDsnagx09RJ0gRk1Nio9ytVy9k+CJ90N3CcYUPERrfEwc6r0fAqyVXL/lEvup6t6+oFugiMVmvzMzad5kcVtzOeNY380Vhn98bvinmndPuS4AAAAAAAAAAAAAAAAAAAAAAAAA4Pi7iCODxbsiNkr05Vhpwu92eynvPcnxbH2T/Lfodfmri4/DXLjeroYXPanm7XRPropXjqRYsrBiWu3HjYGRKu/ekVOZ7v3VV6/sBAXLdi9bktW5nSzSrzPe5eqqKNSa/dhqVmc00z0YxPVTAWP+EmESa3YzUzNtg/lQ7/uVPaX5J0+YG7x/hW43gbHY6jGr21Zud6tTqumO5nr812VWX/xGjnZPAsY3m5rrkciptFb4T+bfprZUPG2CTAcQy14kVK0qeLBv4NX4fJdp9ANjhHNpHIzEZCdzKksiOgmRfaqTf0vb5JvunbS/vu48JfkvU3JaY2O5XesNljeyPT4p6Kio5PRUPzmXPwZkVsux1t7tuv03RTeaywO0ir6q1y/RAO2AAAAAAAAAAAAAAAAAAAAAADy9VaxzkTaom9eYEPxW9ruHLitVFRis59fBEe1V+xTXHDXN4xyiO7+Oq/LSaLT4SmZxBwQ+vYk3PIk0Nnfdr3Ocu/8AuRSAyfDNfO3G27tq1Dcnja17I6iytR7ERj966p7SeadFQCrkTal84daXCvDWPpWXKk6s34MbVfJLIvVyNanVeq6ODj/DnL08xXla2GxTjkZI5yP0qtRUVU5V6718CwVxcrbckkKPkll/5JnP5Fenkr09rl8mtRE81AwS5XLPuV5P063lXmWJstpqTa11VGoitRdfBXfQ5P8AFKunksTQvwI5skM7oJI3t5Xxqrd8rk+C9Pv0O7Ws6K5Qjc2Pokqr4bVRPdRPNV+Zyv4h4e9l3UsfiaUliRFWSaZdIjU6o1Fevfu71+oFRFpfh81yUMHtO9u05P8Ap8PS/c0IPw7jpQeLmsi6FUTmd4FZ8qNT1drSfQ7DhPGflFhi5nPjoQOja57dKr5Xc7t+qNRifNQOpa5rt8qoul0uvgp9ObwOS/OcWcQQQvV9eFYURU7eJyqj/wDSJ8jpAAAAAAAAAAAAAAAAAAAAAHzmajkaqpteybA5a1wzZxuVky/DMzIZZnbsU5VXwZuvXr/Svc3rCWbySNxFxlGZ7kdJI6FJUe3WuZnXW+iJ18uqITiqjUVVVEROqqpE5fHWpIUmw1xKVpkniJtNxSqqaVHp8d+adQIpeG70j9zZrOKq93pdbH9Gtbr7mhayH8Atxtfxi+y3ftVJK7bErvRFbpUX9ybl4eo5SBLGYpIy09qeMxlh/Jzeml1r5Eb+lLsCPbibGOxESoqeJXrq+VU9ZHLv6aA8Xc/mbDUlZHTwNVU9mxk3p4rk/wAY/h8zRZYoWnI2bju1YnX4RWW1Wb9PZX/ZvUfw5xHP+Yylm1k53dXPlkVEX6dfuSf6M4bR3KmOjRVT3Veq7+qgYqmLy1fkkgzlh9foskd9rJ2vb8dPbpe3mZL7chepto4GWOo2RzvHsSr/ADGNXrzNb5uXfVdH1+IvMmgx+LdHjMPD7T1hX+dKu98qf2p5r3UnYWQxczYka1VcrnIndVX4qBH8PYGnw/Q/K00e5XLzSSPXbnu81/8ABKDab1vqfNpvW035AfQAAAAAAAAAAAAAAAAAAKcStQXLW2cZT5Olk32FWG2i/wAtG76aXy9e2tdi4no5WORjka5U6Kqb0pX2R4d40ylR2Iv5HHzUnP5lsOb/ADNb321/722BIcfXJf4RTwWNcslrKPSJiq7arGmtqq+vTr5KprVcq/JfhZeWVVS1Urvrzb7o5idF/fWvmepuBpMlnfFylhyY+rWZXpthlVJNNRE27p0+K9PP0PFfgzIY5M7RoTROx2QrcsKSyKr2ya/q6duruv7AQFziue9wLbxWaR0d90McleV6a/Mx87V3++vrrz2SHFcNqXBcNPmitzYdleNbjK3ve63Sr8t/cnbXBkWS4PpYu8rGXakKNjnZ15Ha+7V+KHu9jeKK9LF/wS9WjdVqthmryt9h7kREVd669vT7gQNfI4rA8F5S/wALXrEyvexjY53bWsrunur8138dJ30bFf8ADqG1jGXJ8pcXLSsST8x4nRr1Tf7qnrvZtYrgmeWjl/49PEtnK6V6V002JUXaKnbrv/Xqa7MHx3BUTEwZaktNG+G2wqKkjWeXbfb/AOgRb+K8vb4Jp1mTqy/YurRdZ3pdIiLvfn7SJv0U3ctwJDhcPNlcXk7keRqRrMsrnpqTl6r0Tt9V9SYm4Epu4SiwsM7mTQv8ZlnXXxfiqp5fDX7eRG2MBxvla6YzKZWmyiuklljTb5Gp8k39gI3KcSZeV/DGVxsauuT15UkhanSblcnMmvJeVVT7G3QzdXP/AIj4a9TVURaL2yRu7xvRH7av1JuzwtJHmuHpcf4baWKa5r0e5eZUVO6dOq+Zm/ScFfjGtnqPLFvnSzF2Ryq1U5k9dr1+oHTAAAAAAAAAAAAAAAAAAAAAPE0aTQviVzmo9qptq6VP2X4EK3GZhklXkyackdd0cqu25z5HIu3+XR3LpNdtp0J0AQK4rKLHVSO6sCxf8jUmfIkntsd7zuvZrvrrsb9OjJWhttWZ7lmke5irK5eVF7Jtd616G+AOcr4fLRrU8S61UhgkjdqZ/vLvld1T2lRFTarr0MtHD5KCOo2bJOkSJzvG9py+IndmtrtNL377Tp6E8AOfdiMoteeP84jpZKiRMmWeRFY9GIi+z2Xaorubv1Nihjr1fIwzSztdC2qkT2LK523ovdEXSfuq9V6diYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/9k=';

const COMPANY_NAME     = "SANSOON YACHT SERVICES";
const LEGAL_DISCLAIMER = "IMPORTANT — LIABILITY DISCLAIMER: This report has been prepared solely for the use of the client named herein and is based on the surveyor's visual examination of the vessel at the time and place indicated. This survey is not a guarantee or warranty of the vessel's condition, seaworthiness, or fitness for any particular purpose. The surveyor's findings are the professional opinion of the surveyor based on conditions observed and accessible at the time of inspection. Sansoon Yacht Services and its surveyors shall not be liable for any loss, damage, or injury arising from reliance on this report beyond the survey fee paid. © " + new Date().getFullYear() + " Sansoon Yacht Services. All rights reserved.";

// ── QUICK INSERT ──────────────────────────────────────────────
const LS_KEY = 'sansoon_quick_insert_v1';
let quickInsertLibrary = [];

function loadQuickInsert() {
  try { const raw = localStorage.getItem(LS_KEY); if (raw) quickInsertLibrary = JSON.parse(raw); }
  catch(e) { quickInsertLibrary = []; }
}
function saveQuickInsert() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(quickInsertLibrary)); } catch(e) {}
}
function addToQuickInsert(phrase) {
  const trimmed = phrase.trim();
  if (!trimmed || quickInsertLibrary.includes(trimmed)) return false;
  quickInsertLibrary.unshift(trimmed);
  if (quickInsertLibrary.length > 80) quickInsertLibrary.length = 80;
  saveQuickInsert(); return true;
}
function deleteQuickInsert(idx) {
  quickInsertLibrary.splice(idx, 1);
  saveQuickInsert(); renderQuickInsertList();
}

// ───────────────────────────────────────────────────────────────
// §1  CHECKLIST DATABASE
// ───────────────────────────────────────────────────────────────


const DB = [
  {
    id:'vessel-id', label:'Vessel ID & Docs', icon:'<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    subcategories:[
      { id:'vid-reg', label:'Registration & Documentation', items:[
        {id:'vd01',label:'Hull Identification Number (HIN) — present, legible, matches title'},
        {id:'vd02',label:'State registration or USCG documentation number displayed correctly'},
        {id:'vd03',label:'Builder\'s plate — present, legible, data consistent with vessel'},
        {id:'vd04',label:'Certificate of documentation or state title — on board, unencumbered'},
        {id:'vd05',label:'Year of manufacture confirmed consistent across all documentation'},
        {id:'vd06',label:'LOA, beam, and draft confirmed consistent with listed specifications'},
        {id:'vd07',label:'Insurance certificate — current, adequate coverage, on board'},
        {id:'vd08',label:'MARPOL placard — posted if vessel 26 ft or longer'},
        {id:'vd09',label:'Sewage discharge placard — posted in head compartment'},
        {id:'vd10',label:'Capacity plate (USCG) — present, legible, not exceeded'},
      ]},
      { id:'vid-survey', label:'Survey Conditions', items:[
        {id:'vs01',label:'Sea trial conducted — speed, maneuverability, steering response recorded'},
        {id:'vs02',label:'Vessel afloat or on the hard — noted in report with inspection limitations'},
        {id:'vs03',label:'Engine(s) operated under load — RPM, temperature, and duration recorded'},
        {id:'vs04',label:'Moisture meter readings taken — reference readings logged by location'},
        {id:'vs05',label:'Sounding hammer used throughout hull, deck, and structural members'},
      ]},
    ]
  },
  {
    id:'hull-exterior', label:'Hull Exterior', icon:'<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    subcategories:[
      { id:'hx-bottom', label:'Bottom & Topsides', items:[
        {id:'hx01',label:'Antifouling paint — coverage, condition, appropriate type for use'},
        {id:'hx02',label:'Osmotic blistering — pattern (isolated/widespread), depth, moisture content'},
        {id:'hx03',label:'Gelcoat — crazing, star cracking, impact damage, stress fractures'},
        {id:'hx04',label:'Hull laminate — delamination detected by tap test, moisture meter readings'},
        {id:'hx05',label:'Hull fairness — hard spots, unfair sections, repaired areas visible'},
        {id:'hx06',label:'Boot stripe and waterline tape — adhesion, condition, alignment'},
        {id:'hx07',label:'Topsides paint or gelcoat — oxidation, scratches, patches, fading'},
        {id:'hx08',label:'Hull-to-deck joint — sealant integrity, fastener condition, no separation'},
        {id:'hx09',label:'Bow section — impact damage, abrasion, laminate condition'},
        {id:'hx10',label:'Stern section — impact damage, transom firmness, no delamination'},
        {id:'hx11',label:'Keel — attachment, garboard seam condition, weeping bolt holes, no offset'},
        {id:'hx12',label:'Keel fairing compound — condition, cracks, disbondment'},
        {id:'hx13',label:'Rub rails and fendering — secured, undamaged, end caps present'},
      ]},
      { id:'hx-thru', label:'Through-Hull Fittings', items:[
        {id:'ht01',label:'All through-hull fittings identified, counted, and charted on plan'},
        {id:'ht02',label:'Through-hull material — bronze or Marelon (no plastic, no gate valves below waterline)'},
        {id:'ht03',label:'Seacock operation — full open/close cycle completed without excessive force'},
        {id:'ht04',label:'Seacock backing plates — present, correct material, bedded properly'},
        {id:'ht05',label:'Depth sounder / speed transducer fittings — condition, fairing, sealant'},
        {id:'ht06',label:'Exhaust through-hull — no erosion, no discoloration, flapper valve present'},
        {id:'ht07',label:'Cockpit drain through-hulls — seacocks present, double-clamped hoses'},
        {id:'ht08',label:'AC discharge — seacock, hose condition, no chafe'},
        {id:'ht09',label:'Bilge pump discharge — one-way flap valve present, hose condition'},
        {id:'ht10',label:'Hull zinc anodes — consumption level (flag if >50% consumed), bonding wire'},
      ]},
    ]
  },
  {
    id:'deck-structure', label:'Deck & Hardware', icon:'<svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    subcategories:[
      { id:'dk-surface', label:'Deck Surface & Coring', items:[
        {id:'dk01',label:'Non-skid surface — condition, wear, cracking, tripping hazards'},
        {id:'dk02',label:'Deck coring — delamination by tap test around all high-load fittings'},
        {id:'dk03',label:'Deck moisture readings — elevated readings logged with location'},
        {id:'dk04',label:'Cockpit sole — firmness, drainage, no soft spots underfoot'},
        {id:'dk05',label:'Cockpit drainage — drain rate, no pooling, seacocks present'},
        {id:'dk06',label:'Cockpit seat lids — hinges, seals, drainage, structural integrity'},
        {id:'dk07',label:'Swim platform — attachment bolts, structural integrity, non-skid'},
        {id:'dk08',label:'Transom firmness — tap test, moisture readings, no soft spots'},
        {id:'dk09',label:'Anchor locker — condition, drainage, structural integrity'},
      ]},
      { id:'dk-hardware', label:'Deck Hardware & Fittings', items:[
        {id:'dh01',label:'Cleats — backing plates present, fasteners tight, no gelcoat cracking at base'},
        {id:'dh02',label:'Chocks and fairleads — condition, no sharp edges, secure to deck'},
        {id:'dh03',label:'Stanchion bases — tight, no coring soft spots, backing plates verified'},
        {id:'dh04',label:'Lifelines — wire diameter, swage integrity, pelican hooks, sag check'},
        {id:'dh05',label:'Bow pulpit — fasteners, no cracks at base, height code compliant'},
        {id:'dh06',label:'Stern pulpit — fasteners, no cracks at base, gate operation functional'},
        {id:'dh07',label:'Hatches — seals, hinges, dogs, plexiglass condition, drainage channels'},
        {id:'dh08',label:'Portlights and opening windows — seals, scratches, crazing, operation'},
        {id:'dh09',label:'Dorade vents — drain function, screens present, cowl condition'},
        {id:'dh10',label:'Compass — mounting secure, deviation card present, lighting operational'},
        {id:'dh11',label:'Windlass/capstan — motor, clutch, chain counter, breaker/fuse, deck plate'},
        {id:'dh12',label:'Winches — operation, self-tailer function, service interval, pawl function'},
        {id:'dh13',label:'Mast boot and deck plate — sealant condition, no cracking or lifting'},
        {id:'dh14',label:'Bimini/dodger — frame condition, fabric UV degradation, zipper function'},
        {id:'dh15',label:'Boarding ladder — condition, security, deployment mechanism, drain'},
      ]},
    ]
  },
  {
    id:'rig-spars', label:'Rig & Sails', icon:'<svg viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
    subcategories:[
      { id:'rg-standing', label:'Standing Rigging', items:[
        {id:'rg01',label:'Wire rigging age — date stamps checked, flag if >10 years or unknown'},
        {id:'rg02',label:'Wire condition — broken strands, kinks, fishhooks, corrosion pitting'},
        {id:'rg03',label:'Swage terminals — cracking, corrosion staining, pull test resistance'},
        {id:'rg04',label:'Toggle fittings — toggle pins, cotter pins or rings present and spread'},
        {id:'rg05',label:'Turnbuckles — condition, thread engagement, locking mechanisms secure'},
        {id:'rg06',label:'Chainplates — visible section condition, backing plates, sealant at deck'},
        {id:'rg07',label:'Chainplate area (interior) — staining, corrosion weeping, sealant failure'},
        {id:'rg08',label:'Forestay and furler — wire condition, drum bearing, foil alignment'},
        {id:'rg09',label:'Backstay — wire, tensioner or adjuster, terminal fittings'},
        {id:'rg10',label:'Spreaders — angle, condition, boots/covers, attachment hardware'},
      ]},
      { id:'rg-running', label:'Spars & Running Rigging', items:[
        {id:'rs01',label:'Mast extrusion — corrosion, dents, alignment, exit box condition'},
        {id:'rs02',label:'Mast sheaves — condition, lubrication, cheek blocks at exits'},
        {id:'rs03',label:'Masthead — crane, sheaves, anchor light, wind instrument mount'},
        {id:'rs04',label:'Boom — extrusion condition, vang attachment, outhaul, reefing hardware'},
        {id:'rs05',label:'Halyards — condition, clutch/jamcleat function, dead end securing'},
        {id:'rs06',label:'Sheets — diameter, condition, chafe at fairleads, stopper knots'},
        {id:'rs07',label:'Reefing system — lines, hooks or slab points, clewring condition'},
      ]},
      { id:'rg-sails', label:'Sails & Canvas', items:[
        {id:'sl01',label:'Mainsail — leech and luff condition, UV degradation, batten pockets'},
        {id:'sl02',label:'Headsail — luff tape, hanks or furling foil fit, clew patch condition'},
        {id:'sl03',label:'UV covers on furled headsail — stitching, coverage, fading'},
        {id:'sl04',label:'Sail bag stowage — accessible, properly labeled, no mold/mildew'},
      ]},
    ]
  },
  {
    id:'cabin-interior', label:'Cabin & Interior', icon:'<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    subcategories:[
      { id:'ci-structure', label:'Structural Elements', items:[
        {id:'ci01',label:'Main structural bulkheads — tabbing intact, no delamination, no crack propagation'},
        {id:'ci02',label:'Partial bulkheads and furniture structures — fastening, moisture staining'},
        {id:'ci03',label:'Cabin sole condition — water damage, rot, soft areas, panel fit'},
        {id:'ci04',label:'Cabin sole hatches — fit, fasteners, labels, access clearance'},
        {id:'ci05',label:'Keel bolts (interior) — nut/washer condition, staining, corrosion'},
        {id:'ci06',label:'Structural floors — tabbing to hull, no cracking or disbonding'},
        {id:'ci07',label:'Chainplate knees (interior side) — condition, staining, weeping'},
      ]},
      { id:'ci-accommodation', label:'Accommodation & Finish', items:[
        {id:'ca01',label:'Headliner — condition, staining as leak evidence, fasteners secure'},
        {id:'ca02',label:'Cabinetry — hardware, latches adequate for seaway use, doors secure'},
        {id:'ca03',label:'Joinery varnish/oil finish — condition, swelling, delamination'},
        {id:'ca04',label:'Cushions/upholstery — mildew, foam condition, cover integrity'},
        {id:'ca05',label:'Berths — structure, lee cloths or boards present and load-rated'},
        {id:'ca06',label:'Navigation station — structure, chart table, instrument visibility'},
        {id:'ca07',label:'Galley — stove mounting, fiddle rails, drainage, counter condition'},
        {id:'ca08',label:'Ice box/refrigeration — insulation, drain, compressor or holding plate'},
      ]},
      { id:'ci-ventilation', label:'Ventilation & Access', items:[
        {id:'cv01',label:'Opening hatches — operation, seals, safety straps or wire lanyards'},
        {id:'cv02',label:'Dorade/fixed ventilation — cowls operational, screens present'},
        {id:'cv03',label:'Companionway — drop boards secure, washboard condition'},
        {id:'cv04',label:'Emergency escape hatch — operable from interior, labeled, unobstructed'},
        {id:'cv05',label:'LPG locker ventilation — drain to cockpit, sealed from interior'},
      ]},
    ]
  },
  {
    id:'engine-mechanical', label:'Engine & Mechanical', icon:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>',
    subcategories:[
      { id:'en-engine', label:'Main Engine', items:[
        {id:'en01',label:'Engine make, model, hours — recorded from hour meter'},
        {id:'en02',label:'Engine mounts — condition, alignment, no excessive vibration'},
        {id:'en03',label:'Raw water cooling — impeller interval, strainer, hose condition'},
        {id:'en04',label:'Freshwater cooling — level, hose condition, clamps, thermostat'},
        {id:'en05',label:'Oil level and condition — color, level, no milky appearance'},
        {id:'en06',label:'Transmission fluid — level, condition, shifting action'},
        {id:'en07',label:'Fuel system — tank, lines, filters, water separator, shutoff'},
        {id:'en08',label:'Exhaust system — wet exhaust hose, waterlock, no leaks or burns'},
        {id:'en09',label:'Zincs on shaft and prop — consumption level, bonding continuity'},
        {id:'en10',label:'Shaft seal — dripless or stuffing box, condition, adjustment'},
      ]},
      { id:'en-drive', label:'Drive & Controls', items:[
        {id:'ed01',label:'Propeller — blade condition, pitch, hub zinc, no cavitation damage'},
        {id:'ed02',label:'Shaft — straightness, cutlass bearing condition, no vibration'},
        {id:'ed03',label:'Engine controls — throttle and shift cables, no binding or slack'},
        {id:'ed04',label:'Steering system — play, cable/hydraulic condition, rudder free movement'},
        {id:'ed05',label:'Emergency tiller — present, accessible, fits rudder head'},
      ]},
    ]
  },
  {
    id:'electrical', label:'Electrical Systems', icon:'<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    subcategories:[
      { id:'el-dc', label:'DC Systems', items:[
        {id:'el01',label:'Battery bank — age, state of charge, terminal condition, secure'},
        {id:'el02',label:'Battery switches — type, labeling, accessible, all positions functional'},
        {id:'el03',label:'Shore power inlet — condition, polarity indicator, ELCI breaker'},
        {id:'el04',label:'DC panel — breakers labeled, no corrosion, cover secure'},
        {id:'el05',label:'Bilge pump — automatic float switch, manual override, fuse/breaker'},
        {id:'el06',label:'Running lights — port, starboard, stern, masthead all functional'},
        {id:'el07',label:'Anchor light — functional, visible 360°'},
        {id:'el08',label:'Wiring — marine grade, no automotive wire, no splices under water line'},
        {id:'el09',label:'Bonding system — continuity, zincs connected, no stray current path'},
      ]},
      { id:'el-ac', label:'AC & Charging', items:[
        {id:'ea01',label:'Shore power cord — condition, plug type, amperage rating'},
        {id:'ea02',label:'AC panel — breakers labeled, GFCI protection in wet areas'},
        {id:'ea03',label:'Battery charger — output, connection, ventilation'},
        {id:'ea04',label:'Inverter — rating, DC disconnect, ventilation, fusing'},
        {id:'ea05',label:'Generator (if fitted) — hours, exhaust routing, CO risk assessment'},
        {id:'ea06',label:'Solar panels (if fitted) — mounting, wiring, controller condition'},
        {id:'ea07',label:'Wind generator (if fitted) — blades, furling, wiring, mounting'},
      ]},
    ]
  },
  {
    id:'safety-equipment', label:'Safety & Gear', icon:'<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
    subcategories:[
      { id:'sf-personal', label:'Personal Safety', items:[
        {id:'sf01',label:'PFDs — one per person, USCG-approved type, condition, accessible'},
        {id:'sf02',label:'Throwable device (Type IV) — present, accessible, line attached'},
        {id:'sf03',label:'Harnesses and tethers — quantity, condition, adjustment, clips'},
        {id:'sf04',label:'EPIRB — registration current, battery expiry date, bracket type'},
        {id:'sf05',label:'Personal AIS/PLB — present, registered, battery date'},
      ]},
      { id:'sf-distress', label:'Distress & Fire', items:[
        {id:'sd01',label:'Visual distress signals — USCG-approved, quantity, not expired'},
        {id:'sd02',label:'VHF radio — DSC-capable, MMSI programmed, DSC distress tested'},
        {id:'sd03',label:'Fire extinguishers — quantity, rating, service date, accessible'},
        {id:'sd04',label:'Fixed fire suppression (engine room) — type, service date, indicator'},
        {id:'sd05',label:'Smoke/CO detectors — present, tested, battery check'},
        {id:'sd06',label:'Life raft — type, capacity, service date, hydrostatic release'},
        {id:'sd07',label:'Emergency bag / ditch bag — contents, accessibility, floatability'},
        {id:'sd08',label:'Flare kit — quantity, type, expiry date, accessible and labeled'},
      ]},
    ]
  },
  {
    id:'plumbing', label:'Plumbing & Bilge', icon:'<svg viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
    subcategories:[
      { id:'pl-fresh', label:'Fresh Water System', items:[
        {id:'pl01',label:'Fresh water tank — capacity, fill deck fitting, vent, material'},
        {id:'pl02',label:'Pressure pump — operation, pressure switch, accumulator tank'},
        {id:'pl03',label:'Hot water heater — type (engine/electric/both), anode condition, pressure relief'},
        {id:'pl04',label:'Watermaker (if fitted) — membrane, filters, flushing protocol'},
        {id:'pl05',label:'Faucets and fixtures — operation, hot/cold, drain condition'},
      ]},
      { id:'pl-waste', label:'Waste & Bilge', items:[
        {id:'pw01',label:'Holding tank — capacity, vent, deck pumpout fitting, macerator'},
        {id:'pw02',label:'Head — operation, hoses (no-stink type), Y-valve in correct position'},
        {id:'pw03',label:'Bilge — water present (record depth), odor, staining evidence'},
        {id:'pw04',label:'Bilge pump (manual) — present, functional, accessible'},
        {id:'pw05',label:'Bilge alarm — tested, sensor position at correct height'},
        {id:'pw06',label:'Fuel in bilge — presence, odor, source investigation'},
      ]},
    ]
  },
  {
    id:'nav-electronics', label:'Nav & Electronics', icon:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    subcategories:[
      { id:'ne-nav', label:'Navigation Electronics', items:[
        {id:'ne01',label:'Chartplotter / MFD — operation, chart currency, antenna connection'},
        {id:'ne02',label:'Depth sounder — calibration, operation, transducer condition'},
        {id:'ne03',label:'Wind instruments — apparent/true wind, calibration, masthead unit'},
        {id:'ne04',label:'AIS transponder — MMSI programmed, transmit/receive confirmed'},
        {id:'ne05',label:'Radar — operation, antenna rotation, range test'},
        {id:'ne06',label:'Autopilot — drive unit, controller, calibration, emergency disconnect'},
        {id:'ne07',label:'VHF radio (at nav station) — DSC registered, operation tested'},
      ]},
      { id:'ne-comms', label:'Instruments & Comms', items:[
        {id:'nc01',label:'Barometer — present, calibrated, logging capability'},
        {id:'nc02',label:'Log/speedometer — operation, calibration, transducer condition'},
        {id:'nc03',label:'SSB or satellite phone — installation, grounding, antenna tuner'},
        {id:'nc04',label:'Wiring and cable runs — labeling, routing, connector quality'},
      ]},
    ]
  },
  {
    id:'lpg-fuel', label:'LPG & Fuel Systems', icon:'<svg viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    subcategories:[
      { id:'lp-lpg', label:'LPG / Propane', items:[
        {id:'lp01',label:'LPG locker — dedicated, overboard drain, no ignition sources'},
        {id:'lp02',label:'LPG cylinders — type, condition, valve, mounting secure'},
        {id:'lp03',label:'Regulator — date, condition, pressure test, lock-off solenoid'},
        {id:'lp04',label:'LPG hose — age, routing, no chafe, approved type'},
        {id:'lp05',label:'Stove — burner condition, gimbals, fiddles, shutoff at stove'},
        {id:'lp06',label:'LPG detector — present, sensor in bilge, alarm function tested'},
      ]},
      { id:'lp-fuel', label:'Fuel System', items:[
        {id:'fu01',label:'Diesel tank — material, fill, vent, inspection port, gauge'},
        {id:'fu02',label:'Fuel lines — material, routing, no chafe, shutoff valves'},
        {id:'fu03',label:'Primary fuel filter / water separator — condition, service interval'},
        {id:'fu04',label:'Day tank (if fitted) — condition, connections'},
        {id:'fu05',label:'Fuel deck fill — label, cap, no spillage staining'},
      ]},
    ]
  },
  {
    id:'anchoring', label:'Anchoring & Mooring', icon:'<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>',
    subcategories:[
      { id:'an-ground', label:'Ground Tackle', items:[
        {id:'an01',label:'Primary anchor — type, weight appropriate for vessel, condition'},
        {id:'an02',label:'Anchor chain — size, length, shackle moused, swivel condition'},
        {id:'an03',label:'Anchor rode (rope) — diameter, length, chafe protection at hawse'},
        {id:'an04',label:'Secondary / kedge anchor — present, stowed, accessible'},
        {id:'an05',label:'Anchor locker — drainage, securing arrangement, rode marking'},
      ]},
      { id:'an-mooring', label:'Mooring & Towing', items:[
        {id:'am01',label:'Dock lines — quantity (minimum 4), diameter, condition, chafe guards'},
        {id:'am02',label:'Fenders — quantity, size appropriate, lines in good condition'},
        {id:'am03',label:'Tow line — minimum 50 ft, appropriate diameter, bridle or bitter end'},
        {id:'am04',label:'Cleats and chocks — condition, backing, no cracking at bases'},
      ]},
    ]
  },
  {
    id:'bilge-systems', label:'Bilge & Flooding', icon:'<svg viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="6"/><path d="M5 10c0 5.523 3.134 10 7 10s7-4.477 7-10"/><path d="M7 10c0 3.866 2.239 7 5 7s5-3.134 5-7"/><line x1="3" y1="6" x2="5" y2="10"/><line x1="19" y1="6" x2="21" y2="10"/><line x1="8" y1="3" x2="7" y2="6"/><line x1="16" y1="3" x2="17" y2="6"/></svg>',
    subcategories:[
      { id:'bg-pumps', label:'Bilge Pumps & Alarms', items:[
        {id:'bg01',label:'Electric bilge pump — float switch, manual override, discharge routing'},
        {id:'bg02',label:'High-water bilge alarm — float height, audible alarm, wiring'},
        {id:'bg03',label:'Manual bilge pump — type, handle present, accessible from cockpit'},
        {id:'bg04',label:'Emergency bilge pump — capacity adequate for vessel size'},
        {id:'bg05',label:'All bilge areas inspected — strum box clear, no debris blocking'},
      ]},
      { id:'bg-flooding', label:'Flooding Risk Assessment', items:[
        {id:'bf01',label:'All seacocks accounted for and operational'},
        {id:'bf02',label:'Softwood bungs attached near each through-hull'},
        {id:'bf03',label:'Hose clamps — double-clamped on all below-waterline hoses'},
        {id:'bf04',label:'Hose condition — no cracking, collapse, or chafe'},
        {id:'bf05',label:'Stuffing box / shaft seal — no excessive drip rate'},
      ]},
    ]
  },
  {
    id:'canvas-covers', label:'Canvas & Covers', icon:'<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    subcategories:[
      { id:'cv-covers', label:'Covers & Enclosures', items:[
        {id:'cc01',label:'Dodger — frame, fabric, windows (clarity, crazing), zipper operation'},
        {id:'cc02',label:'Bimini — frame joints, fabric UV condition, fittings secure'},
        {id:'cc03',label:'Full enclosure panels — zip condition, attachment points, storage'},
        {id:'cc04',label:'Sail covers — stitching, UV strip on furled headsail, snaps'},
        {id:'cc05',label:'Cockpit cushions — mildew, foam, snap condition'},
        {id:'cc06',label:'Winch covers — present, snug fit'},
      ]},
    ]
  },
  {
    id:'dinghy-outboard', label:'Dinghy & Tender', icon:'<svg viewBox="0 0 24 24"><path d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1"/><path d="M4 18l-1-5h18l-2 5"/><path d="M12 2v3"/><path d="m9 7 3-2 3 2"/></svg>',
    subcategories:[
      { id:'dy-dinghy', label:'Tender / Dinghy', items:[
        {id:'dy01',label:'Dinghy hull — condition, inflation (inflatable), structural integrity'},
        {id:'dy02',label:'Dinghy registration — documentation, numbers displayed'},
        {id:'dy03',label:'Dinghy oars — pair present, oarlocks, stowage method'},
        {id:'dy04',label:'Dinghy painter — length adequate, cleat, chafe protection'},
      ]},
      { id:'dy-outboard', label:'Dinghy Outboard', items:[
        {id:'do01',label:'Outboard make, model, horsepower — recorded'},
        {id:'do02',label:'Outboard condition — cowl, tilt/trim, water pump tell-tale operational'},
        {id:'do03',label:'Outboard fuel tank — type, portable, condition, primer bulb'},
        {id:'do04',label:'Outboard kill switch — lanyard present, operation tested'},
        {id:'do05',label:'Outboard bracket or mount — condition, locking mechanism, zincs'},
      ]},
    ]
  },
];

// ───────────────────────────────────────────────────────────────
// §2  NAV STACK
// ───────────────────────────────────────────────────────────────
const Nav = {
  stack: ['splash'],
  activeCategory: null,
  lastVisitedSection: null,
  openAccordion: null,
  noteTrayOpen: false,

  push(level) { this.stack.push(level); updateBackBtn(); _historyPush(); },
  back() {
    if (this.noteTrayOpen)  { closeNoteTray(); return; }
    if (this.openAccordion) {
      this.openAccordion = null;
      renderAccordion(); renderContextBar(); updateBackBtn(); return;
    }
    if (this.current() === 'category') {
      this.lastVisitedSection = this.activeCategory;
      this.stack.pop();
      showView(this.stack[this.stack.length - 1]);
      refreshAll(); return;
    }
    if (this.current() === 'hub') {
      // Hub → Dashboard (not Splash)
      Nav.stack = ['dashboard'];
      showView('dashboard');
      renderDashboard();
      return;
    }
    if (this.current() === 'dashboard') {
      // On dashboard, show exit confirmation instead of going back to splash
      showExitAppConfirm();
      return;
    }
    if (this.stack.length > 1) this.stack.pop();
    showView(this.stack[this.stack.length - 1]);
  },
  current() { return this.stack[this.stack.length - 1]; }
};

function _historyPush() {
  history.pushState({ appNav: true, depth: Nav.stack.length }, '');
}

// ── STATE-AWARE POPSTATE ──────────────────────────────────────
window.addEventListener('popstate', () => {
  history.pushState({ appNav: true, depth: Nav.stack.length }, '');
  if (Nav.current() === 'category') {
    Nav.lastVisitedSection = Nav.activeCategory;
    Nav.noteTrayOpen = false;
    Nav.openAccordion = null;
    Nav.stack.pop();
    showView(Nav.stack[Nav.stack.length - 1]);
    refreshAll();
  } else if (Nav.current() === 'dashboard') {
    // Don't navigate away from dashboard on popstate, just push state back
    history.pushState({ appNav: true, depth: Nav.stack.length }, '');
  } else {
    Nav.back();
  }
});

function showExitAppConfirm() {
  const old = document.getElementById('nav-confirm-overlay');
  if (old) old.remove();
  const overlay = document.createElement('div');
  overlay.id = 'nav-confirm-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;z-index:9999;';
  const box = document.createElement('div');
  box.style.cssText = 'background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:32px 28px;max-width:360px;width:90%;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.6);';
  box.innerHTML =
    '<div style="font-size:28px;margin-bottom:12px">🚪</div>' +
    '<div style="font-size:16px;font-weight:600;color:var(--text);margin-bottom:8px">Exit App?</div>' +
    '<div style="font-size:13px;color:var(--text-dim);margin-bottom:24px">Are you sure you want to exit? Your projects are safely saved.</div>' +
    '<div style="display:flex;gap:12px;justify-content:center;">' +
      '<button id="nav-confirm-cancel" style="flex:1;padding:10px 0;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;font-size:14px;">Stay</button>' +
      '<button id="nav-confirm-yes"    style="flex:1;padding:10px 0;border-radius:8px;border:none;background:var(--accent);color:#fff;cursor:pointer;font-size:14px;font-weight:600;">Exit</button>' +
    '</div>';
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  document.getElementById('nav-confirm-yes').addEventListener('click', () => {
    overlay.remove();
    // Close the app/tab
    window.close();
    // Fallback: show splash if window.close() doesn't work
    Nav.stack = ['splash'];
    showView('splash');
  });
  document.getElementById('nav-confirm-cancel').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  const esc = e => { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); } };
  document.addEventListener('keydown', esc);
}

function showBackToSplashConfirm() {
  const old = document.getElementById('nav-confirm-overlay');
  if (old) old.remove();
  const overlay = document.createElement('div');
  overlay.id = 'nav-confirm-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;z-index:9999;';
  const box = document.createElement('div');
  box.style.cssText = 'background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:32px 28px;max-width:360px;width:90%;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.6);';
  box.innerHTML =
    '<div style="font-size:28px;margin-bottom:12px">⚓</div>' +
    '<div style="font-size:16px;font-weight:600;color:var(--text);margin-bottom:8px">Return to Dashboard?</div>' +
    '<div style="font-size:13px;color:var(--text-dim);margin-bottom:24px">Your inspection progress is saved. You can return to the survey at any time.</div>' +
    '<div style="display:flex;gap:12px;justify-content:center;">' +
      '<button id="nav-confirm-cancel" style="flex:1;padding:10px 0;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;font-size:14px;">Stay Here</button>' +
      '<button id="nav-confirm-yes"    style="flex:1;padding:10px 0;border-radius:8px;border:none;background:var(--accent);color:#fff;cursor:pointer;font-size:14px;font-weight:600;">Yes, Go Back</button>' +
    '</div>';
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  document.getElementById('nav-confirm-yes').addEventListener('click', () => {
    overlay.remove();
    Nav.stack = ['dashboard'];
    showView('dashboard');
    renderDashboard();
  });
  document.getElementById('nav-confirm-cancel').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  const esc = e => { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); } };
  document.addEventListener('keydown', esc);
}

function updateBackBtn() {
  const btn = document.getElementById('back-btn');
  if (!btn) return;
  // On dashboard, hide back button (no going back to splash)
  if (Nav.current() === 'dashboard') {
    btn.style.display = 'none';
    const hubBtn = document.getElementById('hub-btn');
    if (hubBtn) hubBtn.style.display = 'none';
    return;
  }
  const show = Nav.stack.length > 1 || Nav.noteTrayOpen || Nav.openAccordion !== null;
  btn.style.display = show ? 'inline-flex' : 'none';
  const hubBtn = document.getElementById('hub-btn');
  if (hubBtn) hubBtn.style.display = (Nav.current() === 'category') ? 'inline-flex' : 'none';
}

function showView(view) {
  document.getElementById('splash').style.display       = view === 'splash'   ? 'flex'  : 'none';
  const hub = document.getElementById('hub-panel');
  if (hub) hub.style.display = view === 'hub' ? 'block' : 'none';
  const dash = document.getElementById('dashboard-panel');
  if (dash) dash.style.display = view === 'dashboard' ? 'block' : 'none';
  document.getElementById('work-area').style.display    = view === 'category' ? 'flex'  : 'none';
  document.getElementById('report-panel').style.display = view === 'report'   ? 'block' : 'none';
  updateBackBtn();
  if (history.state === null || !history.state.appNav)
    history.replaceState({ appNav: true, depth: Nav.stack.length }, '');
}

// ───────────────────────────────────────────────────────────────
// §3  APP STATE
// ───────────────────────────────────────────────────────────────
const State = { items: {}, filterMode: 'all', vesselPhoto: null };

function initState() {
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(it => {
    State.items[it.id] = { status: null, finding: { active: false, note: '', priority: null, photo: null, cost: '' } };
  })));
}

// ───────────────────────────────────────────────────────────────
// §4  HELPERS & STATS
// ───────────────────────────────────────────────────────────────
const $        = id => document.getElementById(id);
const allItems = () => DB.flatMap(c => c.subcategories.flatMap(s => s.items));

function getStats(items) {
  let done=0, prog=0, na=0, findings=0;
  items.forEach(it => {
    const s = State.items[it.id];
    if (!s) return;
    if (s.status === 'done')          done++;
    else if (s.status === 'progress') prog++;
    else if (s.status === 'na')       na++;
    if (s.finding.active) findings++;
  });
  return { total: items.length, done, prog, na, findings, rem: items.length - done - na };
}

function catItems(cat) { return cat.subcategories.flatMap(s => s.items); }
function globalStats() { return getStats(allItems()); }

// ───────────────────────────────────────────────────────────────
// §5  CATEGORY BAR  (with drag-scroll)
// ───────────────────────────────────────────────────────────────
function renderCategoryBar() {
  const bar = $('cat-bar');
  bar.innerHTML = '';
  DB.forEach(cat => {
    const st  = getStats(catItems(cat));
    const pct = st.total ? Math.round(((st.done + st.na) / st.total) * 100) : 0;
    const isActive = Nav.activeCategory === cat.id;
    const btn = document.createElement('button');
    btn.className = 'cat-cap' + (isActive ? ' active' : '') + (st.findings ? ' has-finding' : '');
    btn.dataset.catId = cat.id;
    btn.innerHTML = `<span class="cap-icon">${cat.icon}</span>
      <span class="cap-label">${cat.label}</span>
      <span class="cap-pct">${pct}%</span>
      ${st.findings ? `<span class="cap-flag">⚑ ${st.findings}</span>` : ''}`;
    btn.addEventListener('click', () => selectCategory(cat.id));
    bar.appendChild(btn);
  });
}

function enableDragScroll(el) {
  let down=false, startX, scrollLeft;
  el.addEventListener('mousedown', e => {
    if (e.button !== 0 || e.target.closest('.cat-cap')) return;
    down=true; el.classList.add('dragging');
    startX=e.pageX - el.offsetLeft; scrollLeft=el.scrollLeft; e.preventDefault();
  });
  ['mouseleave','mouseup'].forEach(ev => el.addEventListener(ev, () => { down=false; el.classList.remove('dragging'); }));
  el.addEventListener('mousemove', e => {
    if (!down) return;
    el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.5;
  });
}


// ───────────────────────────────────────────────────────────────
// §6  ACCORDION  (with horizontal-divider jump arrows)
// ───────────────────────────────────────────────────────────────
function renderAccordion() {
  const cat = DB.find(c => c.id === Nav.activeCategory);
  if (!cat) return;
  const acc = $('accordion');
  acc.innerHTML = '';

  const subIds = cat.subcategories.map(s => s.id);

  cat.subcategories.forEach((sub, idx) => {
    const st    = getStats(sub.items);
    const isOpen = Nav.openAccordion === sub.id || (Nav.openAccordion === null && idx === 0);
    const pct = st.total ? Math.round(((st.done + st.na) / st.total) * 100) : 0;

    const section = document.createElement('div');
    section.className = 'acc-section' + (isOpen ? ' open' : '');
    section.dataset.subId = sub.id;
    section.id = 'acc-sec-' + sub.id;

    const prevId = idx > 0 ? subIds[idx - 1] : null;
    const nextId = idx < subIds.length - 1 ? subIds[idx + 1] : null;

    const jumpArrowsHTML =
      '<div class="acc-jump-arrows">' +
        (prevId
          ? `<button class="acc-jump-btn" title="Jump to previous section" data-target="acc-sec-${prevId}">&#8593;</button>`
          : '<span class="acc-jump-spacer"></span>') +
        (nextId
          ? `<button class="acc-jump-btn" title="Jump to next section" data-target="acc-sec-${nextId}">&#8595;</button>`
          : '<span class="acc-jump-spacer"></span>') +
      '</div>';

    const hdr = document.createElement('div');
    hdr.className = 'acc-header';
    hdr.innerHTML = `
      <div class="acc-hdr-left">
        <span class="acc-chevron"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></span>
        <span class="acc-title">${sub.label}</span>
      </div>
      <div class="acc-hdr-right">
        ${st.findings ? `<span class="acc-flag">⚑${st.findings}</span>` : ''}
        <span class="acc-count">${st.done+st.na}/${st.total}</span>
        <div class="acc-minibar"><div class="acc-minifill" style="width:${pct}%"></div></div>
        ${jumpArrowsHTML}
      </div>`;

    hdr.addEventListener('click', e => {
      if (e.target.closest('.acc-jump-btn')) return;
      Nav.openAccordion = Nav.openAccordion === sub.id ? null : sub.id;
      renderAccordion(); renderContextBar(); updateBackBtn();
    });

    hdr.querySelectorAll('.acc-jump-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const target = document.getElementById(btn.dataset.target);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const body = document.createElement('div');
    body.className = 'acc-body';
    const filtered = filterItems(sub.items);
    if (!filtered.length && sub.items.length) {
      body.innerHTML = `<div class="empty-filter">No items match the current filter.</div>`;
    } else {
      filtered.forEach((item, i) => body.appendChild(buildItemRow(item, i + 1)));
    }

    section.appendChild(hdr);
    section.appendChild(body);
    acc.appendChild(section);
  });
}

function filterItems(items) {
  const f = State.filterMode;
  if (f === 'remaining') return items.filter(it => !['done','na'].includes(State.items[it.id]?.status));
  if (f === 'findings')  return items.filter(it => State.items[it.id]?.finding.active);
  return items;
}

// ───────────────────────────────────────────────────────────────
// §7  ITEM ROW  (4-state pill)
// ───────────────────────────────────────────────────────────────
const STATUS_LABELS = { null:'Not Started', progress:'In Progress', done:'Completed', na:'N / A' };
const STATUS_CLASS  = { null:'status-none', progress:'status-progress', done:'status-done', na:'status-na' };
// NOTE: The class names are identical — the Horizon UI color changes are purely
// in style.css. No change needed here. (This entry is for reference only.)

function pillIcon(s) {
  if (s === 'done')     return `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;
  if (s === 'progress') return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>`;
  if (s === 'na')       return `<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" stroke-width="3"/></svg>`;
  return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>`;
}

function buildItemRow(item, num) {
  const s   = State.items[item.id];
  const row = document.createElement('div');
  row.className = 'item-row' + (s.finding.active ? ' has-finding' : '');
  row.dataset.itemId = item.id;
  const hasPhoto = !!s.finding.photo;

  row.innerHTML = `
    <span class="item-num">${String(num).padStart(2,'0')}</span>
    <span class="item-label" id="il-${item.id}">${item.label}</span>
    <button class="edit-label-btn" title="Rename item"
      onclick="enableInlineEdit('${item.id}',document.getElementById('il-${item.id}'))">✏️</button>
    <div class="item-controls">
      ${hasPhoto ? `<span class="photo-indicator" title="Photo attached">📷</span>` : ''}
      <button class="pill-btn ${STATUS_CLASS[s.status]}" data-id="${item.id}" title="${STATUS_LABELS[s.status]}">
        ${pillIcon(s.status)}<span>${STATUS_LABELS[s.status]}</span>
      </button>
      <button class="flag-btn ${s.finding.active ? 'active' : ''}" data-id="${item.id}" title="Flag finding">
        <svg viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
      </button>
    </div>`;

  row.querySelector('.pill-btn').addEventListener('click', e => { e.stopPropagation(); cycleStatus(item.id); });
  row.querySelector('.flag-btn').addEventListener('click', e => { e.stopPropagation(); toggleFinding(item.id); });
  return row;
}

// ───────────────────────────────────────────────────────────────
// §8  4-STATE STATUS CYCLE
// ───────────────────────────────────────────────────────────────
const CYCLE = { null:'progress', progress:'done', done:'na', na:null };

function cycleStatus(itemId) {
  const s     = State.items[itemId];
  const newSt = CYCLE[s.status];
  s.status    = newSt;
  if (newSt === 'progress') { s.finding.active = true; openNoteTray(itemId); }
  else if (Nav.noteTrayOpen && _currentTrayId === itemId) closeNoteTray();
  refreshAll();
  saveAllProgress();
}

function toggleFinding(itemId) {
  const f = State.items[itemId].finding;
  if (f.active) {
    f.active=false; f.note=''; f.priority=null; f.photo=null;
    if (Nav.noteTrayOpen && _currentTrayId === itemId) closeNoteTray();
  } else {
    f.active=true; openNoteTray(itemId);
  }
  refreshAll();
  saveAllProgress();
}

// ───────────────────────────────────────────────────────────────
// §9  NOTE TRAY (Modal on desktop/tablet, side panel on mobile)
// ───────────────────────────────────────────────────────────────
let _currentTrayId = null;

function openNoteTray(itemId) {
  const item = allItems().find(it => it.id === itemId);
  if (!item) return;
  const s = State.items[itemId];
  const f = s.finding;
  _currentTrayId = itemId;
  Nav.noteTrayOpen = true;

  $('tray-item-label').textContent = item.label;
  $('tray-note').value = f.note;
  document.querySelectorAll('.tray-pri-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.pri === f.priority));

  // Load photo from IndexedDB if the stored value looks like an IDB key
  // (short string with no data: prefix), otherwise render inline data URL directly.
  if (f.photo && !f.photo.startsWith('data:')) {
    loadPhotoIDB(f.photo)
      .then(dataUrl => renderTrayPhoto(dataUrl || null))
      .catch(() => renderTrayPhoto(null));
  } else {
    renderTrayPhoto(f.photo || null);
  }

  // Render cost field in collapsible Extras section
  renderCostField(itemId);

  // Add animation class for modal entrance
  const tray = $('note-tray');
  tray.classList.add('open');
  tray.classList.add('tray-animate-in');

  $('tray-overlay').classList.add('visible');
  updateBackBtn();
  requestAnimationFrame(() => {
    $('tray-note').focus();
    const len = $('tray-note').value.length;
    $('tray-note').setSelectionRange(len, len);
  });

  // Remove animation class after animation completes
  setTimeout(() => tray.classList.remove('tray-animate-in'), 500);
}

function closeNoteTray() {
  saveTray();
  const tray = $('note-tray');
  tray.classList.remove('open');
  $('tray-overlay').classList.remove('visible');
  Nav.noteTrayOpen = false;
  _currentTrayId = null;
  updateBackBtn();
}

function saveTray() {
  if (!_currentTrayId) return;
  State.items[_currentTrayId].finding.note = $('tray-note').value;
  saveAllProgress();
}

function setTrayPriority(pri) {
  if (!_currentTrayId) return;
  const f = State.items[_currentTrayId].finding;
  f.priority = f.priority === pri ? null : pri;
  document.querySelectorAll('.tray-pri-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.pri === f.priority));
  saveAllProgress();
}

// ── Photo ──────────────────────────────────────────────────────
function renderTrayPhoto(data) {
  const c = $('tray-photo-preview');
  if (!data) { c.innerHTML=''; c.style.display='none'; return; }
  c.style.display = 'block';
  const img = document.createElement('img');
  img.src = data; img.className = 'tray-photo-img';
  img.style.cursor = 'pointer'; img.title = 'Click to mark up';
  img.addEventListener('click', () => openMarkupCanvas(data, _currentTrayId));
  const markupBtn = document.createElement('button');
  markupBtn.className = 'tray-markup-btn'; markupBtn.textContent = '✏️ Mark up';
  markupBtn.addEventListener('click', () => openMarkupCanvas(img.src, _currentTrayId));
  const removeBtn = document.createElement('button');
  removeBtn.className = 'tray-photo-remove'; removeBtn.textContent = '✕';
  removeBtn.addEventListener('click', removePhoto);
  const wrap = document.createElement('div');
  wrap.className = 'tray-photo-wrap'; wrap.style.position = 'relative';
  wrap.append(img, markupBtn, removeBtn);
  c.innerHTML = ''; c.appendChild(wrap);
}

function removePhoto() {
  if (!_currentTrayId) return;
  State.items[_currentTrayId].finding.photo = null;
  renderTrayPhoto(null); refreshAll();
}

function triggerPhotoUpload() { $('photo-file-input').click(); }

// ── IndexedDB helpers for photo storage ───────────────────────
const IDB_NAME    = 'sansoon_photos_v1';
const IDB_STORE   = 'photos';
const IDB_VERSION = 2;          // bump triggers onupgradeneeded on existing installs
let   _idb        = null;

function openPhotoDB() {
  if (_idb) return Promise.resolve(_idb);
  return new Promise((res, rej) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      // Primary photo store — key is item id string, value is compressed data URL
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = e => { _idb = e.target.result; res(_idb); };
    req.onerror   = () => rej(req.error);
  });
}

function savePhotoIDB(key, dataUrl) {
  return openPhotoDB().then(db => new Promise((res, rej) => {
    const tx  = db.transaction(IDB_STORE, 'readwrite');
    const req = tx.objectStore(IDB_STORE).put(dataUrl, key);
    req.onsuccess = () => res();
    req.onerror   = () => rej(req.error);
  }));
}

function loadPhotoIDB(key) {
  return openPhotoDB().then(db => new Promise((res, rej) => {
    const tx  = db.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).get(key);
    req.onsuccess = () => res(req.result || null);
    req.onerror   = () => rej(req.error);
  }));
}

function deletePhotoIDB(key) {
  return openPhotoDB().then(db => new Promise((res, rej) => {
    const tx  = db.transaction(IDB_STORE, 'readwrite');
    const req = tx.objectStore(IDB_STORE).delete(key);
    req.onsuccess = () => res();
    req.onerror   = () => rej(req.error);
  }));
}

// MAX_PHOTO_PX — compress down to this dimension on the longest edge.
// 900px at 0.72 JPEG quality produces ~60-120 KB per photo; ample for survey reports.
const MAX_PHOTO_PX = 900;

function compressImage(file) {
  // Returns a Promise that resolves to a compressed JPEG data URL.
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onerror = () => rej(new Error('FileReader failed'));
    reader.onload = e => {
      const img = new Image();
      img.onerror = () => rej(new Error('Image decode failed'));
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > MAX_PHOTO_PX || h > MAX_PHOTO_PX) {
          const r = Math.min(MAX_PHOTO_PX / w, MAX_PHOTO_PX / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        const cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        cv.getContext('2d').drawImage(img, 0, 0, w, h);
        res(cv.toDataURL('image/jpeg', 0.72));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function handlePhotoInput(input) {
  const file = input.files && input.files[0];
  if (!file || !_currentTrayId) return;
  const itemId = _currentTrayId;
  input.value = '';   // reset immediately so the same file can be re-selected

  compressImage(file).then(dataUrl => {
    return savePhotoIDB(itemId, dataUrl).then(() => {
      // Store only the IDB key in State — never the raw data URL
      State.items[itemId].finding.photo = itemId;
      renderTrayPhoto(dataUrl);
      refreshAll();
      saveAllProgress();
    }).catch(() => {
      // IDB unavailable — fall back to storing the data URL directly in State
      State.items[itemId].finding.photo = dataUrl;
      renderTrayPhoto(dataUrl);
      refreshAll();
      saveAllProgress();
    });
  }).catch(err => {
    console.warn('handlePhotoInput: compression failed', err);
    showToast('Photo could not be processed');
  });
}

// ── Vessel Cover Photo — stored in IndexedDB ──────────────────
const VESSEL_PHOTO_IDB_KEY = '__vessel_cover_photo__';

function handleVesselPhoto(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      let w=img.width, h=img.height; const maxW=1400, maxH=900;
      if(w>maxW||h>maxH){ const r=Math.min(maxW/w,maxH/h); w=Math.round(w*r); h=Math.round(h*r); }
      const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
      cv.getContext('2d').drawImage(img,0,0,w,h);
      const url = cv.toDataURL('image/jpeg',0.82);
      savePhotoIDB(VESSEL_PHOTO_IDB_KEY, url).then(() => {
        State.vesselPhoto = VESSEL_PHOTO_IDB_KEY;
        updateVesselPhotoPreview(); showToast('Vessel photo saved');
      }).catch(() => {
        State.vesselPhoto = url;
        updateVesselPhotoPreview(); showToast('Vessel photo saved');
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file); input.value='';
}

function updateVesselPhotoPreview() {
  const prev = $('vessel-photo-preview');
  if (!prev) return;
  if (State.vesselPhoto) {
    prev.style.display = 'block';
    prev.innerHTML = `<div class="vp-wrap">
      <img src="${State.vesselPhoto}" class="vp-img" alt="Vessel photo">
      <button class="vp-remove" onclick="removeVesselPhoto()">✕ Remove</button>
    </div>`;
  } else { prev.style.display='none'; prev.innerHTML=''; }
}

function removeVesselPhoto() { State.vesselPhoto = null; updateVesselPhotoPreview(); }


// ───────────────────────────────────────────────────────────────
// §10  NAVIGATION
// ───────────────────────────────────────────────────────────────
function selectCategory(catId) {
  Nav.activeCategory = catId; Nav.lastVisitedSection = null;
  const _entryCat = DB.find(c => c.id === catId);
  Nav.openAccordion = (_entryCat && _entryCat.subcategories.length)
    ? _entryCat.subcategories[0].id : null;
  if (Nav.current() !== 'category') Nav.push('category');
  showView('category'); refreshAll(); window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    const a = document.querySelector('.cat-cap.active');
    if (a) a.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
  });
}

function setFilter(mode) {
  State.filterMode = mode;
  document.querySelectorAll('.filter-pill').forEach(b =>
    b.classList.toggle('active', b.dataset.filter === mode));
  if (Nav.current() === 'category') renderAccordion();
}

// ───────────────────────────────────────────────────────────────
// §11  PROGRESS & CONTEXT BAR
// ───────────────────────────────────────────────────────────────
function renderProgress() {
  const g   = globalStats();
  const pct = g.total ? Math.round(((g.done + g.na) / g.total) * 100) : 0;
  $('gp-fill').style.width  = pct + '%';
  $('gp-label').textContent = `${g.done + g.na} / ${g.total}`;
  $('gp-pct').textContent   = pct + '%';
  const fEl = $('gp-findings');
  if (g.findings) { fEl.textContent = `${g.findings} finding${g.findings!==1?'s':''}`; fEl.style.display='inline'; }
  else fEl.style.display = 'none';
}

function renderContextBar() {
  const cat = DB.find(c => c.id === Nav.activeCategory);
  if (!cat) return;
  const st  = getStats(catItems(cat));
  const pct = st.total ? Math.round(((st.done + st.na) / st.total) * 100) : 0;
  // FIX #9: Use innerHTML so SVG icon strings render correctly
  $('ctx-title').innerHTML = `<span style="display:inline-flex;align-items:center;width:22px;height:22px;flex-shrink:0;">${cat.icon}</span>&nbsp;&nbsp;${cat.label}`;
  $('ctx-stats').innerHTML = `
    <span class="ctx-chip done">${st.done} done</span>
    <span class="ctx-chip prog">${st.prog} in progress</span>
    <span class="ctx-chip na">${st.na} N/A</span>
    <span class="ctx-chip rem">${st.rem} remaining</span>
    ${st.findings ? `<span class="ctx-chip flag">${st.findings} finding${st.findings>1?'s':''}</span>` : ''}
    <span class="ctx-pct" style="color:var(--accent)">${pct}%</span>`;
}

function refreshAll() {
  renderCategoryBar(); renderProgress();
  if (Nav.activeCategory && Nav.current() === 'category') {
    renderContextBar(); renderAccordion(); appendAddItemButton(Nav.activeCategory);
  }
  const hubPanel = document.getElementById('hub-panel');
  if (hubPanel) renderHub();
}

// ───────────────────────────────────────────────────────────────
// §12  KEYBOARD  (state-aware Escape)
// ───────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('nav-confirm-overlay')) return;
    e.preventDefault();
    if (Nav.noteTrayOpen) {
      closeNoteTray(); return;
    }
    if (Nav.current() === 'category') {
      Nav.lastVisitedSection = Nav.activeCategory;
      Nav.openAccordion = null;
      Nav.stack.pop();
      showView(Nav.stack[Nav.stack.length - 1]);
      refreshAll();
    } else {
      Nav.back();
    }
  }
});

// ───────────────────────────────────────────────────────────────
// §13  REPORT
// ───────────────────────────────────────────────────────────────
function openReport() { Nav.push('report'); showView('report'); buildReport(); }

async function buildReport() {
  const I = {
    vessel:   $('v-name').value    || 'Unnamed Vessel',
    hin:      $('v-hin').value     || '—',
    surveyor: $('v-surveyor').value|| '—',
    client:   $('v-client').value  || '—',
    date:     $('v-date').value    || '',
    type:     $('v-type').value    || 'Pre-Purchase Survey',
    location: $('v-location').value|| '—',
    weather:  $('v-weather').value || '—',
    ref:      $('v-ref').value     || '—',
    scope:    $('v-scope').value   || '',
  };
  const fmtDate = I.date
    ? new Date(I.date+'T12:00:00').toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})
    : new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const g   = globalStats();
  const pct = g.total ? Math.round(((g.done+g.na)/g.total)*100) : 0;

  const F = {A:[],B:[],C:[]};
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(item => {
    const s = State.items[item.id];
    if (s.finding.active) {
      const p = s.finding.priority||'C';
      F[p].push({ cat:cat.label, sub:sub.label, item:item.label,
                  note:s.finding.note, photo:s.finding.photo,
                  cost:parseFloat(s.finding.cost)||0 });
    }
  })));

  const findHTML = () => {
    const tot = F.A.length+F.B.length+F.C.length;
    if (!tot) return `<div class="rpt-no-findings">✓ No findings or deficiencies flagged during this inspection.</div>`;
    return ['A','B','C'].map(p => {
      if (!F[p].length) return '';
      const m = {
        A:{label:'Priority A — Safety / Critical',cls:'pri-a',icon:'🔴'},
        B:{label:'Priority B — Maintenance / Hazard',cls:'pri-b',icon:'🟡'},
        C:{label:'Priority C — Minor / Observations',cls:'pri-c',icon:'🔵'}
      }[p];
      return `<div class="rpt-find-group ${m.cls}">
        <div class="rpt-find-hdr">${m.icon} ${m.label} (${F[p].length})</div>
        ${F[p].map((f,i) => `
          <div class="rpt-find-row">
            <span class="rpt-find-n">${i+1}</span>
            <div class="rpt-find-body">
              <div class="rpt-find-path">${f.cat} › ${f.sub}
                ${f.cost>0 ? `<span class="rpt-find-cost">$${f.cost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',')}</span>` : ''}
              </div>
              <div class="rpt-find-item">${f.item}</div>
              ${f.note  ? `<div class="rpt-find-note">"${f.note}"</div>` : ''}
              ${f.photo ? `<div class="rpt-find-photo"><img src="${f.photo}" class="rpt-photo-img" alt="Finding photo"></div>` : ''}
            </div>
          </div>`).join('')}
      </div>`;
    }).join('');
  };

  const tocRows = DB.map(cat => {
    const st   = getStats(catItems(cat));
    const pct2 = st.total ? Math.round(((st.done+st.na)/st.total)*100) : 0;
    return `<div class="toc-row">
      <span class="toc-icon">${cat.icon}</span>
      <span class="toc-label">${cat.label}</span>
      <span class="toc-dots"></span>
      <span class="toc-meta">${st.done+st.na}/${st.total} &nbsp; <strong>${pct2}%</strong>
        ${st.findings ? ` &nbsp; <span class="toc-flag">⚑${st.findings}</span>` : ''}
      </span>
    </div>`;
  }).join('');

  const includeAll = document.getElementById('pdf-include-all') && document.getElementById('pdf-include-all').checked;

  const detail = (() => {
    // appendixItems accumulates findings cards for the compressed-mode appendix
    const appendixItems = [];

    const catBlocks = DB.map(cat => {
      const cst = getStats(catItems(cat));
      const cp  = cst.total ? Math.round(((cst.done+cst.na)/cst.total)*100) : 0;

      const subBlocks = cat.subcategories.map(sub => {
        if (includeAll) {
          // ── FULL mode: render every item row exactly as before ──────
          const rows = sub.items.map(item => {
            const s  = State.items[item.id];
            const sl = {null:'—',progress:'In Progress',done:'Completed',na:'N/A'}[s.status]||'—';
            const sc = {null:'rpt-s-none',progress:'rpt-s-prog',done:'rpt-s-done',na:'rpt-s-na'}[s.status]||'rpt-s-none';
            const ft = s.finding.active ? `<span class="rpt-ftag p${(s.finding.priority||'C').toLowerCase()}">Pri ${s.finding.priority||'C'}</span>` : '';
            const ph = s.finding.active && s.finding.photo ? `<br><img src="${s.finding.photo}" class="rpt-inline-thumb" alt="photo">` : '';
            return `<tr>
              <td>${item.label}</td>
              <td><span class="rpt-stag ${sc}">${sl}</span></td>
              <td>${ft}</td>
              <td class="rpt-note-cell">${s.finding.active && s.finding.note ? s.finding.note : ''}${ph}</td>
            </tr>`;
          }).join('');
          return `<div class="rpt-sub">
            <div class="rpt-sub-hdr">${sub.label}</div>
            <table class="rpt-tbl">
              <thead><tr><th>Inspection Item</th><th>Status</th><th>Finding</th><th>Notes</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>`;
        } else {
          // ── COMPRESSED mode ─────────────────────────────────────────
          const satNames   = [];  // satisfactory / done / na, no finding
          const findingRows = []; // in-progress or flagged findings (shown inline)

          sub.items.forEach(item => {
            const s = State.items[item.id];
            const isSat = (s.status === 'done' || s.status === 'na') && !s.finding.active;
            if (isSat) {
              satNames.push(item.label);
            } else {
              // Collect for inline display if they have actionable status
              const sl = {null:'—',progress:'In Progress',done:'Completed',na:'N/A'}[s.status]||'—';
              const sc = {null:'rpt-s-none',progress:'rpt-s-prog',done:'rpt-s-done',na:'rpt-s-na'}[s.status]||'rpt-s-none';
              const ft = s.finding.active ? `<span class="rpt-ftag p${(s.finding.priority||'C').toLowerCase()}">Pri ${s.finding.priority||'C'}</span>` : '';
              findingRows.push(`<tr>
                <td>${item.label}</td>
                <td><span class="rpt-stag ${sc}">${sl}</span></td>
                <td>${ft}</td>
                <td class="rpt-note-cell">${s.finding.active && s.finding.note ? s.finding.note : ''}</td>
              </tr>`);
              // Push items with photos/notes/priority to appendix
              if (s.finding.active && (s.finding.photo || s.finding.note || s.finding.priority)) {
                appendixItems.push({
                  cat: cat.label, sub: sub.label, item: item.label,
                  note: s.finding.note, photo: s.finding.photo,
                  priority: s.finding.priority
                });
              }
            }
          });

          const satBlock = satNames.length
            ? `<div class="rpt-sat-block"><strong>✓ Found Satisfactory:</strong> ${satNames.join(', ')}.</div>`
            : '';
          const tableBlock = findingRows.length
            ? `<table class="rpt-tbl">
                <thead><tr><th>Inspection Item</th><th>Status</th><th>Finding</th><th>Notes</th></tr></thead>
                <tbody>${findingRows.join('')}</tbody>
               </table>`
            : '';

          return `<div class="rpt-sub">
            <div class="rpt-sub-hdr">${sub.label}</div>
            ${satBlock}${tableBlock}
          </div>`;
        }
      }).join('');

      return `<div class="rpt-cat">
        <div class="rpt-cat-hdr" style="border-left:4px solid var(--accent)">
          <span>${cat.icon} ${cat.label}</span>
          <div>
            ${cst.findings ? `<span class="rpt-fflag">${cst.findings} Findings</span>` : ''}
            <span class="rpt-cpct">${cp}%</span>
          </div>
        </div>
        ${subBlocks}
      </div>`;
    }).join('');

    // ── Appendix section (compressed mode only) ──────────────────
    const appendix = (!includeAll && appendixItems.length) ? `
      <div class="rpt-sec-title">📎 Findings &amp; Photos Appendix</div>
      <div class="rpt-appendix-grid">
        ${appendixItems.map(f => `
          <div class="rpt-appendix-card">
            ${f.photo ? `<img src="${f.photo}" class="rpt-photo-img" alt="Finding photo">` : ''}
            <div class="apx-path">${f.cat} › ${f.sub}</div>
            <div class="apx-item">${f.item}${f.priority ? ` <span class="rpt-ftag p${f.priority.toLowerCase()}">Pri ${f.priority}</span>` : ''}</div>
            ${f.note ? `<div class="apx-note">"${f.note}"</div>` : ''}
          </div>`).join('')}
      </div>` : '';

    return catBlocks + appendix;
  })();

  const logoSrc = (COMPANY_LOGO_BASE64 && COMPANY_LOGO_BASE64 !== 'PLACEHOLDER_LOGO_BASE64')
    ? `<img src="data:image/jpeg;base64,${COMPANY_LOGO_BASE64}" class="rpt-logo-img" alt="${COMPANY_NAME}">`
    : `<div class="rpt-logo-fallback">${COMPANY_NAME}</div>`;

// Resolve vessel cover photo for screen/print render
  let _screenVesselSrc = '';
  if (State.vesselPhoto) {
    if (State.vesselPhoto.startsWith('data:')) {
      _screenVesselSrc = State.vesselPhoto;
    } else {
      try { _screenVesselSrc = await loadPhotoIDB(State.vesselPhoto); } catch(e) { _screenVesselSrc = ''; }
    }
  }
  $('report-body').innerHTML = `
    <div class="rpt-cover">
      <div class="rpt-cvr-top">
        ${logoSrc}
        <div class="rpt-doc-label">MARINE SURVEY REPORT</div>
        <div class="rpt-vessel-name">${I.vessel}</div>
        <div class="rpt-cvr-meta">${fmtDate} &nbsp;·&nbsp; ${I.type}</div>
      </div>
      ${_screenVesselSrc ? `<div class="rpt-vessel-photo"><img src="${_screenVesselSrc}" alt="Vessel" class="rpt-vessel-photo-img" onerror="this.parentElement.style.display='none'"></div>` : ''}
      <div class="rpt-info-grid">
        ${[['Vessel',I.vessel],['HIN',I.hin],['Surveyor',I.surveyor],['Client',I.client],
           ['Date',fmtDate],['Type',I.type],['Location',I.location],['Weather',I.weather],['Ref #',I.ref]]
          .map(([k,v]) => `<div class="rpt-irow"><span class="rpt-ikey">${k}</span><span class="rpt-ival">${v}</span></div>`).join('')}
        ${I.scope ? `<div class="rpt-irow full"><span class="rpt-ikey">Scope</span><span class="rpt-ival">${I.scope}</span></div>` : ''}
      </div>
    </div>

    <div class="rpt-stat-bar">
      <div class="rpt-stat"><div class="v">${pct}%</div><div class="l">Complete</div></div>
      <div class="rpt-stat pa"><div class="v">${F.A.length}</div><div class="l">Priority A</div></div>
      <div class="rpt-stat pb"><div class="v">${F.B.length}</div><div class="l">Priority B</div></div>
      <div class="rpt-stat pc"><div class="v">${F.C.length}</div><div class="l">Priority C</div></div>
      <div class="rpt-stat"><div class="v">${g.done}</div><div class="l">Completed</div></div>
      <div class="rpt-stat na"><div class="v">${g.na}</div><div class="l">N / A</div></div>
    </div>

    <div class="rpt-sec-title">📑 Table of Contents</div>
    <div class="rpt-toc">${tocRows}</div>

    <div class="rpt-sec-title">⚑ Findings &amp; Deficiencies</div>
    ${findHTML()}

    <div class="rpt-sec-title">📋 Detailed Inspection Results</div>
    ${detail}

    ${buildCostPage()}
    <div class="rpt-disclaimer">${LEGAL_DISCLAIMER}</div>
    <div class="rpt-footer">${COMPANY_NAME} &nbsp;·&nbsp; ${I.surveyor} &nbsp;·&nbsp; ${fmtDate} &nbsp;·&nbsp; ${I.vessel}</div>`;
}


// ───────────────────────────────────────────────────────────────
// §14  UNIFIED PDF EXPORT  —  generatePDF(mode)
//  mode = 'preview' → watermark with company logo
//  mode = 'download' → clean, no watermark
// ───────────────────────────────────────────────────────────────
async function generatePDF(mode) {
  const isPreview = mode === 'preview';

  // Confirmation flow before marking complete on download
  if (!isPreview && _currentProjectId) {
    const confirmed = await showCompleteConfirmModal();
    if (confirmed === true) {
      await updateProjectStatus(_currentProjectId, 'completed');
    }
    // If false, just download without marking complete
  }

  const includeAll = document.getElementById('pdf-include-all') ? document.getElementById('pdf-include-all').checked : true;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  const W=210, M=15, CW=W-M*2;
  let y=0;

  // ── HORIZON DARK THEME COLORS ─────────────────────────────────
  const C = {
    bg:       [4, 7, 12],        // #04070c  — page background
    card:     [13, 20, 32],      // #0d1420  — card backgrounds
    cardBrd:  [26, 37, 53],      // #1a2535  — card borders
    text:     [244, 241, 235],   // #f4f1eb  — warm white text
    textDim:  [148, 163, 184],   // #94a3b8  — muted text
    // FIX #8: Warm brass #c4a35a
    accent:   [196, 163, 90],    // #c4a35a  — warm brass accent
    accentDim:[161, 139, 72],    // #a18b48  — dim gold
    priA:     [192, 25, 44],     // #c0192c  — red critical
    priB:     [161, 75, 0],      // #a14b00  — orange maintenance
    priC:     [37, 99, 235],     // #2563eb  — blue observation
    done:     [5, 120, 60],      // #05783c  — green done
    na:       [71, 85, 105],     // #475569  — gray N/A
    progress: [161, 75, 0],      // #a14b00  — amber in-progress
    photoBg:  [10, 18, 32],      // #0a1220  — photo letterbox
    line:     [26, 37, 53],      // #1a2535  — divider lines
    lineLight:[38, 55, 77],      // #26374d  — lighter dividers
  };

  const setF = (sz, style) => { doc.setFontSize(sz); doc.setFont('helvetica', style||'normal'); };
  const clr  = (r,g,b) => doc.setTextColor(r,g,b);
  const fill = (r,g,b) => doc.setFillColor(r,g,b);
  const draw = (r,g,b) => doc.setDrawColor(r,g,b);
  const fmt$ = n => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Helper: draw dark page background on every new page
  const darkPage = () => {
    fill(...C.bg); doc.rect(0, 0, W, 297, 'F');
  };

  const I = {
    vessel:   $('v-name').value    || 'Unnamed Vessel',
    hin:      $('v-hin').value     || '—',
    surveyor: $('v-surveyor').value|| '—',
    client:   $('v-client').value  || '—',
    date:     $('v-date').value    || '',
    type:     $('v-type').value    || 'Pre-Purchase Survey',
    location: $('v-location').value|| '—',
    weather:  $('v-weather').value || '—',
    ref:      $('v-ref').value     || '—',
  };
  const fmtDate = I.date
    ? new Date(I.date+'T12:00:00').toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})
    : new Date().toLocaleDateString();
  const g   = globalStats();
  const pct = g.total ? Math.round(((g.done+g.na)/g.total)*100) : 0;

  const F={A:[],B:[],C:[]};
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(item => {
    const s=State.items[item.id];
    if (s.finding.active) {
      const p=s.finding.priority||'C';
      F[p].push({ cat:cat.label, sub:sub.label, item:item.label,
                  note:s.finding.note, photo:s.finding.photo,
                  cost:parseFloat(s.finding.cost)||0 });
    }
  })));

  // Resolve vessel cover photo from IDB if needed
  let vesselPhotoData = null;
  if (State.vesselPhoto) {
    if (State.vesselPhoto.startsWith('data:')) {
      vesselPhotoData = State.vesselPhoto;
    } else {
      try { vesselPhotoData = await loadPhotoIDB(State.vesselPhoto); } catch(e) {}
    }
  }

  // Resolve finding photos from IDB
  const resolvePhoto = async (ref) => {
    if (!ref) return null;
    if (ref.startsWith('data:')) return ref;
    try { return await loadPhotoIDB(ref); } catch(e) { return null; }
  };
  for (const arr of [F.A, F.B, F.C]) {
    for (const f of arr) { f.photo = await resolvePhoto(f.photo); }
  }

  const chk = (n=10) => { if(y+n>284){ doc.addPage(); darkPage(); y=22; } };

  const drawFooter = () => {
    const pages = doc.getNumberOfPages();
    for (let i=1; i<=pages; i++) {
      doc.setPage(i);
      draw(...C.line); doc.setLineWidth(0.3); doc.line(M,286,W-M,286);
      setF(6,'normal'); clr(...C.textDim);
      doc.text(COMPANY_NAME, M, 290);
      doc.text(`Page ${i} of ${pages}`, W-M, 290, {align:'right'});

      // Watermark on preview mode
      if (isPreview) {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.06 }));
        setF(48,'bold'); clr(...C.accent);
        doc.text('PREVIEW', W/2, 150, {align:'center', angle: 45});
        doc.restoreGraphicsState();
      }
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // COVER PAGE — Dark Horizon
  // ═══════════════════════════════════════════════════════════════
  darkPage();

  // Gold accent bar at top
  fill(...C.accent); doc.rect(0,0,210,2,'F');

  let logoBottom = 14;
  const hasLogo = COMPANY_LOGO_BASE64 && COMPANY_LOGO_BASE64 !== 'PLACEHOLDER_LOGO_BASE64';
  if (hasLogo) {
    try {
      // FIX #5: Properly center logo — calculate width relative to page center
      const logoW = 48, logoH = 24;
      const logoX = (W - logoW) / 2;  // exact horizontal center
      doc.addImage('data:image/jpeg;base64,' + COMPANY_LOGO_BASE64, 'JPEG', logoX, 7, logoW, logoH);
      logoBottom = 7 + logoH + 2;
    } catch (e) { }
  }

  // Company name in gold (only once — no duplicate)
  setF(8,'bold'); clr(...C.accent); doc.text(COMPANY_NAME, W/2, logoBottom+4, {align:'center'});
  fill(...C.accent); doc.rect(M, logoBottom+8, CW, 0.8, 'F');

  setF(22,'bold'); clr(...C.text); doc.text(I.vessel, W/2, logoBottom+22, {align:'center'});
  setF(10,'normal'); clr(...C.textDim); doc.text(I.type, W/2, logoBottom+31, {align:'center'});
  setF(9,'normal');  clr(...C.textDim); doc.text(fmtDate, W/2, logoBottom+39, {align:'center'});

  let photoBottom = logoBottom + 48;
  if (vesselPhotoData) {
    try {
      const _tmpImg = new Image();
      await new Promise(res => { _tmpImg.onload = res; _tmpImg.onerror = res; _tmpImg.src = vesselPhotoData; });
      const _ih = _tmpImg.naturalHeight || 1, _iw = _tmpImg.naturalWidth || 1;
      const _maxW = CW, _maxH = 80;
      const _scale = Math.min(_maxW / _iw, _maxH / _ih);
      const _dw = _iw * _scale, _dh = _ih * _scale;
      const _dx = M + (_maxW - _dw) / 2;
      // Dark letterbox background
      fill(...C.photoBg); doc.roundedRect(M, photoBottom, CW, _maxH, 2, 2, 'F');
      draw(...C.cardBrd); doc.setLineWidth(0.3); doc.roundedRect(M, photoBottom, CW, _maxH, 2, 2, 'S');
      doc.addImage(vesselPhotoData,'JPEG',_dx,photoBottom+(_maxH-_dh)/2,_dw,_dh,undefined,'FAST');
      photoBottom += _maxH + 5;
    } catch(e) {}
  }

  // Info rows — dark cards
  const ROW_H=8, TEXT_OFFSET=5, COL_KEY_W=44, COL_VAL_X=M+COL_KEY_W+2;
  const infoRows=[
    ['VESSEL',I.vessel],['HIN / HULL ID',I.hin],['SURVEYOR',I.surveyor],
    ['CLIENT',I.client],['LOCATION',I.location],['WEATHER',I.weather],['REFERENCE',I.ref],
  ];
  let iy = photoBottom + 5;
  infoRows.forEach(([k,v], rowIdx) => {
    const rowTop = iy;
    fill(...C.card); doc.roundedRect(M,rowTop,CW,ROW_H,1,1,'F');
    setF(7,'bold'); clr(...C.textDim); doc.text(k, M+3, rowTop+TEXT_OFFSET);
    setF(7.5,'normal'); clr(...C.text);
    const valLines = doc.splitTextToSize(String(v), CW-COL_KEY_W-6);
    doc.text(valLines, COL_VAL_X, rowTop+TEXT_OFFSET);
    draw(...C.cardBrd); doc.setLineWidth(0.2); doc.line(M,rowTop+ROW_H,M+CW,rowTop+ROW_H);
    iy += Math.max(ROW_H, valLines.length*ROW_H);
  });

  // Rounded card border around info table
  draw(...C.cardBrd); doc.setLineWidth(0.4); doc.roundedRect(M, photoBottom+5, CW, iy-(photoBottom+5), 2,2,'S');

  iy += 7;
  const STATS_COLS=3, STATS_ROWS=2, CARD_W=CW/STATS_COLS, CARD_H=18, statsBandH=STATS_ROWS*CARD_H+4;
  fill(...C.card); doc.roundedRect(M,iy,CW,statsBandH,2,2,'F');
  draw(...C.cardBrd); doc.setLineWidth(0.4); doc.roundedRect(M,iy,CW,statsBandH,2,2,'S');
  fill(...C.accent); doc.rect(M,iy,2.5,statsBandH,'F');
  const sts  = [`${pct}%`,`${F.A.length}`,`${F.B.length}`,`${F.C.length}`,`${g.done}`,`${g.na}`];
  const stl  = ['Complete','Pri A','Pri B','Pri C','Done','N/A'];
  const stcl = [C.accent, C.priA, C.priB, C.priC, C.done, C.na];
  sts.forEach((v,i) => {
    const col=i%STATS_COLS, row=Math.floor(i/STATS_COLS);
    const cx=M+col*CARD_W+CARD_W/2, cy=iy+row*CARD_H+CARD_H*0.52;
    if (col>0) { draw(...C.cardBrd); doc.setLineWidth(0.3); doc.line(M+col*CARD_W,iy+2,M+col*CARD_W,iy+statsBandH-2); }
    if (row===1&&col===0) { draw(...C.cardBrd); doc.setLineWidth(0.3); doc.line(M+3,iy+CARD_H,M+CW,iy+CARD_H); }
    setF(10,'bold');  clr(...stcl[i]); doc.text(v, cx, cy, {align:'center'});
    setF(6,'normal'); clr(...C.textDim); doc.text(stl[i], cx, cy+4.5, {align:'center'});
  });

  const allCostItems = getAllCostItems();
  if (allCostItems.length) {
    iy += statsBandH + 7;
    const subtotal=allCostItems.reduce((a,r)=>a+r.cost,0);
    const taxAmt=taxSettings.enabled ? subtotal*taxSettings.rate/100 : 0;
    const total=subtotal+taxAmt, COST_H=taxSettings.enabled?28:22;
    fill(...C.card); doc.roundedRect(M,iy,CW,COST_H,2,2,'F');
    draw(...C.cardBrd); doc.setLineWidth(0.4); doc.roundedRect(M,iy,CW,COST_H,2,2,'S');
    fill(...C.done); doc.rect(M,iy,2.5,COST_H,'F');
    setF(7,'bold'); clr(...C.done); doc.text('ESTIMATED REPAIR COSTS', M+6, iy+6);
    setF(7,'normal'); clr(...C.textDim);
    doc.text(`${allCostItems.length} item${allCostItems.length!==1?'s':''} flagged`, M+6, iy+12);
    if (taxSettings.enabled) {
      doc.text(`Subtotal: ${fmt$(subtotal)}`, M+6, iy+17);
      doc.text(`HST ${taxSettings.rate}%: ${fmt$(taxAmt)}`, M+6, iy+22);
    }
    setF(9,'bold'); clr(...C.done);
    doc.text(fmt$(total), W-M-3, iy+(taxSettings.enabled?20:12), {align:'right'});
    setF(6,'normal'); clr(...C.textDim);
    doc.text(taxSettings.enabled?'TOTAL INC. TAX':'SUBTOTAL', W-M-3, iy+(taxSettings.enabled?25:17), {align:'right'});
  }

  // ═══════════════════════════════════════════════════════════════
  // PAGE 2: TABLE OF CONTENTS — Dark Horizon
  // ═══════════════════════════════════════════════════════════════
  doc.addPage(); darkPage(); y=22;
  setF(14,'bold'); clr(...C.text); doc.text('TABLE OF CONTENTS', M, y); y+=6;
  fill(...C.accent); doc.rect(M,y,CW,0.8,'F'); y+=8;
  DB.forEach(cat => {
    chk(9);
    const st=getStats(catItems(cat));
    const cp=st.total?Math.round(((st.done+st.na)/st.total)*100):0;
    const cpClr = cp>=80?C.done:cp>=40?C.progress:C.priA;
    fill(...C.card); doc.roundedRect(M,y-5,CW,8,1,1,'F');
    setF(8.5,'normal'); clr(...C.text); doc.text(cat.label, M+3, y);
    setF(8.5,'bold'); clr(...cpClr); doc.text(`${st.done+st.na}/${st.total}  ${cp}%`, W-M, y, {align:'right'});
    // Proper dot leaders
    const labelW = doc.getTextWidth(cat.label) + 6;
    const scoreW = doc.getTextWidth(`${st.done+st.na}/${st.total}  ${cp}%`) + 4;
    const dotStart = M + 3 + labelW;
    const dotEnd   = W - M - scoreW;
    if (dotEnd > dotStart + 4) {
      setF(8,'normal'); clr(...C.textDim);
      const dotW = doc.getTextWidth('.');
      const dotCount = Math.floor((dotEnd - dotStart) / dotW);
      const dots = '.'.repeat(dotCount);
      doc.text(dots, dotStart, y);
    }
    y+=8;
  });

  // ═══════════════════════════════════════════════════════════════
  // PAGE 3: FINDINGS — Dark Horizon
  // ═══════════════════════════════════════════════════════════════
  doc.addPage(); darkPage(); y=22;
  setF(12,'bold'); clr(...C.text); doc.text('FINDINGS & DEFICIENCIES', M, y); y+=5;
  fill(...C.accent); doc.rect(M,y,CW,0.8,'F'); y+=8;
  const allF=[...F.A.map(f=>({...f,p:'A'})),...F.B.map(f=>({...f,p:'B'})),...F.C.map(f=>({...f,p:'C'}))];
  if (!allF.length) {
    setF(9,'normal'); clr(...C.done);
    doc.text('No findings or deficiencies were flagged during this inspection.', M, y); y+=10;
  } else {
    const F_COST_X=W-M-2, F_COST_W=24, F_TEXT_W=CW-8-F_COST_W-2;
    const pc={A:C.priA,B:C.priB,C:C.priC};
    const pcBg={A:[32,8,10],B:[28,16,6],C:[8,16,32]};
    for (const f of allF) {
      const hasCost = f.cost > 0;
      chk(f.photo ? 28 : 22);
      fill(...pcBg[f.p]); doc.roundedRect(M,y,CW,16,2,2,'F');
      draw(...pc[f.p]); doc.setLineWidth(0.3); doc.roundedRect(M,y,CW,16,2,2,'S');
      fill(...pc[f.p]); doc.rect(M,y,2.5,16,'F');
      setF(7,'bold'); clr(...pc[f.p]); doc.text(`PRIORITY ${f.p}`, M+5, y+5);
      if (hasCost) { setF(8,'bold'); clr(...C.done); doc.text(fmt$(f.cost), F_COST_X, y+5, {align:'right'}); }
      setF(7,'normal'); clr(...C.textDim); doc.text(`${f.cat}  >  ${f.sub}`, M+5, y+11);
      setF(9,'bold'); clr(...C.text);
      const il = doc.splitTextToSize(f.item, hasCost ? F_TEXT_W : CW-8);
      doc.text(il, M+5, y+17); y += 17 + il.length*4.5;
      if (f.note) {
        chk(8);
        const nl=doc.splitTextToSize(`"${f.note}"`, CW-10);
        setF(8,'italic'); clr(...C.textDim); doc.text(nl, M+5, y); y+=nl.length*4.5+2;
      }
      if (f.photo) {
        try {
          const _fi = new Image();
          await new Promise(res => { _fi.onload = res; _fi.onerror = res; _fi.src = f.photo; });
          const _fiw = _fi.naturalWidth || 1, _fih = _fi.naturalHeight || 1;
          const _fMaxW = CW - 2, _fMaxH = 54;
          const _fScale = Math.min(_fMaxW / _fiw, _fMaxH / _fih);
          const _fdw = _fiw * _fScale, _fdh = _fih * _fScale;
          const _fdx = M + 1 + (_fMaxW - _fdw) / 2;
          chk(_fdh + 6);
          fill(...C.photoBg); doc.roundedRect(M, y, CW, _fdh + 2, 2, 2, 'F');
          draw(...C.cardBrd); doc.setLineWidth(0.3); doc.roundedRect(M, y, CW, _fdh + 2, 2, 2, 'S');
          doc.addImage(f.photo, 'JPEG', _fdx, y + 1, _fdw, _fdh, undefined, 'FAST');
          y += _fdh + 4;
        } catch(e) {}
      }
      draw(...C.line); doc.line(M+3,y+2,M+CW,y+2); y+=7;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // DETAIL BREAKDOWN — Dark Horizon
  // ═══════════════════════════════════════════════════════════════
  const pdfAppendixItems = [];
  for (const cat of DB) {
    chk(14);
    fill(...C.card); doc.roundedRect(M,y,CW,9,2,2,'F');
    draw(...C.cardBrd); doc.setLineWidth(0.3); doc.roundedRect(M,y,CW,9,2,2,'S');
    fill(...C.accent); doc.rect(M,y,2.5,9,'F');
    setF(9,'bold'); clr(...C.text); doc.text(cat.label.toUpperCase(), M+5, y+6); y+=12;
    for (const sub of cat.subcategories) {
      chk(9);
      fill(...C.card); doc.rect(M,y,CW,7,1,1,'F');
      setF(8,'bold'); clr(...C.accent); doc.text(sub.label, M+4, y+5); y+=9;

      if (includeAll) {
        // ── FULL mode: render every item row ──────────────────────
        for (const item of sub.items) {
          chk(7);
          const s=State.items[item.id];
          const sl={null:'—',progress:'In Progress',done:'PASS',na:'N/A'}[s.status]||'—';
          const sc={null:C.textDim,progress:C.progress,done:C.done,na:C.na}[s.status]||C.textDim;
          setF(7,'bold'); clr(...sc); doc.text(sl, M+2, y+4.5);
          setF(7,'normal'); clr(...C.text);
          const ll=doc.splitTextToSize(item.label, CW-36); doc.text(ll, M+14, y+4.5);
          // ONLY show priority tag for flagged findings (active finding)
          if (s.finding.active) {
            const fc={A:C.priA,B:C.priB,C:C.priC}[s.finding.priority||'C'];
            const hasCost2 = s.finding.cost && parseFloat(s.finding.cost)>0;
            if (hasCost2) {
              setF(7,'bold'); clr(...C.done); doc.text(fmt$(parseFloat(s.finding.cost)), W-M-2, y+4.5, {align:'right'});
              setF(7,'bold'); clr(...fc); doc.text(`[P${s.finding.priority||'C'}]`, W-M-2-18, y+4.5, {align:'right'});
            } else { setF(7,'bold'); clr(...fc); doc.text(`[PRI ${s.finding.priority||'C'}]`, W-M-2, y+4.5, {align:'right'}); }
          }
          y += ll.length*4+1;
          if (s.finding.active && s.finding.note) {
            chk(6);
            const nl=doc.splitTextToSize(`  > ${s.finding.note}`, CW-20);
            setF(7,'italic'); clr(...C.textDim); doc.text(nl, M+14, y); y+=nl.length*3.5+1;
          }
          draw(...C.line); doc.line(M+12,y,M+CW,y); y+=2;
        }
      } else {
        // ── COMPRESSED mode ─────────────────────────────────────────
        const satNames = [];
        for (const item of sub.items) {
          const s = State.items[item.id];
          const isSat = (s.status === 'done' || s.status === 'na') && !s.finding.active;
          if (isSat) {
            satNames.push(item.label);
          } else {
            chk(7);
            const sl={null:'—',progress:'In Progress',done:'PASS',na:'N/A'}[s.status]||'—';
            const sc={null:C.textDim,progress:C.progress,done:C.done,na:C.na}[s.status]||C.textDim;
            setF(7,'bold'); clr(...sc); doc.text(sl, M+2, y+4.5);
            setF(7,'normal'); clr(...C.text);
            const ll=doc.splitTextToSize(item.label, CW-36); doc.text(ll, M+14, y+4.5);
            // ONLY show priority tag for flagged findings
            if (s.finding.active) {
              const fc={A:C.priA,B:C.priB,C:C.priC}[s.finding.priority||'C'];
              setF(7,'bold'); clr(...fc); doc.text(`[PRI ${s.finding.priority||'C'}]`, W-M-2, y+4.5, {align:'right'});
              if (s.finding.photo || s.finding.note || s.finding.priority) {
                pdfAppendixItems.push({
                  cat: cat.label, sub: sub.label, item: item.label,
                  note: s.finding.note, photo: s.finding.photo,
                  priority: s.finding.priority
                });
              }
            }
            y += ll.length*4+1;
            if (s.finding.active && s.finding.note) {
              chk(6);
              const nl=doc.splitTextToSize(`  > ${s.finding.note}`, CW-20);
              setF(7,'italic'); clr(...C.textDim); doc.text(nl, M+14, y); y+=nl.length*3.5+1;
            }
            draw(...C.line); doc.line(M+12,y,M+CW,y); y+=2;
          }
        }
        if (satNames.length) {
          chk(8);
          const satLine = doc.splitTextToSize(`✓ Found Satisfactory: ${satNames.join(', ')}.`, CW-4);
          fill(...[8,24,16]); doc.roundedRect(M,y,CW,satLine.length*4+4,2,2,'F');
          draw(...C.done); doc.setLineWidth(0.3); doc.roundedRect(M,y,CW,satLine.length*4+4,2,2,'S');
          setF(7,'normal'); clr(...C.done); doc.text(satLine, M+3, y+4); y+=satLine.length*4+6;
        }
      }
      y+=3;
    }
    y+=4;
  }

  // ── Findings Appendix (compressed mode only) ─────────────────
  if (!includeAll && pdfAppendixItems.length) {
    doc.addPage(); darkPage(); y=22;
    setF(12,'bold'); clr(...C.text); doc.text('FINDINGS & PHOTOS APPENDIX', M, y); y+=5;
    fill(...C.accent); doc.rect(M,y,CW,0.8,'F'); y+=8;
    const APX_COLS=2, APX_CARD_W=(CW-6)/APX_COLS, APX_PHOTO_H=40;
    let apxCol=0, apxRowTop=y;
    for (const f of pdfAppendixItems) {
      const resolvedPhoto = await resolvePhoto(f.photo);
      const cardH = (resolvedPhoto ? APX_PHOTO_H+4 : 0) + 18;
      if (apxCol === 0) {
        chk(cardH+2); apxRowTop=y;
      }
      const cardX = M + apxCol*(APX_CARD_W+6);
      fill(...C.card); doc.roundedRect(cardX,apxRowTop,APX_CARD_W,cardH,2,2,'F');
      draw(...C.cardBrd); doc.setLineWidth(0.3); doc.roundedRect(cardX,apxRowTop,APX_CARD_W,cardH,2,2,'S');
      let cy=apxRowTop+4;
      if (resolvedPhoto) {
        try {
          const _ai=new Image();
          await new Promise(res=>{ _ai.onload=res; _ai.onerror=res; _ai.src=resolvedPhoto; });
          const _aw=_ai.naturalWidth||1, _ah=_ai.naturalHeight||1;
          const _scale=Math.min(APX_CARD_W/_aw, APX_PHOTO_H/_ah);
          const _dw=_aw*_scale, _dh=_ah*_scale;
          const _dx=cardX+(APX_CARD_W-_dw)/2;
          fill(...C.photoBg); doc.roundedRect(cardX+1,cy,APX_CARD_W-2,APX_PHOTO_H,1,1,'F');
          draw(...C.cardBrd); doc.setLineWidth(0.3); doc.roundedRect(cardX+1,cy,APX_CARD_W-2,APX_PHOTO_H,1,1,'S');
          doc.addImage(resolvedPhoto,'JPEG',_dx,cy+(APX_PHOTO_H-_dh)/2,_dw,_dh,undefined,'FAST');
          cy+=APX_PHOTO_H+3;
        } catch(e) { cy+=2; }
      }
      const pc={A:C.priA,B:C.priB,C:C.priC};
      if (f.priority) { setF(6,'bold'); clr(...(pc[f.priority]||C.textDim)); doc.text(`PRI ${f.priority}`, cardX+2, cy+3); }
      setF(6.5,'bold'); clr(...C.text);
      const il=doc.splitTextToSize(f.item, APX_CARD_W-4); doc.text(il, cardX+2, cy+(f.priority?7:4));
      if (f.note) { setF(6,'italic'); clr(...C.textDim); const nl=doc.splitTextToSize(f.note, APX_CARD_W-4); doc.text(nl, cardX+2, cy+(f.priority?7:4)+il.length*3.5); }
      apxCol++;
      if (apxCol >= APX_COLS) { apxCol=0; y=apxRowTop+cardH+4; }
    }
    if (apxCol > 0) y=apxRowTop+((pdfAppendixItems.length%APX_COLS===0?0:1)*60)+4;
  }

  // ═══════════════════════════════════════════════════════════════
  // REPAIR COST ESTIMATE — Dark Horizon
  // ═══════════════════════════════════════════════════════════════
  if (allCostItems.length) {
    doc.addPage(); darkPage(); y=22;
    setF(12,'bold'); clr(...C.text); doc.text('REPAIR COST ESTIMATE', M, y); y+=5;
    fill(...C.accent); doc.rect(M,y,CW,0.8,'F'); y+=8;
    const TH=7;
    fill(...C.card); doc.rect(M,y,CW,TH,'F');
    setF(7,'bold'); clr(...C.textDim);
    doc.text('#', M+3, y+5); doc.text('ITEM / DESCRIPTION', M+10, y+5);
    doc.text('PRI', M+CW-36, y+5); doc.text('EST. COST', W-M-2, y+5, {align:'right'});
    draw(...C.accent); doc.setLineWidth(0.4); doc.line(M,y+TH,M+CW,y+TH); y+=TH+2;

    allCostItems.forEach((r,i) => {
      const rowLines=doc.splitTextToSize(r.item, CW-56);
      const rowH=Math.max(9, rowLines.length*4.5+4); chk(rowH+2);
      if (i%2===0) { fill(...C.card); doc.rect(M,y,CW,rowH,'F'); }
      setF(7,'bold'); clr(...C.textDim); doc.text(String(i+1), M+3, y+5.5);
      setF(7.5,'bold'); clr(...C.text); doc.text(rowLines, M+10, y+5.5);
      if (r.note) { const noteY=y+5.5+rowLines.length*4.5; setF(7,'italic'); clr(...C.textDim); doc.text(doc.splitTextToSize(r.note,CW-56), M+10, noteY); }
      if (r.priority) { const priClr={A:C.priA,B:C.priB,C:C.priC}[r.priority]||C.textDim; setF(7,'bold'); clr(...priClr); doc.text(`P${r.priority}`, M+CW-34, y+5.5); }
      setF(8,'bold'); clr(...C.done); doc.text(fmt$(r.cost), W-M-2, y+5.5, {align:'right'});
      draw(...C.line); doc.setLineWidth(0.15); doc.line(M,y+rowH,M+CW,y+rowH); y+=rowH;
    });

    y+=4;
    const subtotal2=allCostItems.reduce((a,r)=>a+r.cost,0);
    const taxAmt2=taxSettings.enabled?subtotal2*taxSettings.rate/100:0;
    const total2=subtotal2+taxAmt2;
    chk(9); fill(...C.card); doc.rect(M,y,CW,8,'F');
    setF(8,'bold'); clr(...C.textDim); doc.text('SUBTOTAL', M+4, y+5.5);
    setF(8,'bold'); clr(...C.text); doc.text(fmt$(subtotal2), W-M-2, y+5.5, {align:'right'}); y+=8;
    if (taxSettings.enabled) {
      chk(9); fill(...C.card); doc.rect(M,y,CW,8,'F');
      setF(8,'normal'); clr(...C.textDim); doc.text(`HST / TAX (${taxSettings.rate}%)`, M+4, y+5.5);
      setF(8,'normal'); clr(...C.text); doc.text(fmt$(taxAmt2), W-M-2, y+5.5, {align:'right'}); y+=8;
    }
    chk(11); fill(...C.card); doc.roundedRect(M,y,CW,10,2,2,'F');
    draw(...C.done); doc.setLineWidth(0.4); doc.roundedRect(M,y,CW,10,2,2,'S');
    fill(...C.done); doc.rect(M,y,2.5,10,'F');
    setF(9,'bold'); clr(...C.done); doc.text('TOTAL ESTIMATED REPAIR COST', M+6, y+7);
    setF(10,'bold'); clr(...C.done); doc.text(fmt$(total2), W-M-2, y+7, {align:'right'}); y+=14;
    setF(7,'normal'); clr(...C.textDim);
    doc.text(taxSettings.enabled
      ? `Tax calculated at ${taxSettings.rate}% (HST/GST). Toggle in report view to recalculate.`
      : `Tax not included. Toggle the tax option in the report view to add HST/GST.`, M, y);
  }

  drawFooter();
  const fname = `survey-${(I.vessel||'vessel').replace(/\s+/g,'-').toLowerCase()}-${I.date||'report'}.pdf`;
  doc.save(fname); showToast(isPreview ? 'PDF preview saved' : 'PDF downloaded — '+fname);
}

// ── Confirmation modal for marking survey complete ──────────────
function showCompleteConfirmModal() {
  return new Promise((res) => {
    const overlay = document.createElement('div');
    overlay.id = 'complete-confirm-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;z-index:10001;animation:fadeIn .3s ease;';
    overlay.innerHTML = `
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:32px 28px;max-width:420px;width:90%;text-align:center;box-shadow:0 12px 48px rgba(0,0,0,.5);animation:slideUp .4s cubic-bezier(.16,1,.3,1);">
        <div style="font-size:32px;margin-bottom:12px">✅</div>
        <div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:6px">Mark Survey Complete?</div>
        <div style="font-size:13px;color:var(--text-dim);margin-bottom:24px">This will mark the project as completed and finalize the report.</div>
        <div style="display:flex;gap:12px;justify-content:center;">
          <button id="complete-no" style="flex:1;padding:12px;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;font-size:14px;font-weight:600;">Download Only</button>
          <button id="complete-yes" style="flex:1;padding:12px;border-radius:8px;border:none;background:var(--accent);color:#fff;cursor:pointer;font-size:14px;font-weight:600;">Yes, Complete</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    document.getElementById('complete-yes').addEventListener('click', () => {
      overlay.remove();
      res(true);
    });
    document.getElementById('complete-no').addEventListener('click', () => {
      overlay.remove();
      res(false);
    });
    overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.remove(); res(false); } });
  });
}

// ───────────────────────────────────────────────────────────────
// §15  RESET
// ───────────────────────────────────────────────────────────────
function resetAll() {
  if (!confirm('Reset all inspection data? This cannot be undone.')) return;
  initState(); State.vesselPhoto = null;
  _currentProjectId = null;
  Nav.stack=['splash']; Nav.activeCategory=null; Nav.lastVisitedSection=null;
  Nav.openAccordion=null; Nav.noteTrayOpen=false; _currentTrayId=null;
  State.filterMode='all';
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.toggle('active', b.dataset.filter==='all'));
  $('note-tray').classList.remove('open'); $('tray-overlay').classList.remove('visible');
  updateVesselPhotoPreview();
  // Clear draft from sessionStorage on manual reset
  try { sessionStorage.removeItem(DRAFT_KEY); } catch(e) {}
  showView('splash'); renderCategoryBar(); renderProgress();
  showToast('Inspection reset');
}

// ───────────────────────────────────────────────────────────────
// §16  TOAST
// ───────────────────────────────────────────────────────────────
let _tt;
function showToast(msg) {
  const t=$('toast'); $('toast-msg').textContent=msg;
  t.classList.add('show'); clearTimeout(_tt);
  _tt = setTimeout(() => t.classList.remove('show'), 3200);
}


// ───────────────────────────────────────────────────────────────
// §17  HUB PANEL (with entrance animations)
// ───────────────────────────────────────────────────────────────
function renderHub() {
  const grid = $('hub-grid');
  if (!grid) return;
  grid.innerHTML = '';

  DB.forEach((cat, idx) => {
    const items    = catItems(cat);
    const st       = getStats(items);
    const completed= st.done + st.na;
    const pct      = st.total > 0 ? Math.round((completed / st.total) * 100) : 0;
    const badgeBg  = pct===100 ? '#0d9450' : pct>=50 ? '#b08840' : '#3a5070';

    const card = document.createElement('div');
    card.className = 'hub-card' +
      (st.findings ? ' hub-has-finding' : '') +
      (Nav.lastVisitedSection === cat.id ? ' hub-last-visited' : '') +
      ' hub-card-entrance';
    card.style.animationDelay = `${idx * 0.05}s`;

    // FIX #9: cat.icon is now an SVG string — wrap it in a div that has the svg styling
    card.innerHTML =
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:6px;">' +
        '<div class="hub-card-icon">' + cat.icon + '</div>' +
        '<span class="hub-pct-badge" style="' +
          'display:inline-flex;align-items:center;justify-content:center;' +
          'min-width:44px;height:24px;padding:0 8px;border-radius:12px;' +
          'background:' + badgeBg + ';color:#fff;font-size:12px;font-weight:700;' +
          'font-family:&quot;IBM Plex Mono&quot;,monospace;letter-spacing:0.02em;' +
          'flex-shrink:0;margin-top:2px;box-shadow:0 1px 4px rgba(0,0,0,.35);' +
        '">' + pct + '%</span>' +
      '</div>' +
      '<div class="hub-card-label">' + cat.label + '</div>' +
      '<div class="hub-progress-bar">' +
        '<div class="hub-progress-fill" style="width:' + pct + '%"></div>' +
      '</div>' +
      '<div class="hub-card-meta">' +
        '<span class="hub-done-count">' + completed + ' / ' + st.total + '</span>' +
        (st.findings ? '<span class="hub-finding-dot">⚑' + st.findings + '</span>' : '') +
      '</div>';

    card.addEventListener('click', () => selectCategory(cat.id));
    grid.appendChild(card);
  });

  // Add custom section card
  const addCard = document.createElement('div');
  addCard.className = 'hub-card hub-add-card hub-card-entrance';
  addCard.style.animationDelay = `${DB.length * 0.05}s`;
  addCard.innerHTML =
    '<div class="hub-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg></div>' +
    '<div class="hub-card-label">Create Custom Section</div>' +
    '<div style="font-size:12px;color:var(--text-dim);margin-top:4px">Add your own inspection category</div>';
  addCard.addEventListener('click', () => {
    const label = prompt('Enter new section name:');
    if (!label) return;
    addCustomSection(label); buildSearchIndex(); renderHub(); showToast('Custom section added');
  });
  grid.appendChild(addCard);
}

// ───────────────────────────────────────────────────────────────
// §18  SEARCH
// ───────────────────────────────────────────────────────────────
let _searchIndex = null;

function buildSearchIndex() {
  _searchIndex = [];
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(item => {
    _searchIndex.push({
      catId:cat.id, catLabel:cat.label, subLabel:sub.label,
      itemId:item.id, label:item.label, lower:item.label.toLowerCase()
    });
  })));
}

function searchItems(query) {
  if (!_searchIndex) buildSearchIndex();
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return _searchIndex.filter(r => r.lower.includes(q)).slice(0,10);
}

function highlightMatch(label, q) {
  const idx = label.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return label;
  return label.slice(0,idx) +
    '<mark class="search-mark">' + label.slice(idx, idx+q.length) + '</mark>' +
    label.slice(idx+q.length);
}

function jumpToItem(itemId) {
  const entry = (_searchIndex||[]).find(r => r.itemId === itemId);
  if (!entry) return;
  selectCategory(entry.catId);
  setTimeout(() => {
    const cat = DB.find(c => c.id === entry.catId);
    if (cat) {
      const sub = cat.subcategories.find(s => s.items.some(i => i.id === itemId));
      if (sub) { Nav.openAccordion=sub.id; renderAccordion(); renderContextBar(); appendAddItemButton(entry.catId); updateBackBtn(); }
    }
    setTimeout(() => {
      const row = document.querySelector('.item-row[data-item-id="'+itemId+'"]');
      if (row) { row.scrollIntoView({behavior:'smooth',block:'center'}); row.classList.add('search-highlight'); setTimeout(()=>row.classList.remove('search-highlight'),2200); }
      openNoteTray(itemId);
    }, 160);
  }, 80);
}

function initSearchBar() {
  const input   = $('global-search-input');
  const results = $('global-search-results');
  if (!input || !results) return;

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (!q) { results.style.display='none'; return; }
    const hits = searchItems(q);
    if (!hits.length) { results.style.display='none'; return; }
    results.innerHTML = hits.map(h =>
      '<div class="search-result-row" data-item-id="'+h.itemId+'">' +
        '<span class="sr-cat">'+h.catLabel+' › '+h.subLabel+'</span>' +
        '<span class="sr-label">'+highlightMatch(h.label,q)+'</span>' +
      '</div>'
    ).join('');
    results.style.display = 'block';
    results.querySelectorAll('.search-result-row').forEach(row => {
      row.addEventListener('click', () => {
        input.value=''; results.style.display='none'; jumpToItem(row.dataset.itemId);
      });
    });
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !results.contains(e.target))
      results.style.display='none';
  });

  input.addEventListener('keydown', e => {
    if (e.key==='Escape') { input.value=''; results.style.display='none'; }
  });
}

// ── Mobile search expand/collapse ─────────────────────────────
function initMobileSearch() {
  const btn   = $('mobile-search-btn');
  const wrap  = $('search-wrap');
  const input = $('global-search-input');
  if (!btn || !wrap || !input) return;

  btn.addEventListener('click', () => {
    wrap.classList.add('expanded');
    btn.classList.add('active');
    requestAnimationFrame(() => input.focus());
  });

  input.addEventListener('blur', () => {
    if (!input.value.trim()) {
      wrap.classList.remove('expanded');
      btn.classList.remove('active');
    }
  });

  input.addEventListener('input', () => {
    if (!input.value.trim()) {
      setTimeout(() => {
        if (!input.value.trim()) {
          wrap.classList.remove('expanded');
          btn.classList.remove('active');
        }
      }, 200);
    }
  });
}

// ───────────────────────────────────────────────────────────────
// §19  IMAGE MARKUP CANVAS  (with color swatches)
// ───────────────────────────────────────────────────────────────
const MARKUP_COLORS = [
  { hex:'#e53535', label:'Red'    },
  { hex:'#f5c518', label:'Yellow' },
  { hex:'#f97316', label:'Orange' },
  { hex:'#22c55e', label:'Green'  },
];

function openMarkupCanvas(dataUrl, itemId) {
  const old = $('markup-modal');
  if (old) old.remove();

  let activeColor = MARKUP_COLORS[0].hex;

  const swatchHTML = MARKUP_COLORS.map(c =>
    `<button class="markup-swatch${c.hex === activeColor ? ' active' : ''}"
       data-color="${c.hex}" title="${c.label}"
       style="background:${c.hex};" aria-label="${c.label}"></button>`
  ).join('');

  const modal = document.createElement('div');
  modal.id        = 'markup-modal';
  modal.className = 'markup-modal';
  modal.innerHTML =
    '<div class="markup-inner">' +
      '<div class="markup-toolbar">' +
        '<span class="markup-title">✏️ Mark Up Photo</span>' +
        '<div class="markup-color-palette">' +
          '<span class="markup-color-label">Brush</span>' +
          '<div class="markup-swatch-row">' + swatchHTML + '</div>' +
        '</div>' +
        '<div class="markup-actions">' +
          '<button id="markup-undo"   class="tb-btn">↩️ Undo</button>' +
          '<button id="markup-save"   class="tb-btn primary">💾 Save Markup</button>' +
          '<button id="markup-cancel" class="tb-btn danger">✕ Cancel</button>' +
        '</div>' +
      '</div>' +
      '<canvas id="markup-canvas" class="markup-canvas"></canvas>' +
    '</div>';
  document.body.appendChild(modal);

  modal.querySelectorAll('.markup-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      activeColor = btn.dataset.color;
      modal.querySelectorAll('.markup-swatch').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  const canvas  = $('markup-canvas');
  const ctx     = canvas.getContext('2d');
  const history = [];
  let drawing=false, lx=0, ly=0;

  const img = new Image();
  img.onload = () => {
    const maxW = Math.min(img.width, window.innerWidth - 56);
    const scale = maxW / img.width;
    canvas.width  = Math.round(img.width  * scale);
    canvas.height = Math.round(img.height * scale);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };
  img.src = dataUrl;

  function getPos(e) {
    const r  = canvas.getBoundingClientRect();
    const cx = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
    const cy = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
    return [(cx-r.left)*(canvas.width/r.width), (cy-r.top)*(canvas.height/r.height)];
  }

  function drawLine(x1, y1, x2, y2) {
    ctx.strokeStyle = activeColor;
    ctx.lineWidth   = 4;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  }

  canvas.addEventListener('mousedown',  e => { drawing=true; [lx,ly]=getPos(e); history.push(ctx.getImageData(0,0,canvas.width,canvas.height)); });
  canvas.addEventListener('mousemove',  e => { if(!drawing)return; const [x,y]=getPos(e); drawLine(lx,ly,x,y); [lx,ly]=[x,y]; });
  canvas.addEventListener('mouseup',    () => { drawing=false; });
  canvas.addEventListener('mouseleave', () => { drawing=false; });
  canvas.addEventListener('touchstart', e => { e.preventDefault(); drawing=true; [lx,ly]=getPos(e); history.push(ctx.getImageData(0,0,canvas.width,canvas.height)); }, {passive:false});
  canvas.addEventListener('touchmove',  e => { e.preventDefault(); if(!drawing)return; const [x,y]=getPos(e); drawLine(lx,ly,x,y); [lx,ly]=[x,y]; }, {passive:false});
  canvas.addEventListener('touchend',   () => { drawing=false; });

  $('markup-undo').addEventListener('click', () => {
    if (history.length > 1) { history.pop(); ctx.putImageData(history[history.length-1],0,0); }
  });
  $('markup-save').addEventListener('click', () => {
    const newData = canvas.toDataURL('image/jpeg', 0.88);
    if (itemId && State.items[itemId]) {
      State.items[itemId].finding.photo = newData;
      renderTrayPhoto(newData); refreshAll();
    }
    modal.remove(); showToast('Markup saved');
  });
  $('markup-cancel').addEventListener('click', () => modal.remove());
}

// ───────────────────────────────────────────────────────────────
// §20  COST FIELD
// ───────────────────────────────────────────────────────────────
const TAX_LS_KEY = 'sansoon_tax_settings_v1';
let taxSettings = { enabled: false, rate: 13 };

function loadTaxSettings() {
  try { const r=localStorage.getItem(TAX_LS_KEY); if(r) taxSettings=JSON.parse(r); } catch(e) {}
}
function saveTaxSettings() {
  try { localStorage.setItem(TAX_LS_KEY, JSON.stringify(taxSettings)); } catch(e) {}
}
function setItemCost(itemId, val) {
  if (State.items[itemId]) {
    State.items[itemId].finding.cost = val;
    saveAllProgress();
  }
}

function renderCostField(itemId) {
  const el = $('tray-cost-field');
  if (!el) return;
  const s   = State.items[itemId];
  const val = (s && s.finding && s.finding.cost) ? s.finding.cost : '';
  el.innerHTML =
    '<div class="tray-extras-section">' +
      '<button type="button" class="tray-extras-toggle" onclick="toggleExtrasSection(this)">' +
        '<span>⚙️ Extras</span>' +
        '<span class="extras-chevron">▼</span>' +
      '</button>' +
      '<div class="tray-extras-body">' +
        '<label class="tray-field-label">Estimated Repair Cost (CAD $)</label>' +
        '<input type="number" min="0" step="0.01" class="cost-input f-input" id="tray-cost-input"' +
        ' placeholder="0.00" value="' + val + '">' +
      '</div>' +
    '</div>';
  const inp = $('tray-cost-input');
  if (inp) inp.addEventListener('input', function() { setItemCost(itemId, this.value); });
}

function toggleExtrasSection(btn) {
  const body = btn.nextElementSibling;
  const chevron = btn.querySelector('.extras-chevron');
  if (body.classList.contains('open')) {
    body.classList.remove('open');
    chevron.textContent = '▼';
  } else {
    body.classList.add('open');
    chevron.textContent = '▲';
  }
}

function getAllCostItems() {
  const rows = [];
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(item => {
    const s = State.items[item.id];
    if (s && s.finding && s.finding.cost && parseFloat(s.finding.cost)>0) {
      rows.push({ cat:cat.label, sub:sub.label, item:item.label,
                  note:s.finding.note, priority:s.finding.priority,
                  cost:parseFloat(s.finding.cost)||0 });
    }
  })));
  return rows;
}

function buildCostPage() {
  const rows = getAllCostItems();
  if (!rows.length) return '';
  const subtotal = rows.reduce((a,r)=>a+r.cost, 0);
  const taxAmt   = taxSettings.enabled ? subtotal*taxSettings.rate/100 : 0;
  const total    = subtotal + taxAmt;
  const fmt      = n => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const rowsHTML = rows.map((r,i) =>
    '<tr>' +
    '<td class="inv-n">' + (i+1) + '</td>' +
    '<td class="inv-item"><strong>' + r.item + '</strong>' +
      '<div class="inv-path">' + r.cat + ' › ' + r.sub + '</div>' +
      (r.note ? '<div class="inv-note">' + r.note + '</div>' : '') + '</td>' +
    '<td class="inv-pri">' + (r.priority ? '<span class="rpt-ftag p'+r.priority.toLowerCase()+'">Pri '+r.priority+'</span>' : '—') + '</td>' +
    '<td class="inv-cost">' + fmt(r.cost) + '</td>' +
    '</tr>'
  ).join('');
  return '<div class="rpt-sec-title">💰 Repair Estimate — Page 4</div>' +
    '<div class="cost-tax-bar">' +
      '<label class="cost-tax-toggle" style="display:flex;align-items:center;gap:8px;cursor:pointer">' +
        '<input type="checkbox" id="rpt-tax-toggle"' + (taxSettings.enabled?' checked':'') +
          ' onchange="toggleReportTax(this.checked)">' +
        (taxSettings.enabled ? '📦 Including Tax' : '❌ No Tax') +
        '<span class="cost-tax-rate-wrap">(Rate: <input type="number" id="rpt-tax-rate"' +
          ' class="cost-rate-input" value="' + taxSettings.rate + '" min="0" max="99"' +
          ' onchange="updateTaxRate(this.value)">%)</span>' +
      '</label>' +
    '</div>' +
    '<table class="inv-table">' +
      '<thead><tr><th>#</th><th>Item Description</th><th>Priority</th><th>Est. Cost</th></tr></thead>' +
      '<tbody>' + rowsHTML + '</tbody>' +
      '<tfoot>' +
        '<tr class="inv-subtotal"><td colspan="3">Subtotal</td><td>' + fmt(subtotal) + '</td></tr>' +
        (taxSettings.enabled ? '<tr class="inv-tax"><td colspan="3">HST / Tax (' + taxSettings.rate + '%)</td><td>' + fmt(taxAmt) + '</td></tr>' : '') +
        '<tr class="inv-total"><td colspan="3"><strong>Total Estimated Repairs</strong></td><td><strong>' + fmt(total) + '</strong></td></tr>' +
      '</tfoot>' +
    '</table>';
}

function toggleReportTax(enabled) { taxSettings.enabled=enabled; saveTaxSettings(); buildReport(); }
function updateTaxRate(val)        { taxSettings.rate=parseFloat(val)||13; saveTaxSettings(); }

// ───────────────────────────────────────────────────────────────
// §21  CUSTOM SECTIONS & ITEMS
// ───────────────────────────────────────────────────────────────
const LS_CUSTOM = 'sansoon_custom_v1';
let customSections = [];

function loadCustomSections() {
  try { const r=localStorage.getItem(LS_CUSTOM); if(r) customSections=JSON.parse(r); } catch(e) {}
}
function saveCustomSections() {
  try { localStorage.setItem(LS_CUSTOM, JSON.stringify(customSections)); } catch(e) {}
}
function injectCustomSectionIntoDB(cs) {
  if (DB.find(c => c.id===cs.id)) return;
  DB.push({ id:cs.id, label:cs.label, icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    subcategories:[{ id:cs.id+'-sub', label:cs.label, items:cs.items }] });
  cs.items.forEach(it => {
    if (!State.items[it.id])
      State.items[it.id]={ status:null, finding:{ active:false, note:'', priority:null, photo:null, cost:'' } };
  });
}
function addCustomSection(label) {
  const id = 'custom-' + Date.now();
  const cs = { id, label: label||'Custom Section', items:[] };
  customSections.push(cs); saveCustomSections(); injectCustomSectionIntoDB(cs);
}
function addCustomItemToSection(catId, label) {
  const itemId = 'ci-' + Date.now();
  const cat = DB.find(c => c.id===catId);
  if (!cat) return;
  let customSub = cat.subcategories.find(s => s.id===catId+'-custom');
  if (!customSub) {
    customSub = { id:catId+'-custom', label:'Custom Items', items:[] };
    cat.subcategories.push(customSub);
  }
  customSub.items.push({ id:itemId, label:label||'Custom item' });
  State.items[itemId]={ status:null, finding:{ active:false, note:'', priority:null, photo:null, cost:'' } };
  const cs = customSections.find(s => s.id===catId);
  if (cs) { cs.items.push({ id:itemId, label:label||'Custom item' }); saveCustomSections(); }
}

function appendAddItemButton(catId) {
  const acc = $('accordion');
  if (!acc) return;
  const existing = $('add-item-btn');
  if (existing) existing.remove();
  const btn = document.createElement('button');
  btn.id='add-item-btn'; btn.className='add-item-btn';
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:6px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add Custom Item to This Section';
  btn.addEventListener('click', () => {
    const label = prompt('Enter item description:');
    if (!label) return;
    addCustomItemToSection(catId, label);
    buildSearchIndex(); renderAccordion(); appendAddItemButton(catId); showToast('Item added');
  });
  // FIX #4: Insert at top of accordion (prepend), not bottom
  if (acc.firstChild) {
    acc.insertBefore(btn, acc.firstChild);
  } else {
    acc.appendChild(btn);
  }
}

// ── Inline label edit ─────────────────────────────────────────
function enableInlineEdit(itemId, labelEl) {
  if (!labelEl) return;
  const current = labelEl.textContent;
  const input = document.createElement('input');
  input.type='text'; input.value=current; input.className='inline-edit-input';
  labelEl.replaceWith(input); input.focus(); input.select();
  const commit = () => {
    const newLabel = input.value.trim() || current;
    DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(it => {
      if (it.id===itemId) it.label=newLabel;
    })));
    buildSearchIndex(); renderAccordion(); appendAddItemButton(Nav.activeCategory);
  };
  input.addEventListener('blur', commit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.value.trim() === '') {
        // Only delete if it's a custom item (ci- prefix)
        if (itemId.startsWith('ci-')) {
          input.blur();
          DB.forEach(cat => cat.subcategories.forEach(sub => {
            const idx = sub.items.findIndex(it => it.id === itemId);
            if (idx !== -1) sub.items.splice(idx, 1);
          }));
          customSections.forEach(cs => {
            const idx = cs.items.findIndex(it => it.id === itemId);
            if (idx !== -1) cs.items.splice(idx, 1);
          });
          saveCustomSections();
          delete State.items[itemId];
          buildSearchIndex();
          document.activeElement?.blur();
          renderAccordion();
          appendAddItemButton(Nav.activeCategory);
          showToast('Item deleted');
          return;
        } else {
          // Default items - revert to original, don't delete
          input.value = current;
          input.blur();
          return;
        }
      }
      commit();
    }
    if (e.key === 'Escape') { input.value = current; input.blur(); }
  });
}


// ───────────────────────────────────────────────────────────────
// §22  REPHRASE (simplified - only 10-12 most common terms)
// ───────────────────────────────────────────────────────────────
const REPHRASE_MAP = [
  [/\bgood\b/gi,               'satisfactory'],
  [/\bbad\b/gi,               'deteriorated'],
  [/\bbroken\b/gi,            'inoperable'],
  [/\bcracked\b/gi,           'exhibits visible cracking'],
  [/\bleaking\b/gi,           'exhibits active fluid ingress'],
  [/\brust\b/gi,              'ferrous corrosion'],
  [/\bworn\b/gi,              'shows significant wear'],
  [/\bmissing\b/gi,           'absent — immediate attention required'],
  [/\bok\b/gi,                'within acceptable survey parameters'],
  [/\bnot working\b/gi,       'non-functional — recommend immediate attention'],
  [/\bneeds work\b/gi,        'requires remediation'],
  [/\breplace\b/gi,           'renew or replace at earliest opportunity'],
];

function rephraseNote(text) {
  let out = text.trim();
  if (!out) return out;
  REPHRASE_MAP.forEach(([rx,rep]) => { out = out.replace(rx, rep); });
  out = out.charAt(0).toUpperCase() + out.slice(1);
  if (!/[.!?]$/.test(out)) out += '.';
  return out;
}

function handleRephrase() {
  const ta = $('tray-note');
  if (!ta || !ta.value.trim()) { showToast('Type a note first'); return; }
  const rephrased = rephraseNote(ta.value);
  ta.value = rephrased;
  if (_currentTrayId) State.items[_currentTrayId].finding.note = rephrased;
  ta.focus(); showToast('Note rephrased ✨');
}

// ───────────────────────────────────────────────────────────────
// §23  AUTOSAVE — targeted field listeners only
//       No broad container listeners. No DOM rebuilds on save.
// ───────────────────────────────────────────────────────────────
function attachAutosaveListeners() {
  // Only the named splash/intake form fields get autosave listeners.
  // Checklist item status/flag changes call saveAllProgress() directly
  // at the point of mutation (cycleStatus, toggleFinding, saveTray, etc.).
  const FIELD_IDS = [
    'v-name','v-hin','v-ref','v-surveyor','v-client',
    'v-date','v-type','v-location','v-weather','v-scope'
  ];
  FIELD_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    // Use the right event for each element type
    const evt = (el.tagName === 'SELECT' || el.type === 'date' || el.type === 'checkbox')
      ? 'change' : 'input';
    el.addEventListener(evt, saveAllProgress);
  });
}

// ───────────────────────────────────────────────────────────────
// §24  BOOTSTRAP
// ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // ── Access gate setup ────────────────────────────────────────
  checkAccessGate();
  const _agBtn   = document.getElementById('ag-verify-btn');
  const _agInput = document.getElementById('ag-key-input');
  if (_agBtn)   _agBtn.addEventListener('click', verifyAccessKey);
  if (_agInput) _agInput.addEventListener('keydown', e => { if (e.key === 'Enter') verifyAccessKey(); });

  loadQuickInsert();
  loadCustomSections();
  loadTaxSettings();
  customSections.forEach(injectCustomSectionIntoDB);
  buildSearchIndex();
  initState();
  $('v-date').valueAsDate = new Date();

  // ── Restore saved draft (overwrites initState defaults if a draft exists) ──
  const _hadDraft = loadAllProgress();
  // FIX: Silent auto-restore — pop-up notification removed so navigation is uninterrupted
  // if (_hadDraft) {
  //   showToast('Draft restored ✓');
  // }

  // ── Autosave: targeted input listeners on intake form only ──
  // (No broad container listeners — these were causing the infinite loop)
  attachAutosaveListeners();

  document.querySelectorAll('.filter-pill').forEach(b =>
    b.addEventListener('click', () => setFilter(b.dataset.filter)));

  // FIX #2: Removed pointerdown stopPropagation which was causing double-click bug.
  // A single click now immediately calls Nav.back().
  $('back-btn').addEventListener('click', () => Nav.back());

  const _hubBtn = $('hub-btn');
  if (_hubBtn) {
    _hubBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (Nav.current()==='category') Nav.lastVisitedSection = Nav.activeCategory;
      Nav.noteTrayOpen=false; Nav.openAccordion=null;
      if (Nav.current()==='category') Nav.stack.pop();
      showView(Nav.stack[Nav.stack.length-1]); refreshAll();
    });
    _hubBtn.addEventListener('pointerdown', e => e.stopPropagation());
  }

  $('btn-report').addEventListener('click', openReport);
  // 'View Report as PDF' calls generatePDF('preview')
  // FIX #1: Wire "View Report as PDF" button → calls generatePDF('preview')
  const _btnViewPdf = $('btn-view-pdf');
  if (_btnViewPdf) _btnViewPdf.addEventListener('click', () => generatePDF('preview'));
  // FIX #6: Download PDF button shows "Download Only" / "Yes, Complete" modal
  $('btn-pdf').addEventListener('click', () => generatePDF('download'));
  $('btn-refresh-rpt').addEventListener('click', buildReport);
  $('btn-back-survey').addEventListener('click', () => {
    if (Nav.current()==='report' && Nav.stack.length>1) Nav.stack.pop();
    showView(Nav.stack[Nav.stack.length-1]); refreshAll();
  });
  $('btn-reset').addEventListener('click', resetAll);

  $('btn-start').addEventListener('click', () => {
    const name=$('v-name').value.trim(), surv=$('v-surveyor').value.trim();
    if (!name||!surv) { showToast('⚠️  Enter Vessel Name and Surveyor Name'); return; }
    // Auto-save project with status "in-progress"
    saveProject().then(() => {
      Nav.push('hub'); showView('hub'); renderHub(); renderProgress();
    }).catch(() => {
      Nav.push('hub'); showView('hub'); renderHub(); renderProgress();
    });
  });

  // Dashboard buttons in topbar and hub
  const _dashBtn = document.getElementById('btn-dashboard');
  const _hubDashBtn = document.getElementById('btn-hub-dashboard');
  
  const navigateToDashboard = () => {
    Nav.stack = ['dashboard'];
    showView('dashboard');
    renderDashboard();
  };

  if (_dashBtn) _dashBtn.addEventListener('click', navigateToDashboard);
  if (_hubDashBtn) _hubDashBtn.addEventListener('click', navigateToDashboard);

  // Tray events
  $('tray-note').addEventListener('keydown', e => {
    if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); closeNoteTray(); refreshAll(); }
  });
  $('tray-note').addEventListener('input', () => {
    if (!_currentTrayId) return;
    State.items[_currentTrayId].finding.note = $('tray-note').value;
    saveAllProgress();
  });
  $('tray-save-btn').addEventListener('click',  () => { closeNoteTray(); refreshAll(); });
  $('tray-close-btn').addEventListener('click', () => { closeNoteTray(); refreshAll(); });
  $('tray-overlay').addEventListener('click',   () => { closeNoteTray(); refreshAll(); });

 // On desktop the tray IS the backdrop; close only when clicking the backdrop itself,
  // not when the click originates from inside the card content.
  const _noteTray = $('note-tray');
  if (_noteTray) {
    _noteTray.addEventListener('click', e => {
      if (e.target === _noteTray) { closeNoteTray(); refreshAll(); }
    });
  }
  document.querySelectorAll('.tray-pri-btn').forEach(b =>
    b.addEventListener('click', () => setTrayPriority(b.dataset.pri)));
  $('photo-add-btn').addEventListener('click', triggerPhotoUpload);
  $('photo-file-input').addEventListener('change', function() { handlePhotoInput(this); });
  const rpBtn = $('rephrase-btn');
  if (rpBtn) rpBtn.addEventListener('click', handleRephrase);
  
  // Quick Insert save button kept but not auto-rendered
  const qiBtn = $('qi-save-btn');
  // FIX: Commented out to prevent ReferenceError since handleSaveToQuickInsert is not yet defined
  // if (qiBtn) qiBtn.addEventListener('click', handleSaveToQuickInsert); 
  
  $('vessel-photo-input').addEventListener('change', function() { handleVesselPhoto(this); });

  // Drag scroll on catbar
  const _catbar = document.querySelector('.catbar');
  enableDragScroll(_catbar);

  // ── CATBAR SCROLL ARROW BUTTONS ───────────────────────────────
  const _catScrollLeft  = $('catbar-scroll-left');
  const _catScrollRight = $('catbar-scroll-right');
  if (_catScrollLeft && _catbar)
    _catScrollLeft.addEventListener('click', () => _catbar.scrollBy({ left: -250, behavior: 'smooth' }));
  if (_catScrollRight && _catbar)
    _catScrollRight.addEventListener('click', () => _catbar.scrollBy({ left: 250, behavior: 'smooth' }));

  // FIX #3: Desktop/tablet row click cycles status (not on touch-only devices)
  const _accordion = $('accordion');
  if (_accordion) {
    _accordion.addEventListener('click', e => {
      // Only on devices that support hover (desktop/tablet)
      if (!window.matchMedia('(hover: hover)').matches) return;
      const row = e.target.closest('.item-row');
      if (!row) return;
      // Don't trigger if clicking a button inside the row
      if (e.target.closest('button') || e.target.closest('input')) return;
      const itemId = row.dataset.itemId;
      if (itemId) cycleStatus(itemId);
    });
  }

  // Search
  initSearchBar();
  initMobileSearch();

  // Prevent search results from blocking back btn
  const _sr = $('global-search-results');
  if (_sr) _sr.addEventListener('pointerdown', e => e.stopPropagation());

    // ── DASHBOARD FIRST FLOW ────────────────────────────────────
    // Check if surveyor profile exists and access gate is passed
    const hasProfile = localStorage.getItem(PROFILE_LS_KEY);
    const gatePassed = document.getElementById('access-gate') && 
                       document.getElementById('access-gate').style.display === 'none';

    if (hasProfile && gatePassed) {
      // Profile exists and gate passed → show dashboard
      Nav.stack = ['dashboard'];
      showView('dashboard');
      renderDashboard();
    } else if (!hasProfile && gatePassed) {
      // Gate passed but no profile → show profile modal (it will redirect to dashboard after save)
      showSurveyorProfileModal();
    } else {
      // Access gate still showing or no profile
      showView('splash');
      renderCategoryBar();
      renderProgress();
      refreshAll();
    }

}); // ← closes DOMContentLoaded
   
