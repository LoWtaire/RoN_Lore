(() => {
  const app = document.getElementById('archive-app');
  if (!app || typeof DATA === 'undefined') return;

  const allMissions = DATA.flatMap(dlc => dlc.missions.map(mission => ({ dlc, mission })));
  const list = document.getElementById('archive-mission-list');
  const relatedEditor = document.getElementById('archive-related-editor');
  const relatedSelect = document.getElementById('archive-related-select');
  const search = document.getElementById('archive-search');
  const evidenceStrip = document.getElementById('archive-evidence-strip');
  const timelineCards = document.getElementById('archive-timeline-cards');
  const workspace = document.querySelector('.archive-workspace');
  const archiveTree = document.getElementById('archive-tree');
  const reportList = document.getElementById('archive-report-list');
  const moduleMain = document.getElementById('archive-module-main');
  const moduleNav = document.getElementById('archive-module-nav');
  let activeEntry = allMissions[0];
  let activeCollection = 'all';
  let currentView = 'reports';
  let activePeopleFilter = 'all';

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  const safeImageSource = value => {
    const source = String(value || '').trim();
    if (/^data:image\/(?:png|jpe?g|webp);base64,[a-z0-9+/=]+$/i.test(source)) return source;
    if (/^(?:https:\/\/|assets\/)[^\s<>"']+$/i.test(source)) return source;
    return '';
  };
  const EVIDENCE_REGISTRY_KEY = 'ronLoreEvidenceRegistryV1';
  const PEOPLE_GROUP_BANK_KEY = 'ronLorePeopleGroupBankV1';
  const PEOPLE_GROUP_LINKS_KEY = 'ronLorePeopleGroupLinksV1';
  const REPORT_PERSON_REGISTRY_KEY = 'ronLoreReportPersonRegistryV1';
  const isArchiveAdmin = () => typeof requireAdmin === 'function' && requireAdmin();

  function readEvidenceRegistry() {
    try {
      const records = JSON.parse(localStorage.getItem(EVIDENCE_REGISTRY_KEY) || '[]');
      return Array.isArray(records) ? records : [];
    } catch {
      return [];
    }
  }

  function saveEvidenceRegistry(records) {
    localStorage.setItem(EVIDENCE_REGISTRY_KEY, JSON.stringify(records));
  }

  function readPeopleGroupBank() {
    try {
      const groups = JSON.parse(localStorage.getItem(PEOPLE_GROUP_BANK_KEY) || '[]');
      return Array.isArray(groups) ? groups.filter(Boolean) : [];
    } catch { return []; }
  }

  function readPeopleGroupLinks() {
    try {
      const links = JSON.parse(localStorage.getItem(PEOPLE_GROUP_LINKS_KEY) || '{}');
      return links && typeof links === 'object' && !Array.isArray(links) ? links : {};
    } catch { return {}; }
  }

  function savePeopleGroups(bank, links) {
    localStorage.setItem(PEOPLE_GROUP_BANK_KEY, JSON.stringify(bank));
    localStorage.setItem(PEOPLE_GROUP_LINKS_KEY, JSON.stringify(links));
  }

  function readReportPersonRegistry() {
    try {
      const people = JSON.parse(localStorage.getItem(REPORT_PERSON_REGISTRY_KEY) || '[]');
      return Array.isArray(people) ? people : [];
    } catch { return []; }
  }

  function saveReportPersonRegistry(people) {
    localStorage.setItem(REPORT_PERSON_REGISTRY_KEY, JSON.stringify(people));
  }

  function syncReportPersonRecord(record, type, image = '', explicitSourceId = '') {
    if (!record) return;
    record.registryId ||= `PER-CUSTOM-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const registry = readReportPersonRegistry();
    const normalizedName = String(record.name || '').trim().toLowerCase();
    const placeholder = /^(nouveau|nouvelle)\s/i.test(normalizedName);
    let index = registry.findIndex(person => person.id === record.registryId);
    if (index < 0 && normalizedName && !placeholder) index = registry.findIndex(person => person.name.trim().toLowerCase() === normalizedName && person.statusClass === (type === 'suspect' ? 'suspect' : 'civil'));
    const existing = index >= 0 ? registry[index] : null;
    if (existing) record.registryId = existing.id;
    const sourceId = explicitSourceId || reportId(activeEntry);
    const person = {
      ...(existing || {}),
      id: record.registryId,
      name: String(record.name || (type === 'suspect' ? 'NOUVEAU SUSPECT' : 'NOUVEAU CIVIL')).slice(0, 200),
      desc: String(record.desc || '').slice(0, 1000),
      category: type === 'suspect' ? 'Suspect' : 'Civil / Victime',
      status: type === 'suspect' ? 'Répertorié' : 'Associé à un dossier',
      statusClass: type === 'suspect' ? 'suspect' : 'civil',
      portrait: image || existing?.portrait || '',
      sourceReports: [...new Set([...(existing?.sourceReports || []), sourceId])]
    };
    if (index >= 0) registry[index] = person;
    else registry.push(person);
    saveReportPersonRegistry(registry);
    return record.registryId;
  }

  const MODULES = {
    dashboard: { label: 'Tableau de bord', icon: 'dashboard' },
    people: { label: 'Personnes', icon: 'group' },
    evidence: { label: 'Preuves', icon: 'inventory_2' }
  };
  const MEMORIAL_PERSONNEL = [
    ['PO', 'Paula J. Harris'], ['Lt.', 'Lucie Reese'], ['Sgt.', 'Jacob Porter'], ['Sgt.', 'Gaspar Lang'],
    ['PO', 'Marie Lin'], ['Lt.', 'Alice West'], ['Det.', 'Rachael Chadwick'], ['PO', 'Sarah Hammond'],
    ['Col.', 'Lucie Reese'], ['PO', 'Alice West'], ['PO', "Mohamed O'Brien"], ['PO', 'Damita Kelley'],
    ['Capt.', 'Vera Moya'], ['PO', 'Ted Flynn'], ['Det.', 'Gaspar Lang'], ['PO', 'Ted Kelley'],
    ['Col.', 'Djillali Jones'], ['Lt.', 'Zahid Mann'], ['PO', 'Hamza Campos'], ['Capt.', 'Trent Mora'],
    ['Sgt.', 'Joel Serrano'], ['Sgt.', 'Adrian Juarez'], ['Det.', 'Justin Williamson'], ['Sgt.', 'Aldo Alexander'],
    ['PO', 'Trent McCarthy'], ['Lt.', 'Joel Chadwick'], ['Sgt.', 'Adrian West'], ['PO', 'Gaspar Perez'],
    ['Cmdr.', 'Xeres Gallego'], ['Sgt.', 'Maximo Romero'], ['PO', 'Aldo Herrera'], ['PO', 'Maisie Flynn'],
    ['PO', 'Caroline Spencer'], ['PO', 'Margaret Carlson'], ['PO', 'Rowan Juarez'], ['Det.', 'Rosalee Mann'],
    ['Lt.', "Natanael O'Brien"], ['Det.', 'Gaspar Campos'], ['Sgt.', 'Xeres Williamson'], ['Sgt.', 'Ann McCarthy'],
    ['Lt.', 'Julie Alexander'], ['Col.', 'Trent Mora'], ['PO', 'Patricia Khan'], ['PO', 'Ellen Hussain'],
    ['PO', 'Rowan Ahmed'], ['PO', 'Margaret Adamm'], ['Col.', 'Damita Kelley'], ['Lt.', 'Julina Ali'],
    ['Lt.', '[Prénom illisible] Abdi', true], ['Lt.', 'Carline Begum'], ['PO', 'Concepcion Khan'], ['PO', 'Vera Hussain'],
    ['PO', 'Damita Ahmed'], ['PO', 'Julina Adamm'], ['Det.', 'Gabriela Kelley'], ['PO', 'Alec Diliore'],
    ['Cmdr.', 'Hilda Abdi'], ['Lt.', 'Carissa Begum']
  ].map(([rank, name, uncertain = false], index) => ({ id: `MEM-${String(index + 1).padStart(3, '0')}`, rank, name, uncertain }));
  const REGISTERED_LSPD_PERSONNEL = [
    { id: 'LSPD-ARC-0417', name: 'LORIQUEEE', rank: 'Agent', category: 'Personnel LSPD · Archives', status: 'En service', statusClass: 'active' },
    { id: 'LSPD-ARC-7326', name: 'AURUM', rank: 'Agent', category: 'Personnel LSPD · Archives', status: 'En service', statusClass: 'active' },
    { id: 'LSPD-DP-0001', name: 'David “Judge” Beaumont', rank: 'Cmdr.', category: 'Personnel LSPD · D-Platoon SWAT', status: 'Accès révoqué · FISA', statusClass: 'revoked', portrait: 'assets/people/judge.webp' }
  ];
  function applySteamCreatorPortraits(creators = []) {
    const [loriqueee, aurum] = creators;
    if (loriqueee?.avatar) REGISTERED_LSPD_PERSONNEL[0].portrait = loriqueee.avatar;
    if (aurum?.avatar) REGISTERED_LSPD_PERSONNEL[1].portrait = aurum.avatar;
    if (currentView === 'people') renderPeople();
  }
  window.addEventListener('ron-lore:creators-loaded', event => applySteamCreatorPortraits(event.detail));

  const CONNECTED_AGENTS = [
    { id: 'loriqueee', name: 'AGT. LORIQUEEE', unit: 'ARCHIVES · CONCEPTION', accent: '#417326', theme: 'light' },
    { id: 'aurum', name: 'AGT. AURUM', unit: 'ARCHIVES · RECHERCHE', accent: '#732673', theme: 'dark' },
    { id: 'judge', name: 'CDR. “JUDGE” BEAUMONT', unit: 'D-PLATOON · SWAT', accent: '#8b2d25', theme: 'fisa' }
  ];
  const agentToggle = document.getElementById('archive-agent-toggle');
  const agentMenu = document.getElementById('archive-agent-menu');
  let activeAgentId = localStorage.getItem('ronLoreConnectedAgent') || CONNECTED_AGENTS[0].id;

  const pad = value => String(value).padStart(2, '0');
  const slugId = name => name.split(/\s+/).map(word => word[0] || '').join('').slice(0, 4).toUpperCase();
  const reportId = entry => `LS-2026-${pad((allMissions.indexOf(entry) % 12) + 1)}-${pad((allMissions.indexOf(entry) % 27) + 1)}-${slugId(entry.mission.name)}`;
  const readableDate = value => {
    if (!value) return 'Date non renseignée';
    const date = new Date(`${value} 00:00:00`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  function closeAgentMenu({ restoreFocus = false } = {}) {
    agentMenu.hidden = true;
    agentToggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) agentToggle.focus();
  }

  function selectConnectedAgent(agentId) {
    const agent = CONNECTED_AGENTS.find(item => item.id === agentId) || CONNECTED_AGENTS[0];
    activeAgentId = agent.id;
    localStorage.setItem('ronLoreConnectedAgent', agent.id);
    document.getElementById('archive-agent-name').textContent = agent.name;
    document.getElementById('archive-agent-unit').textContent = agent.unit;
    app.style.setProperty('--agent-accent', agent.accent);
    document.documentElement.dataset.agentTheme = agent.theme;
    renderAgentMenu();
    closeAgentMenu({ restoreFocus: true });
    if (agent.id === 'judge') openRestrictedAccess();
    else if (currentView === 'restricted') openReports('all');
  }

  function renderAgentMenu() {
    agentMenu.replaceChildren();
    CONNECTED_AGENTS.forEach(agent => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'archive-agent-option';
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', String(agent.id === activeAgentId));
      option.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">badge</span><span><strong>${escapeHtml(agent.name)}</strong><small>${escapeHtml(agent.unit)}</small></span>${agent.id === activeAgentId ? '<span class="material-symbols-outlined archive-agent-check" aria-hidden="true">check</span>' : '<span></span>'}`;
      option.addEventListener('click', () => selectConnectedAgent(agent.id));
      agentMenu.appendChild(option);
    });
  }

  function openReports(collectionId = activeCollection) {
    if (activeAgentId === 'judge') { openRestrictedAccess(); return; }
    currentView = 'reports';
    activeCollection = collectionId;
    workspace.classList.remove('detail-view', 'module-view', 'seized-view');
    app.classList.remove('detail-view');
    document.querySelectorAll('[data-archive-tab]').forEach(item => item.classList.toggle('active', item.dataset.archiveTab === 'reports'));
    renderTree();
    renderReportBrowser(search.value);
    document.title = 'Rapports de mission · Archives LSPD';
  }

  function openDetail(entry) {
    if (activeAgentId === 'judge') { openRestrictedAccess(); return; }
    currentView = 'detail';
    workspace.classList.remove('module-view', 'seized-view');
    workspace.classList.add('detail-view');
    app.classList.add('detail-view');
    selectMission(entry);
  }

  function moduleHeader(kicker, title, description, count = '') {
    return `<header class="archive-module-header"><div><span class="archive-eyebrow">${kicker}</span><h1>${title}</h1><p>${description}</p></div>${count !== '' ? `<strong class="archive-module-count">${count}</strong>` : ''}</header>`;
  }

  function renderModuleNav(moduleName) {
    if (moduleName === 'people') {
      renderPeopleTree();
      return;
    }
    moduleNav.replaceChildren();
    Object.entries(MODULES).forEach(([id, module]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.classList.toggle('active', id === moduleName);
      button.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">${module.icon}</span>${module.label}`;
      button.addEventListener('click', () => openModule(id));
      moduleNav.appendChild(button);
    });
  }

  function getRegisteredPeople() {
    const reportPeopleByName = new Map();
    allMissions.forEach(({ dlc, mission }) => {
      [...(mission.civilians || []).map(person => ({ ...person, category: 'Civil / Victime' })), ...(mission.suspects || []).map(person => ({ ...person, category: 'Suspect' }))].forEach(person => {
        if (!person.name) return;
        const key = person.name.trim().toLowerCase();
        if (!reportPeopleByName.has(key)) reportPeopleByName.set(key, { ...person, dlc, mission });
      });
    });
    const reportRegistry = readReportPersonRegistry();
    const knownNames = new Set([...REGISTERED_LSPD_PERSONNEL, ...MEMORIAL_PERSONNEL, ...reportRegistry].map(person => String(person.name || '').trim().toLowerCase()));
    return [
      ...REGISTERED_LSPD_PERSONNEL,
      ...MEMORIAL_PERSONNEL.map(person => ({ ...person, category: 'Personnel LSPD', status: 'Décédé en service', statusClass: 'deceased', portrait: 'assets/people/memorial-officer.webp' })),
      ...reportRegistry,
      ...[...reportPeopleByName.values()].filter(person => !knownNames.has(person.name.trim().toLowerCase())).map((person, index) => {
        const sourceEntry = allMissions.find(entry => entry.mission === person.mission && entry.dlc === person.dlc);
        return { ...person, id: `PER-${String(index + 1).padStart(3, '0')}`, status: person.category === 'Suspect' ? 'Répertorié' : 'Associé à un dossier', statusClass: person.category === 'Suspect' ? 'suspect' : 'civil', sourceReports: sourceEntry ? [reportId(sourceEntry)] : [] };
      })
    ];
  }

  function matchesPeopleFilter(person, filter) {
    if (filter === 'police') return ['active', 'revoked', 'deceased'].includes(person.statusClass);
    if (filter === 'active') return person.statusClass === 'active';
    if (filter === 'memorial') return person.statusClass === 'deceased';
    if (filter === 'suspects') return person.statusClass === 'suspect';
    if (filter === 'victims') return person.statusClass === 'civil';
    if (filter.startsWith('group:')) return (readPeopleGroupLinks()[person.id] || []).includes(filter.slice(6));
    return true;
  }

  function renderPeopleTree() {
    const people = getRegisteredPeople();
    const groupLinks = readPeopleGroupLinks();
    const assignedGroups = readPeopleGroupBank().map(group => ({ group, count: people.filter(person => (groupLinks[person.id] || []).includes(group)).length })).filter(item => item.count > 0);
    const count = filter => people.filter(person => matchesPeopleFilter(person, filter)).length;
    moduleNav.innerHTML = `<div class="archive-people-tree"><button type="button" data-people-filter="all"><span class="material-symbols-outlined" aria-hidden="true">groups</span><strong>Toutes les personnes</strong><small>${people.length}</small></button><div class="archive-people-folder"><button type="button" data-people-filter="police"><span class="material-symbols-outlined" aria-hidden="true">folder_open</span><strong>Police</strong><small>${count('police')}</small></button><div><button type="button" data-people-filter="active"><span class="material-symbols-outlined" aria-hidden="true">badge</span><strong>En service</strong><small>${count('active')}</small></button><button type="button" data-people-filter="memorial"><span class="material-symbols-outlined" aria-hidden="true">local_florist</span><strong>Mémorial</strong><small>${count('memorial')}</small></button></div></div><div class="archive-people-folder"><button type="button" data-people-filter="suspects"><span class="material-symbols-outlined" aria-hidden="true">person_alert</span><strong>Suspects</strong><small>${count('suspects')}</small></button>${assignedGroups.length ? `<div>${assignedGroups.map(item => `<button type="button" data-people-filter="group:${escapeHtml(item.group)}"><span class="material-symbols-outlined" aria-hidden="true">folder</span><strong>${escapeHtml(item.group)}</strong><small>${item.count}</small></button>`).join('')}</div>` : ''}</div><button type="button" data-people-filter="victims"><span class="material-symbols-outlined" aria-hidden="true">personal_injury</span><strong>Victimes</strong><small>${count('victims')}</small></button></div>`;
    moduleNav.querySelectorAll('[data-people-filter]').forEach(button => {
      button.classList.toggle('active', button.dataset.peopleFilter === activePeopleFilter);
      button.addEventListener('click', () => {
        activePeopleFilter = button.dataset.peopleFilter;
        renderPeopleTree();
        renderPeople(activePeopleFilter);
      });
    });
  }

  function renderDashboardError() {
    moduleMain.innerHTML = `<div class="archive-error-page"><section class="archive-error-panel" role="alert"><div class="archive-error-icon"><span class="material-symbols-outlined" aria-hidden="true">error</span></div><span class="archive-eyebrow">Los Sueños Police Department · Services numériques</span><h1>Erreur interne du tableau de bord</h1><p>Le service d’agrégation opérationnelle n’a pas répondu dans le délai imparti. Les rapports individuels restent accessibles depuis le module Rapports.</p><div class="archive-error-code">CODE ERREUR · LSPD-OPS-7F3-503</div><div class="archive-error-meta">Incident automatiquement transmis · 24 juillet 2026 · 23:41 UTC−7</div></section></div>`;
  }

  function openRestrictedAccess() {
    currentView = 'restricted';
    workspace.classList.remove('detail-view');
    workspace.classList.add('module-view', 'seized-view');
    app.classList.remove('detail-view');
    document.querySelectorAll('[data-archive-tab]').forEach(item => item.classList.remove('active'));
    document.getElementById('archive-module-sidebar-title').textContent = 'Accès suspendu';
    moduleNav.innerHTML = `<div class="archive-restriction-nav"><span><i class="archive-status-dot revoked"></i> Identifiants révoqués</span><span><span class="material-symbols-outlined" aria-hidden="true">policy</span> Contrôle FISA actif</span><span><span class="material-symbols-outlined" aria-hidden="true">lock</span> Archives verrouillées</span></div>`;
    moduleMain.innerHTML = `<section class="archive-seizure-page" role="alert" aria-labelledby="archive-seizure-title"><header class="archive-seizure-banner"><span>Federal Investigation and Security Agency</span><strong>SYSTÈME PLACÉ SOUS SCELLÉS</strong><span>Department of Authority · Los Sueños</span></header><div class="archive-seizure-body"><div class="archive-seizure-seal"><img src="assets/creator-fisa.webp" alt="Sceau de la Federal Investigation and Security Agency"><span>AUTORITÉ FÉDÉRALE</span></div><div class="archive-seizure-copy"><span class="archive-seizure-kicker">Notification officielle de saisie numérique</span><h1 id="archive-seizure-title">ACCÈS RÉVOQUÉ</h1><h2>Cette interface a été placée sous contrôle de la FISA</h2><p>Les autorisations du commandant David “Judge” Beaumont sont suspendues dans le cadre d’une procédure fédérale en cours. Les archives, journaux d’activité et éléments de preuve associés à cette session ont été placés sous scellés.</p><div class="archive-seizure-warning"><strong>AVERTISSEMENT</strong><span>Toute tentative d’accès, de copie, d’altération ou de contournement sera enregistrée et susceptible d’être versée à la procédure.</span></div></div></div><footer class="archive-seizure-footer"><dl><div><dt>Référence de saisie</dt><dd>LS-FISA-26-0719-JB</dd></div><div><dt>Niveau de restriction</dt><dd>ACCÈS 0 · TOTAL</dd></div><div><dt>Statut</dt><dd>PROCÉDURE ACTIVE</dd></div><div><dt>Autorité de contrôle</dt><dd>FISA · INTERNAL AFFAIRS</dd></div></dl><p>Pour restaurer une session autorisée, sélectionnez un autre agent depuis le contrôle d’identité.</p></footer><div class="archive-seizure-stamp" aria-hidden="true">SAISI · FISA</div></section>`;
    moduleMain.focus({ preventScroll: true });
    document.title = 'Accès révoqué · Archives LSPD';
  }

  function renderDossiers() {
    moduleMain.innerHTML = `${moduleHeader('Bureau des archives', 'Dossiers opérationnels', 'Collections officielles classées selon votre arborescence existante.', DATA.length)}<div class="archive-module-cards" id="archive-dossier-cards"></div>`;
    const container = document.getElementById('archive-dossier-cards');
    DATA.forEach(dlc => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'archive-module-card';
      card.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">folder</span><h2>${escapeHtml(dlc.name)}</h2><p>${dlc.missions.length} rapport${dlc.missions.length > 1 ? 's' : ''} de mission · Ouvrir la collection</p>`;
      card.addEventListener('click', () => openReports(dlc.id));
      container.appendChild(card);
    });
  }

  function renderPeople(filter = activePeopleFilter) {
    const registeredPeople = getRegisteredPeople().filter(person => matchesPeopleFilter(person, filter));
    const filterLabels = { all: 'Personnes', police: 'Police', active: 'Personnel en service', memorial: 'Mémorial', suspects: 'Suspects', victims: 'Victimes' };
    const groupBank = readPeopleGroupBank();
    const groupLinks = readPeopleGroupLinks();
    const title = filter.startsWith('group:') ? filter.slice(6) : (filterLabels[filter] || 'Personnes');
    moduleMain.innerHTML = `${moduleHeader('Registre central du LSPD', title, 'Personnel, civils, victimes et suspects enregistrés dans les archives de Los Sueños.', registeredPeople.length)}${isArchiveAdmin() ? `<form id="archive-people-group-create" class="archive-people-group-create"><label for="archive-people-group-name">Banque de groupuscules</label><input id="archive-people-group-name" maxlength="60" placeholder="Nom du nouveau groupuscule" required><button type="submit"><span class="material-symbols-outlined" aria-hidden="true">create_new_folder</span> Créer</button></form><div class="archive-people-group-bank">${groupBank.map(group => `<span>${escapeHtml(group)}<button type="button" data-delete-people-group="${escapeHtml(group)}" aria-label="Supprimer ${escapeHtml(group)}">×</button></span>`).join('')}</div>` : ''}<div class="archive-memorial-head" aria-hidden="true"><span>Portrait</span><span>Référence</span><span>Identité</span><span>Catégorie</span><span>Statut</span></div><div class="archive-module-list" id="archive-people-list"></div>`;
    document.getElementById('archive-people-group-create')?.addEventListener('submit', event => {
      event.preventDefault();
      const input = document.getElementById('archive-people-group-name');
      const group = input.value.trim().replace(/\s+/g, ' ').slice(0, 60);
      if (!group) return;
      const bank = readPeopleGroupBank();
      if (!bank.some(item => item.toLowerCase() === group.toLowerCase())) bank.push(group);
      savePeopleGroups(bank, readPeopleGroupLinks());
      renderPeopleTree();
      renderPeople(filter);
    });
    moduleMain.querySelectorAll('[data-delete-people-group]').forEach(button => button.addEventListener('click', () => {
      const group = button.dataset.deletePeopleGroup;
      const bank = readPeopleGroupBank().filter(item => item !== group);
      const links = readPeopleGroupLinks();
      Object.keys(links).forEach(personId => { links[personId] = (links[personId] || []).filter(item => item !== group); });
      savePeopleGroups(bank, links);
      if (activePeopleFilter === `group:${group}`) activePeopleFilter = 'all';
      renderPeopleTree();
      renderPeople(activePeopleFilter);
    }));
    const container = document.getElementById('archive-people-list');
    registeredPeople.forEach(person => {
      const row = document.createElement('div');
      row.className = 'archive-module-row archive-memorial-row';
      const portrait = safeImageSource(person.portrait);
      const personGroups = Array.isArray(groupLinks[person.id]) ? groupLinks[person.id] : [];
      row.innerHTML = `${portrait ? `<img class="archive-memorial-portrait${person.statusClass === 'deceased' ? ' deceased' : ''}" src="${escapeHtml(portrait)}" alt="Portrait de ${escapeHtml(person.name)}">` : '<span class="archive-person-placeholder material-symbols-outlined" aria-hidden="true">person</span>'}<small>${escapeHtml(person.id)}</small><strong>${escapeHtml(person.name)}${person.uncertain ? '<sup title="Inscription partiellement masquée">†</sup>' : ''}</strong><div class="archive-person-category"><span>${escapeHtml(person.category)}${person.rank ? ` · ${escapeHtml(person.rank)}` : ''}</span>${person.sourceReports?.length ? `<small>Origine · ${escapeHtml(person.sourceReports.join(' · '))}</small>` : ''}<div>${personGroups.map(group => `<em>${escapeHtml(group)}</em>`).join('')}</div>${isArchiveAdmin() && groupBank.length ? `<details><summary>Groupuscules</summary><section>${groupBank.map(group => `<button type="button" data-person-group="${escapeHtml(group)}" class="${personGroups.includes(group) ? 'selected' : ''}">${escapeHtml(group)}</button>`).join('')}</section></details>` : ''}</div><span class="archive-memorial-status ${escapeHtml(person.statusClass)}"><i class="archive-status-dot"></i> ${escapeHtml(person.status)}</span>`;
      row.querySelectorAll('[data-person-group]').forEach(button => button.addEventListener('click', () => {
        const links = readPeopleGroupLinks();
        const assigned = new Set(Array.isArray(links[person.id]) ? links[person.id] : []);
        if (assigned.has(button.dataset.personGroup)) assigned.delete(button.dataset.personGroup);
        else assigned.add(button.dataset.personGroup);
        links[person.id] = [...assigned];
        savePeopleGroups(readPeopleGroupBank(), links);
        renderPeopleTree();
        renderPeople(filter);
      }));
      const sourceEntry = (person.sourceReports || []).map(sourceId => allMissions.find(entry => reportId(entry) === sourceId)).find(Boolean);
      if (sourceEntry) {
        row.classList.add('has-report-link');
        row.tabIndex = 0;
        row.setAttribute('role', 'link');
        row.setAttribute('aria-label', `Ouvrir le rapport associé à ${person.name}`);
        const openSourceReport = event => {
          if (event.target.closest('button, input, details, summary')) return;
          if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
          event.preventDefault();
          openDetail(sourceEntry);
        };
        row.addEventListener('click', openSourceReport);
        row.addEventListener('keydown', openSourceReport);
      }
      container.appendChild(row);
    });
  }

  function renderPlaces() {
    moduleMain.innerHTML = `${moduleHeader('Répertoire géographique', 'Lieux d’intervention', 'Sites associés aux opérations enregistrées.', allMissions.length)}<div class="archive-module-list" id="archive-place-list"></div>`;
    const container = document.getElementById('archive-place-list');
    allMissions.forEach((entry, index) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'archive-module-row';
      const thumb = safeImageSource(entry.mission.thumb);
      row.innerHTML = `${thumb ? `<img src="${escapeHtml(thumb)}" alt="">` : '<span class="material-symbols-outlined" aria-hidden="true">location_on</span>'}<strong>${escapeHtml(entry.mission.name)}</strong><span>${escapeHtml(entry.dlc.name)}</span><small>District ${pad((index % 9) + 1)} · Los Sueños</small>`;
      row.addEventListener('click', () => openDetail(entry));
      container.appendChild(row);
    });
  }

  function renderEvidenceModule() {
    const evidenceEntries = readEvidenceRegistry();
    const admin = isArchiveAdmin();
    const tagBank = typeof getAllTags === 'function' ? getAllTags() : [];
    moduleMain.innerHTML = `${moduleHeader('Evidence Unit', 'Inventaire des preuves', 'Pièces visuelles enregistrées et indexées par les administrateurs.', evidenceEntries.length)}<div class="archive-evidence-grid" id="archive-evidence-grid"></div>`;
    const container = document.getElementById('archive-evidence-grid');
    evidenceEntries.forEach((evidence, index) => {
      const card = document.createElement('article');
      card.className = 'archive-evidence-card';
      const image = safeImageSource(evidence.image);
      const tags = Array.isArray(evidence.tags) ? evidence.tags : [];
      card.innerHTML = `<button class="archive-evidence-image${image ? '' : ' empty'}" type="button" ${admin ? '' : 'disabled'}>${image ? `<img src="${escapeHtml(image)}" alt="Preuve ${escapeHtml(evidence.name)}">` : '<span class="material-symbols-outlined" aria-hidden="true">add_photo_alternate</span><small>AJOUTER UNE IMAGE</small>'}</button><div class="archive-evidence-copy">${admin ? `<input data-evidence-field="name" value="${escapeHtml(evidence.name || '')}" aria-label="Nom de la preuve"><input data-evidence-field="reference" value="${escapeHtml(evidence.reference || '')}" aria-label="Référence de la preuve">` : `<strong>${escapeHtml(evidence.name || 'PREUVE SANS NOM')}</strong><small>${escapeHtml(evidence.reference || 'RÉF. NON RENSEIGNÉE')}</small>`}<div class="archive-evidence-tags">${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>${admin ? `<details class="archive-evidence-tag-bank"><summary><span class="material-symbols-outlined" aria-hidden="true">sell</span> Banque de tags <small>${tags.length} sélectionné${tags.length > 1 ? 's' : ''}</small></summary><div>${tagBank.map(tag => `<button type="button" data-evidence-tag="${escapeHtml(tag)}" class="tag${tags.includes(tag) ? ' selected' : ''}">${escapeHtml(tag)}</button>`).join('') || '<p>Aucun tag disponible dans Paramètres.</p>'}</div></details><button class="archive-evidence-delete" type="button"><span class="material-symbols-outlined" aria-hidden="true">delete</span> Supprimer</button>` : ''}</div>`;
      if (admin) {
        card.querySelector('.archive-evidence-image').addEventListener('click', () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/png,image/jpeg,image/webp';
          input.addEventListener('change', async () => {
            const file = input.files?.[0];
            if (!file) return;
            try {
              const uploaded = await uploadManagedImage(file, 'evidence', `${evidence.reference || 'preuve'}-${evidence.name || index + 1}`);
              const records = readEvidenceRegistry();
              if (!records[index]) return;
              records[index].image = uploaded.url || uploaded.path;
              records[index].assetPath = uploaded.path || '';
              records[index].format = uploaded.format || 'webp';
              saveEvidenceRegistry(records);
              renderEvidenceModule();
            } catch (error) {
              window.alert(error.message || 'Import de l’image impossible.');
            }
          });
          input.click();
        });
        card.querySelectorAll('[data-evidence-field]').forEach(input => input.addEventListener('change', () => {
          const records = readEvidenceRegistry();
          if (!records[index]) return;
          records[index][input.dataset.evidenceField] = input.value.trim().slice(0, 200);
          saveEvidenceRegistry(records);
          renderEvidenceModule();
        }));
        card.querySelectorAll('[data-evidence-tag]').forEach(button => button.addEventListener('click', () => {
          const records = readEvidenceRegistry();
          if (!records[index]) return;
          const currentTags = new Set(Array.isArray(records[index].tags) ? records[index].tags : []);
          if (currentTags.has(button.dataset.evidenceTag)) currentTags.delete(button.dataset.evidenceTag);
          else if (currentTags.size < 12) currentTags.add(button.dataset.evidenceTag);
          records[index].tags = [...currentTags];
          saveEvidenceRegistry(records);
          renderEvidenceModule();
        }));
        card.querySelector('.archive-evidence-delete').addEventListener('click', () => {
          const records = readEvidenceRegistry();
          records.splice(index, 1);
          saveEvidenceRegistry(records);
          renderEvidenceModule();
        });
      }
      container.appendChild(card);
    });
    if (!evidenceEntries.length && !admin) container.innerHTML = '<div class="archive-evidence-registry-empty">AUCUNE PREUVE ENREGISTRÉE</div>';
    if (admin) {
      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'archive-evidence-registry-add';
      add.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">add_photo_alternate</span><strong>AJOUTER UNE PREUVE</strong><small>Créer une carte et importer une image</small>';
      add.addEventListener('click', () => {
        const records = readEvidenceRegistry();
        records.push({ name: 'NOUVELLE PREUVE', reference: `EV-${String(records.length + 1).padStart(4, '0')}`, tags: [], image: '' });
        saveEvidenceRegistry(records);
        renderEvidenceModule();
      });
      container.appendChild(add);
    }
    if (typeof refreshRenderedTagColors === 'function') refreshRenderedTagColors();
  }

  function openModule(moduleName) {
    if (activeAgentId === 'judge') { openRestrictedAccess(); return; }
    const module = MODULES[moduleName] || MODULES.dashboard;
    currentView = moduleName;
    workspace.classList.remove('detail-view', 'seized-view');
    workspace.classList.add('module-view');
    app.classList.remove('detail-view');
    document.querySelectorAll('[data-archive-tab]').forEach(item => item.classList.toggle('active', item.dataset.archiveTab === moduleName));
    document.getElementById('archive-module-sidebar-title').textContent = module.label;
    renderModuleNav(moduleName);
    if (moduleName === 'dashboard') renderDashboardError();
    if (moduleName === 'people') renderPeople();
    if (moduleName === 'evidence') renderEvidenceModule();
    moduleMain.focus({ preventScroll: true });
    document.title = `${module.label} · Archives LSPD`;
  }

  function renderTree() {
    archiveTree.replaceChildren();
    const collections = [{ id: 'all', name: 'Toutes les missions', missions: allMissions }, ...DATA.map(dlc => ({ id: dlc.id, name: dlc.name, missions: dlc.missions.map(mission => ({ dlc, mission })) }))];
    collections.forEach(collection => {
      const group = document.createElement('div');
      group.className = `archive-tree-group${activeCollection === collection.id ? ' open' : ''}`;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = `archive-tree-button${activeCollection === collection.id ? ' active' : ''}`;
      button.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">${collection.id === 'all' ? 'inventory_2' : 'folder'}</span><strong>${escapeHtml(collection.name)}</strong><small>${collection.missions.length}</small>`;
      button.addEventListener('click', () => {
        activeCollection = collection.id;
        renderTree();
        renderReportBrowser(search.value);
      });
      group.appendChild(button);

      if (collection.id !== 'all') {
        const children = document.createElement('div');
        children.className = 'archive-tree-children';
        collection.missions.forEach(entry => {
          const child = document.createElement('button');
          child.type = 'button';
          child.className = 'archive-tree-mission';
          child.textContent = entry.mission.name;
          child.addEventListener('click', () => openDetail(entry));
          children.appendChild(child);
        });
        group.appendChild(children);
      }
      archiveTree.appendChild(group);
    });
  }

  const isConfidential = entry => /^SecretEnd\s*-|^Commissariat$/i.test(entry.mission.name);
  const statusFor = entry => isConfidential(entry)
    ? { label: 'Confidentielle', className: 'confidential' }
    : { label: 'Clôturée', className: 'closed' };

  function renderReportBrowser(query = '') {
    const normalized = query.trim().toLowerCase();
    const collection = activeCollection === 'all' ? null : DATA.find(dlc => dlc.id === activeCollection);
    const entries = allMissions.filter(entry => {
      const inCollection = !collection || entry.dlc === collection;
      const searchable = `${entry.mission.name} ${entry.dlc.name} ${(entry.mission.tags || []).join(' ')}`.toLowerCase();
      return inCollection && (!normalized || searchable.includes(normalized));
    });

    document.getElementById('archive-browser-title').textContent = collection ? collection.name : 'Toutes les missions';
    document.getElementById('archive-browser-description').textContent = collection ? `Rapports classés dans la collection ${collection.name}.` : 'Rapports classés par campagne et extension.';
    document.getElementById('archive-browser-count').textContent = String(entries.length);
    reportList.replaceChildren();

    if (!entries.length) {
      const empty = document.createElement('div');
      empty.className = 'archive-empty';
      empty.textContent = 'Aucun rapport ne correspond à la recherche.';
      reportList.appendChild(empty);
      return;
    }

    entries.forEach(entry => {
      const row = document.createElement('button');
      const status = statusFor(entry);
      row.type = 'button';
      row.className = 'archive-report-row';
      const thumb = safeImageSource(entry.mission.thumb);
      row.innerHTML = `<span class="report-number">${escapeHtml(reportId(entry))}</span><span class="report-mission">${thumb ? `<img src="${escapeHtml(thumb)}" alt="">` : ''}<strong>${escapeHtml(entry.mission.name)}</strong></span><span class="report-collection">${escapeHtml(entry.dlc.name)}</span><span class="report-date">${escapeHtml(readableDate(entry.mission.date))}</span><span class="report-status"><i class="archive-status-dot ${escapeHtml(status.className)}"></i> ${escapeHtml(status.label)}</span>`;
      row.addEventListener('click', () => openDetail(entry));
      reportList.appendChild(row);
    });
  }

  const makeMissionButton = entry => {
    const button = document.createElement('button');
    const status = statusFor(entry);
    button.type = 'button';
    button.className = 'archive-mission-item';
    button.classList.toggle('active', entry === activeEntry);
    const thumb = safeImageSource(entry.mission.thumb);
    button.innerHTML = `${thumb ? `<img src="${escapeHtml(thumb)}" alt="">` : ''}<span><strong>${escapeHtml(entry.mission.name)}</strong><small>${escapeHtml(readableDate(entry.mission.date))}</small><small>STATUT : ${escapeHtml(status.label.toUpperCase())}</small></span>`;
    button.addEventListener('click', () => openDetail(entry));
    return button;
  };

  const printBackground = document.getElementById('archive-print-bg');
  const pdfViewport = document.querySelector('.archive-pdf-viewport');
  const pageControl = document.getElementById('archive-page-control');
  const zoomControl = document.getElementById('archive-zoom-control');
  const editControl = document.getElementById('archive-edit-control');
  const documentImageInput = document.getElementById('archive-document-image-input');
  const documentEditor = document.getElementById('archive-document-editor');
  const resourceInput = document.getElementById('archive-resource-input');
  const resourceBank = document.getElementById('archive-resource-bank');
  const pdfPages = [...pdfViewport.children];
  pdfPages.forEach((page, index) => {
    const footer = document.createElement('footer');
    footer.className = 'archive-page-footer';
    footer.innerHTML = `<span>LSPD · ARCHIVES DES OPÉRATIONS</span><strong class="archive-page-footer-id">RÉF. NON RENSEIGNÉE</strong><span>PAGE ${index + 1} / 6</span>`;
    page.appendChild(footer);
  });
  let currentPdfPage = 1;
  let zoomIndex = 1;
  const zoomLevels = [75, 100, 125];
  const DOCUMENT_STORE_KEY = 'ronLoreA4DocumentsV1';
  const EDITABLE_DOCUMENT_SELECTOR = [
    '.archive-report-grid section p', '.archive-report-grid section li', '.archive-report-grid th', '.archive-report-grid td',
    '.archive-form-row strong', '.archive-report-id dd', '.archive-custody p',
    '.archive-fixed-timeline time', '.archive-fixed-timeline strong', '.archive-fixed-timeline span', '.archive-fixed-timeline small',
    '.archive-record-card strong', '.archive-record-card small', '.archive-fixed-fields strong', '.archive-large-field p',
    '.archive-analysis-grid p', '#archive-evidence-strip figcaption', '.archive-associated-docs span', '.archive-revision-table td', '.archive-signature-block strong'
  ].join(',');
  let documentEditing = false;
  let pendingImageKey = '';
  let selectedResourceIndex = -1;

  function readDocumentStore() {
    try { return JSON.parse(localStorage.getItem(DOCUMENT_STORE_KEY) || '{}'); }
    catch { return {}; }
  }

  function migrateLegacyDocumentCards() {
    const migrationKey = 'ronLoreA4CardSchemaVersion';
    if (localStorage.getItem(migrationKey) === '3') return;
    const store = readDocumentStore();
    Object.values(store).forEach(documentState => {
      delete documentState.records;
      delete documentState.texts;
      if (documentState.images) {
        Object.keys(documentState.images).forEach(key => {
          if (key.startsWith('civil-') || key.startsWith('suspect-') || key.startsWith('evidence-')) delete documentState.images[key];
        });
      }
    });
    localStorage.setItem(DOCUMENT_STORE_KEY, JSON.stringify(store));
    localStorage.setItem(migrationKey, '3');
  }

  migrateLegacyDocumentCards();

  function importExistingReportPeople() {
    const store = readDocumentStore();
    let changed = false;
    Object.entries(store).forEach(([sourceReportId, documentState]) => {
      ['civil', 'suspect'].forEach(type => {
        const records = documentState?.records?.[type];
        if (!Array.isArray(records)) return;
        records.forEach((record, index) => {
          const previousId = record.registryId;
          syncReportPersonRecord(record, type, documentState.images?.[`${type}-${index}`] || record.image || '', sourceReportId);
          if (record.registryId !== previousId) changed = true;
        });
      });
    });
    if (changed) localStorage.setItem(DOCUMENT_STORE_KEY, JSON.stringify(store));
  }

  importExistingReportPeople();

  function getCurrentDocumentState() {
    const store = readDocumentStore();
    return store[reportId(activeEntry)] || { texts: {}, images: {} };
  }

  function saveCurrentDocumentState(state) {
    const store = readDocumentStore();
    store[reportId(activeEntry)] = state;
    localStorage.setItem(DOCUMENT_STORE_KEY, JSON.stringify(store));
  }

  function editableDocumentTargets() {
    return [...pdfViewport.querySelectorAll(EDITABLE_DOCUMENT_SELECTOR)];
  }

  function configureEditableTargets() {
    editableDocumentTargets().forEach((element, index) => {
      element.dataset.documentField = `text-${index}`;
      if (documentEditing) {
        element.contentEditable = 'true';
        element.spellcheck = true;
      } else {
        element.removeAttribute('contenteditable');
      }
    });
  }

  function renderResourceBank() {
    const resources = getCurrentDocumentState().resources || [];
    resourceBank.replaceChildren();
    if (!resources.length) {
      resourceBank.innerHTML = '<p>AUCUNE IMAGE IMPORTÉE<small>Importer des fichiers PNG, JPG ou WEBP</small></p>';
      selectedResourceIndex = -1;
      return;
    }
    resources.forEach((source, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `archive-resource-item${selectedResourceIndex === index ? ' selected' : ''}`;
      button.title = `Ressource ${index + 1}`;
      button.innerHTML = `<img src="${escapeHtml(safeImageSource(source))}" alt="Ressource importée ${index + 1}">`;
      button.addEventListener('click', () => { selectedResourceIndex = index; renderResourceBank(); });
      resourceBank.appendChild(button);
    });
  }

  function assignDocumentImage(key, source) {
    const state = getCurrentDocumentState();
    state.images ||= {};
    state.images[key] = source;
    const personImage = key.match(/^(civil|suspect)-(\d+)$/);
    if (personImage) {
      const [, type, rawIndex] = personImage;
      const record = state.records?.[type]?.[Number(rawIndex)];
      if (record) syncReportPersonRecord(record, type, source);
    }
    saveCurrentDocumentState(state);
    applyDocumentOverrides();
  }

  function applyDocumentOverrides() {
    const state = getCurrentDocumentState();
    editableDocumentTargets().forEach((element, index) => {
      const key = `text-${index}`;
      element.dataset.documentField = key;
      if (Object.prototype.hasOwnProperty.call(state.texts || {}, key)) element.textContent = state.texts[key];
      if (element.matches('.archive-record-card strong') && element.textContent.trim() !== 'NON RENSEIGNÉ') element.closest('.archive-record-card')?.classList.remove('empty');
    });
    [...document.querySelectorAll('#archive-evidence-strip figure')].forEach((figure, index) => {
      const source = state.images?.[`evidence-${index}`];
      if (!source) return;
      const media = figure.querySelector('.archive-evidence-media');
      if (media) media.innerHTML = `<img src="${escapeHtml(safeImageSource(source))}" alt="Preuve personnalisée ${index + 1}">`;
    });
    [...document.querySelectorAll('.archive-record-media[data-document-image-key]')].forEach(media => {
      const source = state.images?.[media.dataset.documentImageKey];
      if (!source) return;
      media.innerHTML = `<img src="${escapeHtml(safeImageSource(source))}" alt="Image personnalisée">`;
    });
    configureEditableTargets();
  }

  function setDocumentEditing(enabled) {
    documentEditing = Boolean(enabled && typeof requireAdmin === 'function' && requireAdmin());
    app.classList.toggle('document-editing', documentEditing);
    editControl.classList.toggle('active', documentEditing);
    editControl.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">${documentEditing ? 'done' : 'edit_document'}</span> ${documentEditing ? 'Terminer' : 'Éditer'}`;
    renderReportPeople(activeEntry);
    renderEvidence();
    renderList(search.value);
    applyDocumentOverrides();
    documentEditor.hidden = !documentEditing;
    relatedEditor.hidden = !documentEditing;
    if (documentEditing) renderResourceBank();
  }

  function goToPdfPage(pageNumber) {
    currentPdfPage = Math.min(6, Math.max(1, pageNumber));
    pageControl.textContent = String(currentPdfPage);
    pdfPages[currentPdfPage - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setPdfZoom(percent) {
    pdfViewport.classList.remove('zoom-75', 'zoom-125', 'fit-width');
    if (percent === 75) pdfViewport.classList.add('zoom-75');
    if (percent === 125) pdfViewport.classList.add('zoom-125');
    zoomControl.textContent = `${percent}%`;
  }

  function downloadBlankPdf() {
    const objects = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
      '2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\n'
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach(object => { offsets.push(pdf.length); pdf += object; });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    const reportIdForFile = document.getElementById('archive-report-id').textContent || 'NON-REFERENCE';
    link.download = `LSPD_ARCHIVE_${reportIdForFile}_DIFFUSION-RESTREINTE.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function openPrintDialog() {
    document.getElementById('archive-print-dialog').classList.remove('print-sent');
    document.getElementById('archive-print-title').textContent = 'Impression sécurisée LSPD';
    printBackground.classList.add('open');
    printBackground.setAttribute('aria-hidden', 'false');
    document.getElementById('archive-printer').focus();
  }

  function closePrintDialog() {
    printBackground.classList.remove('open');
    printBackground.setAttribute('aria-hidden', 'true');
  }

  pdfViewport.addEventListener('input', event => {
    if (!documentEditing || !event.target.matches('[data-document-field]')) return;
    const state = getCurrentDocumentState();
    if (event.target.dataset.recordType) {
      const type = event.target.dataset.recordType;
      const index = Number(event.target.dataset.recordIndex);
      state.records ||= {};
      state.records[type] ||= type === 'evidence' ? [] : getReportPeople(type, type === 'civil' ? activeEntry.mission.civilians : activeEntry.mission.suspects);
      if (state.records[type][index]) {
        state.records[type][index][event.target.dataset.recordField] = event.target.textContent;
        if (type === 'civil' || type === 'suspect') syncReportPersonRecord(state.records[type][index], type, state.images?.[`${type}-${index}`]);
      }
    }
    state.texts ||= {};
    state.texts[event.target.dataset.documentField] = event.target.textContent;
    saveCurrentDocumentState(state);
  });

  pdfViewport.addEventListener('click', event => {
    if (!documentEditing) return;
    const deleteButton = event.target.closest('[data-delete-record]');
    if (deleteButton) {
      event.preventDefault();
      const state = getCurrentDocumentState();
      const type = deleteButton.dataset.deleteRecord;
      const index = Number(deleteButton.dataset.recordIndex);
      if (Array.isArray(state.records?.[type])) state.records[type].splice(index, 1);
      saveCurrentDocumentState(state);
      if (type === 'evidence') renderEvidence();
      else renderReportPeople(activeEntry);
      applyDocumentOverrides();
      return;
    }
    const imageTarget = event.target.closest('[data-document-image-key]');
    if (!imageTarget) return;
    event.preventDefault();
    pendingImageKey = imageTarget.dataset.documentImageKey;
    const selectedResource = getCurrentDocumentState().resources?.[selectedResourceIndex];
    if (selectedResource) {
      assignDocumentImage(pendingImageKey, selectedResource);
      return;
    }
    documentImageInput.click();
  });

  documentImageInput.addEventListener('change', async () => {
    const file = documentImageInput.files?.[0];
    if (!file || !pendingImageKey || !documentEditing) return;
    try {
      const uploaded = await uploadManagedImage(file, 'reports', `${reportId(activeEntry)}-${pendingImageKey}`);
      assignDocumentImage(pendingImageKey, uploaded.url || uploaded.path);
    } catch (error) {
      window.alert(error.message || 'Import de l’image impossible.');
    } finally {
      documentImageInput.value = '';
      pendingImageKey = '';
    }
  });

  document.getElementById('archive-resource-import').addEventListener('click', () => resourceInput.click());
  resourceInput.addEventListener('change', async () => {
    const files = [...(resourceInput.files || [])];
    if (!files.length || !documentEditing) return;
    try {
      const uploads = await Promise.all(files.map((file, index) => uploadManagedImage(file, 'reports', `${reportId(activeEntry)}-ressource-${Date.now()}-${index + 1}`)));
      const images = uploads.map(upload => upload.url || upload.path);
      const state = getCurrentDocumentState();
      state.resources = [...(state.resources || []), ...images];
      saveCurrentDocumentState(state);
      selectedResourceIndex = state.resources.length - images.length;
      renderResourceBank();
    } catch (error) {
      window.alert(error.message || 'Import d’une ou plusieurs images impossible.');
    } finally {
      resourceInput.value = '';
    }
  });

  function focusEditableField(element) {
    if (!element) return;
    const page = element.closest('article.archive-report, section.archive-timeline, section.archive-pdf-page');
    const pageIndex = pdfPages.indexOf(page);
    if (pageIndex >= 0) goToPdfPage(pageIndex + 1);
    setTimeout(() => element.focus(), 250);
  }

  function addPersonBlock(type) {
    const state = getCurrentDocumentState();
    state.records ||= {};
    const missionPeople = type === 'civil' ? activeEntry.mission.civilians : activeEntry.mission.suspects;
    state.records[type] ||= getReportPeople(type, missionPeople);
    const record = { name: type === 'civil' ? 'NOUVEAU CIVIL' : 'NOUVEAU SUSPECT', desc: type === 'civil' ? 'DESCRIPTION DU CIVIL NON RENSEIGNÉE' : 'DESCRIPTION DU SUSPECT NON RENSEIGNÉE', image: '', _custom: true };
    syncReportPersonRecord(record, type);
    state.records[type].push(record);
    saveCurrentDocumentState(state);
    renderReportPeople(activeEntry);
    applyDocumentOverrides();
    const container = document.getElementById(type === 'civil' ? 'archive-report-civilians' : 'archive-report-suspects');
    focusEditableField(container.querySelector('.archive-record-card:last-of-type strong'));
  }

  document.querySelectorAll('[data-document-block]').forEach(button => button.addEventListener('click', () => {
    const type = button.dataset.documentBlock;
    if (!documentEditing) return;
    if (type === 'civil' || type === 'suspect') { addPersonBlock(type); return; }
    if (type === 'evidence') {
      addEvidenceBlock();
      return;
    }
    const emptyText = editableDocumentTargets().find(element => /NON RENSEIGN/i.test(element.textContent));
    focusEditableField(emptyText);
  }));
  document.getElementById('archive-editor-finish').addEventListener('click', () => setDocumentEditing(false));

  function renderList(query = '') {
    list.replaceChildren();
    const normalized = query.trim().toLowerCase();
    const state = getCurrentDocumentState();
    const defaultEntries = [activeEntry, ...allMissions.filter(entry => entry !== activeEntry).slice(0, 2)];
    const linkedIds = Array.isArray(state.relatedOperations) ? state.relatedOperations : defaultEntries.map(reportId);
    const linked = linkedIds.map(id => allMissions.find(entry => reportId(entry) === id)).filter(Boolean);
    const visible = linked.filter(entry => !normalized || entry.mission.name.toLowerCase().includes(normalized) || entry.dlc.name.toLowerCase().includes(normalized));
    visible.forEach(entry => {
      const row = document.createElement('div');
      row.className = 'archive-related-row';
      row.appendChild(makeMissionButton(entry));
      if (documentEditing) {
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'archive-related-remove';
        remove.title = 'Retirer cette liaison';
        remove.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">link_off</span>';
        remove.addEventListener('click', event => {
          event.stopPropagation();
          const nextState = getCurrentDocumentState();
          nextState.relatedOperations = linkedIds.filter(id => id !== reportId(entry));
          saveCurrentDocumentState(nextState);
          renderList(search.value);
        });
        row.appendChild(remove);
      }
      list.appendChild(row);
    });
    document.getElementById('archive-related-count').textContent = String(visible.length);
    relatedSelect.replaceChildren();
    allMissions.filter(entry => !linkedIds.includes(reportId(entry))).forEach(entry => {
      const option = document.createElement('option');
      option.value = reportId(entry);
      option.textContent = `${entry.mission.name} · ${entry.dlc.name}`;
      relatedSelect.appendChild(option);
    });
    document.getElementById('archive-related-add').disabled = !relatedSelect.options.length;
  }

  document.getElementById('archive-related-add').addEventListener('click', () => {
    if (!documentEditing || !relatedSelect.value) return;
    const state = getCurrentDocumentState();
    const defaults = [activeEntry, ...allMissions.filter(entry => entry !== activeEntry).slice(0, 2)].map(reportId);
    state.relatedOperations = Array.isArray(state.relatedOperations) ? state.relatedOperations : defaults;
    if (!state.relatedOperations.includes(relatedSelect.value)) state.relatedOperations.push(relatedSelect.value);
    saveCurrentDocumentState(state);
    renderList(search.value);
  });

  function addEvidenceBlock() {
    const state = getCurrentDocumentState();
    state.records ||= {};
    state.records.evidence ||= [];
    state.records.evidence.push({ name: 'NOUVELLE PREUVE', desc: 'DESCRIPTION DE LA PIÈCE NON RENSEIGNÉE', ref: 'RÉF. NON RENSEIGNÉE', _custom: true });
    saveCurrentDocumentState(state);
    renderEvidence();
    applyDocumentOverrides();
    goToPdfPage(4);
    focusEditableField(evidenceStrip.querySelector('figure:last-of-type strong'));
  }

  function renderEvidence() {
    const state = getCurrentDocumentState();
    const evidence = state.records?.evidence || [];
    evidenceStrip.replaceChildren();
    evidence.forEach((item, index) => {
      const figure = document.createElement('figure');
      figure.dataset.documentImageKey = `evidence-${index}`;
      const source = safeImageSource(state.images?.[`evidence-${index}`] || item.image || '');
      figure.innerHTML = `<div class="archive-evidence-media" data-document-image-key="evidence-${index}">${source ? `<img src="${escapeHtml(source)}" alt="${escapeHtml(item.name || 'Preuve')}">` : '<div class="archive-evidence-placeholder">AJOUTER UNE IMAGE</div>'}</div><figcaption><strong data-record-type="evidence" data-record-index="${index}" data-record-field="name">${escapeHtml(item.name || 'NOUVELLE PREUVE')}</strong><span data-record-type="evidence" data-record-index="${index}" data-record-field="desc">${escapeHtml(item.desc || 'DESCRIPTION NON RENSEIGNÉE')}</span><small data-record-type="evidence" data-record-index="${index}" data-record-field="ref">${escapeHtml(item.ref || 'RÉF. NON RENSEIGNÉE')}</small></figcaption>${documentEditing ? `<button class="archive-record-delete" type="button" data-delete-record="evidence" data-record-index="${index}" aria-label="Supprimer cette preuve"><span class="material-symbols-outlined" aria-hidden="true">delete</span></button>` : ''}`;
      evidenceStrip.appendChild(figure);
    });
    if (!evidence.length && !documentEditing) evidenceStrip.innerHTML = '<div class="archive-entity-empty archive-evidence-empty">AUCUNE PREUVE ENREGISTRÉE</div>';
    if (documentEditing) {
      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'archive-entity-add-zone archive-evidence-add-zone';
      add.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">add_photo_alternate</span><strong>AJOUTER UNE PREUVE</strong><small>Créer une carte de pièce à conviction</small>';
      add.addEventListener('click', addEvidenceBlock);
      evidenceStrip.appendChild(add);
    }
  }

  function getReportPeople(type, missionPeople) {
    const saved = getCurrentDocumentState().records?.[type];
    return Array.isArray(saved) ? saved : (missionPeople || []).map(person => ({ name: person.name || '', desc: person.desc || person.role || person.status || '', image: person.image || person.img || person.thumb || '' }));
  }

  function fillReportPeople(containerId, missionPeople, emptyMeta, type) {
    const container = document.getElementById(containerId);
    container.replaceChildren();
    const people = getReportPeople(type, missionPeople);
    people.forEach((person, index) => {
      const card = document.createElement('div');
      card.className = 'archive-record-card';
      const image = safeImageSource(person?.image || person?.img || person?.thumb || '');
      card.innerHTML = `<div class="archive-record-media" data-document-image-key="${type}-${index}">${image ? `<img src="${escapeHtml(image)}" alt="Portrait de ${escapeHtml(person.name || type)}">` : '<span class="material-symbols-outlined" aria-hidden="true">person</span><em>AJOUTER UNE IMAGE</em>'}</div><div class="archive-record-copy"><strong data-record-type="${type}" data-record-index="${index}" data-record-field="name">${escapeHtml(person?.name || 'NOUVELLE PERSONNE')}</strong><small data-record-type="${type}" data-record-index="${index}" data-record-field="desc">${escapeHtml(person?.desc || emptyMeta)}</small></div>${documentEditing && person._custom ? `<button class="archive-record-delete" type="button" data-delete-record="${type}" data-record-index="${index}" aria-label="Supprimer cette carte"><span class="material-symbols-outlined" aria-hidden="true">delete</span></button>` : ''}`;
      container.appendChild(card);
    });
    if (!people.length && !documentEditing) container.innerHTML = '<div class="archive-entity-empty">AUCUNE PERSONNE ENREGISTRÉE</div>';
    if (documentEditing) {
      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'archive-entity-add-zone';
      add.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">person_add</span><strong>AJOUTER ${type === 'civil' ? 'UN CIVIL OU UNE VICTIME' : 'UN SUSPECT'}</strong><small>Créer une carte personne</small>`;
      add.addEventListener('click', () => addPersonBlock(type));
      container.appendChild(add);
    }
  }

  function renderReportPeople(entry) {
    fillReportPeople('archive-report-suspects', entry.mission.suspects || [], 'DESCRIPTION DU SUSPECT NON RENSEIGNÉE', 'suspect');
    fillReportPeople('archive-report-civilians', entry.mission.civilians || [], 'DESCRIPTION DU CIVIL NON RENSEIGNÉE', 'civil');
  }

  function renderTimeline(entry) {
    const index = allMissions.indexOf(entry);
    const entries = [allMissions[(index - 1 + allMissions.length) % allMissions.length], entry, allMissions[(index + 1) % allMissions.length]];
    timelineCards.replaceChildren();
    entries.forEach((item, itemIndex) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `archive-timeline-card${itemIndex === 1 ? ' active' : ''}`;
      const thumb = safeImageSource(item.mission.thumb);
      card.innerHTML = `<small>${itemIndex === 0 ? 'Opération précédente' : itemIndex === 1 ? 'Opération actuelle' : 'Opération suivante'}</small><div>${thumb ? `<img src="${escapeHtml(thumb)}" alt="">` : ''}<span><strong>${escapeHtml(item.mission.name)}</strong><small>${escapeHtml(readableDate(item.mission.date))}</small><small>Liens établis</small></span></div><em>${itemIndex === 1 ? 'Rapport actuel' : 'Voir le rapport'}</em>`;
      card.addEventListener('click', () => openDetail(item));
      timelineCards.appendChild(card);
    });
  }

  function selectMission(entry) {
    activeEntry = entry;
    const { mission, dlc } = entry;
    const id = reportId(entry);
    document.getElementById('archive-side-title').textContent = mission.name;
    document.getElementById('archive-side-id').textContent = id;
    document.getElementById('archive-side-date').textContent = readableDate(mission.date);
    const status = statusFor(entry);
    document.getElementById('archive-side-status').innerHTML = `<span class="archive-status-dot ${status.className}"></span> ${status.label}`;
    document.getElementById('archive-report-title')?.removeAttribute('id');
    document.getElementById('archive-location-name').textContent = mission.name;
    document.getElementById('archive-report-id').textContent = id;
    document.querySelectorAll('.archive-page-footer-id').forEach(element => { element.textContent = `RÉF. ${id}`; });
    document.getElementById('archive-summary').textContent = mission.brief || `Intervention du LSPD menée dans le cadre de l’opération « ${mission.name} ». Les unités engagées ont sécurisé la zone, traité les menaces identifiées et placé les éléments collectés sous scellés.`;
    document.getElementById('archive-civilian-count').textContent = String((mission.civilians || []).length || 11);
    document.getElementById('archive-suspect-count').textContent = String((mission.suspects || []).length || 18);
    renderList(search.value);
    renderEvidence(entry);
    renderReportPeople(entry);
    renderTimeline(entry);
    applyDocumentOverrides();
    document.title = `${mission.name} · Archives LSPD`;
    app.dataset.dlc = dlc.id;
  }

  search.addEventListener('input', event => {
    if (currentView === 'reports') renderReportBrowser(event.target.value);
    else renderList(event.target.value);
  });
  agentToggle.addEventListener('click', () => {
    const willOpen = agentMenu.hidden;
    agentMenu.hidden = !willOpen;
    agentToggle.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) agentMenu.querySelector('[aria-selected="true"]')?.focus();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.archive-agent-switcher')) closeAgentMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !agentMenu.hidden) closeAgentMenu({ restoreFocus: true });
    if (event.key === 'Escape' && printBackground.classList.contains('open')) closePrintDialog();
  });
  document.getElementById('archive-settings').addEventListener('click', openSettingsPanel);
  document.querySelector('.archive-back').addEventListener('click', () => openReports());
  document.getElementById('archive-return').addEventListener('click', () => openReports());
  document.querySelector('.archive-brand').addEventListener('click', event => { event.preventDefault(); openReports('all'); });
  pageControl.addEventListener('click', () => goToPdfPage(currentPdfPage === 6 ? 1 : currentPdfPage + 1));
  zoomControl.addEventListener('click', () => { zoomIndex = (zoomIndex + 1) % zoomLevels.length; setPdfZoom(zoomLevels[zoomIndex]); });
  document.getElementById('archive-fit-control').addEventListener('click', () => {
    const scale = Math.min(1.2, Math.max(.5, (document.getElementById('archive-main-content').clientWidth - 64) / 842));
    pdfViewport.classList.remove('zoom-75', 'zoom-125');
    pdfViewport.classList.add('fit-width');
    pdfViewport.style.setProperty('--archive-fit-zoom', scale.toFixed(3));
    zoomControl.textContent = 'AJUSTÉ';
  });
  editControl.addEventListener('click', () => setDocumentEditing(!documentEditing));
  window.addEventListener('ron-lore:admin-changed', event => {
    if (!event.detail?.authenticated) setDocumentEditing(false);
    if (currentView === 'evidence') renderEvidenceModule();
    if (currentView === 'people') { renderPeopleTree(); renderPeople(activePeopleFilter); }
  });
  document.getElementById('archive-print-control').addEventListener('click', openPrintDialog);
  document.getElementById('archive-print-close').addEventListener('click', closePrintDialog);
  document.getElementById('archive-print-cancel').addEventListener('click', closePrintDialog);
  document.getElementById('archive-print-sent-close').addEventListener('click', closePrintDialog);
  printBackground.addEventListener('click', event => { if (event.target === printBackground) closePrintDialog(); });
  document.getElementById('archive-print-form').addEventListener('submit', event => {
    event.preventDefault();
    const printer = document.getElementById('archive-printer').value.split(' · ')[0];
    const jobId = `LS-${Date.now().toString().slice(-6)}`;
    document.getElementById('archive-print-job').textContent = jobId;
    document.getElementById('archive-print-destination').textContent = printer;
    document.getElementById('archive-print-title').textContent = 'Confirmation d’impression';
    document.getElementById('archive-print-dialog').classList.add('print-sent');
    document.getElementById('archive-print-sent-close').focus();
  });
  document.getElementById('archive-toolbar-export').addEventListener('click', downloadBlankPdf);
  document.getElementById('archive-export').addEventListener('click', downloadBlankPdf);
  document.querySelectorAll('[data-archive-tab]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.archiveTab === 'reports') { openReports(); return; }
    openModule(button.dataset.archiveTab);
  }));

  selectMission(activeEntry);
  const savedAgent = CONNECTED_AGENTS.find(agent => agent.id === activeAgentId) || CONNECTED_AGENTS[0];
  document.getElementById('archive-agent-name').textContent = savedAgent.name;
  document.getElementById('archive-agent-unit').textContent = savedAgent.unit;
  app.style.setProperty('--agent-accent', savedAgent.accent);
  document.documentElement.dataset.agentTheme = savedAgent.theme;
  renderAgentMenu();
  if (window.__ronLoreSteamCreators) applySteamCreatorPortraits(window.__ronLoreSteamCreators);
  else if (typeof loadSteamCreators === 'function') loadSteamCreators({ render: false });
  openReports('all');
  if (savedAgent.id === 'judge') openRestrictedAccess();
})();
