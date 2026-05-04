// ═══════════════════════════════════════════════════════════════
//  DATA — Add/edit missions here
//  Each DLC has: id, name, missions[]
//  Each mission: name, date, thumb (URL or local path), tags[], brief, civilians[], suspects[], evidence[]
// ═══════════════════════════════════════════════════════════════
function mission(name, tags = [], options = {}) {
  return {
    name,
    date: options.date || "",
    thumb: options.thumb || "",
    tags,
    brief: options.brief || "",
    civilians: options.civilians || [],
    suspects: options.suspects || [],
    evidence: options.evidence || []
  };
}

const DATA = [
  {
    id: "ready_or_not",
    name: "Ready Or Not",
    missions: [
      mission("Thank You, Come Again", ["robbery", "gang"], { date: "February 3, 2025", thumb: "assets/missions/4U_Gas_Station_location.webp" }),
      mission("23 Megabytes a Second", ["cybercrime"], { date: "December 8, 2025", thumb: "assets/missions/23_Megabytes_a_Second.webp" }),
      mission("Twisted Nerve", ["drugs"], { date: "September 29, 2025", thumb: "assets/missions/Twited_nerve.webp" }),
      mission("The Spider", ["exploitation"], { date: "December 21, 2025", thumb: "assets/missions/The_spider.webp" }),
      mission("A Lethal Obsession", ["domestic"], { date: "August 20, 2025", thumb: "assets/missions/A_lethal_obsession.webp" }),
      mission("Ides of March", ["terrorism"], { date: "October 1, 2025", thumb: "assets/missions/Ides_of_march.webp" }),
      mission("Sinuous Trail", ["cybercrime"], { date: "December 15, 2025", thumb: "assets/missions/Sinuous_Trail.webp" }),
      mission("Ends of the Earth", ["hostage"], { date: "December 3, 2025", thumb: "assets/missions/End_of_the_earth.webp" }),
      mission("Greased Palms", ["trafficking"], { date: "October 25, 2025", thumb: "assets/missions/Greased_Palms.webp" }),
      mission("Valley of the Dolls", ["exploitation"], { date: "January 5, 2026", thumb: "assets/missions/Valley_of_the_Dolls.webp" }),
      mission("Elephant", ["active-shooter"], { date: "October 17, 2025", thumb: "assets/missions/Elephant.webp" }),
      mission("Rust Belt", ["trafficking"], { date: "October 15, 2025", thumb: "assets/missions/Rust_Belt.webp" }),
      mission("Sins of the Father", ["terrorism"], { date: "October 2, 2025", thumb: "assets/missions/Sins_of_the_father.webp" }),
      mission("Neon Tomb", ["terrorism"], { date: "April 19, 2025", thumb: "assets/missions/Neon_tomb.webp" }),
      mission("Buy Cheap, Buy Twice", ["robbery"], { date: "February 10, 2026", thumb: "assets/missions/Buy_cheap_buy_twice.webp" }),
      mission("Carriers of the Vine", ["cult"], { date: "June 1, 2025", thumb: "assets/missions/Carrieres_of_the_Vine.webp" }),
      mission("Relapse", ["hostage"], { date: "May 8, 2025", thumb: "assets/missions/Relapse.webp" }),
      mission("Hide and Seek", ["trafficking"], { date: "February 18, 2026", thumb: "assets/missions/Hide_and_seek.webp" })
    ]
  },
  {
    id: "home_invasion",
    name: "Home Invasion",
    missions: [
      mission("Dorms", ["eviction"], { date: "February 20, 2026", thumb: "assets/missions/Dorms.webp" }),
      mission("Narcos", ["drugs", "gang"], { date: "February 25, 2026", thumb: "assets/missions/Narcos.webp" }),
      mission("Lawmaker", ["home-invasion"], { date: "February 19, 2026", thumb: "assets/missions/Lawmaker.webp" })
    ]
  },
  {
    id: "dark_waters",
    name: "Dark Waters",
    missions: [
      mission("Mirage at the Sea", ["maritime"], { date: "September 15, 2027", thumb: "assets/missions/Mirage_at_Sea.webp" }),
      mission("Leviathan", ["maritime"], { date: "October 21, 2027", thumb: "assets/missions/Leviathan.webp" }),
      mission("3 Letter Triad", ["organized-crime"], { date: "November 5, 2027", thumb: "assets/missions/3_Letter_Triad.webp" })
    ]
  },
  {
    id: "los_suenos",
    name: "Los Sueños",
    missions: [
      mission("Hunger Strike", ["gang"], { date: "October 6, 2025", thumb: "assets/missions/Hunger_Strike.webp" }),
      mission("Stolen Valor", ["kidnapping"], { date: "September 30, 2025", thumb: "assets/missions/Stolen_Valor.webp" })
    ]
  },
  {
    id: "boiling_point",
    name: "Boiling Point",
    missions: [
      mission("No Good Deed", ["terrorism"], { date: "September 3, 2028", thumb: "assets/missions/No_good_deed.webp" }),
      mission("All Gods Burn", ["robbery", "terrorism"], { date: "September 4, 2028", thumb: "assets/missions/All_gods_burn.webp" }),
      mission("A New America", ["terrorism"], { date: "September 4, 2028", thumb: "assets/missions/A_New_America.webp" })
    ]
  },
  {
    id: "others",
    name: "Others",
    missions: [
      mission("SecretEnd - Prison", ["secret"], { date: "Après le 4 septembre 2028", thumb: "assets/missions/Secret_prison.webp"}),
      mission("SecretEnd - Appart", ["secret"], { date: "Après le 4 septembre 2028" }),
      mission("Commissariat", ["secret"], { thumb: "assets/missions/LSPD_HQ.webp" })
    ]
  }
];

const BASE_MISSION_TAGS = new Map(
  DATA.flatMap(dlc => dlc.missions.map(mission => [`${dlc.id}::${mission.name}`, [...(mission.tags || [])]]))
);

// ═══════════════════════════════════════════════════════════════
//  RENDER
// ═══════════════════════════════════════════════════════════════
const modalBg = document.getElementById('modal-bg');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalMeta = document.getElementById('modal-meta');
const modalGrid = document.getElementById('modal-grid');
const intelTitle = document.getElementById('intel-title');
const missionNotes = document.getElementById('mission-notes');
const evidenceList = document.getElementById('evidence-list');
const evidencePreview = document.getElementById('evidence-preview');
const quickLinks = document.getElementById('quick-links');
const blockLibrary = document.getElementById('block-library');
const editorBlockLibrary = document.getElementById('editor-block-library');
const deleteModeToggle = document.getElementById('delete-mode-toggle');
const heroImg = document.getElementById('hero-img');
const searchInput = document.getElementById('search');
const board = document.getElementById('board');
const noResults = document.getElementById('no-results');
const timelineScroll = document.getElementById('timeline-scroll');
const timeline = document.getElementById('timeline');
const timelineScale = document.getElementById('timeline-scale');
const peopleGrid = document.getElementById('people-grid');
const filterBg = document.getElementById('filter-bg');
const filterPanel = document.getElementById('filter-panel');
const filterBtn = document.getElementById('filter-btn');
const filterClose = document.getElementById('filter-close');
const filterTags = document.getElementById('filter-tags');
const filterApply = document.getElementById('filter-apply');
const filterReset = document.getElementById('filter-reset');
const filterSummary = document.getElementById('filter-summary');
const filterModeInputs = document.querySelectorAll('input[name="filter-mode"]');
const settingsBg = document.getElementById('settings-bg');
const settingsPanel = document.getElementById('settings-panel');
const settingsBtn = document.getElementById('settings-btn');
const settingsClose = document.getElementById('settings-close');
const settingsSummary = document.getElementById('settings-summary');
const tagSummaryList = document.getElementById('tag-summary-list');
const settingsTabs = document.querySelectorAll('.settings-tab[data-settings-page]');
const adminSessionSummary = document.getElementById('admin-session-summary');
const adminLoginForm = document.getElementById('admin-login-form');
const adminPassword = document.getElementById('admin-password');
const adminLoginSubmit = document.getElementById('admin-login-submit');
const adminLoginMessage = document.getElementById('admin-login-message');
const adminSessionPanel = document.getElementById('admin-session-panel');
const adminLogout = document.getElementById('admin-logout');
const confirmBg = document.getElementById('confirm-bg');
const confirmDialog = document.getElementById('confirm-dialog');
const confirmMessage = document.getElementById('confirm-message');
const confirmCancel = document.getElementById('confirm-cancel');
const confirmOk = document.getElementById('confirm-ok');
const editBg = document.getElementById('edit-bg');
const editDialog = document.getElementById('edit-dialog');
const editInput = document.getElementById('edit-input');
const editColorGrid = document.getElementById('edit-color-grid');
const editColorPicker = document.getElementById('edit-color-picker');
const editColorValue = document.getElementById('edit-color-value');
const editColorSave = document.getElementById('edit-color-save');
const editCustomColorGrid = document.getElementById('edit-custom-color-grid');
const customPaletteNote = document.getElementById('custom-palette-note');
const editCancel = document.getElementById('edit-cancel');
const editOk = document.getElementById('edit-ok');
const blockCustomBg = document.getElementById('block-custom-bg');
const blockCustomDialog = document.getElementById('block-custom-dialog');
const blockCustomTitle = document.getElementById('block-custom-title');
const blockCustomColumn = document.getElementById('block-custom-column');
const blockCustomText = document.getElementById('block-custom-text');
const blockCustomSeparator = document.getElementById('block-custom-separator');
const blockBorderColor = document.getElementById('block-border-color');
const blockBgColor = document.getElementById('block-bg-color');
const blockTitleColor = document.getElementById('block-title-color');
const blockTextSize = document.getElementById('block-text-size');
const blockTextBold = document.getElementById('block-text-bold');
const blockTextItalic = document.getElementById('block-text-italic');
const blockTextUnderline = document.getElementById('block-text-underline');
const blockTextColor = document.getElementById('block-text-color');
const blockSeparatorColor = document.getElementById('block-separator-color');
const blockSeparatorOrientation = document.getElementById('block-separator-orientation');
const blockCustomCancel = document.getElementById('block-custom-cancel');
const blockCustomOk = document.getElementById('block-custom-ok');
const TAG_STORAGE_KEY = 'ron-lore-tags-v1';
const TAG_COLOR_STORAGE_KEY = 'ron-lore-tag-colors-v1';
const CUSTOM_TAG_COLORS_STORAGE_KEY = 'ron-lore-custom-tag-colors-v1';
const MODAL_LAYOUT_STORAGE_KEY = 'ron-lore-modal-layouts-v1';
const MODAL_BLOCKS_STORAGE_KEY = 'ron-lore-modal-blocks-v1';
const MISSION_DB_STORAGE_KEY = 'ron-lore-mission-db-v1';
const MISSION_DB_INDEX_STORAGE_KEY = 'ron-lore-mission-db-index-v1';
const MISSION_NOTES_STORAGE_KEY = 'ron-lore-mission-notes-v1';
const API_BASE_URL = (
  window.RON_LORE_API_BASE ||
  document.querySelector('meta[name="ron-lore-api-base"]')?.content ||
  ''
).replace(/\/$/, '');
const MAX_CUSTOM_TAG_COLORS = 12;
const COLLAPSIBLE_COLUMN_ID = 'ready_or_not';
const COLLAPSED_COLUMN_LIMIT = 3;
const TIMELINE_CARD_WIDTH = 210;
const TIMELINE_MIN_WIDTH = 1600;
const TIMELINE_MAX_ROWS = 3;
const TIMELINE_EXPANDED_VISIBLE_ROWS = 6;
const TIMELINE_STACK_GAP = 34;
const TIMELINE_ROW_HEIGHT = 58;
const TIMELINE_TOP_OFFSET = 66;
const TIMELINE_SCALES = {
  day: { label: 'day', unitWidth: 22 },
  week: { label: 'week', unitWidth: 70 },
  month: { label: 'month', unitWidth: 150 },
  year: { label: 'year', unitWidth: 260 }
};
const TAG_COLOR_OPTIONS = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#1abc9c', '#3498db', '#9b59b6', '#e84393', '#95a5a6', '#ffffff'];
const DEFAULT_TAG_COLORS = {
  gang: '#e67e22',
  terrorism: '#e74c3c',
  drugs: '#9b59b6',
  kidnapping: '#3498db',
  robbery: '#f39c12',
  cult: '#1abc9c'
};
let lastFocusedElement = null;
let lastFilterFocusedElement = null;
let lastSettingsFocusedElement = null;
let activeTagFilters = [];
let activeFilterMode = 'or';
let expandedColumns = new Set();
let expandedTimelineStacks = new Set();
let activeTimelineScale = timelineScale.value;
let activeModalEditMode = false;
let activeDeleteMode = false;
let activeModalMissionKey = '';
let activeModalMission = null;
let activeModalDlc = null;
let activeBlockTarget = null;
let editingDrag = null;
let isTimelineDragging = false;
let timelineDragStartX = 0;
let timelineDragStartScroll = 0;
let confirmResolve = null;
let lastConfirmFocusedElement = null;
let editResolve = null;
let lastEditFocusedElement = null;
let activeCustomBlockTarget = null;
let lastBlockCustomFocusedElement = null;
let selectedEditColor = TAG_COLOR_OPTIONS[0];
let pendingCustomColorReplacement = '';
let isAdminAuthenticated = false;

function getApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

function hasConfiguredApiBase() {
  return Boolean(API_BASE_URL);
}

function requireAdmin() {
  return isAdminAuthenticated;
}

function setAdminLoginMessage(message = '', type = '') {
  if (!adminLoginMessage) return;
  adminLoginMessage.textContent = message;
  adminLoginMessage.classList.toggle('error', type === 'error');
  adminLoginMessage.classList.toggle('success', type === 'success');
}

function setAdminLoginLoading(isLoading) {
  if (adminLoginSubmit) {
    adminLoginSubmit.disabled = isLoading;
    adminLoginSubmit.textContent = isLoading ? 'Connexion...' : 'Connexion';
  }
  if (adminPassword) adminPassword.disabled = isLoading;
}

function updateAdminLoginUi() {
  if (adminSessionSummary) {
    if (isAdminAuthenticated) {
      adminSessionSummary.textContent = 'Mode administrateur actif';
    } else if (!hasConfiguredApiBase()) {
      adminSessionSummary.textContent = 'Web Service Render non configuré';
    } else {
      adminSessionSummary.textContent = 'Mode lecture publique';
    }
  }
  if (adminLoginForm) adminLoginForm.hidden = isAdminAuthenticated;
  if (adminSessionPanel) adminSessionPanel.hidden = !isAdminAuthenticated;
  if (adminPassword && isAdminAuthenticated) adminPassword.value = '';
  if (!isAdminAuthenticated && !hasConfiguredApiBase()) {
    setAdminLoginMessage('Renseigne l’URL publique du Web Service Render dans la meta ron-lore-api-base.', 'error');
  }
}

function setAdminAuthenticated(authenticated) {
  const wasAdminAuthenticated = isAdminAuthenticated;
  isAdminAuthenticated = Boolean(authenticated);
  document.body.classList.toggle('admin-authenticated', isAdminAuthenticated);
  updateAdminLoginUi();

  if (isAdminAuthenticated && !wasAdminAuthenticated) {
    loadSavedTags();
    refreshBoardFromSearch();
    buildTimeline();
    buildPeopleBoard();
    refreshRenderedTagColors();
  }

  if (!isAdminAuthenticated && wasAdminAuthenticated) {
    resetMissionTagsToBase();
    refreshBoardFromSearch();
    buildTimeline();
    buildPeopleBoard();
    refreshRenderedTagColors();
  }

  document.querySelectorAll('[data-admin-only]').forEach(element => {
    element.hidden = !isAdminAuthenticated;
    const keepsOwnAriaState = ['editor-block-library', 'block-library', 'edit-bg', 'block-custom-bg'].includes(element.id);
    if (!isAdminAuthenticated) {
      element.setAttribute('aria-hidden', 'true');
    } else if (!keepsOwnAriaState) {
      element.removeAttribute('aria-hidden');
    }

    element.querySelectorAll('button, input, select, textarea').forEach(control => {
      control.disabled = !isAdminAuthenticated;
    });
  });

  if (!isAdminAuthenticated) {
    setModalEditMode(false);
    closeBlockLibrary();
    if (document.querySelector('#settings-page-tags.active')) showSettingsPage('tuto');
  }

  if (activeModalMission && activeModalDlc) {
    const modalTags = modalMeta.querySelector('.modal-tags');
    if (modalTags) renderTagEditor(modalTags, activeModalMission, activeModalDlc);
    if (isAdminAuthenticated) {
      restoreModalBlocks();
      const savedLayout = getSavedModalLayout();
      if (savedLayout) applySavedModalLayout(savedLayout);
    }
    renderIntelPanel(activeModalMission, activeModalDlc);
  }
}

async function refreshAdminSession() {
  if (!hasConfiguredApiBase()) {
    setAdminAuthenticated(false);
    return;
  }

  try {
    const response = await fetch(getApiUrl('/auth/session'), {
      credentials: 'include',
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Admin session unavailable');
    const session = await response.json();
    setAdminAuthenticated(session.authenticated === true);
  } catch {
    setAdminAuthenticated(false);
  }
}

async function loginAdmin(password) {
  if (!hasConfiguredApiBase()) {
    throw new Error('URL du Web Service Render non configurée.');
  }

  const response = await fetch(getApiUrl('/auth/login'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password })
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Mot de passe incorrect.');
    }
    if (response.status === 404) {
      throw new Error('Route auth introuvable. Vérifie que l’URL pointe vers le Web Service Render, pas le Static Site.');
    }
    throw new Error('Connexion impossible. Vérifie l’URL du Web Service Render et la configuration CORS.');
  }

  const session = await response.json();
  setAdminAuthenticated(session.authenticated === true);
}

async function logoutAdmin() {
  try {
    await fetch(getApiUrl('/auth/logout'), {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' }
    });
  } finally {
    setAdminAuthenticated(false);
    setAdminLoginMessage('Session administrateur fermée.', 'success');
  }
}

function clearElement(element) {
  element.replaceChildren();
}

function makeTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function trapFocus(event, container) {
  if (event.key !== 'Tab') return false;

  const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return false;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
    return true;
  }
  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
    return true;
  }
  return false;
}

function normalizeTagClass(tag) {
  return String(tag || '').toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

function makeTag(tag) {
  const tagElement = makeTextElement('span', 'tag', tag);
  const tagClass = normalizeTagClass(tag);
  if (tagClass) tagElement.classList.add(tagClass);
  applyTagColor(tagElement, tag);
  return tagElement;
}

function applyTagColor(element, tag) {
  const color = getTagColor(tag);
  if (!color) return;
  element.dataset.color = 'custom';
  element.style.setProperty('--tag-color', color);
}

function refreshRenderedTagColors() {
  document.querySelectorAll('.tag').forEach(tagElement => {
    const tagText = tagElement.querySelector('span')?.textContent || tagElement.textContent;
    applyTagColor(tagElement, normalizeTagValue(tagText.replace('×', '')));
  });
  document.querySelectorAll('.filter-tag input').forEach(input => {
    applyTagColor(input.closest('.filter-tag'), input.value);
  });
}

function normalizeTagValue(tag) {
  return String(tag || '').trim().toLowerCase().replace(/\s+/g, '-');
}

function getMissionKey(dlc, mission) {
  return `${dlc.id}::${mission.name}`;
}

function getSavedTagMap() {
  try {
    return JSON.parse(localStorage.getItem(TAG_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function getSavedTagColorMap() {
  try {
    return JSON.parse(localStorage.getItem(TAG_COLOR_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveTagColorMap(colors) {
  if (!requireAdmin()) return;
  try {
    localStorage.setItem(TAG_COLOR_STORAGE_KEY, JSON.stringify(colors));
  } catch {
    // Color edits still work for the current session if storage is unavailable.
  }
}

function getTagColor(tag) {
  return (requireAdmin() ? getSavedTagColorMap()[tag] : '') || DEFAULT_TAG_COLORS[tag] || '';
}

function setTagColor(tag, color) {
  if (!requireAdmin()) return;
  const colors = getSavedTagColorMap();
  colors[tag] = color;
  saveTagColorMap(colors);
}

function renameTagColor(oldTag, newTag) {
  if (!requireAdmin()) return;
  const colors = getSavedTagColorMap();
  if (colors[oldTag]) {
    colors[newTag] = colors[oldTag];
    delete colors[oldTag];
    saveTagColorMap(colors);
  }
}

function deleteTagColor(tag) {
  if (!requireAdmin()) return;
  const colors = getSavedTagColorMap();
  delete colors[tag];
  saveTagColorMap(colors);
}

function getCustomTagColors() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_TAG_COLORS_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCustomTagColors(colors) {
  if (!requireAdmin()) return;
  try {
    localStorage.setItem(CUSTOM_TAG_COLORS_STORAGE_KEY, JSON.stringify(colors));
  } catch {
    // Custom palette edits still work for the current session if storage is unavailable.
  }
}

function rememberCustomTagColor(color) {
  if (!requireAdmin()) return 'blocked';
  const normalizedColor = String(color || '').toLowerCase();
  if (!/^#[0-9a-f]{6}$/.test(normalizedColor)) return 'invalid';
  if (TAG_COLOR_OPTIONS.map(option => option.toLowerCase()).includes(normalizedColor)) return 'preset';

  const colors = getCustomTagColors().filter(existing => existing.toLowerCase() !== normalizedColor);
  if (colors.length < MAX_CUSTOM_TAG_COLORS) {
    colors.push(normalizedColor);
    saveCustomTagColors(colors);
    return 'saved';
  }

  pendingCustomColorReplacement = normalizedColor;
  return 'full';
}

function replaceCustomTagColor(index, color) {
  if (!requireAdmin()) return '';
  const colors = getCustomTagColors();
  colors[index] = color;
  saveCustomTagColors(colors.slice(0, MAX_CUSTOM_TAG_COLORS));
  pendingCustomColorReplacement = '';
  return colors[index];
}

function loadSavedTags() {
  if (!requireAdmin()) return;
  const savedTags = getSavedTagMap();
  DATA.forEach(dlc => {
    dlc.missions.forEach(mission => {
      const tags = savedTags[getMissionKey(dlc, mission)];
      if (Array.isArray(tags)) mission.tags = tags;
    });
  });
}

function resetMissionTagsToBase() {
  DATA.forEach(dlc => {
    dlc.missions.forEach(mission => {
      mission.tags = [...(BASE_MISSION_TAGS.get(getMissionKey(dlc, mission)) || [])];
    });
  });
}

function saveMissionTags(dlc, mission) {
  if (!requireAdmin()) return;
  const savedTags = getSavedTagMap();
  savedTags[getMissionKey(dlc, mission)] = mission.tags || [];
  try {
    localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(savedTags));
  } catch {
    // Local edits still work for the current session if storage is unavailable.
  }
  if (activeModalMissionKey === getMissionKey(dlc, mission)) syncActiveMissionDb();
}

function getMissionDbMap() {
  try {
    return JSON.parse(localStorage.getItem(MISSION_DB_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveMissionDbMap(dbMap) {
  if (!requireAdmin()) return;
  try {
    localStorage.setItem(MISSION_DB_STORAGE_KEY, JSON.stringify(dbMap));
    localStorage.setItem(MISSION_DB_INDEX_STORAGE_KEY, JSON.stringify({
      updatedAt: new Date().toISOString(),
      missions: Object.values(dbMap)
    }));
  } catch {
    // Mission DB generation still works for the current session if storage is unavailable.
  }
}

function getSectionReadableTitle(section) {
  return section.querySelector('.section-header')?.textContent?.trim() || section.dataset.sectionId || '';
}

function getMissionLayoutSnapshot() {
  return [...modalGrid.querySelectorAll(':scope > .section')].map(section => ({
    id: section.dataset.sectionId,
    title: getSectionReadableTitle(section),
    kind: section.classList.contains('custom-section') ? 'custom' : 'permanent',
    style: getElementStyleSnapshot(section),
    custom: getBlockCustomData(section)
  }));
}

function getVisualBlocksSnapshot() {
  return [...modalGrid.querySelectorAll('.custom-block')]
    .map((block, index) => {
      const data = serializeCustomBlock(block);
      if (!data) return null;
      return {
        id: `block-${index + 1}`,
        ...data
      };
    })
    .filter(Boolean);
}

function buildActiveMissionDb() {
  if (!activeModalMission || !activeModalDlc || !activeModalMissionKey) return null;

  return {
    schema: 'ron-lore-mission-db-v1',
    id: activeModalMissionKey,
    missionId: normalizeTagValue(activeModalMission.name),
    title: activeModalMission.name,
    dlc: {
      id: activeModalDlc.id,
      name: activeModalDlc.name
    },
    date: activeModalMission.date || '',
    tags: [...(activeModalMission.tags || [])],
    summary: activeModalMission.brief || '',
    people: {
      civilians: [...(activeModalMission.civilians || [])],
      suspects: [...(activeModalMission.suspects || [])]
    },
    evidence: [...(activeModalMission.evidence || [])],
    notes: {
      freeform: ''
    },
    visual: {
      sections: getMissionLayoutSnapshot(),
      blocks: getVisualBlocksSnapshot()
    },
    ai: {
      facts: [],
      hypotheses: [],
      questions: []
    },
    updatedAt: new Date().toISOString()
  };
}

function syncActiveMissionDb() {
  const missionDb = buildActiveMissionDb();
  if (!missionDb) return;
  const dbMap = getMissionDbMap();
  dbMap[missionDb.id] = missionDb;
  saveMissionDbMap(dbMap);
}

function getSavedModalLayouts() {
  try {
    return JSON.parse(localStorage.getItem(MODAL_LAYOUT_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveModalLayoutMap(layouts) {
  if (!requireAdmin()) return;
  try {
    localStorage.setItem(MODAL_LAYOUT_STORAGE_KEY, JSON.stringify(layouts));
  } catch {
    // Layout edits still work for the current session if storage is unavailable.
  }
}

function saveModalLayout() {
  if (!requireAdmin()) return;
  if (!activeModalMissionKey) return;
  const layouts = getSavedModalLayouts();
  layouts[activeModalMissionKey] = [...modalGrid.querySelectorAll('.section')].map(section => ({
    id: section.dataset.sectionId,
    left: section.style.left,
    top: section.style.top,
    width: section.style.width,
    minHeight: section.style.minHeight
  }));
  saveModalLayoutMap(layouts);
  syncActiveMissionDb();
}

function getSavedModalLayout() {
  if (!activeModalMissionKey) return null;
  const layout = getSavedModalLayouts()[activeModalMissionKey];
  return Array.isArray(layout) ? layout : null;
}

function deleteSavedModalLayout() {
  if (!requireAdmin()) return;
  if (!activeModalMissionKey) return;
  const layouts = getSavedModalLayouts();
  delete layouts[activeModalMissionKey];
  saveModalLayoutMap(layouts);
}

function getSavedModalBlocksMap() {
  try {
    return JSON.parse(localStorage.getItem(MODAL_BLOCKS_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveModalBlocksMap(blocks) {
  if (!requireAdmin()) return;
  try {
    localStorage.setItem(MODAL_BLOCKS_STORAGE_KEY, JSON.stringify(blocks));
  } catch {
    // Custom blocks still work for the current session if storage is unavailable.
  }
}

function getSavedModalBlocks() {
  if (!activeModalMissionKey) return null;
  return getSavedModalBlocksMap()[activeModalMissionKey] || null;
}

function deleteSavedModalBlocks() {
  if (!requireAdmin()) return;
  if (!activeModalMissionKey) return;
  const blocks = getSavedModalBlocksMap();
  delete blocks[activeModalMissionKey];
  saveModalBlocksMap(blocks);
}

function getSavedMissionNotes() {
  try {
    return JSON.parse(localStorage.getItem(MISSION_NOTES_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveMissionNote() {
  if (!activeModalMissionKey || !missionNotes) return;
  const notes = getSavedMissionNotes();
  notes[activeModalMissionKey] = missionNotes.value;
  try {
    localStorage.setItem(MISSION_NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Notes still work for the current session if storage is unavailable.
  }
}

function getAllMissionEntries() {
  return DATA.flatMap(dlc => dlc.missions.map(mission => ({ dlc, mission })));
}

function getEvidenceLabel(evidence) {
  return typeof evidence === 'string' ? evidence : evidence?.name || 'Evidence';
}

function getEvidenceDescription(evidence) {
  return typeof evidence === 'object' && evidence?.desc ? evidence.desc : '// Aucun détail supplémentaire';
}

function renderEvidencePreview(evidence) {
  evidencePreview.textContent = evidence ? getEvidenceDescription(evidence) : '// Aucune preuve sélectionnée';
}

function renderEvidenceViewer(mission) {
  clearElement(evidenceList);
  const evidence = mission.evidence || [];
  if (evidence.length === 0) {
    evidenceList.appendChild(makeTextElement('div', 'intel-empty', '// Aucune preuve enregistrée'));
    renderEvidencePreview(null);
    return;
  }

  evidence.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'evidence-card';
    button.textContent = getEvidenceLabel(item);
    button.addEventListener('click', () => {
      evidenceList.querySelectorAll('.evidence-card').forEach(card => card.classList.remove('active'));
      button.classList.add('active');
      renderEvidencePreview(item);
    });
    evidenceList.appendChild(button);
    if (index === 0) {
      button.classList.add('active');
      renderEvidencePreview(item);
    }
  });
}

function makeQuickLink(label, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'quick-link';
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

function renderQuickLinks(mission, dlc) {
  clearElement(quickLinks);
  const links = [];
  const missionTags = new Set((mission.tags || []).map(tag => tag.toLowerCase()));

  if (missionTags.size > 0) {
    getAllMissionEntries()
      .filter(entry => entry.mission !== mission)
      .filter(entry => (entry.mission.tags || []).some(tag => missionTags.has(tag.toLowerCase())))
      .slice(0, 5)
      .forEach(entry => {
        links.push(makeQuickLink(`Mission liée: ${entry.mission.name}`, () => openModal(entry.mission, entry.dlc)));
      });
  }

  (mission.civilians || []).slice(0, 3).forEach(person => {
    links.push(makeQuickLink(`Victime: ${person.name}`, () => {
      evidencePreview.textContent = person.desc || '// Aucun détail supplémentaire';
    }));
  });

  (mission.suspects || []).slice(0, 3).forEach(person => {
    links.push(makeQuickLink(`Suspect: ${person.name}`, () => {
      evidencePreview.textContent = person.desc || '// Aucun détail supplémentaire';
    }));
  });

  links.push(makeQuickLink(`Colonne: ${dlc.name}`, () => {
    closeModal();
    document.querySelector(`[data-column-id="${dlc.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }));

  links.slice(0, 8).forEach(link => quickLinks.appendChild(link));
  if (quickLinks.children.length === 0) {
    quickLinks.appendChild(makeTextElement('div', 'intel-empty', '// Aucun lien rapide'));
  }
}

function renderIntelPanel(mission, dlc) {
  intelTitle.textContent = mission.name;
  const savedNotes = getSavedMissionNotes();
  missionNotes.value = savedNotes[activeModalMissionKey] || '';
  renderEvidenceViewer(mission);
  renderQuickLinks(mission, dlc);
}

function getAllTags() {
  const tags = new Set();
  DATA.forEach(dlc => {
    dlc.missions.forEach(mission => {
      (mission.tags || []).forEach(tag => tags.add(tag));
    });
  });
  return [...tags].sort((a, b) => a.localeCompare(b));
}

function getTagSummaries() {
  const summaries = new Map();
  DATA.forEach(dlc => {
    dlc.missions.forEach(mission => {
      (mission.tags || []).forEach(tag => {
        if (!summaries.has(tag)) summaries.set(tag, []);
        summaries.get(tag).push({ dlc, mission });
      });
    });
  });
  return [...summaries.entries()]
    .map(([tag, entries]) => ({ tag, entries }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

function renameTagEverywhere(oldTag, newTag) {
  if (!requireAdmin()) return false;
  const normalizedNewTag = normalizeTagValue(newTag);
  if (!normalizedNewTag || normalizedNewTag === oldTag) return false;

  DATA.forEach(dlc => {
    dlc.missions.forEach(mission => {
      const mergedTags = new Set((mission.tags || []).map(tag => tag === oldTag ? normalizedNewTag : tag));
      mission.tags = [...mergedTags];
      saveMissionTags(dlc, mission);
    });
  });
  renameTagColor(oldTag, normalizedNewTag);
  return true;
}

function deleteTagEverywhere(tagToDelete) {
  if (!requireAdmin()) return;
  DATA.forEach(dlc => {
    dlc.missions.forEach(mission => {
      mission.tags = (mission.tags || []).filter(tag => tag !== tagToDelete);
      saveMissionTags(dlc, mission);
    });
  });
  deleteTagColor(tagToDelete);
}

function missionMatchesTagFilters(mission) {
  if (activeTagFilters.length === 0) return true;
  const missionTags = (mission.tags || []).map(tag => tag.toLowerCase());
  return activeFilterMode === 'and'
    ? activeTagFilters.every(tag => missionTags.includes(tag.toLowerCase()))
    : activeTagFilters.some(tag => missionTags.includes(tag.toLowerCase()));
}

function makeEmptyText(text) {
  return makeTextElement('p', 'empty-text', text);
}

function makeMetaItem(label, value) {
  const item = makeTextElement('div', 'meta-item', label);
  const valueElement = makeTextElement('span', '', value);
  item.appendChild(valueElement);
  return item;
}

function closeBlockLibrary() {
  blockLibrary.classList.remove('open');
  blockLibrary.setAttribute('aria-hidden', 'true');
}

function setCustomBlocksEditable(isEditing) {
  modalGrid.querySelectorAll('.custom-block-content, .custom-block-separator-label').forEach(element => {
    element.contentEditable = String(isEditing);
    element.tabIndex = isEditing ? 0 : -1;
  });
  modalGrid.querySelectorAll('.section .section-header').forEach(header => {
    header.contentEditable = String(isEditing);
    header.tabIndex = isEditing ? 0 : -1;
  });
  modalGrid.querySelectorAll('.custom-block-field').forEach(field => {
    field.readOnly = !isEditing;
    field.tabIndex = isEditing ? 0 : -1;
  });
}

function setDeleteMode(isDeleting) {
  if (isDeleting && !requireAdmin()) return;
  activeDeleteMode = isDeleting;
  modalBg.classList.toggle('delete-mode', isDeleting);
  deleteModeToggle.classList.toggle('active', isDeleting);
  deleteModeToggle.setAttribute('aria-pressed', String(isDeleting));
}

function setModalEditMode(isEditing) {
  if (isEditing && !requireAdmin()) return;
  activeModalEditMode = isEditing;
  modal.classList.toggle('editing', isEditing);
  modalBg.classList.toggle('modal-editing', isEditing);
  editorBlockLibrary.setAttribute('aria-hidden', String(!isEditing));
  setCustomBlocksEditable(isEditing);
  if (!isEditing) {
    setDeleteMode(false);
    closeBlockLibrary();
  }
}

function snapToGrid(value) {
  return Math.max(0, Math.round(value / 8) * 8);
}

function layoutModalCanvas() {
  const savedLayout = getSavedModalLayout();
  if (savedLayout) {
    applySavedModalLayout(savedLayout);
    return;
  }

  const gridRect = modalGrid.getBoundingClientRect();
  const sections = [...modalGrid.querySelectorAll('.section')];
  const captures = sections.map(section => {
    const rect = section.getBoundingClientRect();
    return {
      section,
      left: rect.left - gridRect.left + modalGrid.scrollLeft,
      top: rect.top - gridRect.top + modalGrid.scrollTop,
      width: rect.width,
      height: rect.height
    };
  });

  sections.forEach((section, index) => {
    if (section.dataset.canvasReady) return;
    const capture = captures[index];
    section.style.left = `${capture.left}px`;
    section.style.top = `${capture.top}px`;
    section.style.width = `${Math.max(220, capture.width)}px`;
    section.style.minHeight = `${Math.max(72, capture.height)}px`;
    section.dataset.canvasReady = 'true';
  });
}

function applySavedModalLayout(layout) {
  modalGrid.classList.add('has-saved-layout');
  const layoutById = new Map(layout.map(item => [item.id, item]));
  modalGrid.querySelectorAll('.section').forEach(section => {
    const item = layoutById.get(section.dataset.sectionId);
    if (!item) return;
    section.style.left = item.left || '';
    section.style.top = item.top || '';
    section.style.width = item.width || '';
    section.style.minHeight = item.minHeight || '';
    section.dataset.canvasReady = 'true';
  });
}

function clearModalCanvasLayout() {
  modalGrid.querySelectorAll('.section, #modal-grid > .custom-block').forEach(element => {
    element.style.left = '';
    element.style.top = '';
    element.style.width = '';
    element.style.minHeight = '';
    delete element.dataset.canvasReady;
  });
  modalGrid.classList.remove('has-saved-layout');
}

function openBlockLibrary(button, section) {
  if (!requireAdmin()) return;
  activeBlockTarget = section;
  const rect = button.getBoundingClientRect();
  blockLibrary.style.left = `${Math.min(rect.left, window.innerWidth - 296)}px`;
  blockLibrary.style.top = `${Math.min(rect.bottom + 8, window.innerHeight - 170)}px`;
  blockLibrary.classList.add('open');
  blockLibrary.setAttribute('aria-hidden', 'false');
  blockLibrary.querySelector('.block-option')?.focus();
}

function addCustomBlockHandle(block) {
  if (block.querySelector(':scope > .custom-block-handle')) return;
  const handle = makeTextElement('span', 'custom-block-handle', '::');
  handle.setAttribute('aria-hidden', 'true');
  block.prepend(handle);
}

function makeTextCustomBlock(text = 'Nouveau bloc texte') {
  const block = document.createElement('div');
  block.className = 'custom-block custom-block-text';
  const content = makeTextElement('div', 'custom-block-content', text);
  content.contentEditable = 'true';
  content.spellcheck = false;
  block.appendChild(content);
  addCustomBlockHandle(block);
  return block;
}

function makeImageCustomBlock() {
  const block = document.createElement('div');
  block.className = 'custom-block custom-block-image';
  const input = document.createElement('input');
  input.className = 'custom-block-field';
  input.type = 'url';
  input.placeholder = 'URL image';
  input.autocomplete = 'off';

  const preview = makeTextElement('div', 'custom-block-image-preview', '// Aucun visuel');
  const image = makeImage('', 'Bloc image', '');
  image.style.display = 'none';
  preview.appendChild(image);

  input.addEventListener('input', () => {
    const url = input.value.trim();
    image.style.display = url ? 'block' : 'none';
    preview.firstChild.textContent = url ? '' : '// Aucun visuel';
    if (url) image.src = url;
  });

  block.append(input, preview);
  addCustomBlockHandle(block);
  return block;
}

function makeLinkCustomBlock() {
  const block = document.createElement('div');
  block.className = 'custom-block custom-block-link-block';
  const labelInput = document.createElement('input');
  labelInput.className = 'custom-block-field';
  labelInput.type = 'text';
  labelInput.placeholder = 'Texte du lien';
  labelInput.autocomplete = 'off';

  const urlInput = document.createElement('input');
  urlInput.className = 'custom-block-field';
  urlInput.type = 'url';
  urlInput.placeholder = 'URL du lien';
  urlInput.autocomplete = 'off';

  const link = document.createElement('a');
  link.className = 'custom-block-link';
  link.href = '#';
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = 'Nouveau lien';

  const syncLink = () => {
    const url = urlInput.value.trim();
    link.href = url || '#';
    link.textContent = labelInput.value.trim() || url || 'Nouveau lien';
  };
  labelInput.addEventListener('input', syncLink);
  urlInput.addEventListener('input', syncLink);

  block.append(labelInput, urlInput, link);
  addCustomBlockHandle(block);
  return block;
}

function makeSeparatorCustomBlock() {
  const block = document.createElement('div');
  block.className = 'custom-block custom-block-separator';
  const label = makeTextElement('span', 'custom-block-separator-label', 'Section');
  label.contentEditable = 'true';
  label.spellcheck = false;
  block.append(
    makeTextElement('span', 'custom-block-separator-line', ''),
    label,
    makeTextElement('span', 'custom-block-separator-line', '')
  );
  addCustomBlockHandle(block);
  return block;
}

function makeColumnCustomBlock() {
  const section = makeSection('NOUVELLE COLONNE');
  section.classList.add('custom-section');
  section.dataset.sectionId = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const header = section.querySelector('.section-header');
  header.contentEditable = 'true';
  header.spellcheck = false;
  section.querySelector('.section-body').classList.add('custom-grid-body');
  section.querySelector('.section-body').appendChild(makeEmptyText('// Dépose des blocs ici'));
  return section;
}

function getElementStyleSnapshot(element) {
  return {
    left: element.style.left,
    top: element.style.top,
    width: element.style.width,
    minHeight: element.style.minHeight
  };
}

function applyElementStyleSnapshot(element, style = {}) {
  element.style.left = style.left || '';
  element.style.top = style.top || '';
  element.style.width = style.width || '';
  element.style.minHeight = style.minHeight || '';
  if (style.left || style.top || style.width || style.minHeight) element.dataset.canvasReady = 'true';
}

function getColorValue(value, fallback = '#e74c3c') {
  return /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback;
}

function applyBlockCustomData(element, data = {}) {
  if (element.classList.contains('section')) {
    const header = element.querySelector('.section-header');
    if (data.borderColor) {
      element.dataset.borderColor = data.borderColor;
      element.style.borderColor = data.borderColor;
    }
    if (data.bgColor) {
      element.dataset.bgColor = data.bgColor;
      element.style.background = data.bgColor;
    }
    if (data.titleColor && header) {
      element.dataset.titleColor = data.titleColor;
      header.style.color = data.titleColor;
    }
  } else if (element.classList.contains('custom-block-text')) {
    const content = element.querySelector('.custom-block-content');
    element.dataset.textSize = data.textSize || element.dataset.textSize || 'text';
    element.dataset.bold = String(data.bold === true || data.bold === 'true');
    element.dataset.italic = String(data.italic === true || data.italic === 'true');
    element.dataset.underline = String(data.underline === true || data.underline === 'true');
    if (data.textColor && content) {
      element.dataset.textColor = data.textColor;
      content.style.color = data.textColor;
    }
  } else if (element.classList.contains('custom-block-separator')) {
    element.dataset.orientation = data.orientation || element.dataset.orientation || 'horizontal';
    if (data.separatorColor) {
      element.dataset.separatorColor = data.separatorColor;
      element.style.setProperty('--separator-color', data.separatorColor);
    }
  }
}

function getBlockCustomData(element) {
  if (element.classList.contains('section')) {
    return {
      borderColor: element.dataset.borderColor || '',
      bgColor: element.dataset.bgColor || '',
      titleColor: element.dataset.titleColor || ''
    };
  }
  if (element.classList.contains('custom-block-text')) {
    return {
      textSize: element.dataset.textSize || 'text',
      bold: element.dataset.bold === 'true',
      italic: element.dataset.italic === 'true',
      underline: element.dataset.underline === 'true',
      textColor: element.dataset.textColor || ''
    };
  }
  if (element.classList.contains('custom-block-separator')) {
    return {
      separatorColor: element.dataset.separatorColor || '',
      orientation: element.dataset.orientation || 'horizontal'
    };
  }
  return {};
}

function getCustomBlockType(block) {
  if (block.classList.contains('custom-block-text')) return 'text';
  if (block.classList.contains('custom-block-image')) return 'image';
  if (block.classList.contains('custom-block-link-block')) return 'link';
  if (block.classList.contains('custom-block-separator')) return 'separator';
  return '';
}

function serializeCustomBlock(block) {
  const type = getCustomBlockType(block);
  if (!type) return null;
  const parentSection = block.closest('.section');
  const data = {
    type,
    parent: block.parentElement === modalGrid ? 'canvas' : parentSection?.dataset.sectionId || 'canvas',
    style: getElementStyleSnapshot(block),
    custom: getBlockCustomData(block)
  };

  if (type === 'text') {
    data.text = block.querySelector('.custom-block-content')?.textContent || '';
  } else if (type === 'image') {
    data.url = block.querySelector('.custom-block-field')?.value || '';
  } else if (type === 'link') {
    const fields = block.querySelectorAll('.custom-block-field');
    data.label = fields[0]?.value || '';
    data.url = fields[1]?.value || '';
  } else if (type === 'separator') {
    data.label = block.querySelector('.custom-block-separator-label')?.textContent || '';
  }

  return data;
}

function hydrateCustomBlock(data) {
  let block = null;
  if (data.type === 'text') {
    block = makeTextCustomBlock(data.text || 'Nouveau bloc texte');
  } else if (data.type === 'image') {
    block = makeImageCustomBlock();
    const input = block.querySelector('.custom-block-field');
    input.value = data.url || '';
    input.dispatchEvent(new Event('input'));
  } else if (data.type === 'link') {
    block = makeLinkCustomBlock();
    const fields = block.querySelectorAll('.custom-block-field');
    if (fields[0]) fields[0].value = data.label || '';
    if (fields[1]) fields[1].value = data.url || '';
    fields[0]?.dispatchEvent(new Event('input'));
  } else if (data.type === 'separator') {
    block = makeSeparatorCustomBlock();
    const label = block.querySelector('.custom-block-separator-label');
    if (label) label.textContent = data.label || 'Section';
  }
  if (block) applyElementStyleSnapshot(block, data.style);
  if (block) applyBlockCustomData(block, data.custom);
  if (block) setCustomBlocksEditable(activeModalEditMode);
  return block;
}

function saveModalBlocks() {
  if (!requireAdmin()) return;
  if (!activeModalMissionKey) return;
  const blockMap = getSavedModalBlocksMap();
  const sectionOverrides = [...modalGrid.querySelectorAll(':scope > .section:not(.custom-section)')].map(section => ({
    id: section.dataset.sectionId,
    title: section.querySelector('.section-header')?.textContent || '',
    custom: getBlockCustomData(section)
  }));
  const customSections = [...modalGrid.querySelectorAll(':scope > .custom-section')].map(section => ({
    id: section.dataset.sectionId,
    title: section.querySelector('.section-header')?.textContent || 'NOUVELLE COLONNE',
    style: getElementStyleSnapshot(section),
    custom: getBlockCustomData(section)
  }));
  const blocks = [...modalGrid.querySelectorAll('.custom-block')]
    .map(serializeCustomBlock)
    .filter(Boolean);

  if (sectionOverrides.length === 0 && customSections.length === 0 && blocks.length === 0) {
    delete blockMap[activeModalMissionKey];
  } else {
    blockMap[activeModalMissionKey] = { sectionOverrides, customSections, blocks };
  }
  saveModalBlocksMap(blockMap);
  syncActiveMissionDb();
}

function restoreModalBlocks() {
  const saved = getSavedModalBlocks();
  if (!saved) return;

  (saved.sectionOverrides || []).forEach(item => {
    const section = modalGrid.querySelector(`:scope > .section[data-section-id="${CSS.escape(item.id)}"]`);
    if (!section) return;
    if (item.title) section.querySelector('.section-header').textContent = item.title;
    applyBlockCustomData(section, item.custom);
  });

  (saved.customSections || []).forEach(item => {
    const section = makeColumnCustomBlock();
    section.dataset.sectionId = item.id;
    section.querySelector('.section-header').textContent = item.title || 'NOUVELLE COLONNE';
    clearElement(section.querySelector('.section-body'));
    applyElementStyleSnapshot(section, item.style);
    applyBlockCustomData(section, item.custom);
    modalGrid.appendChild(section);
  });

  (saved.blocks || []).forEach(item => {
    const block = hydrateCustomBlock(item);
    if (!block) return;
    const parent = item.parent === 'canvas'
      ? modalGrid
      : modalGrid.querySelector(`.section[data-section-id="${CSS.escape(item.parent)}"] .section-body`);
    const target = parent || modalGrid;
    if (target !== modalGrid) {
      target.classList.add('custom-grid-body');
      target.querySelectorAll('.empty-text').forEach(placeholder => placeholder.remove());
    }
    target.appendChild(block);
  });
  setCustomBlocksEditable(activeModalEditMode);
}

function appendCustomBlock(section, type) {
  if (!requireAdmin()) return;
  const isCanvasBlock = activeModalEditMode && modal.classList.contains('editing');
  const body = isCanvasBlock ? modalGrid : section?.querySelector('.section-body');
  if (!body) return;
  if (!isCanvasBlock) body.querySelectorAll('.empty-text').forEach(placeholder => placeholder.remove());

  const placeCanvasBlock = block => {
    if (!isCanvasBlock) return;
    const count = modalGrid.querySelectorAll(':scope > .custom-block').length;
    block.style.left = `${24 + count * 24}px`;
    block.style.top = `${24 + count * 24}px`;
    block.style.width = '280px';
    block.dataset.canvasReady = 'true';
  };
  const placeCanvasSection = section => {
    if (!isCanvasBlock) return;
    const count = modalGrid.querySelectorAll(':scope > .section').length;
    section.style.left = `${48 + count * 24}px`;
    section.style.top = `${48 + count * 24}px`;
    section.style.width = '320px';
    section.style.minHeight = '220px';
    section.dataset.canvasReady = 'true';
  };

  if (type === 'text') {
    const block = makeTextCustomBlock();
    placeCanvasBlock(block);
    body.appendChild(block);
    setCustomBlocksEditable(activeModalEditMode);
    block.querySelector('.custom-block-content')?.focus();
  } else if (type === 'image') {
    const imageBlock = makeImageCustomBlock();
    placeCanvasBlock(imageBlock);
    body.appendChild(imageBlock);
    setCustomBlocksEditable(activeModalEditMode);
    imageBlock.querySelector('.custom-block-field')?.focus();
    return;
    const url = prompt('URL de l’image');
    if (!url) return;
    const block = document.createElement('div');
    block.className = 'custom-block';
    addCustomBlockHandle(block);
    block.appendChild(makeImage(url, 'Bloc image', ''));
    placeCanvasBlock(block);
    body.appendChild(block);
  } else if (type === 'link') {
    const linkBlock = makeLinkCustomBlock();
    placeCanvasBlock(linkBlock);
    body.appendChild(linkBlock);
    setCustomBlocksEditable(activeModalEditMode);
    linkBlock.querySelector('.custom-block-field')?.focus();
    return;
    const url = prompt('URL du lien');
    if (!url) return;
    const label = prompt('Texte du lien') || url;
    const block = document.createElement('div');
    block.className = 'custom-block';
    addCustomBlockHandle(block);
    const link = document.createElement('a');
    link.className = 'custom-block-link';
    link.href = url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = label;
    block.appendChild(link);
    placeCanvasBlock(block);
    body.appendChild(block);
  } else if (type === 'column') {
    const column = makeColumnCustomBlock();
    placeCanvasSection(column);
    modalGrid.appendChild(column);
    setCustomBlocksEditable(activeModalEditMode);
    column.querySelector('.section-header')?.focus();
  } else if (type === 'separator') {
    const separator = makeSeparatorCustomBlock();
    placeCanvasBlock(separator);
    body.appendChild(separator);
    setCustomBlocksEditable(activeModalEditMode);
    separator.querySelector('.custom-block-separator-label')?.focus();
  }
}

function makeImage(src, alt, className) {
  const image = document.createElement('img');
  image.className = className;
  image.src = src;
  image.alt = alt;
  image.loading = 'lazy';
  image.addEventListener('error', () => {
    image.style.display = 'none';
    const placeholder = image.nextElementSibling;
    if (placeholder) placeholder.style.display = 'flex';
  });
  return image;
}

function parseMissionDate(dateText) {
  if (!dateText) return null;
  if (dateText.startsWith('Après le 4 septembre 2028')) {
    return { date: new Date(2028, 8, 5), approximate: true };
  }

  const date = new Date(`${dateText} 00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return { date, approximate: false };
}

function getTimelineEntries() {
  return DATA.flatMap(dlc => dlc.missions.map(mission => {
    const parsed = parseMissionDate(mission.date);
    return parsed ? { dlc, mission, ...parsed } : null;
  }))
    .filter(Boolean)
    .sort((a, b) => a.date - b.date || a.mission.name.localeCompare(b.mission.name));
}

function getPeopleEntries() {
  return DATA.flatMap(dlc => dlc.missions.flatMap(mission => [
    ...(mission.civilians || []).map(person => ({ role: 'victim', label: 'Victime', person, mission, dlc })),
    ...(mission.suspects || []).map(person => ({ role: 'suspect', label: 'Suspect', person, mission, dlc }))
  ]))
    .filter(entry => entry.person?.name)
    .sort((a, b) => a.person.name.localeCompare(b.person.name));
}

function buildPeopleBoard() {
  clearElement(peopleGrid);
  const entries = getPeopleEntries();

  if (entries.length === 0) {
    peopleGrid.appendChild(makeEmptyText('// AUCUNE PERSONNE RENSEIGNÉE'));
    return;
  }

  entries.forEach(({ role, label, person, mission, dlc }) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `person-card ${role}`;
    card.setAttribute('aria-label', `Ouvrir la mission liée à ${person.name}`);
    card.append(
      makeTextElement('span', 'person-role', label),
      makeTextElement('div', 'person-name', person.name),
      makeTextElement('div', 'person-meta', `${mission.name} / ${dlc.name}`)
    );

    if (person.desc) {
      card.appendChild(makeTextElement('div', 'person-desc', person.desc));
    }

    card.addEventListener('click', () => openModal(mission, dlc));
    peopleGrid.appendChild(card);
  });
}

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, count) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function getMonthDiff(from, to) {
  return (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth();
}

function getDayDiff(from, to) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((getDayStart(to) - getDayStart(from)) / msPerDay);
}

function getDayStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getWeekStart(date) {
  const start = getDayStart(date);
  const day = start.getDay() || 7;
  start.setDate(start.getDate() - day + 1);
  return start;
}

function getYearStart(date) {
  return new Date(date.getFullYear(), 0, 1);
}

function addDays(date, count) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + count);
}

function addYears(date, count) {
  return new Date(date.getFullYear() + count, 0, 1);
}

function getTimelineUnitStart(date) {
  if (activeTimelineScale === 'day') return getDayStart(date);
  if (activeTimelineScale === 'week') return getWeekStart(date);
  if (activeTimelineScale === 'year') return getYearStart(date);
  return getMonthStart(date);
}

function addTimelineUnit(date, count) {
  if (activeTimelineScale === 'day') return addDays(date, count);
  if (activeTimelineScale === 'week') return addDays(date, count * 7);
  if (activeTimelineScale === 'year') return addYears(date, count);
  return addMonths(date, count);
}

function getTimelineUnitDiff(from, to) {
  if (activeTimelineScale === 'day') return getDayDiff(from, to);
  if (activeTimelineScale === 'week') return Math.floor(getDayDiff(from, to) / 7);
  if (activeTimelineScale === 'year') return to.getFullYear() - from.getFullYear();
  return getMonthDiff(from, to);
}

function formatTimelineUnit(date) {
  if (activeTimelineScale === 'day') {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).replace('.', '');
  }
  if (activeTimelineScale === 'week') {
    return `S${getWeekNumber(date)}`;
  }
  if (activeTimelineScale === 'year') {
    return String(date.getFullYear());
  }
  return date.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
}

function getWeekNumber(date) {
  const target = getDayStart(date);
  target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  return 1 + Math.round(((target - firstThursday) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);
}

function getTimelineLeft(date, start) {
  const scale = TIMELINE_SCALES[activeTimelineScale];
  const unitStart = getTimelineUnitStart(date);
  const unitLeft = getTimelineUnitDiff(start, unitStart) * scale.unitWidth;

  if (activeTimelineScale === 'day' || activeTimelineScale === 'week' || activeTimelineScale === 'month') {
    return unitLeft;
  }

  const dayOfYear = getDayDiff(unitStart, date);
  const daysInYear = getDayDiff(unitStart, addYears(unitStart, 1));
  return unitLeft + (dayOfYear / daysInYear) * scale.unitWidth;
}

function stackTimelineEntries(entries, start) {
  return entries.reduce((stacks, entry) => {
    const left = getTimelineLeft(entry.date, start);
    const lastStack = stacks[stacks.length - 1];
    if (lastStack && left - lastStack.left < TIMELINE_CARD_WIDTH + TIMELINE_STACK_GAP) {
      lastStack.entries.push({ ...entry, left });
      return stacks;
    }

    stacks.push({ left, entries: [{ ...entry, left }] });
    return stacks;
  }, []).map(stack => ({
    ...stack,
    key: `${activeTimelineScale}:${Math.round(stack.left)}:${stack.entries.map(entry => entry.mission.name).join('|')}`
  }));
}

function makeTimelineCard(entry, top) {
  const { dlc, mission, approximate, left } = entry;
  const card = document.createElement('button');
  card.type = 'button';
  card.className = `timeline-card ${approximate ? 'approx' : ''}`;
  card.style.left = `${left}px`;
  card.style.top = `${top}px`;
  card.setAttribute('aria-label', `Open mission details: ${mission.name}`);
  card.append(
    makeTextElement('span', 'timeline-card-name', mission.name),
    makeTextElement('span', 'timeline-card-date', `${mission.date} / ${dlc.name}`)
  );
  card.addEventListener('click', () => openModal(mission, dlc));
  return card;
}

function makeTimelineMoreCard(stack, hiddenCount, top) {
  const isExpanded = expandedTimelineStacks.has(stack.key);
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'timeline-card more';
  card.style.left = `${stack.left}px`;
  card.style.top = `${top}px`;
  card.textContent = `Encore ${hiddenCount} élément${hiddenCount > 1 ? 's' : ''}`;
  card.setAttribute('aria-label', `${hiddenCount} missions supplémentaires`);
  if (isExpanded) card.textContent = 'Replier la pile';
  card.setAttribute('aria-label', isExpanded ? 'Replier cette pile de missions' : card.getAttribute('aria-label'));
  card.setAttribute('aria-expanded', String(isExpanded));
  card.addEventListener('click', () => {
    if (isExpanded) {
      expandedTimelineStacks.delete(stack.key);
    } else {
      expandedTimelineStacks.add(stack.key);
    }
    buildTimeline();
  });
  return card;
}

function getVisibleStackRows(stack) {
  const isExpanded = expandedTimelineStacks.has(stack.key);
  if (!isExpanded) return Math.min(stack.entries.length, TIMELINE_MAX_ROWS);
  if (stack.entries.length <= TIMELINE_EXPANDED_VISIBLE_ROWS) return stack.entries.length + 1;
  return Math.min(stack.entries.length, TIMELINE_EXPANDED_VISIBLE_ROWS);
}

function getTimelineStackRender(stack) {
  const isExpanded = expandedTimelineStacks.has(stack.key);
  if (!isExpanded && stack.entries.length > TIMELINE_MAX_ROWS) {
    return {
      isExpanded,
      entries: stack.entries.slice(0, TIMELINE_MAX_ROWS - 1),
      hiddenCount: stack.entries.length - (TIMELINE_MAX_ROWS - 1),
      hasToggle: true
    };
  }

  if (isExpanded && stack.entries.length > TIMELINE_EXPANDED_VISIBLE_ROWS) {
    return {
      isExpanded,
      entries: stack.entries.slice(0, TIMELINE_EXPANDED_VISIBLE_ROWS - 1),
      hiddenCount: stack.entries.length - (TIMELINE_EXPANDED_VISIBLE_ROWS - 1),
      hasToggle: true
    };
  }

  return {
    isExpanded,
    entries: stack.entries,
    hiddenCount: 0,
    hasToggle: isExpanded
  };
}

function buildTimeline() {
  clearElement(timeline);
  const entries = getTimelineEntries();
  if (entries.length === 0) return;

  const scale = TIMELINE_SCALES[activeTimelineScale];
  const start = getTimelineUnitStart(entries[0].date);
  const end = addTimelineUnit(getTimelineUnitStart(entries[entries.length - 1].date), 1);
  const unitCount = getTimelineUnitDiff(start, end) + 1;
  const width = Math.max(TIMELINE_MIN_WIDTH, unitCount * scale.unitWidth + TIMELINE_CARD_WIDTH + 80);
  const stacks = stackTimelineEntries(entries, start);
  const maxRows = Math.max(
    TIMELINE_MAX_ROWS,
    ...stacks.map(getVisibleStackRows)
  );
  const height = TIMELINE_TOP_OFFSET + maxRows * TIMELINE_ROW_HEIGHT + 18;
  timeline.style.width = `${width}px`;
  timeline.style.height = `${height}px`;

  for (let i = 0; i < unitCount; i++) {
    const unit = addTimelineUnit(start, i);
    const left = i * scale.unitWidth;

    const gridLine = document.createElement('div');
    gridLine.className = 'timeline-grid-line';
    gridLine.style.left = `${left}px`;
    timeline.appendChild(gridLine);

    const unitLabel = makeTextElement('div', 'timeline-month', formatTimelineUnit(unit));
    unitLabel.style.left = `${left}px`;
    unitLabel.style.width = `${scale.unitWidth}px`;
    timeline.appendChild(unitLabel);
  }

  for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year + 1, 0, 1);
    const left = Math.max(0, getTimelineUnitDiff(start, getTimelineUnitStart(yearStart)) * scale.unitWidth);
    const right = Math.min(width, getTimelineUnitDiff(start, getTimelineUnitStart(yearEnd)) * scale.unitWidth);
    const label = makeTextElement('div', 'timeline-year', year);
    label.style.left = `${left}px`;
    label.style.width = `${Math.max(scale.unitWidth, right - left)}px`;
    timeline.appendChild(label);
  }

  stacks.forEach(stack => {
    const stackRender = getTimelineStackRender(stack);

    stackRender.entries.forEach((entry, index) => {
      timeline.appendChild(makeTimelineCard(entry, TIMELINE_TOP_OFFSET + index * TIMELINE_ROW_HEIGHT));
    });

    if (stackRender.hasToggle) {
      timeline.appendChild(makeTimelineMoreCard(
        stack,
        stackRender.hiddenCount,
        TIMELINE_TOP_OFFSET + stackRender.entries.length * TIMELINE_ROW_HEIGHT
      ));
    }
  });
}

function makeColumnToggle(dlcId, hiddenCount, isExpanded) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'col-toggle';
  button.textContent = isExpanded
    ? 'Ranger la liste'
    : `Afficher ${hiddenCount} mission${hiddenCount > 1 ? 's' : ''}`;
  button.setAttribute('aria-expanded', String(isExpanded));
  button.addEventListener('click', () => {
    if (isExpanded) {
      expandedColumns.delete(dlcId);
    } else {
      expandedColumns.add(dlcId);
    }
    refreshBoardFromSearch();
  });
  return button;
}

function buildBoard(filter = '') {
  clearElement(board);

  const q = filter.toLowerCase().trim();
  let totalVisible = 0;

  DATA.forEach(dlc => {
    const missions = dlc.missions.filter(m => {
      const matchesSearch = q
        ? (
          m.name.toLowerCase().includes(q) ||
          (m.tags || []).some(t => t.toLowerCase().includes(q)) ||
          (m.brief || '').toLowerCase().includes(q)
        )
        : true;

      return matchesSearch && missionMatchesTagFilters(m);
    });

    if (missions.length === 0) return;
    totalVisible += missions.length;

    const col = document.createElement('div');
    col.className = `col ${normalizeTagClass(dlc.id)}`;
    col.dataset.columnId = dlc.id;

    const header = document.createElement('div');
    header.className = 'col-header';
    header.append(
      makeTextElement('span', 'col-title', dlc.name),
      makeTextElement('span', 'col-count', missions.length)
    );
    col.appendChild(header);

    const isCollapsible = dlc.id === COLLAPSIBLE_COLUMN_ID && missions.length > COLLAPSED_COLUMN_LIMIT;
    const isExpanded = expandedColumns.has(dlc.id);
    const visibleMissions = isCollapsible && !isExpanded
      ? missions.slice(0, COLLAPSED_COLUMN_LIMIT)
      : missions;

    visibleMissions.forEach((mission, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'card';
      card.style.animationDelay = `${i * 0.04}s`;
      card.setAttribute('aria-label', `Open mission details: ${mission.name}`);

      if (mission.thumb) {
        card.appendChild(makeImage(mission.thumb, mission.name, 'card-thumb'));
      }

      const placeholder = makeTextElement('div', 'card-thumb-placeholder', '[ NO IMAGE ]');
      if (mission.thumb) placeholder.style.display = 'none';
      card.appendChild(placeholder);

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      cardBody.appendChild(makeTextElement('div', 'card-name', mission.name));

      card.appendChild(cardBody);
      card.addEventListener('click', () => openModal(mission, dlc));
      col.appendChild(card);
    });

    if (isCollapsible) {
      col.appendChild(makeColumnToggle(dlc.id, missions.length - COLLAPSED_COLUMN_LIMIT, isExpanded));
    }

    board.appendChild(col);
  });

  noResults.style.display = totalVisible === 0 ? 'block' : 'none';
}

// ═══════════════════════════════════════════════════════════════
//  MODAL
// ═══════════════════════════════════════════════════════════════
function refreshBoardFromSearch() {
  buildBoard(searchInput.value);
}

function updateFilterButton() {
  const count = activeTagFilters.length;
  filterBtn.classList.toggle('active', count > 0);
  filterBtn.dataset.count = count > 0 ? `(${count})` : '';
}

function updateFilterSummary() {
  const selectedCount = filterBg.classList.contains('open')
    ? filterTags.querySelectorAll('input:checked').length
    : activeTagFilters.length;
  const mode = filterBg.classList.contains('open')
    ? [...filterModeInputs].find(input => input.checked).value
    : activeFilterMode;

  if (selectedCount === 0) {
    filterSummary.textContent = 'Aucun tag sélectionné';
    return;
  }
  filterSummary.textContent = `${selectedCount} tag(s) sélectionné(s) - mode ${mode.toUpperCase()}`;
}

function renderFilterTags() {
  clearElement(filterTags);
  getAllTags().forEach(tag => {
    const id = `filter-tag-${normalizeTagClass(tag)}`;
    const label = document.createElement('label');
    label.className = 'filter-tag';
    label.setAttribute('for', id);
    applyTagColor(label, tag);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.value = tag;
    checkbox.checked = activeTagFilters.includes(tag);

    label.append(checkbox, makeTextElement('span', '', tag));
    filterTags.appendChild(label);
  });
  updateFilterSummary();
}

function openFilterPanel() {
  lastFilterFocusedElement = document.activeElement;
  renderFilterTags();
  filterModeInputs.forEach(input => {
    input.checked = input.value === activeFilterMode;
  });
  filterBg.classList.add('open');
  filterBg.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  filterClose.focus();
}

function closeFilterPanel() {
  filterBg.classList.remove('open');
  filterBg.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFilterFocusedElement) lastFilterFocusedElement.focus();
}

function applyFilters() {
  activeTagFilters = [...filterTags.querySelectorAll('input:checked')].map(input => input.value);
  activeFilterMode = [...filterModeInputs].find(input => input.checked).value;
  updateFilterButton();
  updateFilterSummary();
  refreshBoardFromSearch();
  closeFilterPanel();
}

function resetFilters() {
  activeTagFilters = [];
  activeFilterMode = 'or';
  filterModeInputs.forEach(input => {
    input.checked = input.value === activeFilterMode;
  });
  renderFilterTags();
  updateFilterButton();
  refreshBoardFromSearch();
}

function syncActiveFiltersAfterTagChange() {
  const allTags = new Set(getAllTags());
  activeTagFilters = activeTagFilters.filter(tag => allTags.has(tag));
  updateFilterButton();
}

function showConfirm(message, confirmLabel = 'Confirmer') {
  lastConfirmFocusedElement = document.activeElement;
  confirmMessage.textContent = message;
  confirmOk.textContent = confirmLabel;
  confirmBg.classList.add('open');
  confirmBg.setAttribute('aria-hidden', 'false');
  confirmOk.focus();

  return new Promise(resolve => {
    confirmResolve = resolve;
  });
}

function closeConfirm(result) {
  if (!confirmResolve) return;
  const resolve = confirmResolve;
  confirmResolve = null;
  confirmBg.classList.remove('open');
  confirmBg.setAttribute('aria-hidden', 'true');
  if (lastConfirmFocusedElement) lastConfirmFocusedElement.focus();
  resolve(result);
}

function renderColorOptions(currentColor) {
  clearElement(editColorGrid);
  selectedEditColor = currentColor || TAG_COLOR_OPTIONS[0];
  editColorPicker.value = selectedEditColor;
  editColorValue.textContent = selectedEditColor;
  pendingCustomColorReplacement = '';

  TAG_COLOR_OPTIONS.forEach(color => {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = 'color-swatch';
    swatch.dataset.color = color;
    swatch.style.setProperty('--swatch', color);
    swatch.setAttribute('aria-label', `Choisir la couleur ${color}`);
    swatch.classList.toggle('selected', color === selectedEditColor);
    swatch.addEventListener('click', () => {
      selectEditColor(color);
    });
    editColorGrid.appendChild(swatch);
  });

  editColorPicker.oninput = () => {
    selectedEditColor = editColorPicker.value;
    editColorValue.textContent = selectedEditColor;
    editColorGrid.querySelectorAll('.color-swatch').forEach(item => {
      item.classList.remove('selected');
    });
    editCustomColorGrid.querySelectorAll('.color-slot').forEach(item => {
      item.classList.remove('selected');
    });
  };

  renderCustomColorSlots();
}

function selectEditColor(color) {
  selectedEditColor = color;
  editColorPicker.value = color;
  editColorValue.textContent = color;
  editColorGrid.querySelectorAll('.color-swatch').forEach(item => {
    item.classList.toggle('selected', item.dataset.color === color);
  });
  editCustomColorGrid.querySelectorAll('.color-slot').forEach(item => {
    item.classList.toggle('selected', item.dataset.color === color);
  });
}

function renderCustomColorSlots() {
  clearElement(editCustomColorGrid);
  const colors = getCustomTagColors();
  const isReplacing = Boolean(pendingCustomColorReplacement);
  customPaletteNote.textContent = isReplacing ? 'Palette pleine: choisir un emplacement' : `${colors.length}/${MAX_CUSTOM_TAG_COLORS}`;
  customPaletteNote.classList.toggle('replace', isReplacing);

  for (let i = 0; i < MAX_CUSTOM_TAG_COLORS; i++) {
    const color = colors[i];
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'color-slot';

    if (color) {
      slot.dataset.color = color;
      slot.style.setProperty('--swatch', color);
      slot.classList.toggle('selected', color === selectedEditColor);
      slot.classList.toggle('replace-target', isReplacing);
      slot.setAttribute('aria-label', isReplacing ? `Remplacer ${color}` : `Choisir ${color}`);
      slot.addEventListener('click', () => {
        if (pendingCustomColorReplacement) {
          replaceCustomTagColor(i, pendingCustomColorReplacement);
          selectEditColor(pendingCustomColorReplacement);
          renderCustomColorSlots();
          return;
        }
        selectEditColor(color);
      });
    } else {
      slot.classList.add('empty');
      slot.setAttribute('aria-label', 'Emplacement vide');
    }

    editCustomColorGrid.appendChild(slot);
  }
}

function saveSelectedCustomColor() {
  if (!requireAdmin()) return;
  const result = rememberCustomTagColor(selectedEditColor);
  if (result === 'saved') {
    renderCustomColorSlots();
  } else if (result === 'full') {
    renderCustomColorSlots();
  }
}

function showEdit(initialValue, currentColor = '') {
  if (!requireAdmin()) return Promise.resolve(null);
  lastEditFocusedElement = document.activeElement;
  editInput.value = initialValue;
  renderColorOptions(currentColor);
  editBg.classList.add('open');
  editBg.setAttribute('aria-hidden', 'false');
  editInput.focus();
  editInput.select();

  return new Promise(resolve => {
    editResolve = resolve;
  });
}

function closeEdit(result) {
  if (!editResolve) return;
  const resolve = editResolve;
  editResolve = null;
  editBg.classList.remove('open');
  editBg.setAttribute('aria-hidden', 'true');
  if (lastEditFocusedElement) lastEditFocusedElement.focus();
  resolve(result);
}

function getCustomizableTarget(target) {
  const section = target.closest('#modal-grid .section');
  if (section) return section;
  return target.closest('#modal-grid .custom-block-text, #modal-grid .custom-block-separator');
}

function openBlockCustom(target) {
  if (!requireAdmin()) return;
  activeCustomBlockTarget = target;
  lastBlockCustomFocusedElement = document.activeElement;
  blockCustomColumn.classList.add('custom-panel-hidden');
  blockCustomText.classList.add('custom-panel-hidden');
  blockCustomSeparator.classList.add('custom-panel-hidden');

  if (target.classList.contains('custom-section')) {
    blockCustomTitle.textContent = 'Custom colonne';
    blockCustomColumn.classList.remove('custom-panel-hidden');
    blockBorderColor.value = getColorValue(target.dataset.borderColor, '#e74c3c');
    blockBgColor.value = getColorValue(target.dataset.bgColor, '#141416');
    blockTitleColor.value = getColorValue(target.dataset.titleColor, '#e74c3c');
  } else if (target.classList.contains('custom-block-text')) {
    blockCustomTitle.textContent = 'Custom texte';
    blockCustomText.classList.remove('custom-panel-hidden');
    blockTextSize.value = target.dataset.textSize || 'text';
    blockTextBold.checked = target.dataset.bold === 'true';
    blockTextItalic.checked = target.dataset.italic === 'true';
    blockTextUnderline.checked = target.dataset.underline === 'true';
    blockTextColor.value = getColorValue(target.dataset.textColor, '#d7d7db');
  } else if (target.classList.contains('custom-block-separator')) {
    blockCustomTitle.textContent = 'Custom séparateur';
    blockCustomSeparator.classList.remove('custom-panel-hidden');
    blockSeparatorColor.value = getColorValue(target.dataset.separatorColor, '#e74c3c');
    blockSeparatorOrientation.value = target.dataset.orientation || 'horizontal';
  }

  blockCustomBg.classList.add('open');
  blockCustomBg.setAttribute('aria-hidden', 'false');
  blockCustomOk.focus();
}

function closeBlockCustom() {
  blockCustomBg.classList.remove('open');
  blockCustomBg.setAttribute('aria-hidden', 'true');
  activeCustomBlockTarget = null;
  if (lastBlockCustomFocusedElement) lastBlockCustomFocusedElement.focus();
}

function applyActiveBlockCustom() {
  if (!requireAdmin()) return;
  const target = activeCustomBlockTarget;
  if (!target) return;
  if (target.classList.contains('custom-section')) {
    applyBlockCustomData(target, {
      borderColor: blockBorderColor.value,
      bgColor: blockBgColor.value,
      titleColor: blockTitleColor.value
    });
  } else if (target.classList.contains('custom-block-text')) {
    applyBlockCustomData(target, {
      textSize: blockTextSize.value,
      bold: blockTextBold.checked,
      italic: blockTextItalic.checked,
      underline: blockTextUnderline.checked,
      textColor: blockTextColor.value
    });
  } else if (target.classList.contains('custom-block-separator')) {
    applyBlockCustomData(target, {
      separatorColor: blockSeparatorColor.value,
      orientation: blockSeparatorOrientation.value
    });
  }
  saveModalBlocks();
}

function renderSettingsTags() {
  if (!requireAdmin()) return;
  clearElement(tagSummaryList);
  const summaries = getTagSummaries();
  const totalLinks = summaries.reduce((total, item) => total + item.entries.length, 0);
  settingsSummary.textContent = `${summaries.length} tag(s) - ${totalLinks} association(s) aux cartes`;

  if (summaries.length === 0) {
    tagSummaryList.appendChild(makeEmptyText('// AUCUN TAG'));
    return;
  }

  summaries.forEach(({ tag, entries }) => {
    const card = document.createElement('div');
    card.className = 'tag-summary-card';

    const head = document.createElement('div');
    head.className = 'tag-summary-head';

    const name = document.createElement('div');
    name.className = 'tag-summary-name';
    name.appendChild(makeTag(tag));

    const meta = document.createElement('div');
    meta.className = 'tag-summary-meta';
    meta.appendChild(makeTextElement('div', 'tag-summary-count', `${entries.length} card${entries.length > 1 ? 's' : ''}`));

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'tag-icon-action';
    editButton.textContent = '✎';
    editButton.title = `Modifier le tag ${tag}`;
    editButton.setAttribute('aria-label', `Modifier le tag ${tag}`);
    editButton.addEventListener('click', async () => {
      if (!requireAdmin()) return;
      const result = await showEdit(tag, getTagColor(tag));
      if (result === null) return;
      const normalizedName = normalizeTagValue(result.name);
      if (!normalizedName) return;

      if (renameTagEverywhere(tag, normalizedName)) {
        activeTagFilters = activeTagFilters.map(activeTag => activeTag === tag ? normalizedName : activeTag);
        updateFilterButton();
      }
      setTagColor(normalizedName, result.color);
      refreshBoardFromSearch();
      renderSettingsTags();
      refreshRenderedTagColors();
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'tag-icon-action danger';
    deleteButton.textContent = '🗑';
    deleteButton.title = `Supprimer le tag ${tag}`;
    deleteButton.setAttribute('aria-label', `Supprimer le tag ${tag}`);
    deleteButton.addEventListener('click', async () => {
      if (!requireAdmin()) return;
      const confirmed = await showConfirm(`Supprimer le tag "${tag}" de ${entries.length} carte${entries.length > 1 ? 's' : ''} ?`, 'Supprimer');
      if (!confirmed) return;
      deleteTagEverywhere(tag);
      syncActiveFiltersAfterTagChange();
      refreshBoardFromSearch();
      renderSettingsTags();
    });

    meta.append(editButton, deleteButton);
    head.append(name, meta);

    const links = document.createElement('div');
    links.className = 'tag-mission-links';
    entries.forEach(({ dlc, mission }) => {
      const link = document.createElement('button');
      link.type = 'button';
      link.className = 'tag-mission-link';
      link.textContent = `${mission.name} / ${dlc.name}`;
      link.addEventListener('click', () => {
        closeSettingsPanel();
        openModal(mission, dlc);
      });
      links.appendChild(link);
    });

    card.append(head, links);
    tagSummaryList.appendChild(card);
  });
}

function showSettingsPage(pageName) {
  if (pageName === 'tags' && !requireAdmin()) pageName = 'tuto';
  document.querySelectorAll('.settings-page').forEach(page => {
    page.classList.toggle('active', page.id === `settings-page-${pageName}`);
  });
  settingsTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.settingsPage === pageName);
  });
  if (pageName === 'tags') renderSettingsTags();
}

function openSettingsPanel() {
  lastSettingsFocusedElement = document.activeElement;
  showSettingsPage('tuto');
  settingsBg.classList.add('open');
  settingsBg.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  settingsClose.focus();
}

function closeSettingsPanel() {
  settingsBg.classList.remove('open');
  settingsBg.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastSettingsFocusedElement) lastSettingsFocusedElement.focus();
}

function openModal(mission, dlc) {
  lastFocusedElement = document.activeElement;
  activeModalMissionKey = getMissionKey(dlc, mission);
  activeModalMission = mission;
  activeModalDlc = dlc;
  setModalEditMode(false);

  modalImg.src = mission.thumb || '';
  modalImg.alt = mission.thumb ? mission.name : '';
  modalImg.style.display = mission.thumb ? 'block' : 'none';
  modalTitle.textContent = mission.name;

  clearElement(modalMeta);
  modalMeta.append(
    makeMetaItem('DLC ', dlc.name),
    makeMetaItem('DATE ', mission.date || 'Unknown'),
    makeMetaItem('CIVILIANS ', (mission.civilians || []).length),
    makeMetaItem('SUSPECTS ', (mission.suspects || []).length)
  );

  const spacer = document.createElement('div');
  spacer.className = 'modal-meta-spacer';
  modalMeta.appendChild(spacer);

  const tags = document.createElement('div');
  tags.className = 'modal-tags';
  renderTagEditor(tags, mission, dlc);
  modalMeta.appendChild(tags);

  clearElement(modalGrid);

  // Mission Brief
  if (mission.brief) {
    const brief = makeSection('MISSION BRIEF');
    brief.dataset.sectionId = 'brief';
    brief.querySelector('.section-body').appendChild(makeTextElement('p', '', mission.brief));
    modalGrid.appendChild(brief);
  }

  // Civilians
  const civSection = makeSection('CIVILIANS');
  civSection.dataset.sectionId = 'civilians';
  const civBody = civSection.querySelector('.section-body');
  if (!mission.civilians || mission.civilians.length === 0) {
    civBody.appendChild(makeEmptyText('// NO CIVILIANS REPORTED'));
  } else {
    mission.civilians.forEach((c, i) => {
      civBody.appendChild(makeItem(i + 1, c.name, c.desc));
    });
  }
  modalGrid.appendChild(civSection);

  // Suspects
  const susSection = makeSection('SUSPECTS');
  susSection.dataset.sectionId = 'suspects';
  const susBody = susSection.querySelector('.section-body');
  if (!mission.suspects || mission.suspects.length === 0) {
    susBody.appendChild(makeEmptyText('// UNKNOWN'));
  } else {
    mission.suspects.forEach((s, i) => {
      susBody.appendChild(makeItem(i + 1, s.name, s.desc));
    });
  }
  modalGrid.appendChild(susSection);

  // Evidence
  const evSection = makeSection('EVIDENCE ROOM');
  evSection.dataset.sectionId = 'evidence';
  const evBody = evSection.querySelector('.section-body');
  if (!mission.evidence || mission.evidence.length === 0) {
    evBody.appendChild(makeEmptyText('// NO EVIDENCE LOGGED'));
  } else {
    mission.evidence.forEach((e, i) => {
      evBody.appendChild(makeItem(i + 1, typeof e === 'string' ? e : e.name, typeof e === 'object' ? e.desc : ''));
    });
  }
  modalGrid.appendChild(evSection);
  renderIntelPanel(mission, dlc);

  modalBg.classList.add('open');
  modalBg.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (requireAdmin()) restoreModalBlocks();
  setCustomBlocksEditable(false);
  if (requireAdmin()) {
    const savedLayout = getSavedModalLayout();
    if (savedLayout) applySavedModalLayout(savedLayout);
  }
  modalClose.focus();
}

function renderTagEditor(container, mission, dlc) {
  clearElement(container);

  (mission.tags || []).forEach(tag => {
    const tagButton = document.createElement(requireAdmin() ? 'button' : 'span');
    if (requireAdmin()) tagButton.type = 'button';
    tagButton.className = requireAdmin() ? 'tag tag-editable' : 'tag';
    const tagClass = normalizeTagClass(tag);
    if (tagClass) tagButton.classList.add(tagClass);
    applyTagColor(tagButton, tag);
    tagButton.appendChild(makeTextElement('span', '', tag));
    if (requireAdmin()) {
      tagButton.title = `Clic droit pour retirer le tag ${tag}`;
      tagButton.appendChild(makeTextElement('span', 'tag-remove', '×'));
    }
    tagButton.addEventListener('contextmenu', e => {
      e.preventDefault();
      if (!requireAdmin()) return;
      mission.tags = (mission.tags || []).filter(existing => existing !== tag);
      saveMissionTags(dlc, mission);
      refreshBoardFromSearch();
      renderTagEditor(container, mission, dlc);
    });
    container.appendChild(tagButton);
  });

  if (!requireAdmin()) return;

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'tag tag-add';
  addButton.textContent = '+ Ajouter un tag';
  addButton.addEventListener('click', () => renderTagForm(container, mission, dlc));
  container.appendChild(addButton);

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'tag tag-add modal-edit-toggle';
  editButton.textContent = '✎';
  editButton.title = activeModalEditMode ? 'Quitter le mode édition' : 'Passer en mode édition';
  editButton.setAttribute('aria-label', editButton.title);
  editButton.classList.toggle('active', activeModalEditMode);
  editButton.setAttribute('aria-pressed', String(activeModalEditMode));
  editButton.addEventListener('click', () => {
    const shouldEdit = !activeModalEditMode;
    if (shouldEdit) {
      layoutModalCanvas();
      setModalEditMode(true);
    } else {
      saveModalBlocks();
      saveModalLayout();
      setModalEditMode(false);
      applySavedModalLayout(getSavedModalLayout());
    }
    renderTagEditor(container, mission, dlc);
  });
  container.appendChild(editButton);

  if (activeModalEditMode) {
    const resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'tag tag-add modal-layout-reset';
    resetButton.textContent = '↻';
    resetButton.title = 'Réinitialiser la position des supra blocs';
    resetButton.setAttribute('aria-label', resetButton.title);
    resetButton.addEventListener('click', () => {
      closeBlockLibrary();
      deleteSavedModalLayout();
      setModalEditMode(false);
      clearModalCanvasLayout();
      layoutModalCanvas();
      setModalEditMode(true);
    });
    container.appendChild(resetButton);
  }
}

function renderTagForm(container, mission, dlc) {
  if (!requireAdmin()) return;
  renderTagEditor(container, mission, dlc);

  const form = document.createElement('form');
  form.className = 'tag-form';

  const input = document.createElement('input');
  input.className = 'tag-input';
  input.type = 'text';
  input.placeholder = 'Tag existant ou nouveau';
  input.autocomplete = 'off';

  const suggestions = document.createElement('div');
  suggestions.className = 'tag-suggestions';

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'tag-action';
  submit.textContent = 'Ajouter';

  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'tag-action';
  cancel.textContent = 'Annuler';
  cancel.addEventListener('click', () => renderTagEditor(container, mission, dlc));

  function renderSuggestions() {
    clearElement(suggestions);
    const query = normalizeTagValue(input.value);
    const options = getAllTags()
      .filter(tag => !(mission.tags || []).includes(tag))
      .filter(tag => !query || tag.toLowerCase().includes(query));

    if (options.length === 0) {
      suggestions.appendChild(makeTextElement('div', 'tag-suggestion-empty', query ? `Créer "${query}"` : 'Aucun tag disponible'));
      return;
    }

    options.forEach(tag => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'tag-suggestion';
      option.textContent = tag;
      option.addEventListener('click', () => {
        input.value = tag;
        form.requestSubmit();
      });
      suggestions.appendChild(option);
    });
  }

  input.addEventListener('input', renderSuggestions);
  input.addEventListener('keydown', e => {
    const firstOption = suggestions.querySelector('.tag-suggestion');
    if (e.key === 'ArrowDown' && firstOption) {
      e.preventDefault();
      firstOption.focus();
    }
  });

  suggestions.addEventListener('keydown', e => {
    const options = [...suggestions.querySelectorAll('.tag-suggestion')];
    const index = options.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      (options[index + 1] || options[0])?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      (options[index - 1] || options[options.length - 1])?.focus();
    } else if (e.key === 'Escape') {
      input.focus();
    }
  });

  form.append(input, submit, cancel, suggestions);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const tag = normalizeTagValue(input.value);
    if (!tag) return;

    const existingTags = mission.tags || [];
    if (!existingTags.some(existing => existing.toLowerCase() === tag.toLowerCase())) {
      mission.tags = [...existingTags, tag];
      saveMissionTags(dlc, mission);
      refreshBoardFromSearch();
    }
    renderTagEditor(container, mission, dlc);
  });

  container.appendChild(form);
  renderSuggestions();
  input.focus();
}

function makeSection(title) {
  const sec = document.createElement('div');
  sec.className = 'section';
  sec.append(
    makeTextElement('div', 'section-header', title),
    document.createElement('div')
  );
  sec.lastElementChild.className = 'section-body';
  return sec;
}

function getCanvasDraggable(target) {
  if (!activeModalEditMode || !modal.classList.contains('editing')) return null;
  const block = target.closest('.custom-block');
  if (block && target.closest('.custom-block-handle')) return block;
  if (target.closest('.section-header')) return target.closest('.section');
  return null;
}

function makeItem(num, name, desc) {
  const row = document.createElement('div');
  row.className = 'item-row';
  const content = document.createElement('div');
  content.appendChild(makeTextElement('div', 'item-name', name));
  if (desc) content.appendChild(makeTextElement('div', 'item-desc', desc));
  row.append(makeTextElement('div', 'item-num', num), content);
  return row;
}

function moveCustomBlockToCanvas(block, rect, gridRect) {
  if (block.parentElement === modalGrid) return;
  const previousBody = block.closest('.section-body');
  modalGrid.appendChild(block);
  block.style.left = `${snapToGrid(rect.left - gridRect.left + modalGrid.scrollLeft)}px`;
  block.style.top = `${snapToGrid(rect.top - gridRect.top + modalGrid.scrollTop)}px`;
  block.style.width = `${Math.max(220, rect.width)}px`;
  block.style.minHeight = `${Math.max(72, rect.height)}px`;
  block.dataset.canvasReady = 'true';
  if (previousBody && !previousBody.querySelector('.custom-block')) {
    previousBody.classList.remove('custom-grid-body');
  }
}

function getSectionDropTarget(clientX, clientY, dragged) {
  dragged.style.pointerEvents = 'none';
  const target = document.elementFromPoint(clientX, clientY);
  dragged.style.pointerEvents = '';
  return target?.closest('#modal-grid .section') || null;
}

function dropCustomBlockIntoSection(block, section, event) {
  const body = section.querySelector('.section-body');
  if (!body) return;
  const bodyRect = body.getBoundingClientRect();
  const blockRect = block.getBoundingClientRect();
  body.querySelectorAll('.empty-text').forEach(placeholder => placeholder.remove());
  body.classList.add('custom-grid-body');
  body.appendChild(block);
  block.style.left = `${snapToGrid(event.clientX - bodyRect.left - editingDrag.offsetX + body.scrollLeft)}px`;
  block.style.top = `${snapToGrid(event.clientY - bodyRect.top - editingDrag.offsetY + body.scrollTop)}px`;
  block.style.width = `${Math.max(180, blockRect.width)}px`;
  block.style.minHeight = `${Math.max(24, blockRect.height)}px`;
  block.dataset.canvasReady = 'true';
}

function closeModal() {
  saveMissionNote();
  saveModalBlocks();
  saveModalLayout();
  setModalEditMode(false);
  modalBg.classList.remove('open');
  modalBg.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  activeModalMissionKey = '';
  activeModalMission = null;
  activeModalDlc = null;
  if (lastFocusedElement) lastFocusedElement.focus();
}

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && modalBg.classList.contains('open') && activeModalEditMode) {
    if (!requireAdmin()) return;
    e.preventDefault();
    appendCustomBlock(activeBlockTarget || modalGrid.querySelector('.section'), 'link');
    closeBlockLibrary();
    return;
  }

  if (e.key === 'Escape' && blockLibrary.classList.contains('open')) {
    closeBlockLibrary();
    return;
  }

  if (editBg.classList.contains('open')) {
    if (e.key === 'Escape') closeEdit(null);
    trapFocus(e, editDialog);
    return;
  }

  if (blockCustomBg.classList.contains('open')) {
    if (e.key === 'Escape') closeBlockCustom();
    trapFocus(e, blockCustomDialog);
    return;
  }

  if (confirmBg.classList.contains('open')) {
    if (e.key === 'Escape') closeConfirm(false);
    trapFocus(e, confirmDialog);
    return;
  }

  if (e.key === 'Escape' && settingsBg.classList.contains('open')) closeSettingsPanel();
  if (e.key === 'Tab' && settingsBg.classList.contains('open')) {
    trapFocus(e, settingsPanel);
    return;
  }

  if (e.key === 'Escape' && filterBg.classList.contains('open')) closeFilterPanel();
  if (e.key === 'Tab' && filterBg.classList.contains('open')) {
    trapFocus(e, filterPanel);
    return;
  }

  if (e.key === 'Escape' && modalBg.classList.contains('open')) closeModal();
  if (e.key !== 'Tab' || !modalBg.classList.contains('open')) return;
  trapFocus(e, modalBg);
});

modalBg.addEventListener('click', e => {
  if (e.target === modalBg) closeModal();
});

modalClose.addEventListener('click', closeModal);
missionNotes.addEventListener('input', saveMissionNote);

modalGrid.addEventListener('click', e => {
  if (!requireAdmin()) return;
  if (activeDeleteMode) {
    const target = e.target.closest('#modal-grid .custom-block') || e.target.closest('#modal-grid .custom-section');
    if (!target) return;
    e.preventDefault();
    e.stopPropagation();
    target.remove();
    saveModalBlocks();
    return;
  }

  const link = e.target.closest('.custom-block-link');
  if (link && activeModalEditMode) e.preventDefault();
});

modalGrid.addEventListener('contextmenu', e => {
  if (!requireAdmin()) return;
  if (!activeModalEditMode) return;
  if (activeDeleteMode) return;
  const target = getCustomizableTarget(e.target);
  if (!target) return;
  e.preventDefault();
  openBlockCustom(target);
});

blockLibrary.addEventListener('click', e => {
  if (!requireAdmin()) return;
  const option = e.target.closest('.block-option');
  if (!option) return;
  appendCustomBlock(activeBlockTarget, option.dataset.blockType);
  closeBlockLibrary();
});

editorBlockLibrary.addEventListener('click', e => {
  if (!requireAdmin()) return;
  const option = e.target.closest('.editor-block-option');
  if (!option || !activeModalEditMode) return;
  appendCustomBlock(modalGrid.querySelector('.section'), option.dataset.blockType);
});

deleteModeToggle.addEventListener('click', () => {
  if (!requireAdmin()) return;
  if (!activeModalEditMode) return;
  setDeleteMode(!activeDeleteMode);
});

modalGrid.addEventListener('pointerdown', e => {
  if (!requireAdmin()) return;
  if (activeDeleteMode) return;
  const draggable = getCanvasDraggable(e.target);
  if (!draggable) return;
  e.preventDefault();
  const gridRect = modalGrid.getBoundingClientRect();
  const rect = draggable.getBoundingClientRect();
  if (draggable.classList.contains('custom-block')) {
    moveCustomBlockToCanvas(draggable, rect, gridRect);
  }
  editingDrag = {
    element: draggable,
    isCustomBlock: draggable.classList.contains('custom-block'),
    pointerId: e.pointerId,
    offsetX: e.clientX - rect.left,
    offsetY: e.clientY - rect.top,
    gridLeft: gridRect.left,
    gridTop: gridRect.top
  };
  draggable.setPointerCapture(e.pointerId);
});

modalGrid.addEventListener('pointermove', e => {
  if (!editingDrag) return;
  e.preventDefault();
  editingDrag.element.style.left = `${snapToGrid(e.clientX - editingDrag.gridLeft - editingDrag.offsetX + modalGrid.scrollLeft)}px`;
  editingDrag.element.style.top = `${snapToGrid(e.clientY - editingDrag.gridTop - editingDrag.offsetY + modalGrid.scrollTop)}px`;
});

function stopEditingDrag(e) {
  if (!editingDrag) return;
  const dragged = editingDrag.element;
  if (editingDrag.element.hasPointerCapture(editingDrag.pointerId)) {
    editingDrag.element.releasePointerCapture(editingDrag.pointerId);
  }
  if (editingDrag.isCustomBlock && Number.isFinite(e.clientX) && Number.isFinite(e.clientY)) {
    const section = getSectionDropTarget(e.clientX, e.clientY, dragged);
    if (section) dropCustomBlockIntoSection(dragged, section, e);
  }
  editingDrag = null;
}

modalGrid.addEventListener('pointerup', stopEditingDrag);
modalGrid.addEventListener('pointercancel', stopEditingDrag);

document.addEventListener('click', e => {
  if (!blockLibrary.classList.contains('open')) return;
  if (blockLibrary.contains(e.target)) return;
  closeBlockLibrary();
});

filterBtn.addEventListener('click', openFilterPanel);
filterClose.addEventListener('click', closeFilterPanel);
filterApply.addEventListener('click', applyFilters);
filterReset.addEventListener('click', resetFilters);

filterBg.addEventListener('click', e => {
  if (e.target === filterBg) closeFilterPanel();
});

settingsBtn.addEventListener('click', openSettingsPanel);
settingsClose.addEventListener('click', closeSettingsPanel);
settingsTabs.forEach(tab => {
  tab.addEventListener('click', () => showSettingsPage(tab.dataset.settingsPage));
});

settingsBg.addEventListener('click', e => {
  if (e.target === settingsBg) closeSettingsPanel();
});

adminLoginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const password = adminPassword.value;
  if (!password) return;

  setAdminLoginLoading(true);
  setAdminLoginMessage('');

  try {
    await loginAdmin(password);
    if (!requireAdmin()) throw new Error('Session administrateur refusée.');
    setAdminLoginMessage('Connexion administrateur active.', 'success');
  } catch (error) {
    setAdminAuthenticated(false);
    setAdminLoginMessage(error.message || 'Connexion impossible pour le moment.', 'error');
  } finally {
    setAdminLoginLoading(false);
  }
});

adminLogout.addEventListener('click', logoutAdmin);

confirmCancel.addEventListener('click', () => closeConfirm(false));
confirmOk.addEventListener('click', () => closeConfirm(true));
confirmBg.addEventListener('click', e => {
  if (e.target === confirmBg) closeConfirm(false);
});

editDialog.addEventListener('submit', e => {
  e.preventDefault();
  if (!requireAdmin()) return;
  closeEdit({
    name: editInput.value,
    color: selectedEditColor
  });
});

editColorSave.addEventListener('click', saveSelectedCustomColor);
editCancel.addEventListener('click', () => closeEdit(null));
editBg.addEventListener('click', e => {
  if (e.target === editBg) closeEdit(null);
});

blockCustomCancel.addEventListener('click', closeBlockCustom);
blockCustomBg.addEventListener('click', e => {
  if (e.target === blockCustomBg) closeBlockCustom();
});
blockCustomDialog.addEventListener('submit', e => {
  e.preventDefault();
  if (!requireAdmin()) return;
  applyActiveBlockCustom();
  closeBlockCustom();
});

filterTags.addEventListener('change', updateFilterSummary);
filterModeInputs.forEach(input => {
  input.addEventListener('change', updateFilterSummary);
});

timelineScale.addEventListener('change', e => {
  activeTimelineScale = e.target.value;
  expandedTimelineStacks.clear();
  buildTimeline();
});

timelineScroll.addEventListener('wheel', e => {
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  e.preventDefault();
  timelineScroll.scrollLeft += e.deltaY;
}, { passive: false });

timelineScroll.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  if (e.target.closest('.timeline-card')) return;
  isTimelineDragging = true;
  timelineDragStartX = e.clientX;
  timelineDragStartScroll = timelineScroll.scrollLeft;
  timelineScroll.classList.add('dragging');
  timelineScroll.setPointerCapture(e.pointerId);
});

timelineScroll.addEventListener('pointermove', e => {
  if (!isTimelineDragging) return;
  e.preventDefault();
  timelineScroll.scrollLeft = timelineDragStartScroll - (e.clientX - timelineDragStartX);
});

function stopTimelineDrag(e) {
  if (!isTimelineDragging) return;
  isTimelineDragging = false;
  timelineScroll.classList.remove('dragging');
  if (timelineScroll.hasPointerCapture(e.pointerId)) {
    timelineScroll.releasePointerCapture(e.pointerId);
  }
}

timelineScroll.addEventListener('pointerup', stopTimelineDrag);
timelineScroll.addEventListener('pointercancel', stopTimelineDrag);
timelineScroll.addEventListener('pointerleave', stopTimelineDrag);

modalImg.addEventListener('error', () => {
  modalImg.style.display = 'none';
});

heroImg.addEventListener('error', () => {
  heroImg.style.display = 'none';
});

// ═══════════════════════════════════════════════════════════════
//  SEARCH
// ═══════════════════════════════════════════════════════════════
let searchTimer;
searchInput.addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => buildBoard(e.target.value), 200);
});

// ═══════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════
setAdminAuthenticated(false);
refreshAdminSession();
loadSavedTags();
buildBoard();
buildTimeline();
buildPeopleBoard();
