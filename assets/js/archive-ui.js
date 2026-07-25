(() => {
  const app = document.getElementById('archive-app');
  if (!app || typeof DATA === 'undefined') return;

  const allMissions = DATA.flatMap(dlc => dlc.missions.map(mission => ({ dlc, mission })));
  const list = document.getElementById('archive-mission-list');
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
      option.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">badge</span><span><strong>${agent.name}</strong><small>${agent.unit}</small></span>${agent.id === activeAgentId ? '<span class="material-symbols-outlined archive-agent-check" aria-hidden="true">check</span>' : '<span></span>'}`;
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
      card.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">folder</span><h2>${dlc.name}</h2><p>${dlc.missions.length} rapport${dlc.missions.length > 1 ? 's' : ''} de mission · Ouvrir la collection</p>`;
      card.addEventListener('click', () => openReports(dlc.id));
      container.appendChild(card);
    });
  }

  function renderPeople() {
    const reportPeopleByName = new Map();
    allMissions.forEach(({ dlc, mission }) => {
      [...(mission.civilians || []).map(person => ({ ...person, category: 'Civil / Victime' })), ...(mission.suspects || []).map(person => ({ ...person, category: 'Suspect' }))].forEach(person => {
        if (!person.name) return;
        const key = person.name.trim().toLowerCase();
        if (!reportPeopleByName.has(key)) reportPeopleByName.set(key, { ...person, dlc, mission });
      });
    });
    const registeredPeople = [
      ...REGISTERED_LSPD_PERSONNEL,
      ...MEMORIAL_PERSONNEL.map(person => ({ ...person, category: 'Personnel LSPD', status: 'Décédé en service', statusClass: 'deceased', portrait: 'assets/people/memorial-officer.webp' })),
      ...[...reportPeopleByName.values()].map((person, index) => ({ ...person, id: `PER-${String(index + 1).padStart(3, '0')}`, status: person.category === 'Suspect' ? 'Répertorié' : 'Associé à un dossier', statusClass: person.category === 'Suspect' ? 'suspect' : 'civil' }))
    ];
    moduleMain.innerHTML = `${moduleHeader('Registre central du LSPD', 'Personnes', 'Personnel, civils, victimes et suspects enregistrés dans les archives de Los Sueños.', registeredPeople.length)}<div class="archive-memorial-head" aria-hidden="true"><span>Portrait</span><span>Référence</span><span>Identité</span><span>Catégorie</span><span>Statut</span></div><div class="archive-module-list" id="archive-people-list"></div>`;
    const container = document.getElementById('archive-people-list');
    registeredPeople.forEach(person => {
      const row = document.createElement('div');
      row.className = 'archive-module-row archive-memorial-row';
      row.innerHTML = `${person.portrait ? `<img class="archive-memorial-portrait${person.statusClass === 'deceased' ? ' deceased' : ''}" src="${person.portrait}" alt="Portrait de ${person.name}">` : '<span class="archive-person-placeholder material-symbols-outlined" aria-hidden="true">person</span>'}<small>${person.id}</small><strong>${person.name}${person.uncertain ? '<sup title="Inscription partiellement masquée">†</sup>' : ''}</strong><span>${person.category}${person.rank ? ` · ${person.rank}` : ''}</span><span class="archive-memorial-status ${person.statusClass}"><i class="archive-status-dot"></i> ${person.status}</span>`;
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
      row.innerHTML = `${entry.mission.thumb ? `<img src="${entry.mission.thumb}" alt="">` : '<span class="material-symbols-outlined" aria-hidden="true">location_on</span>'}<strong>${entry.mission.name}</strong><span>${entry.dlc.name}</span><small>District ${pad((index % 9) + 1)} · Los Sueños</small>`;
      row.addEventListener('click', () => openDetail(entry));
      container.appendChild(row);
    });
  }

  function renderEvidenceModule() {
    const evidenceEntries = allMissions.filter(entry => entry.mission.thumb);
    moduleMain.innerHTML = `${moduleHeader('Evidence Unit', 'Inventaire des preuves', 'Photographies de scène et pièces visuelles indexées par opération.', evidenceEntries.length)}<div class="archive-evidence-grid" id="archive-evidence-grid"></div>`;
    const container = document.getElementById('archive-evidence-grid');
    evidenceEntries.forEach((entry, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'archive-evidence-card';
      card.innerHTML = `<img src="${entry.mission.thumb}" alt="Preuve associée à ${entry.mission.name}"><div><strong>${entry.mission.name}</strong><small>EV-${pad(index + 1)} · ${entry.dlc.name}</small></div>`;
      card.addEventListener('click', () => openDetail(entry));
      container.appendChild(card);
    });
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
      button.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">${collection.id === 'all' ? 'inventory_2' : 'folder'}</span><strong>${collection.name}</strong><small>${collection.missions.length}</small>`;
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
      row.innerHTML = `<span class="report-number">${reportId(entry)}</span><span class="report-mission">${entry.mission.thumb ? `<img src="${entry.mission.thumb}" alt="">` : ''}<strong>${entry.mission.name}</strong></span><span class="report-collection">${entry.dlc.name}</span><span class="report-date">${readableDate(entry.mission.date)}</span><span class="report-status"><i class="archive-status-dot ${status.className}"></i> ${status.label}</span>`;
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
    button.innerHTML = `${entry.mission.thumb ? `<img src="${entry.mission.thumb}" alt="">` : ''}<span><strong>${entry.mission.name}</strong><small>${readableDate(entry.mission.date)}</small><small>STATUT : ${status.label.toUpperCase()}</small></span>`;
    button.addEventListener('click', () => openDetail(entry));
    return button;
  };

  const printBackground = document.getElementById('archive-print-bg');
  const pdfViewport = document.querySelector('.archive-pdf-viewport');
  const pageControl = document.getElementById('archive-page-control');
  const zoomControl = document.getElementById('archive-zoom-control');
  const pdfPages = [...pdfViewport.children];
  let currentPdfPage = 1;
  let zoomIndex = 1;
  const zoomLevels = [75, 100, 125];

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

  function renderList(query = '') {
    list.replaceChildren();
    const normalized = query.trim().toLowerCase();
    const related = allMissions.filter(entry => !normalized || entry.mission.name.toLowerCase().includes(normalized) || entry.dlc.name.toLowerCase().includes(normalized));
    const visible = normalized ? related.slice(0, 8) : [activeEntry, ...allMissions.filter(entry => entry !== activeEntry).slice(0, 2)];
    visible.forEach(entry => list.appendChild(makeMissionButton(entry)));
    document.getElementById('archive-related-count').textContent = String(visible.length);
  }

  function renderEvidence(entry) {
    const sources = [entry.mission.thumb, ...allMissions.filter(item => item !== entry).slice(0, 4).map(item => item.mission.thumb)].filter(Boolean);
    const labels = ['Photo de scène', 'Pièce saisie', 'Registre comptable', 'Appareil électronique', 'Zone de stockage'];
    evidenceStrip.replaceChildren();
    sources.slice(0, 5).forEach((src, index) => {
      const figure = document.createElement('figure');
      figure.innerHTML = `<img src="${src}" alt="${labels[index]}"><figcaption>${labels[index]}<small>Réf. EV-2026-07-24-00${index + 1}</small></figcaption>`;
      evidenceStrip.appendChild(figure);
    });
  }

  function renderTimeline(entry) {
    const index = allMissions.indexOf(entry);
    const entries = [allMissions[(index - 1 + allMissions.length) % allMissions.length], entry, allMissions[(index + 1) % allMissions.length]];
    timelineCards.replaceChildren();
    entries.forEach((item, itemIndex) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `archive-timeline-card${itemIndex === 1 ? ' active' : ''}`;
      card.innerHTML = `<small>${itemIndex === 0 ? 'Opération précédente' : itemIndex === 1 ? 'Opération actuelle' : 'Opération suivante'}</small><div>${item.mission.thumb ? `<img src="${item.mission.thumb}" alt="">` : ''}<span><strong>${item.mission.name}</strong><small>${readableDate(item.mission.date)}</small><small>Liens établis</small></span></div><em>${itemIndex === 1 ? 'Rapport actuel' : 'Voir le rapport'}</em>`;
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
    document.getElementById('archive-summary').textContent = mission.brief || `Intervention du LSPD menée dans le cadre de l’opération « ${mission.name} ». Les unités engagées ont sécurisé la zone, traité les menaces identifiées et placé les éléments collectés sous scellés.`;
    document.getElementById('archive-civilian-count').textContent = String((mission.civilians || []).length || 11);
    document.getElementById('archive-suspect-count').textContent = String((mission.suspects || []).length || 18);
    renderList(search.value);
    renderEvidence(entry);
    renderTimeline(entry);
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
  document.getElementById('archive-open-evidence').addEventListener('click', () => openModal(activeEntry.mission, activeEntry.dlc));
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
