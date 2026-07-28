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
      mission("SecretEnd - Appart", ["secret"], { date: "Après le 4 septembre 2028", thumb: "assets/missions/Secret_appart.webp"}),
      mission("Commissariat", ["secret"], { thumb: "assets/missions/LSPD_HQ.webp" })
    ]
  }
];

const BASE_MISSION_TAGS = new Map(
  DATA.flatMap(dlc => dlc.missions.map(mission => [`${dlc.id}::${mission.name}`, [...(mission.tags || [])]]))
);
const BASE_MISSION_SNAPSHOTS = new Map(
  DATA.flatMap(dlc => dlc.missions.map(mission => [getMissionKey(dlc, mission), createMissionSnapshot(mission)]))
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
const imageBank = document.getElementById('image-bank');
const imageBankUploadBtn = document.getElementById('image-bank-upload-btn');
const imageBankUpload = document.getElementById('image-bank-upload');
const imageContextMenu = document.getElementById('image-context-menu');
const imageNameBg = document.getElementById('image-name-bg');
const imageNameDialog = document.getElementById('image-name-dialog');
const imageNameTitle = document.getElementById('image-name-title');
const imageNameInput = document.getElementById('image-name-input');
const imageNameCancel = document.getElementById('image-name-cancel');
const imageNameOk = document.getElementById('image-name-ok');
const briefFormatToolbar = document.getElementById('brief-format-toolbar');
const briefFormatColors = document.getElementById('brief-format-colors');
const briefFormatColor = document.getElementById('brief-format-color');
const briefColorSave = document.getElementById('brief-color-save');
const briefColorToggle = document.getElementById('brief-color-toggle');
const briefColorPreview = document.getElementById('brief-color-preview');
const briefColorPopover = document.getElementById('brief-color-popover');
const briefCustomColors = document.getElementById('brief-custom-colors');
const resourceBank = document.getElementById('resource-bank');
const resourceBankSearch = document.getElementById('resource-bank-search');
const resourceBankFilters = document.querySelectorAll('.resource-bank-filter[data-resource-filter]');
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
const creatorGrid = document.getElementById('creator-grid');
const adminSessionSummary = document.getElementById('admin-session-summary');
const adminLoginForm = document.getElementById('admin-login-form');
const adminPassword = document.getElementById('admin-password');
const adminLoginSubmit = document.getElementById('admin-login-submit');
const adminLoginMessage = document.getElementById('admin-login-message');
const adminSessionPanel = document.getElementById('admin-session-panel');
const adminSyncLocal = document.getElementById('admin-sync-local');
const adminPushDb = document.getElementById('admin-push-db');
const adminAutoSync = document.getElementById('admin-auto-sync');
const adminSyncState = document.getElementById('admin-sync-state');
const adminSyncMessage = document.getElementById('admin-sync-message');
const adminPendingPush = document.getElementById('admin-pending-push');
const adminPushReport = document.getElementById('admin-push-report');
const adminPushReportPanel = document.getElementById('admin-push-report-panel');
const adminLastCommit = document.getElementById('admin-last-commit');
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
const MISSION_DB_PUSHED_STORAGE_KEY = 'ron-lore-mission-db-pushed-v1';
const MISSION_NOTES_STORAGE_KEY = 'ron-lore-mission-notes-v1';
const IMAGE_BANK_STORAGE_KEY = 'ron-lore-image-bank-v1';
const AUTO_SYNC_STORAGE_KEY = 'ron-lore-auto-sync-v1';
const API_BASE_URL = (
  window.RON_LORE_API_BASE ||
  document.querySelector('meta[name="ron-lore-api-base"]')?.content ||
  ''
).replace(/\/$/, '');
const ADMIN_ORIGIN = (
  window.RON_LORE_ADMIN_ORIGIN ||
  document.querySelector('meta[name="ron-lore-admin-origin"]')?.content ||
  ''
).replace(/\/$/, '');
const MAX_CUSTOM_TAG_COLORS = 12;
const COLLAPSIBLE_COLUMN_ID = 'ready_or_not';
const COLLAPSED_COLUMN_LIMIT = 3;
const TIMELINE_CARD_WIDTH = 210;
const TIMELINE_MIN_WIDTH = 1600;
const TIMELINE_MAX_ROWS = 3;
const TIMELINE_EXPANDED_VISIBLE_ROWS = 6;
const AUTO_SYNC_INTERVAL_MS = 15000;
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
const BRIEF_TEXT_COLOR_OPTIONS = ['#e8e8e8', '#f2c94c', '#e74c3c', '#56cc9d', '#2d9cdb', '#bb6bd9'];
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
let activeResourceBankFilter = 'all';
let activeResourceBankSearch = '';
let activeImageContextId = '';
let imageNameResolve = null;
let lastImageNameFocusedElement = null;
let activeBriefEditor = null;
let savedBriefSelectionRange = null;
let isBriefSelectionDragging = false;
let briefSelectionTimer = null;
let selectedBriefColor = BRIEF_TEXT_COLOR_OPTIONS[0];
let isBriefColorPopoverOpen = false;
let sharedMissionDbMap = {};
let sharedModalLayoutMap = {};
let sharedModalBlocksMap = {};
let currentEditorName = '';
let csrfToken = '';
let autoSyncTimer = null;
let isSyncingFromBackend = false;
let presenceTimer = null;
let lastPresenceText = '';
let creatorMaskImage = null;
let creatorMaskCanvas = null;
let creatorMaskContext = null;
let creatorHighlightUrls = null;

function getApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

function hasConfiguredApiBase() {
  return Boolean(API_BASE_URL);
}

function isLocalFrontendOrigin() {
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

function shouldRedirectToAdminOrigin() {
  return Boolean(ADMIN_ORIGIN) && !isLocalFrontendOrigin() && window.location.origin !== ADMIN_ORIGIN;
}

function redirectToAdminOrigin() {
  if (!shouldRedirectToAdminOrigin()) return;
  window.location.assign(`${ADMIN_ORIGIN}${window.location.pathname}${window.location.search}${window.location.hash}`);
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

function setAdminSyncMessage(message = '', type = '') {
  if (!adminSyncMessage) return;
  adminSyncMessage.textContent = message;
  adminSyncMessage.classList.toggle('error', type === 'error');
  adminSyncMessage.classList.toggle('success', type === 'success');
}

function setAdminLoginLoading(isLoading) {
  if (adminLoginSubmit) {
    adminLoginSubmit.disabled = isLoading;
    adminLoginSubmit.textContent = isLoading ? 'Connexion...' : 'Connexion';
  }
  if (adminPassword) adminPassword.disabled = isLoading;
}

function setAdminSyncLoading(isLoading) {
  if (adminSyncLocal) adminSyncLocal.disabled = isLoading || !isAdminAuthenticated;
  if (adminPushDb) adminPushDb.disabled = isLoading || !isAdminAuthenticated;
}

async function refreshLatestCommitPill() {
  if (!adminLastCommit) return;
  if (!isAdminAuthenticated || !hasConfiguredApiBase()) {
    adminLastCommit.textContent = 'Last commit : inconnu';
    return;
  }

  adminLastCommit.textContent = 'Last commit : chargement...';
  try {
    const response = await fetch(getApiUrl('/github/latest-commit'), {
      credentials: 'include',
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Latest commit unavailable');
    const body = await response.json();
    adminLastCommit.textContent = `Last commit : ${body.commit?.message || 'inconnu'}`;
  } catch {
    adminLastCommit.textContent = 'Last commit : impossible a charger';
  }
}

function updateAdminLoginUi() {
  if (adminSessionSummary) {
    if (isAdminAuthenticated) {
      adminSessionSummary.textContent = `Mode administrateur actif${currentEditorName ? ` : ${currentEditorName}` : ''}`;
    } else if (!hasConfiguredApiBase()) {
      adminSessionSummary.textContent = 'Web Service Render non configuré';
    } else {
      adminSessionSummary.textContent = 'Mode lecture publique';
    }
  }
  if (adminLoginForm) adminLoginForm.hidden = isAdminAuthenticated;
  if (adminSessionPanel) adminSessionPanel.hidden = !isAdminAuthenticated;
  if (adminPassword && isAdminAuthenticated) adminPassword.value = '';
  if (adminAutoSync) adminAutoSync.checked = isAutoSyncEnabled();
  setAdminSyncLoading(false);
  updatePendingPushUi();
  updateAutoSyncStateLabel();
  refreshLatestCommitPill();
  if (!isAdminAuthenticated && !hasConfiguredApiBase()) {
    setAdminLoginMessage('Renseigne l’URL publique du Web Service Render dans la meta ron-lore-api-base.', 'error');
  }
}

function setAdminAuthenticated(authenticated, { allowRedirect = true } = {}) {
  const wasAdminAuthenticated = isAdminAuthenticated;
  isAdminAuthenticated = Boolean(authenticated);
  if (!isAdminAuthenticated) {
    currentEditorName = '';
    csrfToken = '';
  }
  document.body.classList.toggle('admin-authenticated', isAdminAuthenticated);
  window.dispatchEvent(new CustomEvent('ron-lore:admin-changed', { detail: { authenticated: isAdminAuthenticated } }));
  updateAdminLoginUi();

  if (isAdminAuthenticated && allowRedirect) {
    redirectToAdminOrigin();
  }

  if (isAdminAuthenticated && !wasAdminAuthenticated) {
    loadSavedTags();
    loadSavedMissionDb();
    refreshBoardFromSearch();
    buildTimeline();
    buildPeopleBoard();
    refreshRenderedTagColors();
    startAutoSync();
    startPresenceLoop();
  }

  if (!isAdminAuthenticated && wasAdminAuthenticated) {
    stopAutoSync();
    stopPresenceLoop();
    lastPresenceText = '';
    resetMissionTagsToBase();
    applySharedMissionDb();
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
    if (document.querySelector('#settings-page-tags.active')) showSettingsPage('legal');
  }

  if (activeModalMission && activeModalDlc) {
    const modalTags = modalMeta.querySelector('.modal-tags');
    if (modalTags) renderTagEditor(modalTags, activeModalMission, activeModalDlc);
    refreshStructuredEditors();
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
    currentEditorName = session.editor?.name || '';
    csrfToken = session.csrfToken || '';
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
  currentEditorName = session.editor?.name || '';
  csrfToken = session.csrfToken || '';
  setAdminAuthenticated(session.authenticated === true);
}

async function logoutAdmin() {
  try {
    await fetch(getApiUrl('/auth/logout'), {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json', 'X-CSRF-Token': csrfToken }
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

function getSteamStatusLabel(status) {
  if (status === null || status === undefined) return 'Statut Steam indisponible';
  return {
    0: 'Hors ligne',
    1: 'En ligne',
    2: 'Occupé',
    3: 'Absent',
    4: 'Sommeil',
    5: 'Recherche échange',
    6: 'Recherche partie'
  }[status] || 'Statut Steam';
}

function getSteamStatusClass(status) {
  return {
    0: 'offline',
    1: 'online',
    2: 'busy',
    3: 'away',
    4: 'away',
    5: 'looking',
    6: 'looking'
  }[status] || 'unknown';
}

function getCreatorPresenceLabel(creator) {
  if (creator.game) return `Joue à : ${creator.game}`;
  return getSteamStatusLabel(creator.status);
}

function getCreatorPresenceClass(creator) {
  if (creator.game) return 'playing';
  return getSteamStatusClass(creator.status);
}

function getCreatorCallsign(creator, index) {
  const source = (creator.name || creator.role || `Agent ${index + 1}`).trim();
  return source.split(/\s+/)[0].replace(/[^a-z0-9_-]/gi, '') || `Agent ${index + 1}`;
}

function getCreatorRegistryNumber(creator, index) {
  if (creator.steamId) return String(creator.steamId);
  return `STEAM-ID-${String(index + 1).padStart(5, '0')}`;
}

function getCreatorNameParts(creator, index) {
  const fallback = getCreatorCallsign(creator, index);
  const rawName = (creator.name || fallback).trim();
  const parts = rawName.split(/\s+/).filter(Boolean);
  return {
    lastName: parts.length > 1 ? parts.slice(1).join(' ') : rawName,
    firstName: parts.length > 1 ? parts[0] : fallback,
    callsign: getCreatorCallsign(creator, index)
  };
}

function getCreatorAssignment(index) {
  return index === 0 ? 'Commandement RoN Lore' : 'Division Integrite Operationnelle';
}

function getCreatorMissionNames() {
  return DATA.flatMap(dlc => dlc.missions.map(item => item.name)).filter(name => !/^SecretEnd/i.test(name));
}

function createCreatorRedaction(text, className = '') {
  const mark = document.createElement('span');
  mark.className = `creator-redaction ${className}`.trim();
  mark.textContent = text;
  return mark;
}

function createCreatorTypeLine(label, value) {
  const line = document.createElement('div');
  line.className = 'creator-type-line';
  line.append(makeTextElement('span', 'creator-type-label', `${label} :`), value);
  return line;
}

function createCreatorSteamIdLink(creator, index) {
  const steamId = getCreatorRegistryNumber(creator, index);
  const profileUrl = creator.profileUrl || (creator.steamId ? `https://steamcommunity.com/profiles/${creator.steamId}` : '');
  if (!profileUrl) return document.createTextNode(steamId);

  const link = document.createElement('a');
  link.className = 'creator-steam-id-link';
  link.href = profileUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = steamId;
  link.setAttribute('aria-label', `Ouvrir le profil Steam ${steamId}`);
  return link;
}

function createCreatorDossierStamp() {
  const stamp = document.createElement('img');
  stamp.className = 'creator-dossier-stamp';
  stamp.setAttribute('aria-hidden', 'true');
  stamp.src = 'assets/creator-fisa.webp';
  stamp.alt = '';
  return stamp;
}

function getCreatorReadyOrNotPlaytimeLabel(creator) {
  const minutes = Number(creator.readyOrNotPlaytimeMinutes);
  if (!Number.isFinite(minutes) || minutes < 0) return 'N/A';
  const hours = minutes / 60;
  if (hours < 1) return `${minutes} min`;
  return `${hours.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} h`;
}

function getDefaultCreators() {
  return [
    { name: 'LORIQUEEE', role: 'Createur RoN Lore', status: null, note: 'Conception, contenu et direction du dossier.' },
    { name: 'AURUM', role: 'Createur RoN Lore', status: null, note: 'Recherche, soutien et verification des dossiers.' }
  ];
}

function loadCreatorMask() {
  if (creatorMaskImage) return creatorMaskImage;
  creatorMaskImage = new Image();
  creatorMaskImage.src = 'assets/creator-mask.webp';
  creatorMaskImage.addEventListener('load', () => {
    creatorMaskCanvas = document.createElement('canvas');
    creatorMaskCanvas.width = creatorMaskImage.naturalWidth;
    creatorMaskCanvas.height = creatorMaskImage.naturalHeight;
    creatorMaskContext = creatorMaskCanvas.getContext('2d', { willReadFrequently: true });
    creatorMaskContext.drawImage(creatorMaskImage, 0, 0);
    creatorHighlightUrls = createCreatorHighlightUrls();
    document.querySelectorAll('.creator-scene').forEach(scene => applyCreatorHighlightImages(scene));
  });
  return creatorMaskImage;
}

function createCreatorHighlightUrls() {
  if (!creatorMaskCanvas || !creatorMaskContext) return null;
  const width = creatorMaskCanvas.width;
  const height = creatorMaskCanvas.height;
  const source = creatorMaskContext.getImageData(0, 0, width, height);
  const urls = [];

  for (let index = 0; index < 2; index += 1) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    const output = context.createImageData(width, height);
    const startX = index === 0 ? 0 : Math.floor(width / 2);
    const endX = index === 0 ? Math.floor(width / 2) : width;

    for (let y = 0; y < height; y += 1) {
      for (let x = startX; x < endX; x += 1) {
        const pixelIndex = (y * width + x) * 4;
        const isWhite = source.data[pixelIndex] > 170 && source.data[pixelIndex + 1] > 170 && source.data[pixelIndex + 2] > 170;
        if (!isWhite) continue;
        output.data[pixelIndex] = 231;
        output.data[pixelIndex + 1] = 76;
        output.data[pixelIndex + 2] = 60;
        output.data[pixelIndex + 3] = 54;
      }
    }

    context.putImageData(output, 0, 0);
    urls.push(canvas.toDataURL('image/png'));
  }

  return urls;
}

function applyCreatorHighlightImages(scene) {
  if (!creatorHighlightUrls) return;
  scene.querySelectorAll('.creator-mask-highlight').forEach((image, index) => {
    image.src = creatorHighlightUrls[index] || '';
  });
}

function getCreatorMaskPoint(scene, event) {
  if (!creatorMaskImage?.complete || !creatorMaskContext) return null;
  const rect = scene.getBoundingClientRect();
  const front = scene.querySelector('.creator-layer.front');
  const frontStyle = getComputedStyle(front);
  const matrix = new DOMMatrixReadOnly(frontStyle.transform === 'none' ? undefined : frontStyle.transform);
  const sceneRatio = rect.width / rect.height;
  const maskRatio = creatorMaskImage.naturalWidth / creatorMaskImage.naturalHeight;
  let renderedWidth = rect.width;
  let renderedHeight = rect.height;
  let offsetX = 0;
  let offsetY = 0;

  if (sceneRatio > maskRatio) {
    renderedWidth = rect.height * maskRatio;
    offsetX = (rect.width - renderedWidth) / 2;
  } else if (sceneRatio < maskRatio) {
    renderedHeight = rect.width / maskRatio;
    offsetY = (rect.height - renderedHeight) / 2;
  }

  const localX = event.clientX - rect.left - offsetX - matrix.m41;
  const localY = event.clientY - rect.top - offsetY - matrix.m42;
  if (localX < 0 || localY < 0 || localX > renderedWidth || localY > renderedHeight) return null;

  return {
    x: Math.floor((localX / renderedWidth) * creatorMaskImage.naturalWidth),
    y: Math.floor((localY / renderedHeight) * creatorMaskImage.naturalHeight)
  };
}

function getCreatorMaskHit(scene, event) {
  const point = getCreatorMaskPoint(scene, event);
  if (!point) return -1;
  const pixel = creatorMaskContext.getImageData(point.x, point.y, 1, 1).data;
  const isWhite = pixel[0] > 170 && pixel[1] > 170 && pixel[2] > 170;
  if (!isWhite) return -1;
  return point.x < creatorMaskImage.naturalWidth / 2 ? 0 : 1;
}

function renderCreatorFallback(message) {
  if (!creatorGrid) return;
  clearElement(creatorGrid);
  creatorGrid.appendChild(makeTextElement('div', 'creator-empty', message));
}

function openCreatorDossier(scene, creators, index) {
  const creator = creators[index];
  const dossier = scene.querySelector('.creator-dossier');
  if (!creator || !dossier) return;

  scene.querySelectorAll('.creator-hotspot').forEach((hotspot, hotspotIndex) => {
    hotspot.classList.toggle('active', hotspotIndex === index);
  });

  const note = creator.note || 'Agent rattache au dossier RoN Lore.';
  const identity = getCreatorNameParts(creator, index);
  const missions = getCreatorMissionNames();
  const missionSplit = Math.ceil(missions.length / 2);

  dossier.innerHTML = '';
  dossier.classList.add('open');
  dossier.setAttribute('aria-hidden', 'false');
  scene.classList.add('dossier-open');

  const head = document.createElement('div');
  head.className = 'creator-dossier-head';
  const seal = document.createElement('img');
  seal.className = 'creator-dossier-seal';
  seal.setAttribute('aria-label', 'City of Los Suenos Police Department');
  seal.src = 'assets/creator-lspd.webp';
  seal.alt = 'City of Los Suenos';
  const heading = makeTextElement('div', 'creator-dossier-name', 'LOS SUENOS POLICE DEPARTMENT');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'creator-dossier-close';
  close.setAttribute('aria-label', 'Fermer la fiche agent');
  close.textContent = 'X';
  close.addEventListener('click', () => {
    dossier.classList.remove('open');
    dossier.setAttribute('aria-hidden', 'true');
    scene.classList.remove('dossier-open');
    scene.querySelectorAll('.creator-hotspot').forEach(hotspot => hotspot.classList.remove('active'));
  });
  head.append(seal, heading, close);

  const identityBlock = document.createElement('section');
  identityBlock.className = 'creator-dossier-id';
  const identityTop = document.createElement('div');
  identityTop.className = 'creator-dossier-id-top';

  const photoFrame = document.createElement('div');
  photoFrame.className = 'creator-dossier-photo-frame';
  const photo = document.createElement('img');
  photo.className = 'creator-dossier-photo';
  photo.src = creator.avatar || 'assets/ready_or_not_lore_logo.webp';
  photo.alt = creator.name || 'Portrait agent';
  photo.loading = 'lazy';
  photoFrame.appendChild(photo);

  const photoMeta = document.createElement('div');
  photoMeta.className = 'creator-dossier-photo-meta';
  photoMeta.append(
    createCreatorTypeLine('Statut', document.createTextNode(getCreatorPresenceLabel(creator))),
    createCreatorTypeLine('Heures en operation', document.createTextNode(getCreatorReadyOrNotPlaytimeLabel(creator)))
  );
  const mainFields = document.createElement('div');
  mainFields.className = 'creator-dossier-main-fields';
  mainFields.append(
    createCreatorTypeLine('Nom', createCreatorRedaction(identity.lastName, 'short')),
    createCreatorTypeLine('Prenom', createCreatorRedaction(identity.firstName)),
    createCreatorTypeLine('Callsign', document.createTextNode(creator.name || identity.callsign)),
    createCreatorTypeLine('ID', createCreatorSteamIdLink(creator, index)),
    createCreatorTypeLine('Grade', document.createTextNode(index === 0 ? 'Lieutenant I' : 'Inspecteur')),
    createCreatorTypeLine('Unite', createCreatorRedaction(getCreatorAssignment(index), 'wide'))
  );

  const sideFields = document.createElement('div');
  sideFields.className = 'creator-dossier-side-fields';
  sideFields.append(
    createCreatorTypeLine('Taille', createCreatorRedaction('1.82 m', 'tiny')),
    createCreatorTypeLine('Poids', createCreatorRedaction('N/A', 'tiny')),
    createCreatorTypeLine('Groupe Sanguin', createCreatorRedaction('O+', 'tiny')),
    createCreatorTypeLine('Observation', document.createTextNode('N/A'))
  );

  identityTop.append(photoFrame, mainFields, sideFields);
  identityBlock.append(identityTop, photoMeta);

  const cases = document.createElement('section');
  cases.className = 'creator-dossier-section creator-dossier-cases';
  cases.appendChild(makeTextElement('div', 'creator-dossier-section-title', 'Dossiers traites :'));
  const caseGrid = document.createElement('div');
  caseGrid.className = 'creator-case-grid';
  [missions.slice(0, missionSplit), missions.slice(missionSplit)].forEach(group => {
    const list = document.createElement('ul');
    group.forEach(name => {
      const item = document.createElement('li');
      item.textContent = `${name} [S]`;
      list.appendChild(item);
    });
    caseGrid.appendChild(list);
  });
  const classified = document.createElement('li');
  classified.innerHTML = '<strong>[CLASSIFIED]</strong>';
  caseGrid.lastElementChild?.appendChild(classified);
  cases.appendChild(caseGrid);

  const psych = document.createElement('section');
  psych.className = 'creator-dossier-section creator-dossier-psych';
  psych.append(
    makeTextElement('div', 'creator-dossier-section-title', 'Rapport Psychologique - Acces FISA/R3'),
    createCreatorTypeLine('Evaluateur', createCreatorRedaction('DIV-IO', 'short')),
    makeTextElement('p', '', 'Profil conforme. Tolerance a l ambiguite morale au-dessus des seuils. Incidents anterieurs expurges sur demande FISA.'),
    makeTextElement('p', '', `L agent coopere. Statut : ACTIF - ${creator.game ? 'DEPLOYE' : 'SURVEILLE'}`)
  );

  const foot = document.createElement('div');
  foot.className = 'creator-dossier-foot';
  const signature = document.createElement('div');
  signature.className = 'creator-signature-block';
  const signatureImage = document.createElement('img');
  signatureImage.className = 'creator-signature';
  signatureImage.src = 'assets/creator-ggl.webp';
  signatureImage.alt = 'Signature responsable unite';
  signature.append(
    makeTextElement('div', '', 'Responsable d unite :'),
    signatureImage,
    createCreatorTypeLine('Date', createCreatorRedaction('__/__/____', 'date'))
  );

  const auth = document.createElement('div');
  auth.className = 'creator-auth-block';
  auth.append(
    makeTextElement('div', '', 'Autorisation FISA :'),
    createCreatorDossierStamp(),
    createCreatorTypeLine('Ref', createCreatorRedaction(`FISA-${String(index + 7).padStart(3, '0')}`, 'short'))
  );

  foot.append(signature, auth);

  const watermark = document.createElement('img');
  watermark.className = 'creator-dossier-watermark';
  watermark.src = 'assets/creator-fisa.webp';
  watermark.alt = '';
  watermark.setAttribute('aria-hidden', 'true');

  dossier.append(head, watermark, createCreatorDossierStamp(), identityBlock, cases, psych, foot);
  close.focus();
}

function renderSteamCreators(creators) {
  if (!creatorGrid) return;
  clearElement(creatorGrid);

  if (!creators.length) {
    renderCreatorFallback('Aucun créateur configuré.');
    return;
  }

  creators.forEach(creator => {
    const card = document.createElement('article');
    card.className = 'creator-card';

    const avatar = document.createElement('img');
    avatar.className = 'creator-avatar';
    avatar.src = creator.avatar || 'assets/ready_or_not_lore_logo.webp';
    avatar.alt = creator.name || 'Créateur Steam';
    avatar.loading = 'lazy';

    const body = document.createElement('div');
    body.className = 'creator-body';

    const name = makeTextElement('h3', 'creator-name', creator.name || 'Créateur');
    const role = makeTextElement('div', 'creator-role', creator.role || 'Créateur');
    const status = makeTextElement('div', `creator-status ${getCreatorPresenceClass(creator)}`, getCreatorPresenceLabel(creator));

    body.append(name, role, status);
    if (creator.note) body.appendChild(makeTextElement('p', 'creator-note', creator.note));

    card.append(avatar, body);
    creatorGrid.appendChild(card);
  });
}

function renderSteamCreatorsScene(creators) {
  if (!creatorGrid) return;
  clearElement(creatorGrid);
  loadCreatorMask();

  if (!creators.length) {
    renderCreatorFallback('Aucun createur configure.');
    return;
  }

  const scene = document.createElement('div');
  scene.className = 'creator-scene';

  const back = document.createElement('img');
  back.className = 'creator-layer back';
  back.src = 'assets/creator-back.webp';
  back.alt = '';
  back.setAttribute('aria-hidden', 'true');

  const front = document.createElement('img');
  front.className = 'creator-layer front';
  front.src = 'assets/creator-front.webp';
  front.alt = '';
  front.setAttribute('aria-hidden', 'true');

  const dossier = document.createElement('aside');
  dossier.className = 'creator-dossier';
  dossier.setAttribute('aria-hidden', 'true');

  scene.append(back, front);

  ['left', 'right'].forEach((side, index) => {
    const highlight = document.createElement('img');
    highlight.className = `creator-mask-highlight ${side}`;
    highlight.alt = '';
    highlight.setAttribute('aria-hidden', 'true');
    if (creatorHighlightUrls?.[index]) highlight.src = creatorHighlightUrls[index];
    scene.appendChild(highlight);
  });

  creators.slice(0, 2).forEach((creator, index) => {
    const hotspot = document.createElement('button');
    hotspot.type = 'button';
    hotspot.className = `creator-hotspot ${index === 0 ? 'left' : 'right'}`;
    hotspot.setAttribute('aria-label', `Ouvrir la fiche de ${creator.name || getCreatorCallsign(creator, index)}`);

    const tag = makeTextElement('span', 'creator-tag', getCreatorCallsign(creator, index));
    hotspot.appendChild(tag);
    hotspot.addEventListener('focus', () => hotspot.classList.add('active'));
    hotspot.addEventListener('blur', () => hotspot.classList.remove('active'));
    hotspot.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      openCreatorDossier(scene, creators, index);
    });

    scene.appendChild(hotspot);
  });

  scene.appendChild(dossier);
  applyCreatorHighlightImages(scene);
  scene.addEventListener('pointermove', e => {
    if (e.target.closest('.creator-dossier')) {
      scene.classList.remove('hover-left', 'hover-right');
      scene.style.cursor = '';
      return;
    }
    const rect = scene.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 28;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 18;
    scene.style.setProperty('--parallax-x', `${x}px`);
    scene.style.setProperty('--parallax-y', `${y}px`);
    const hitIndex = getCreatorMaskHit(scene, e);
    scene.classList.toggle('hover-left', hitIndex === 0);
    scene.classList.toggle('hover-right', hitIndex === 1);
    scene.style.cursor = hitIndex >= 0 ? 'pointer' : '';
  });
  scene.addEventListener('click', e => {
    if (e.target.closest('.creator-dossier')) return;
    const hitIndex = getCreatorMaskHit(scene, e);
    if (hitIndex < 0) return;
    openCreatorDossier(scene, creators, hitIndex);
  });
  scene.addEventListener('pointerleave', () => {
    scene.style.setProperty('--parallax-x', '0px');
    scene.style.setProperty('--parallax-y', '0px');
    scene.classList.remove('hover-left', 'hover-right');
    scene.style.cursor = '';
  });

  creatorGrid.appendChild(scene);
}

async function loadSteamCreators({ render = true } = {}) {
  if (render && !creatorGrid) return;
  if (!hasConfiguredApiBase()) {
    const creators = getDefaultCreators();
    window.__ronLoreSteamCreators = creators;
    window.dispatchEvent(new CustomEvent('ron-lore:creators-loaded', { detail: creators }));
    if (render) renderSteamCreatorsScene(creators);
    return;
  }

  if (render) renderCreatorFallback('Chargement des profils Steam...');

  try {
    const response = await fetch(getApiUrl('/creators/steam'), {
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Steam creators unavailable');
    const body = await response.json();
    const creators = body.creators || [];
    window.__ronLoreSteamCreators = creators;
    window.dispatchEvent(new CustomEvent('ron-lore:creators-loaded', { detail: creators }));
    if (render) renderSteamCreatorsScene(creators);
  } catch {
    const creators = getDefaultCreators();
    window.__ronLoreSteamCreators = creators;
    window.dispatchEvent(new CustomEvent('ron-lore:creators-loaded', { detail: creators }));
    if (render) renderSteamCreatorsScene(creators);
    return;
  }
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

function makeSafeFileId(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'mission';
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

function applyMissionDbMapToData(dbMap) {
  Object.values(dbMap || {}).forEach(saved => {
    const localId = saved.localId || saved.id;
    const entry = getAllMissionEntries().find(({ dlc, mission }) => {
      return getMissionKey(dlc, mission) === localId || normalizeTagValue(mission.name) === saved.missionId;
    });
    if (!entry) return;

    const { mission } = entry;
    if (Array.isArray(saved.tags)) mission.tags = [...saved.tags];
    if (typeof saved.summary === 'string') mission.brief = saved.summary;
    if (typeof saved.summaryHtml === 'string') mission.briefHtml = saved.summaryHtml;
    if (saved.people?.civilians) mission.civilians = [...saved.people.civilians];
    if (saved.people?.suspects) mission.suspects = [...saved.people.suspects];
    if (Array.isArray(saved.evidence)) mission.evidence = [...saved.evidence];
  });
}

function getMissionDbStorageKey(missionDb) {
  return missionDb.localId || missionDb.id || '';
}

function createLayoutFromMissionVisual(missionDb) {
  return (missionDb.visual?.sections || [])
    .filter(section => section?.id)
    .map(section => ({
      id: section.id,
      left: section.style?.left || '',
      top: section.style?.top || '',
      width: section.style?.width || '',
      minHeight: section.style?.minHeight || ''
    }));
}

function createBlocksFromMissionVisual(missionDb) {
  const sections = missionDb.visual?.sections || [];
  const sectionOverrides = sections
    .filter(section => section?.id && section.kind !== 'custom')
    .map(section => ({
      id: section.id,
      title: section.title || '',
      custom: section.custom || {}
    }));
  const customSections = sections
    .filter(section => section?.id && section.kind === 'custom')
    .map(section => ({
      id: section.id,
      title: section.title || 'NOUVELLE COLONNE',
      style: section.style || {},
      custom: section.custom || {}
    }));

  return {
    sectionOverrides,
    customSections,
    blocks: missionDb.visual?.blocks || []
  };
}

function applySharedMissionDb() {
  applyMissionDbMapToData(sharedMissionDbMap);
}

function saveMissionDbIndex(dbMap) {
  localStorage.setItem(MISSION_DB_INDEX_STORAGE_KEY, JSON.stringify({
    updatedAt: new Date().toISOString(),
    missions: Object.values(dbMap)
  }));
}

function mergeSharedMissionDbIntoLocalStorage(missions, options = {}) {
  const dbMap = getMissionDbMap();
  const pushedMap = getMissionDbPushedMap();
  const skipped = [];
  let changed = 0;

  missions.forEach(missionDb => {
    const key = getMissionDbStorageKey(missionDb);
    if (!key) return;

    const local = dbMap[key];
    const localIsPending = local && pushedMap[key] !== local.updatedAt;
    const isActiveEditingMission = activeModalEditMode && activeModalMissionKey === key;

    if (!options.force && (localIsPending || isActiveEditingMission)) {
      skipped.push(missionDb.title || key);
      return;
    }

    if (JSON.stringify(local || null) === JSON.stringify(missionDb || null)) {
      pushedMap[key] = missionDb.updatedAt || '';
      return;
    }

    dbMap[key] = missionDb;
    pushedMap[key] = missionDb.updatedAt || '';
    changed += 1;
  });

  saveMissionDbMap(dbMap);
  saveMissionDbPushedMap(pushedMap);
  saveMissionDbIndex(dbMap);
  updatePendingPushUi();

  return { changed, skipped };
}

async function loadSharedMissionDbFromApi(options = {}) {
  if (!hasConfiguredApiBase()) return { changed: 0, skipped: [] };

  try {
    const response = await fetch(getApiUrl('/data/missions'), {
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Shared mission DB unavailable');

    const body = await response.json();
    const missionDbMap = {};
    const layoutMap = {};
    const blocksMap = {};

    (body.missions || []).forEach(missionDb => {
      const key = getMissionDbStorageKey(missionDb);
      if (!key) return;
      missionDbMap[key] = missionDb;

      const layout = createLayoutFromMissionVisual(missionDb);
      if (layout.length > 0) layoutMap[key] = layout;

      const blocks = createBlocksFromMissionVisual(missionDb);
      if (blocks.sectionOverrides.length > 0 || blocks.customSections.length > 0 || blocks.blocks.length > 0) {
        blocksMap[key] = blocks;
      }
    });

    sharedMissionDbMap = missionDbMap;
    sharedModalLayoutMap = layoutMap;
    sharedModalBlocksMap = blocksMap;
    applySharedMissionDb();
    if (options.updateLocalStorage) {
      return mergeSharedMissionDbIntoLocalStorage(Object.values(missionDbMap), options);
    }
    return { changed: Object.keys(missionDbMap).length, skipped: [] };
  } catch {
    // The static data remains usable if the shared backend is asleep or not deployed yet.
    return { changed: 0, skipped: [] };
  }
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

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value ?? null));
}

function createMissionSnapshot(mission) {
  return {
    tags: [...(mission.tags || [])],
    summary: mission.brief || '',
    summaryHtml: mission.briefHtml || '',
    civilians: cloneJson(mission.civilians || []),
    suspects: cloneJson(mission.suspects || []),
    evidence: cloneJson(mission.evidence || [])
  };
}

function valuesDiffer(left, right) {
  return JSON.stringify(left ?? null) !== JSON.stringify(right ?? null);
}

function getMissionDbMap() {
  try {
    return JSON.parse(localStorage.getItem(MISSION_DB_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function loadSavedMissionDb() {
  if (!requireAdmin()) return;
  const dbMap = getMissionDbMap();
  applyMissionDbMapToData(dbMap);
}

function saveMissionDbMap(dbMap) {
  if (!requireAdmin()) return;
  try {
    localStorage.setItem(MISSION_DB_STORAGE_KEY, JSON.stringify(dbMap));
    localStorage.setItem(MISSION_DB_INDEX_STORAGE_KEY, JSON.stringify({
      updatedAt: new Date().toISOString(),
      missions: Object.values(dbMap)
    }));
    updatePendingPushUi();
  } catch {
    // Mission DB generation still works for the current session if storage is unavailable.
  }
}

function getMissionDbPushedMap() {
  try {
    return JSON.parse(localStorage.getItem(MISSION_DB_PUSHED_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveMissionDbPushedMap(pushedMap) {
  try {
    localStorage.setItem(MISSION_DB_PUSHED_STORAGE_KEY, JSON.stringify(pushedMap));
  } catch {
    // Pending push status is only a local convenience.
  }
}

function markMissionDbPushed(missions) {
  const pushedMap = getMissionDbPushedMap();
  missions.forEach(missionDb => {
    pushedMap[missionDb.id] = missionDb.updatedAt || new Date().toISOString();
  });
  saveMissionDbPushedMap(pushedMap);
  updatePendingPushUi();
}

function getPendingMissionDbs() {
  const pushedMap = getMissionDbPushedMap();
  return Object.values(getMissionDbMap()).filter(missionDb => pushedMap[missionDb.id] !== missionDb.updatedAt);
}

function getCountDiffLabel(label, before, after) {
  if (before === after) return `${label} modifies.`;
  if (after > before) return `${after - before} ${label.toLowerCase()} ajoute(s), ${after} au total.`;
  return `${before - after} ${label.toLowerCase()} retire(s), ${after} restant(s).`;
}

function getMissionDbDiffs(missionDb) {
  const base = BASE_MISSION_SNAPSHOTS.get(missionDb.id) || {};
  const diffs = [];
  const savedTags = missionDb.tags || [];
  const savedCivilians = missionDb.people?.civilians || [];
  const savedSuspects = missionDb.people?.suspects || [];
  const savedEvidence = missionDb.evidence || [];

  if (valuesDiffer(savedTags, base.tags || [])) {
    diffs.push(`Tags modifies: ${(base.tags || []).length} avant, ${savedTags.length} maintenant.`);
  }
  if ((missionDb.summary || '') !== (base.summary || '') || (missionDb.summaryHtml || '') !== (base.summaryHtml || '')) {
    diffs.push('Texte du briefing modifie.');
  }
  if (valuesDiffer(savedCivilians, base.civilians || [])) {
    diffs.push(getCountDiffLabel('Civils', (base.civilians || []).length, savedCivilians.length));
  }
  if (valuesDiffer(savedSuspects, base.suspects || [])) {
    diffs.push(getCountDiffLabel('Suspects', (base.suspects || []).length, savedSuspects.length));
  }
  if (valuesDiffer(savedEvidence, base.evidence || [])) {
    diffs.push(getCountDiffLabel('Preuves', (base.evidence || []).length, savedEvidence.length));
  }
  if ((missionDb.visual?.blocks || []).length > 0) diffs.push(`${missionDb.visual.blocks.length} bloc(s) visuel(s) sauvegarde(s).`);
  if ((missionDb.visual?.sections || []).some(section => section.kind === 'custom' || Object.keys(section.style || {}).length > 0)) {
    diffs.push('Organisation des colonnes modifiee.');
  }
  return diffs;
}

function renderPushReport() {
  if (!adminPushReportPanel) return;
  clearElement(adminPushReportPanel);
  const pending = getPendingMissionDbs();
  if (pending.length === 0) {
    adminPushReportPanel.appendChild(makeTextElement('div', 'admin-report-empty', 'Aucune modification locale en attente de push.'));
    return;
  }

  pending.forEach(missionDb => {
    const item = document.createElement('div');
    item.className = 'admin-report-item';
    const diffs = getMissionDbDiffs(missionDb);
    const list = document.createElement('ul');
    list.className = 'admin-report-list';
    (diffs.length ? diffs : ['Contenu sauvegarde localement.']).forEach(diff => {
      const line = document.createElement('li');
      line.textContent = diff;
      list.appendChild(line);
    });
    item.append(
      makeTextElement('div', 'admin-report-title', missionDb.title || missionDb.id),
      makeTextElement('div', 'admin-report-meta', `Dans ${missionDb.dlc?.name || 'DLC inconnu'}, cette fiche sera envoyee au backend.`),
      list
    );
    adminPushReportPanel.appendChild(item);
  });
}

function updatePendingPushUi() {
  if (!adminPendingPush || !adminPushReport) return;
  const pendingCount = getPendingMissionDbs().length;
  adminPendingPush.textContent = pendingCount === 0
    ? 'Aucune modification en attente'
    : `${pendingCount} fiche(s) avec modifications en attente de push`;
  adminPushReport.disabled = pendingCount === 0;
  if (!adminPushReportPanel?.hidden) renderPushReport();
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
    summaryHtml: activeModalMission.briefHtml || '',
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
    updatedBy: currentEditorName || 'Admin',
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

function syncCurrentMissionDbFromUi() {
  if (!requireAdmin()) return false;
  if (!activeModalMission || !activeModalDlc || !activeModalMissionKey) {
    setAdminSyncMessage('Ouvre une fiche mission avant de sauvegarder.', 'error');
    return false;
  }
  saveMissionNote();
  saveModalBlocks();
  saveModalLayout();
  syncActiveMissionDb();
  setAdminSyncMessage('Fiche sauvegardee localement.', 'success');
  return true;
}

function getMissionDbPushId(missionDb) {
  return makeSafeFileId(missionDb.missionId || missionDb.title || missionDb.id);
}

async function pushMissionDb(missionDb) {
  const id = getMissionDbPushId(missionDb);
  const payload = {
    ...missionDb,
    id,
    localId: missionDb.id,
    updatedBy: currentEditorName || missionDb.updatedBy || 'Admin',
    pushedAt: new Date().toISOString()
  };
  const response = await fetch(getApiUrl(`/data/missions/${encodeURIComponent(id)}`), {
    method: 'PUT',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify(payload)
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || `Push impossible pour ${id}`);
  }
  return body;
}

async function pushMissionDbMap() {
  if (!requireAdmin()) return;
  if (!hasConfiguredApiBase()) {
    setAdminSyncMessage('Web Service Render non configure.', 'error');
    return;
  }

  if (activeModalMission && activeModalDlc) syncCurrentMissionDbFromUi();
  const missions = getPendingMissionDbs();
  if (missions.length === 0) {
    setAdminSyncMessage('Aucune fiche locale a pousser.', 'success');
    return;
  }

  setAdminSyncLoading(true);
  setAdminSyncMessage(`Push backend en cours: ${missions.length} fiche(s)...`);
  try {
    for (const missionDb of missions) {
      await pushMissionDb(missionDb);
    }
    markMissionDbPushed(missions);
    refreshLatestCommitPill();
    setAdminSyncMessage(`Push backend termine: ${missions.length} fiche(s).`, 'success');
  } catch (error) {
    setAdminSyncMessage(error.message || 'Push backend impossible.', 'error');
  } finally {
    setAdminSyncLoading(false);
  }
}

function getSavedModalLayouts() {
  if (!requireAdmin()) return sharedModalLayoutMap;
  try {
    return {
      ...sharedModalLayoutMap,
      ...(JSON.parse(localStorage.getItem(MODAL_LAYOUT_STORAGE_KEY)) || {})
    };
  } catch {
    return sharedModalLayoutMap;
  }
}

function isAutoSyncEnabled() {
  return localStorage.getItem(AUTO_SYNC_STORAGE_KEY) === 'true';
}

function updateAutoSyncStateLabel(message = '') {
  if (!adminSyncState) return;
  if (!isAdminAuthenticated) {
    adminSyncState.textContent = 'Synchro auto inactive';
    return;
  }

  adminSyncState.textContent = message || (
    isAutoSyncEnabled()
      ? `Synchro auto active toutes les ${AUTO_SYNC_INTERVAL_MS / 1000}s`
      : 'Synchro auto inactive'
  );
  if (lastPresenceText) {
    adminSyncState.textContent = `${adminSyncState.textContent} | ${lastPresenceText}`;
  }
}

function formatPresence(editors) {
  const others = (editors || []).filter(editor => editor.name !== currentEditorName);
  if (others.length === 0) return '';
  const editor = others[0];
  return `${editor.name} modifie : ${editor.title || editor.missionId}`;
}

async function refreshPresence() {
  if (!hasConfiguredApiBase()) return;

  try {
    const response = await fetch(getApiUrl('/presence'), {
      credentials: 'include',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Presence unavailable');
    const body = await response.json();
    lastPresenceText = formatPresence(body.editors);
    updateAutoSyncStateLabel();
  } catch {
    lastPresenceText = '';
    updateAutoSyncStateLabel();
  }
}

async function sendPresence() {
  if (!requireAdmin() || !activeModalEditMode || !activeModalMissionKey || !hasConfiguredApiBase()) return;

  try {
    await fetch(getApiUrl('/presence'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({
        missionId: activeModalMissionKey,
        title: activeModalMission?.name || activeModalMissionKey,
        action: 'editing'
      })
    });
  } catch {
    // Presence is only informative; editing must keep working if it fails.
  }
}

function stopPresenceLoop() {
  if (!presenceTimer) return;
  clearInterval(presenceTimer);
  presenceTimer = null;
}

function startPresenceLoop() {
  stopPresenceLoop();
  if (!isAdminAuthenticated) return;
  sendPresence();
  refreshPresence();
  presenceTimer = setInterval(() => {
    sendPresence();
    refreshPresence();
  }, 10000);
}

async function syncLocalStorageFromBackend(options = {}) {
  if (!requireAdmin() || isSyncingFromBackend) return;
  if (!hasConfiguredApiBase()) {
    setAdminSyncMessage('Web Service Render non configure.', 'error');
    return;
  }

  isSyncingFromBackend = true;
  if (!options.silent) setAdminSyncMessage('Synchro backend en cours...');

  try {
    const result = await loadSharedMissionDbFromApi({ updateLocalStorage: true });
    resetMissionTagsToBase();
    applySharedMissionDb();
    loadSavedTags();
    loadSavedMissionDb();
    refreshBoardFromSearch();
    buildTimeline();
    buildPeopleBoard();
    refreshRenderedTagColors();
    if (activeModalMission && activeModalDlc && !activeModalEditMode) {
      openModal(activeModalMission, activeModalDlc);
    }

    const skippedText = result.skipped.length
      ? ` ${result.skipped.length} fiche(s) locale(s) protegee(s).`
      : '';
    const message = `${result.changed} fiche(s) synchronisee(s).${skippedText}`;
    setAdminSyncMessage(message, 'success');
    updateAutoSyncStateLabel(`Derniere synchro : ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    setAdminSyncMessage(error.message || 'Synchro backend impossible.', 'error');
  } finally {
    isSyncingFromBackend = false;
  }
}

function stopAutoSync() {
  if (!autoSyncTimer) return;
  clearInterval(autoSyncTimer);
  autoSyncTimer = null;
}

function startAutoSync() {
  stopAutoSync();
  if (!isAdminAuthenticated || !isAutoSyncEnabled()) {
    updateAutoSyncStateLabel();
    return;
  }

  autoSyncTimer = setInterval(() => {
    syncLocalStorageFromBackend({ silent: true });
  }, AUTO_SYNC_INTERVAL_MS);
  updateAutoSyncStateLabel();
}

function setAutoSyncEnabled(enabled) {
  localStorage.setItem(AUTO_SYNC_STORAGE_KEY, enabled ? 'true' : 'false');
  if (adminAutoSync) adminAutoSync.checked = enabled;
  if (enabled) {
    syncLocalStorageFromBackend();
  }
  startAutoSync();
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
  if (!requireAdmin()) return sharedModalBlocksMap;
  try {
    return {
      ...sharedModalBlocksMap,
      ...(JSON.parse(localStorage.getItem(MODAL_BLOCKS_STORAGE_KEY)) || {})
    };
  } catch {
    return sharedModalBlocksMap;
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

function updateModalMetaCounts() {
  modalMeta.querySelectorAll('.meta-item').forEach(item => {
    const label = item.childNodes[0]?.textContent || '';
    const value = item.querySelector('span');
    if (!value) return;
    if (label.includes('CIVILIANS')) value.textContent = (activeModalMission?.civilians || []).length;
    if (label.includes('SUSPECTS')) value.textContent = (activeModalMission?.suspects || []).length;
  });
}

function getResourceLabel(item, fallback) {
  if (typeof item === 'string') return item || fallback;
  return item?.name || item?.title || fallback;
}

function getResourceMeta(item) {
  if (typeof item === 'string') return '';
  if (item?.image || item?.img || item?.thumb) return 'Image';
  if (item?.desc) return 'Texte';
  return 'A compléter';
}

function getImageBankItems() {
  try {
    return JSON.parse(localStorage.getItem(IMAGE_BANK_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveImageBankItems(items) {
  try {
    localStorage.setItem(IMAGE_BANK_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Image bank remains usable for the current session if storage quota is full.
  }
}

function closeImageContextMenu() {
  if (!imageContextMenu) return;
  activeImageContextId = '';
  imageContextMenu.classList.remove('open');
  imageContextMenu.setAttribute('aria-hidden', 'true');
}

function openImageContextMenu(event, imageId) {
  if (!imageContextMenu) return;
  event.preventDefault();
  activeImageContextId = imageId;
  imageContextMenu.style.left = `${Math.min(event.clientX, window.innerWidth - 170)}px`;
  imageContextMenu.style.top = `${Math.min(event.clientY, window.innerHeight - 100)}px`;
  imageContextMenu.classList.add('open');
  imageContextMenu.setAttribute('aria-hidden', 'false');
}

function showImageNameDialog(title, initialValue = '') {
  lastImageNameFocusedElement = document.activeElement;
  imageNameTitle.textContent = title;
  imageNameInput.value = initialValue;
  imageNameBg.classList.add('open');
  imageNameBg.setAttribute('aria-hidden', 'false');
  imageNameInput.focus();
  imageNameInput.select();

  return new Promise(resolve => {
    imageNameResolve = resolve;
  });
}

function closeImageNameDialog(value) {
  if (!imageNameResolve) return;
  const resolve = imageNameResolve;
  imageNameResolve = null;
  imageNameBg.classList.remove('open');
  imageNameBg.setAttribute('aria-hidden', 'true');
  if (lastImageNameFocusedElement) lastImageNameFocusedElement.focus();
  resolve(value);
}

async function renameImageBankItem(imageId) {
  const images = getImageBankItems();
  const image = images.find(item => item.id === imageId);
  if (!image) return;
  const nextName = await showImageNameDialog('Renommer l’image', image.name);
  if (!nextName) return;
  image.name = nextName.trim() || image.name;
  saveImageBankItems(images);
  renderImageBank();
  refreshStructuredEditors();
}

async function deleteImageBankItem(imageId) {
  const images = getImageBankItems();
  const image = images.find(item => item.id === imageId);
  if (!image) return;
  const confirmed = await showConfirm(`Supprimer "${image.name}" de la banque d’images ?`, 'Supprimer');
  if (!confirmed) return;
  saveImageBankItems(images.filter(item => item.id !== imageId));
  renderImageBank();
  refreshStructuredEditors();
}

function renderImageBank() {
  if (!imageBank) return;
  clearElement(imageBank);
  const images = getImageBankItems();
  if (images.length === 0) {
    imageBank.appendChild(makeTextElement('div', 'image-bank-empty', 'Aucune image importée'));
    return;
  }

  images.forEach(image => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'image-bank-item';
    button.draggable = true;
    button.dataset.imageUrl = image.dataUrl;
    button.title = image.name;
    button.append(
      makeImage(image.dataUrl, image.name, ''),
      makeTextElement('span', 'image-bank-caption', image.name)
    );
    button.addEventListener('contextmenu', event => openImageContextMenu(event, image.id));
    button.addEventListener('dragstart', event => {
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('text/plain', image.dataUrl);
      event.dataTransfer.setData('application/x-ron-lore-image', image.dataUrl);
    });
    button.addEventListener('click', () => {
      navigator.clipboard?.writeText(image.dataUrl);
      button.classList.add('copied');
      window.setTimeout(() => button.classList.remove('copied'), 700);
    });
    imageBank.appendChild(button);
  });
}

function getUploadSafeName(fileName) {
  return String(fileName || 'image')
    .replace(/\.[^.]+$/, '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 42) || 'image';
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function importImageBankFiles(files) {
  const selectedFiles = [...files].filter(file => ['image/png', 'image/jpeg', 'image/webp'].includes(file.type));
  if (selectedFiles.length === 0) return;
  const existing = getImageBankItems();
  for (const file of selectedFiles) {
    const defaultName = getUploadSafeName(file.name);
    const requestedName = await showImageNameDialog('Nommer l’image', defaultName);
    const name = String(requestedName || defaultName).trim() || defaultName;
    const uploaded = await uploadManagedImage(file, 'reports', name);
    existing.unshift({
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      dataUrl: uploaded.url || uploaded.path,
      assetPath: uploaded.path || '',
      type: `image/${uploaded.format || 'webp'}`,
      createdAt: new Date().toISOString()
    });
  }
  saveImageBankItems(existing.slice(0, 80));
  renderImageBank();
  refreshStructuredEditors();
}

function getResourceSearchText(resource) {
  return [
    resource.label,
    resource.typeLabel,
    resource.missionName,
    resource.dlcName,
    resource.meta
  ].join(' ').toLowerCase();
}

function getAllResourceBankItems() {
  const resources = [];
  DATA.forEach(dlc => {
    dlc.missions.forEach(mission => {
      const missionKey = getMissionKey(dlc, mission);
      (mission.civilians || []).forEach((item, index) => {
        resources.push({
          type: 'civilian',
          typeLabel: 'Civil',
          sectionId: 'civilians',
          item,
          index,
          mission,
          dlc,
          missionKey,
          missionName: mission.name,
          dlcName: dlc.name,
          label: getResourceLabel(item, `Civil ${index + 1}`),
          meta: getResourceMeta(item)
        });
      });
      (mission.suspects || []).forEach((item, index) => {
        resources.push({
          type: 'suspect',
          typeLabel: 'Suspect',
          sectionId: 'suspects',
          item,
          index,
          mission,
          dlc,
          missionKey,
          missionName: mission.name,
          dlcName: dlc.name,
          label: getResourceLabel(item, `Suspect ${index + 1}`),
          meta: getResourceMeta(item)
        });
      });
      (mission.evidence || []).forEach((item, index) => {
        resources.push({
          type: 'evidence',
          typeLabel: 'Preuve',
          sectionId: 'evidence',
          item,
          index,
          mission,
          dlc,
          missionKey,
          missionName: mission.name,
          dlcName: dlc.name,
          label: getResourceLabel(item, `Preuve ${index + 1}`),
          meta: getResourceMeta(item)
        });
      });
    });
  });
  return resources;
}

function getFilteredResourceBankItems() {
  const query = activeResourceBankSearch.trim().toLowerCase();
  return getAllResourceBankItems().filter(resource => {
    const matchesType = activeResourceBankFilter === 'all' || resource.type === activeResourceBankFilter;
    const matchesSearch = !query || getResourceSearchText(resource).includes(query);
    return matchesType && matchesSearch;
  });
}

function focusStructuredResource(type, index, sectionId) {
  const selector = type === 'evidence'
    ? `.section[data-section-id="${sectionId}"] .structured-evidence-card[data-index="${index}"]`
    : `.section[data-section-id="${sectionId}"] .structured-person-card[data-person-type="${type}"][data-index="${index}"]`;
  const card = modalGrid.querySelector(selector);
  if (!card) return;
  card.scrollIntoView({ block: 'center', behavior: 'smooth' });
  card.classList.add('resource-highlight');
  window.setTimeout(() => card.classList.remove('resource-highlight'), 900);
  card.querySelector('.structured-person-field')?.focus({ preventScroll: true });
}

function renderResourceBank() {
  if (!resourceBank) return;
  clearElement(resourceBank);
  const resources = getFilteredResourceBankItems();
  if (resources.length === 0) {
    resourceBank.appendChild(makeTextElement('div', 'resource-bank-empty', 'Aucune ressource'));
    return;
  }

  const groups = new Map();
  resources.forEach(resource => {
    const key = resource.missionKey;
    if (!groups.has(key)) {
      groups.set(key, {
        missionName: resource.missionName,
        dlcName: resource.dlcName,
        isActive: key === activeModalMissionKey,
        items: []
      });
    }
    groups.get(key).items.push(resource);
  });

  [...groups.values()].forEach(group => {
    const section = document.createElement('section');
    section.className = 'resource-bank-group';
    section.classList.toggle('active', group.isActive);

    const head = document.createElement('div');
    head.className = 'resource-bank-head';
    head.append(
      makeTextElement('div', 'resource-bank-title', group.missionName),
      makeTextElement('div', 'resource-bank-count', String(group.items.length))
    );
    head.appendChild(makeTextElement('div', 'resource-bank-context', group.dlcName));

    const list = document.createElement('div');
    list.className = 'resource-bank-list';
    group.items.forEach(resource => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `resource-bank-item ${resource.type}`;
      button.append(
        makeTextElement('span', 'resource-bank-item-type', resource.typeLabel),
        makeTextElement('span', 'resource-bank-item-name', resource.label),
        makeTextElement('span', 'resource-bank-item-meta', resource.meta)
      );
      button.addEventListener('click', () => {
        if (resource.missionKey !== activeModalMissionKey) {
          openModal(resource.mission, resource.dlc);
          setModalEditMode(true);
        }
        window.setTimeout(() => focusStructuredResource(resource.type, resource.index, resource.sectionId), 0);
      });
      list.appendChild(button);
    });

    section.append(head, list);
    resourceBank.appendChild(section);
  });
}

function renderEditorBanks() {
  renderImageBank();
  renderResourceBank();
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
  updateSectionEditorControls(isEditing);
}

function updateSectionEditorControls(isEditing = activeModalEditMode) {
  modalGrid.querySelectorAll('.section').forEach(section => {
    section.querySelector(':scope > .editor-section-tools')?.remove();
  });
}

function refreshStructuredEditors() {
  const briefBody = modalGrid.querySelector('.section[data-section-id="brief"] .section-body');
  if (briefBody && activeModalMission) {
    renderBriefingSection(briefBody, activeModalMission);
  }
  const civiliansBody = modalGrid.querySelector('.section[data-section-id="civilians"] .section-body');
  if (civiliansBody && activeModalMission) {
    renderStructuredPeopleSection(civiliansBody, activeModalMission.civilians || [], 'civilian');
  }
  const suspectsBody = modalGrid.querySelector('.section[data-section-id="suspects"] .section-body');
  if (suspectsBody && activeModalMission) {
    renderStructuredPeopleSection(suspectsBody, activeModalMission.suspects || [], 'suspect');
  }
  const evidenceBody = modalGrid.querySelector('.section[data-section-id="evidence"] .section-body');
  if (evidenceBody && activeModalMission) {
    renderStructuredEvidenceSection(evidenceBody, activeModalMission.evidence || []);
  }
  renderResourceBank();
}

function setDeleteMode(isDeleting) {
  if (isDeleting && !requireAdmin()) return;
  activeDeleteMode = isDeleting;
  modalBg.classList.toggle('delete-mode', isDeleting);
  deleteModeToggle?.classList.toggle('active', isDeleting);
  deleteModeToggle?.setAttribute('aria-pressed', String(isDeleting));
}

function setModalEditMode(isEditing) {
  if (isEditing && !requireAdmin()) return;
  activeModalEditMode = isEditing;
  modal.classList.toggle('editing', isEditing);
  modalBg.classList.toggle('modal-editing', isEditing);
  editorBlockLibrary.setAttribute('aria-hidden', String(!isEditing));
  setCustomBlocksEditable(isEditing);
  refreshStructuredEditors();
  if (!isEditing) {
    setDeleteMode(false);
    closeBlockLibrary();
  } else {
    sendPresence();
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
  if (block.querySelector(':scope > .editor-inline-tools')) return;
  const toolbar = document.createElement('div');
  toolbar.className = 'editor-inline-tools';

  const moveButton = makeEditorToolButton('editor-drag-handle', 'Deplacer', '↕');
  const deleteButton = makeEditorToolButton('editor-delete-action danger', 'Supprimer', '×');

  toolbar.appendChild(moveButton);
  if (block.classList.contains('custom-block-text') || block.classList.contains('custom-block-separator')) {
    toolbar.appendChild(makeEditorToolButton('editor-style-action', 'Modifier le style', '✎'));
  }
  toolbar.appendChild(deleteButton);
  block.prepend(toolbar);
}

function makeEditorToolButton(className, label, text) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `editor-tool-btn ${className}`;
  button.textContent = text;
  button.title = label;
  button.setAttribute('aria-label', label);
  return button;
}

function ensureSectionEditorControls(section) {
  if (section.querySelector(':scope > .editor-section-tools')) return;
  const toolbar = document.createElement('div');
  toolbar.className = 'editor-section-tools';
  toolbar.append(
    makeEditorToolButton('editor-add-action', 'Ajouter un bloc ici', '+'),
    makeEditorToolButton('editor-drag-handle', 'Deplacer la section', '↕'),
    makeEditorToolButton('editor-style-action', 'Modifier le style', '✎')
  );
  if (section.classList.contains('custom-section')) {
    toolbar.appendChild(makeEditorToolButton('editor-delete-action danger', 'Supprimer la colonne', '×'));
  }
  section.appendChild(toolbar);
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

function setBlockPlacementMode(block, mode) {
  if (!block) return;
  block.dataset.placement = mode === 'free' ? 'free' : 'flow';
  if (block.dataset.placement === 'flow') {
    block.style.left = '';
    block.style.top = '';
    delete block.dataset.canvasReady;
  }
}

function isFreePlacedBlock(block) {
  return block?.dataset.placement === 'free';
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
  const parent = block.parentElement === modalGrid ? 'canvas' : parentSection?.dataset.sectionId || 'canvas';
  const data = {
    type,
    parent,
    placement: parent === 'canvas' ? 'free' : block.dataset.placement || 'flow',
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
  const inferredPlacement = data.parent === 'canvas' || data.style?.left || data.style?.top ? 'free' : 'flow';
  if (block) setBlockPlacementMode(block, data.placement || inferredPlacement);
  if (block && isFreePlacedBlock(block)) applyElementStyleSnapshot(block, data.style);
  if (block && !isFreePlacedBlock(block) && data.style?.width) block.style.width = data.style.width;
  if (block && !isFreePlacedBlock(block) && data.style?.minHeight) block.style.minHeight = data.style.minHeight;
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

function appendCustomBlock(section, type, options = {}) {
  if (!requireAdmin()) return;
  const isCanvasBlock = activeModalEditMode && modal.classList.contains('editing') && !options.forceSection;
  const body = isCanvasBlock ? modalGrid : section?.querySelector('.section-body');
  if (!body) return;
  if (!isCanvasBlock) body.querySelectorAll('.empty-text').forEach(placeholder => placeholder.remove());
  if (!isCanvasBlock) body.classList.add('custom-grid-body');

  const placeCanvasBlock = block => {
    if (!isCanvasBlock) return;
    const count = modalGrid.querySelectorAll(':scope > .custom-block').length;
    setBlockPlacementMode(block, 'free');
    block.style.left = `${24 + count * 24}px`;
    block.style.top = `${24 + count * 24}px`;
    block.style.width = '280px';
    block.dataset.canvasReady = 'true';
  };
  const placeSectionBlock = block => {
    if (isCanvasBlock || !activeModalEditMode) return;
    setBlockPlacementMode(block, 'flow');
    block.style.width = '';
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
    placeSectionBlock(block);
    body.appendChild(block);
    setCustomBlocksEditable(activeModalEditMode);
    block.querySelector('.custom-block-content')?.focus();
  } else if (type === 'image') {
    const imageBlock = makeImageCustomBlock();
    placeCanvasBlock(imageBlock);
    placeSectionBlock(imageBlock);
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
    placeSectionBlock(linkBlock);
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
    ensureSectionEditorControls(column);
    column.querySelector('.section-header')?.focus();
  } else if (type === 'separator') {
    const separator = makeSeparatorCustomBlock();
    placeCanvasBlock(separator);
    placeSectionBlock(separator);
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
  image.decoding = 'async';
  image.addEventListener('error', () => {
    image.style.display = 'none';
    const placeholder = image.nextElementSibling;
    if (placeholder) placeholder.style.display = 'flex';
  });
  return image;
}

async function uploadManagedImage(file, category, name) {
  const allowedCategories = new Set(['evidence', 'people', 'reports']);
  if (!file || !allowedCategories.has(category)) throw new Error('Catégorie d’image invalide.');
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('Format accepté : PNG, JPEG ou WEBP.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image trop volumineuse : 5 Mo maximum.');
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', () => reject(new Error('Lecture de l’image impossible.')));
    reader.readAsDataURL(file);
  });

  if (window.location.protocol === 'file:' || !hasConfiguredApiBase()) {
    return { url: dataUrl, path: '', format: file.type.split('/')[1], localOnly: true };
  }
  if (!requireAdmin() || !csrfToken) throw new Error('Session administrateur requise.');
  const response = await fetch(getApiUrl(`/assets/${encodeURIComponent(category)}`), {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify({ name, dataUrl })
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Enregistrement de l’image impossible.');
  return body;
}

function sanitizeBriefHtml(value) {
  const template = document.createElement('template');
  template.innerHTML = String(value || '');
  const allowedTags = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'SPAN', 'DIV', 'UL', 'OL', 'LI']);
  const elements = [...template.content.querySelectorAll('*')];

  elements.forEach(element => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...element.childNodes);
      return;
    }

    const color = element.style.color;
    [...element.attributes].forEach(attribute => element.removeAttribute(attribute.name));
    if (color && (/^#[0-9a-f]{3,8}$/i.test(color) || /^rgba?\([\d\s,.%]+\)$/i.test(color))) {
      element.style.color = color;
    }
  });

  return template.innerHTML;
}

function getMissionCardThumb(mission) {
  const thumb = mission.cardThumb || mission.thumb || '';
  if (!thumb.startsWith('assets/missions/')) return thumb;
  const fileName = thumb.split('/').pop().replace(/\.[^.]+$/, '.webp');
  return `assets/missions/thumbs/${fileName}`;
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
      const cardThumb = getMissionCardThumb(mission);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'card';
      card.style.animationDelay = `${i * 0.04}s`;
      card.setAttribute('aria-label', `Open mission details: ${mission.name}`);

      if (cardThumb) {
        card.appendChild(makeImage(cardThumb, mission.name, 'card-thumb'));
      }

      const placeholder = makeTextElement('div', 'card-thumb-placeholder', '[ NO IMAGE ]');
      if (cardThumb) placeholder.style.display = 'none';
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
  const block = target.closest('#modal-grid .custom-block-text, #modal-grid .custom-block-separator');
  if (block) return block;
  return target.closest('#modal-grid .section');
}

function openBlockCustom(target) {
  return;
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
  if (pageName === 'tags' && !requireAdmin()) pageName = 'legal';
  settingsPanel?.classList.toggle('creator-mode', pageName === 'creators');
  document.querySelectorAll('.settings-page').forEach(page => {
    page.classList.toggle('active', page.id === `settings-page-${pageName}`);
  });
  settingsTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.settingsPage === pageName);
  });
  if (pageName === 'tags') renderSettingsTags();
  if (pageName === 'creators') loadSteamCreators();
}

function openSettingsPanel() {
  lastSettingsFocusedElement = document.activeElement;
  showSettingsPage('legal');
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
  modalGrid.classList.remove('has-saved-layout');

  // Briefing
  const brief = makeSection('BRIEFING');
  brief.dataset.sectionId = 'brief';
  renderBriefingSection(brief.querySelector('.section-body'), mission);
  modalGrid.appendChild(brief);

  // Civilians
  const civSection = makeSection('CIVILIANS');
  civSection.dataset.sectionId = 'civilians';
  const civBody = civSection.querySelector('.section-body');
  renderStructuredPeopleSection(civBody, mission.civilians || [], 'civilian');
  modalGrid.appendChild(civSection);

  // Suspects
  const susSection = makeSection('SUSPECTS');
  susSection.dataset.sectionId = 'suspects';
  const susBody = susSection.querySelector('.section-body');
  renderStructuredPeopleSection(susBody, mission.suspects || [], 'suspect');
  modalGrid.appendChild(susSection);

  // Evidence
  const evSection = makeSection('EVIDENCE ROOM');
  evSection.dataset.sectionId = 'evidence';
  const evBody = evSection.querySelector('.section-body');
  renderStructuredEvidenceSection(evBody, mission.evidence || []);
  modalGrid.appendChild(evSection);
  renderIntelPanel(mission, dlc);

  modalBg.classList.add('open');
  modalBg.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Structured edit mode replaces the old free-block editor.
  setCustomBlocksEditable(false);
  renderResourceBank();
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
  editButton.textContent = activeModalEditMode ? 'Terminer' : 'Editer';
  editButton.classList.toggle('active', activeModalEditMode);
  editButton.setAttribute('aria-pressed', String(activeModalEditMode));
  editButton.addEventListener('click', () => {
    const shouldEdit = !activeModalEditMode;
    if (shouldEdit) {
      setModalEditMode(true);
    } else {
      syncActiveMissionDb();
      setModalEditMode(false);
    }
    renderTagEditor(container, mission, dlc);
  });
  container.appendChild(editButton);

  if (activeModalEditMode) {
    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'tag tag-add modal-save-action';
    saveButton.textContent = 'SAVE';
    saveButton.title = 'Sauvegarder les modifications en local';
    saveButton.setAttribute('aria-label', saveButton.title);
    saveButton.addEventListener('click', () => {
      syncCurrentMissionDbFromUi();
    });
    container.appendChild(saveButton);
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

function getPersonPlaceholder(type, field) {
  const labels = {
    civilian: {
      add: 'AJOUTER UN CIVIL',
      empty: '// Aucun civil renseigne',
      name: 'Civil inconnu',
      desc: 'Description manquante',
      image: 'Image manquante'
    },
    suspect: {
      add: 'AJOUTER UN SUSPECT',
      empty: '// Aucun suspect renseigne',
      name: 'Suspect inconnu',
      desc: 'Description manquante',
      image: 'Image manquante'
    }
  };
  return labels[type]?.[field] || '';
}

function renderStructuredImageDrop(imageWrap, imageUrl, label, emptyLabel = 'Image manquante') {
  clearElement(imageWrap);
  imageWrap.dataset.field = 'image';
  imageWrap.tabIndex = activeModalEditMode ? 0 : -1;
  imageWrap.setAttribute('aria-label', activeModalEditMode ? 'Déposer une image depuis la banque' : emptyLabel);
  if (imageUrl) {
    imageWrap.appendChild(makeImage(imageUrl, label, ''));
  } else {
    imageWrap.appendChild(makeTextElement('span', '', emptyLabel));
  }
}

function getStructuredCardCollection(card) {
  if (!activeModalMission || !card) return null;
  const index = Number(card.dataset.index);
  if (!Number.isInteger(index)) return null;

  if (card.classList.contains('structured-evidence-card')) {
    if (typeof activeModalMission.evidence?.[index] === 'string') {
      activeModalMission.evidence[index] = { name: activeModalMission.evidence[index], desc: '', image: '' };
    }
    return { collection: activeModalMission.evidence, index, type: 'evidence' };
  }
  if (card.dataset.personType === 'civilian') {
    return { collection: activeModalMission.civilians, index, type: 'civilian' };
  }
  if (card.dataset.personType === 'suspect') {
    return { collection: activeModalMission.suspects, index, type: 'suspect' };
  }
  return null;
}

function updateStructuredCardImage(card, imageUrl) {
  const target = getStructuredCardCollection(card);
  if (!target?.collection?.[target.index]) return;
  target.collection[target.index].image = imageUrl;

  const item = target.collection[target.index];
  const imageWrap = card.querySelector('.structured-person-image');
  const label = item.name || getPersonPlaceholder(target.type, 'name') || 'Preuve';
  const emptyLabel = getPersonPlaceholder(target.type, 'image') || 'Image manquante';
  if (imageWrap) renderStructuredImageDrop(imageWrap, imageUrl, label, emptyLabel);

  renderIntelPanel(activeModalMission, activeModalDlc);
  syncActiveMissionDb();
  renderResourceBank();
}

function getDroppedImageBankUrl(dataTransfer) {
  const imageUrl = dataTransfer.getData('application/x-ron-lore-image') || dataTransfer.getData('text/plain');
  if (!imageUrl) return '';
  return getImageBankItems().some(image => image.dataUrl === imageUrl) ? imageUrl : '';
}

function makeStructuredPersonCard(person, index, type) {
  const card = document.createElement('article');
  card.className = 'structured-person-card';
  card.dataset.personType = type;
  card.dataset.index = String(index);

  const imageWrap = document.createElement('div');
  imageWrap.className = 'structured-person-image';
  const imageUrl = person.image || person.img || person.thumb || '';
  renderStructuredImageDrop(imageWrap, imageUrl, person.name || getPersonPlaceholder(type, 'name'), getPersonPlaceholder(type, 'image'));

  const name = makeTextElement('div', 'structured-person-name', person.name || getPersonPlaceholder(type, 'name'));
  const desc = makeTextElement('div', 'structured-person-desc', person.desc || getPersonPlaceholder(type, 'desc'));

  const form = document.createElement('div');
  form.className = 'structured-person-form';
  const nameInput = document.createElement('input');
  nameInput.className = 'structured-person-field';
  nameInput.dataset.field = 'name';
  nameInput.value = person.name || '';
  nameInput.placeholder = getPersonPlaceholder(type, 'name');
  nameInput.autocomplete = 'off';

  const descInput = document.createElement('textarea');
  descInput.className = 'structured-person-field';
  descInput.dataset.field = 'desc';
  descInput.value = person.desc || '';
  descInput.placeholder = getPersonPlaceholder(type, 'desc');
  descInput.rows = 3;

  form.append(nameInput, descInput);
  card.append(imageWrap, name, desc, form);
  return card;
}

function renderStructuredPeopleSection(body, people, type) {
  body.querySelector('.structured-person-list')?.remove();
  body.querySelector('.structured-add-zone')?.remove();
  body.querySelectorAll(':scope > .empty-text').forEach(item => item.remove());

  const list = document.createElement('div');
  list.className = 'structured-person-list';
  if (people.length === 0) {
    list.appendChild(makeEmptyText(getPersonPlaceholder(type, 'empty')));
  } else {
    people.forEach((person, index) => {
      list.appendChild(makeStructuredPersonCard(person, index, type));
    });
  }

  const addZone = document.createElement('button');
  addZone.type = 'button';
  addZone.className = 'structured-add-zone';
  addZone.dataset.personType = type;
  addZone.textContent = getPersonPlaceholder(type, 'add');

  body.prepend(addZone, list);
}

function normalizeEvidenceItem(item) {
  return typeof item === 'string' ? { name: item, desc: '', image: '' } : {
    name: item?.name || '',
    desc: item?.desc || '',
    image: item?.image || item?.img || item?.thumb || ''
  };
}

function makeStructuredEvidenceCard(item, index) {
  const evidence = normalizeEvidenceItem(item);
  const card = document.createElement('article');
  card.className = 'structured-person-card structured-evidence-card';
  card.dataset.index = String(index);

  const imageWrap = document.createElement('div');
  imageWrap.className = 'structured-person-image';
  renderStructuredImageDrop(imageWrap, evidence.image, evidence.name || 'Preuve', 'Image manquante');

  const name = makeTextElement('div', 'structured-person-name', evidence.name || 'Preuve sans titre');
  const desc = makeTextElement('div', 'structured-person-desc', evidence.desc || 'Description manquante');

  const form = document.createElement('div');
  form.className = 'structured-person-form';
  const nameInput = document.createElement('input');
  nameInput.className = 'structured-person-field structured-evidence-field';
  nameInput.dataset.field = 'name';
  nameInput.value = evidence.name;
  nameInput.placeholder = 'Titre de la preuve';
  nameInput.autocomplete = 'off';

  const descInput = document.createElement('textarea');
  descInput.className = 'structured-person-field structured-evidence-field';
  descInput.dataset.field = 'desc';
  descInput.value = evidence.desc;
  descInput.placeholder = 'Description';
  descInput.rows = 3;

  form.append(nameInput, descInput);
  card.append(imageWrap, name, desc, form);
  return card;
}

function renderStructuredEvidenceSection(body, evidence) {
  body.querySelector('.structured-evidence-list')?.remove();
  body.querySelector('.structured-evidence-add')?.remove();
  body.querySelectorAll(':scope > .empty-text').forEach(item => item.remove());

  const list = document.createElement('div');
  list.className = 'structured-person-list structured-evidence-list';
  if (evidence.length === 0) {
    list.appendChild(makeEmptyText('// Aucune preuve renseignee'));
  } else {
    evidence.forEach((item, index) => {
      list.appendChild(makeStructuredEvidenceCard(item, index));
    });
  }

  const addZone = document.createElement('button');
  addZone.type = 'button';
  addZone.className = 'structured-add-zone structured-evidence-add';
  addZone.textContent = 'AJOUTER UNE PREUVE';

  body.prepend(addZone, list);
}

function getBriefHtml(mission) {
  if (mission.briefHtml) return sanitizeBriefHtml(mission.briefHtml);
  if (mission.brief) {
    const paragraph = document.createElement('p');
    paragraph.textContent = mission.brief;
    return paragraph.outerHTML;
  }
  return '';
}

function renderBriefingSection(body, mission) {
  clearElement(body);
  const editor = document.createElement('div');
  editor.className = 'brief-editor';
  editor.dataset.placeholder = '// Aucun briefing renseigné';
  editor.innerHTML = getBriefHtml(mission);
  editor.contentEditable = String(activeModalEditMode);
  editor.spellcheck = false;
  editor.tabIndex = activeModalEditMode ? 0 : -1;
  body.appendChild(editor);
}

function hideBriefFormatToolbar() {
  if (!briefFormatToolbar) return;
  savedBriefSelectionRange = null;
  closeBriefColorPopover();
  briefFormatToolbar.classList.remove('open');
  briefFormatToolbar.setAttribute('aria-hidden', 'true');
}

function renderBriefColorPalette() {
  if (!briefFormatColors) return;
  clearElement(briefFormatColors);
  BRIEF_TEXT_COLOR_OPTIONS.forEach(color => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'brief-color-swatch brief-preset-color';
    button.dataset.color = color;
    button.style.setProperty('--brief-color', color);
    button.title = color;
    button.setAttribute('aria-label', `Couleur ${color}`);
    button.classList.toggle('selected', color === selectedBriefColor);
    button.addEventListener('click', () => {
      applyBriefColor(color);
    });
    briefFormatColors.appendChild(button);
  });
}

function renderBriefCustomColorGrid() {
  if (!briefCustomColors) return;
  clearElement(briefCustomColors);
  const colors = getCustomTagColors();

  for (let i = 0; i < MAX_CUSTOM_TAG_COLORS; i++) {
    const color = colors[i] || '';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'brief-color-swatch brief-custom-color-slot';

    if (color) {
      button.dataset.color = color.toLowerCase();
      button.style.setProperty('--brief-color', color);
      button.title = color;
      button.setAttribute('aria-label', `Couleur personnalisée ${color}`);
      button.classList.toggle('selected', color.toLowerCase() === selectedBriefColor);
      button.addEventListener('click', () => applyBriefColor(color));
    } else {
      button.classList.add('empty');
      button.title = 'Enregistrer la couleur actuelle';
      button.setAttribute('aria-label', 'Enregistrer la couleur actuelle');
      button.addEventListener('click', () => saveBriefSelectedColor());
    }

    briefCustomColors.appendChild(button);
  }
}

function updateBriefContentFromEditor(editor) {
  if (!activeModalMission || !editor) return;
  activeModalMission.briefHtml = sanitizeBriefHtml(editor.innerHTML);
  activeModalMission.brief = editor.textContent.trim();
  syncActiveMissionDb();
}

function normalizeHexColor(color) {
  const option = document.createElement('option');
  option.style.color = color;
  document.body.appendChild(option);
  const normalized = getComputedStyle(option).color;
  option.remove();
  const match = normalized.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) return /^#[0-9a-f]{6}$/i.test(color) ? color : selectedBriefColor;
  return `#${match.slice(1).map(value => Number(value).toString(16).padStart(2, '0')).join('')}`;
}

function getSelectedBriefColor() {
  const value = document.queryCommandValue('foreColor');
  if (!value) return selectedBriefColor;
  return normalizeHexColor(value).toLowerCase();
}

function setSelectedBriefColor(color) {
  selectedBriefColor = color.toLowerCase();
  if (briefFormatColor) briefFormatColor.value = selectedBriefColor;
  briefColorPreview?.style.setProperty('--brief-color', selectedBriefColor);
  briefFormatColors?.querySelectorAll('.brief-color-swatch').forEach(button => {
    button.classList.toggle('selected', button.dataset.color === selectedBriefColor);
  });
  briefCustomColors?.querySelectorAll('.brief-color-swatch').forEach(button => {
    button.classList.toggle('selected', button.dataset.color === selectedBriefColor);
  });
}

function getBriefEditorFromSelection(selection) {
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
    ? range.commonAncestorContainer
    : range.commonAncestorContainer.parentElement;
  const editor = container?.closest?.('.brief-editor') || null;
  if (!editor || !editor.contains(range.startContainer) || !editor.contains(range.endContainer)) return null;
  return editor;
}

function scheduleBriefFormatToolbar(delay = 0) {
  window.clearTimeout(briefSelectionTimer);
  briefSelectionTimer = window.setTimeout(showBriefFormatToolbar, delay);
}

function openBriefColorPopover() {
  if (!briefColorPopover || !briefColorToggle) return;
  isBriefColorPopoverOpen = true;
  renderBriefColorPalette();
  renderBriefCustomColorGrid();
  setSelectedBriefColor(selectedBriefColor);
  briefColorPopover.classList.add('open');
  briefColorPopover.setAttribute('aria-hidden', 'false');
  briefColorToggle.setAttribute('aria-expanded', 'true');
}

function closeBriefColorPopover() {
  if (!briefColorPopover || !briefColorToggle) return;
  isBriefColorPopoverOpen = false;
  briefColorPopover.classList.remove('open');
  briefColorPopover.setAttribute('aria-hidden', 'true');
  briefColorToggle.setAttribute('aria-expanded', 'false');
}

function toggleBriefColorPopover() {
  if (isBriefColorPopoverOpen) {
    closeBriefColorPopover();
  } else {
    openBriefColorPopover();
  }
}

function positionBriefFormatToolbar(rect) {
  const toolbarWidth = briefFormatToolbar.offsetWidth || 320;
  const left = rect.left + rect.width / 2 - toolbarWidth / 2;
  briefFormatToolbar.style.left = `${Math.max(12, Math.min(left, window.innerWidth - toolbarWidth - 12))}px`;
  briefFormatToolbar.style.top = `${Math.max(12, rect.top - briefFormatToolbar.offsetHeight - 10)}px`;
}

function showBriefFormatToolbar() {
  if (!activeModalEditMode || !briefFormatToolbar) return;
  if (isBriefSelectionDragging) return;
  const selection = window.getSelection();
  const editor = getBriefEditorFromSelection(selection);
  if (!editor) {
    hideBriefFormatToolbar();
    return;
  }

  activeBriefEditor = editor;
  savedBriefSelectionRange = selection.getRangeAt(0).cloneRange();
  selectedBriefColor = getSelectedBriefColor();
  setSelectedBriefColor(selectedBriefColor);
  if (isBriefColorPopoverOpen) {
    renderBriefColorPalette();
    renderBriefCustomColorGrid();
    setSelectedBriefColor(selectedBriefColor);
  }
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  briefFormatToolbar.classList.add('open');
  briefFormatToolbar.setAttribute('aria-hidden', 'false');
  positionBriefFormatToolbar(rect);
}

function applyBriefCommand(command, value = null) {
  if (!activeBriefEditor) return;
  activeBriefEditor.focus();
  if (savedBriefSelectionRange) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedBriefSelectionRange);
  }
  document.execCommand(command, false, value);
  const selection = window.getSelection();
  if (selection?.rangeCount) savedBriefSelectionRange = selection.getRangeAt(0).cloneRange();
  updateBriefContentFromEditor(activeBriefEditor);
  showBriefFormatToolbar();
}

function applyBriefColor(color) {
  setSelectedBriefColor(color);
  applyBriefCommand('foreColor', color);
}

function saveBriefSelectedColor() {
  const result = rememberCustomTagColor(selectedBriefColor);
  if (result === 'full') {
    replaceCustomTagColor(0, selectedBriefColor);
  }
  if (result === 'saved' || result === 'full') {
    renderBriefCustomColorGrid();
    setSelectedBriefColor(selectedBriefColor);
  }
}

function getCanvasDraggable(target) {
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
  setBlockPlacementMode(block, 'free');
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
  setBlockPlacementMode(block, 'free');
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
    e.preventDefault();
    return;
  }

  if (e.key === 'Escape' && blockLibrary.classList.contains('open')) {
    closeBlockLibrary();
    return;
  }

  if (e.key === 'Escape' && imageContextMenu?.classList.contains('open')) {
    closeImageContextMenu();
    return;
  }

  if (imageNameBg?.classList.contains('open')) {
    if (e.key === 'Escape') closeImageNameDialog(null);
    trapFocus(e, imageNameDialog);
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
  const structuredAdd = e.target.closest('.structured-add-zone');
  if (structuredAdd && activeModalEditMode) {
    e.preventDefault();
    e.stopPropagation();
    const type = structuredAdd.dataset.personType;
    if (!activeModalMission) return;
    if (type === 'civilian' || type === 'suspect') {
      const key = type === 'civilian' ? 'civilians' : 'suspects';
      activeModalMission[key] = [...(activeModalMission[key] || []), { name: '', desc: '', image: '' }];
      refreshStructuredEditors();
      updateModalMetaCounts();
      syncActiveMissionDb();
      renderResourceBank();
      modalGrid.querySelector(`.structured-person-card[data-person-type="${type}"][data-index="${activeModalMission[key].length - 1}"] .structured-person-field`)?.focus();
    } else if (structuredAdd.classList.contains('structured-evidence-add')) {
      activeModalMission.evidence = [...(activeModalMission.evidence || []), { name: '', desc: '', image: '' }];
      refreshStructuredEditors();
      syncActiveMissionDb();
      renderResourceBank();
      modalGrid.querySelector(`.structured-evidence-card[data-index="${activeModalMission.evidence.length - 1}"] .structured-evidence-field`)?.focus();
    }
    return;
  }

  const addButton = e.target.closest('.editor-add-action');
  if (addButton && activeModalEditMode) {
    e.preventDefault();
    e.stopPropagation();
    openBlockLibrary(addButton, addButton.closest('.section'));
    return;
  }

  const styleButton = e.target.closest('.editor-style-action');
  if (styleButton && activeModalEditMode) {
    e.preventDefault();
    e.stopPropagation();
    const target = getCustomizableTarget(styleButton);
    if (target) openBlockCustom(target);
    return;
  }

  const deleteButton = e.target.closest('.editor-delete-action');
  if (deleteButton && activeModalEditMode) {
    e.preventDefault();
    e.stopPropagation();
    const target = deleteButton.closest('.custom-block') || deleteButton.closest('.custom-section');
    if (!target) return;
    target.remove();
    saveModalBlocks();
    return;
  }

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

modalGrid.addEventListener('input', e => {
  if (!requireAdmin() || !activeModalEditMode) return;
  const briefEditor = e.target.closest('.brief-editor');
  if (briefEditor) {
    updateBriefContentFromEditor(briefEditor);
    return;
  }

  const field = e.target.closest('.structured-person-field');
  if (!field || !activeModalMission) return;
  const card = field.closest('.structured-person-card');
  const index = Number(card?.dataset.index);
  if (!Number.isInteger(index)) return;

  let collection = null;
  if (card.classList.contains('structured-evidence-card')) {
    collection = activeModalMission.evidence;
    if (typeof collection?.[index] === 'string') collection[index] = { name: collection[index], desc: '', image: '' };
  } else if (card.dataset.personType === 'civilian') {
    collection = activeModalMission.civilians;
  } else if (card.dataset.personType === 'suspect') {
    collection = activeModalMission.suspects;
  }
  if (!collection?.[index]) return;
  collection[index][field.dataset.field] = field.value;

  if (field.dataset.field === 'image') {
    updateStructuredCardImage(card, field.value.trim());
  } else if (field.dataset.field === 'name') {
    card.querySelector('.structured-person-name').textContent = field.value || getPersonPlaceholder(card.dataset.personType, 'name') || 'Preuve sans titre';
  } else if (field.dataset.field === 'desc') {
    card.querySelector('.structured-person-desc').textContent = field.value || getPersonPlaceholder(card.dataset.personType, 'desc') || 'Description manquante';
  }
  renderIntelPanel(activeModalMission, activeModalDlc);
  syncActiveMissionDb();
  renderResourceBank();
});

modalGrid.addEventListener('dragover', e => {
  if (!requireAdmin() || !activeModalEditMode) return;
  const imageDrop = e.target.closest('.structured-person-image');
  if (!imageDrop) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  imageDrop.classList.add('drag-over');
});

modalGrid.addEventListener('dragleave', e => {
  const imageDrop = e.target.closest('.structured-person-image');
  if (!imageDrop || imageDrop.contains(e.relatedTarget)) return;
  imageDrop.classList.remove('drag-over');
});

modalGrid.addEventListener('drop', e => {
  if (!requireAdmin() || !activeModalEditMode) return;
  const imageDrop = e.target.closest('.structured-person-image');
  if (!imageDrop) return;
  e.preventDefault();
  imageDrop.classList.remove('drag-over');
  const imageUrl = getDroppedImageBankUrl(e.dataTransfer);
  if (!imageUrl) return;
  const card = imageDrop.closest('.structured-person-card');
  updateStructuredCardImage(card, imageUrl);
});

modalGrid.addEventListener('pointerdown', e => {
  if (!e.target.closest('.brief-editor')) return;
  isBriefSelectionDragging = true;
  hideBriefFormatToolbar();
});

modalGrid.addEventListener('mouseup', e => {
  if (!e.target.closest('.brief-editor')) return;
  isBriefSelectionDragging = false;
  scheduleBriefFormatToolbar(0);
});

modalGrid.addEventListener('keyup', e => {
  if (!e.target.closest('.brief-editor')) return;
  scheduleBriefFormatToolbar(0);
});

function finishBriefSelectionDrag() {
  if (!isBriefSelectionDragging) return;
  isBriefSelectionDragging = false;
  scheduleBriefFormatToolbar(0);
}

document.addEventListener('pointerup', finishBriefSelectionDrag);
document.addEventListener('pointercancel', finishBriefSelectionDrag);

document.addEventListener('selectionchange', () => {
  if (!activeModalEditMode) return;
  if (isBriefSelectionDragging) return;
  if (briefFormatToolbar?.matches(':hover')) return;
  scheduleBriefFormatToolbar(40);
});

modalGrid.addEventListener('contextmenu', e => {
  if (activeModalEditMode) return;
});

blockLibrary.addEventListener('click', e => {
  closeBlockLibrary();
});

editorBlockLibrary.addEventListener('click', e => {
  if (e.target.closest('.editor-block-option')) e.preventDefault();
});

deleteModeToggle?.addEventListener('click', () => {
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
  const newRect = draggable.getBoundingClientRect();
  editingDrag = {
    element: draggable,
    isCustomBlock: draggable.classList.contains('custom-block'),
    pointerId: e.pointerId,
    offsetX: e.clientX - newRect.left,
    offsetY: e.clientY - newRect.top,
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
  const clickedBriefEditor = e.target.closest?.('.brief-editor');
  const clickedBriefColorUi = e.target.closest?.('#brief-color-toggle, #brief-color-popover');
  if (isBriefColorPopoverOpen && !clickedBriefColorUi) {
    closeBriefColorPopover();
  }
  if (briefFormatToolbar?.classList.contains('open') && !briefFormatToolbar.contains(e.target) && !clickedBriefEditor) {
    hideBriefFormatToolbar();
  }
  if (imageContextMenu?.classList.contains('open') && !imageContextMenu.contains(e.target)) {
    closeImageContextMenu();
  }
  if (!blockLibrary.classList.contains('open')) return;
  if (blockLibrary.contains(e.target)) return;
  closeBlockLibrary();
});

imageContextMenu?.addEventListener('click', e => {
  const action = e.target.closest('[data-image-action]')?.dataset.imageAction;
  if (!action || !activeImageContextId) return;
  const imageId = activeImageContextId;
  closeImageContextMenu();
  if (action === 'rename') renameImageBankItem(imageId);
  if (action === 'delete') deleteImageBankItem(imageId);
});

imageNameDialog?.addEventListener('submit', e => {
  e.preventDefault();
  closeImageNameDialog(imageNameInput.value.trim());
});

imageNameCancel?.addEventListener('click', () => closeImageNameDialog(null));
imageNameBg?.addEventListener('click', e => {
  if (e.target === imageNameBg) closeImageNameDialog(null);
});

briefFormatToolbar?.addEventListener('mousedown', e => {
  if (e.target.closest('#brief-color-popover')) return;
  e.preventDefault();
});

briefFormatToolbar?.addEventListener('click', e => {
  const command = e.target.closest('[data-brief-command]')?.dataset.briefCommand;
  const block = e.target.closest('[data-brief-block]')?.dataset.briefBlock;
  const linkButton = e.target.closest('[data-brief-link]');
  const colorToggle = e.target.closest('#brief-color-toggle');
  const colorPopover = e.target.closest('#brief-color-popover');
  if (colorToggle) {
    toggleBriefColorPopover();
    return;
  }
  if (colorPopover) return;
  if (linkButton) return;
  if (command) applyBriefCommand(command);
  if (block) applyBriefCommand('formatBlock', block);
});

briefFormatColor?.addEventListener('input', e => {
  setSelectedBriefColor(e.target.value);
});

briefFormatColor?.addEventListener('change', e => {
  applyBriefColor(e.target.value);
});

briefColorSave?.addEventListener('click', () => {
  saveBriefSelectedColor();
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
adminSyncLocal?.addEventListener('click', () => syncLocalStorageFromBackend());
adminPushDb?.addEventListener('click', pushMissionDbMap);
adminAutoSync?.addEventListener('change', e => {
  setAutoSyncEnabled(e.target.checked);
});
adminPushReport?.addEventListener('click', () => {
  if (!adminPushReportPanel) return;
  adminPushReportPanel.hidden = !adminPushReportPanel.hidden;
  if (!adminPushReportPanel.hidden) renderPushReport();
});

imageBankUploadBtn?.addEventListener('click', () => {
  imageBankUpload?.click();
});

imageBank?.addEventListener('click', e => {
  if (e.target.closest('.image-bank-item')) return;
  imageBankUpload?.click();
});

imageBank?.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  e.preventDefault();
  imageBankUpload?.click();
});

imageBankUpload?.addEventListener('change', async e => {
  imageBankUpload.disabled = true;
  try {
    await importImageBankFiles(e.target.files || []);
  } finally {
    imageBankUpload.value = '';
    imageBankUpload.disabled = false;
  }
});

['dragenter', 'dragover'].forEach(eventName => {
  imageBank?.addEventListener(eventName, e => {
    e.preventDefault();
    imageBank.classList.add('drag-over');
  });
});

['dragleave', 'drop'].forEach(eventName => {
  imageBank?.addEventListener(eventName, e => {
    e.preventDefault();
    if (eventName === 'drop') importImageBankFiles(e.dataTransfer?.files || []);
    imageBank.classList.remove('drag-over');
  });
});

resourceBankSearch?.addEventListener('input', e => {
  activeResourceBankSearch = e.target.value;
  renderResourceBank();
});

resourceBankFilters.forEach(button => {
  button.addEventListener('click', () => {
    activeResourceBankFilter = button.dataset.resourceFilter || 'all';
    resourceBankFilters.forEach(item => {
      item.classList.toggle('active', item === button);
    });
    renderResourceBank();
  });
});

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
async function initApp() {
  setAdminAuthenticated(false);
  renderImageBank();
  updatePendingPushUi();
  buildBoard();
  buildTimeline();
  buildPeopleBoard();

  await loadSharedMissionDbFromApi();
  await refreshAdminSession();
  renderImageBank();
  updatePendingPushUi();
  buildBoard();
  buildTimeline();
  buildPeopleBoard();
}

initApp();
