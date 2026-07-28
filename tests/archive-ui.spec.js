const { test, expect } = require('@playwright/test');

test('archive UI renders and supports the primary mission flow', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.setViewportSize({ width: 1440, height: 1024 });
  await page.goto('file:///C:/Users/loric/OneDrive/02_Projets/VSCode/RoN_Lore/index.html');
  await page.evaluate(() => {
    localStorage.removeItem('ronLoreEvidenceRegistryV1');
    localStorage.removeItem('ronLorePeopleGroupBankV1');
    localStorage.removeItem('ronLorePeopleGroupLinksV1');
    localStorage.removeItem('ronLoreReportPersonRegistryV1');
    localStorage.removeItem('ronLoreA4CardSchemaVersion');
    localStorage.setItem('ronLoreA4DocumentsV1', JSON.stringify({ legacy: { records: { civil: [{ name: 'ANCIENNE CARTE' }] }, texts: { 'text-1': 'ANCIEN TEXTE' }, images: { 'civil-0': 'data:image/png;base64,old', 'evidence-0': 'data:image/png;base64,kept' } } }));
  });
  await page.reload();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ronLoreA4CardSchemaVersion'))).toBe('3');
  const migratedLegacyState = await page.evaluate(() => JSON.parse(localStorage.getItem('ronLoreA4DocumentsV1')).legacy);
  expect(migratedLegacyState.records).toBeUndefined();
  expect(migratedLegacyState.texts).toBeUndefined();
  expect(migratedLegacyState.images['civil-0']).toBeUndefined();
  expect(migratedLegacyState.images['evidence-0']).toBeUndefined();
  await page.evaluate(() => {
    localStorage.setItem('ronLoreA4DocumentsV1', JSON.stringify({
      'LS-ARCHIVE-OLD': { records: { civil: [{ name: 'Sharla Leighton', desc: 'Victime déjà enregistrée avant la synchronisation.' }] }, images: {} }
    }));
    localStorage.removeItem('ronLoreReportPersonRegistryV1');
  });
  await page.reload();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ronLoreReportPersonRegistryV1'))).toContain('Sharla Leighton');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ronLoreReportPersonRegistryV1'))).toContain('LS-ARCHIVE-OLD');
  await page.evaluate(() => {
    localStorage.setItem('ronLoreA4DocumentsV1', '{}');
    localStorage.setItem('ronLoreReportPersonRegistryV1', '[]');
  });
  await page.reload();
  await expect(page.locator('#archive-browser-title')).toHaveText('Toutes les missions');
  await expect(page.locator('.archive-report-row')).toHaveCount(32);

  await page.locator('#archive-settings').click();
  await expect(page.locator('#settings-bg')).toHaveClass(/open/);
  await expect(page.locator('#settings-page-tuto')).toHaveCount(0);
  await expect(page.locator('#settings-page-creators')).toHaveCount(0);
  await expect(page.locator('#settings-page-legal')).toHaveClass(/active/);
  await page.waitForTimeout(400);
  await page.screenshot({ path: '../assets/archive-settings-1440.png', fullPage: true });
  await page.locator('.settings-tab[data-settings-page="login"]').click();
  await expect(page.locator('#settings-page-login')).toHaveClass(/active/);
  await page.locator('#settings-close').click();
  await expect(page.locator('#settings-bg')).not.toHaveClass(/open/);

  await page.locator('#archive-agent-toggle').click();
  await expect(page.locator('.archive-agent-option')).toHaveCount(3);
  await page.locator('.archive-agent-option').filter({ hasText: 'JUDGE' }).click();
  await expect(page.locator('#archive-agent-name')).toHaveText('CDR. “JUDGE” BEAUMONT');
  await expect(page.locator('.archive-seizure-copy h1')).toHaveText('ACCÈS RÉVOQUÉ');
  await expect(page.locator('.archive-seizure-page')).toContainText('LS-FISA-26-0719-JB');
  await page.screenshot({ path: '../assets/archive-judge-fisa-revoked-1440.png', fullPage: true });
  await page.reload();
  await expect(page.locator('#archive-agent-name')).toHaveText('CDR. “JUDGE” BEAUMONT');
  await expect(page.locator('.archive-seizure-page')).toBeVisible();

  await page.locator('[data-archive-tab="reports"]').click();
  await expect(page.locator('.archive-seizure-page')).toBeVisible();
  await page.locator('#archive-agent-toggle').click();
  await page.locator('.archive-agent-option').filter({ hasText: 'AURUM' }).click();
  await expect(page.locator('#archive-browser-title')).toHaveText('Toutes les missions');
  await expect(page.locator('html')).toHaveAttribute('data-agent-theme', 'dark');
  await expect.poll(() => page.locator('.report-status .archive-status-dot').first()
    .evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(132, 56, 47)');
  await expect(page.locator('.report-status', { hasText: 'Confidentielle' })).toHaveCount(3);
  await expect(page.locator('.report-status .archive-status-dot.confidential')).toHaveCount(3);
  await expect.poll(() => page.locator('.report-status .archive-status-dot.confidential').first()
    .evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(115, 38, 115)');
  await expect.poll(() => page.locator('[data-archive-tab="reports"]')
    .evaluate(element => getComputedStyle(element, '::after').backgroundColor)).toBe('rgb(115, 83, 38)');

  await page.locator('[data-archive-tab="dashboard"]').click();
  await expect(page.locator('.archive-error-code')).toHaveText(/LSPD-OPS-7F3-503/);
  await page.screenshot({ path: '../assets/archive-dashboard-error-1440.png', fullPage: true });

  await page.locator('[data-archive-tab="people"]').click();
  await expect(page.locator('.archive-module-header h1')).toHaveText('Personnes');
  await expect(page.locator('[data-people-filter]')).toHaveCount(6);
  await expect(page.locator('[data-people-filter="police"] small')).toHaveText('61');
  await page.locator('[data-people-filter="active"]').click();
  await expect(page.locator('.archive-module-header h1')).toHaveText('Personnel en service');
  await expect(page.locator('.archive-memorial-row')).toHaveCount(2);
  await page.locator('[data-people-filter="memorial"]').click();
  await expect(page.locator('.archive-memorial-row')).toHaveCount(58);
  await page.locator('[data-people-filter="all"]').click();
  await expect(page.locator('.archive-memorial-head')).toContainText('Catégorie');
  await expect(page.locator('.archive-memorial-row')).toHaveCount(61);
  await expect(page.locator('.archive-memorial-portrait')).toHaveCount(59);
  await expect(page.locator('.archive-memorial-row').nth(2).locator('img')).toHaveAttribute('src', 'assets/people/judge.webp');
  await expect(page.locator('.archive-memorial-row').nth(2).locator('img')).toHaveCSS('filter', 'none');
  await expect(page.locator('.archive-memorial-portrait[src="assets/people/memorial-officer.webp"]')).toHaveCount(58);
  await expect(page.locator('.archive-memorial-portrait.deceased').first()).not.toHaveCSS('filter', 'none');
  await expect(page.locator('.archive-memorial-status')).toHaveCount(61);
  await expect(page.locator('.archive-memorial-row').first()).toContainText('LORIQUEEE');
  await expect(page.locator('.archive-memorial-row').nth(1)).toContainText('AURUM');
  await expect(page.locator('.archive-memorial-row').nth(2)).toContainText('David “Judge” Beaumont');
  await expect(page.locator('.archive-memorial-row').nth(2)).toContainText('Accès révoqué · FISA');
  await expect(page.locator('.archive-memorial-row').last()).toContainText('Carissa Begum');
  await page.screenshot({ path: '../assets/archive-memorial-people-1440.png', fullPage: true });
  await page.evaluate(() => setAdminAuthenticated(true, { allowRedirect: false }));
  await page.locator('#archive-people-group-name').fill('Los Locos');
  await page.locator('#archive-people-group-create').evaluate(form => form.requestSubmit());
  await page.locator('.archive-memorial-row').first().locator('.archive-person-category summary').click();
  await page.locator('.archive-memorial-row').first().locator('[data-person-group="Los Locos"]').click();
  await expect(page.locator('[data-people-filter="group:Los Locos"] small')).toHaveText('1');
  await page.locator('[data-people-filter="group:Los Locos"]').click();
  await expect(page.locator('.archive-memorial-row')).toHaveCount(1);
  await page.locator('[data-delete-people-group="Los Locos"]').click();
  await expect(page.locator('[data-people-filter="group:Los Locos"]')).toHaveCount(0);
  await page.evaluate(() => setAdminAuthenticated(false));
  await page.locator('[data-archive-tab="evidence"]').click();
  await expect(page.locator('.archive-evidence-card')).toHaveCount(0);
  await expect(page.locator('.archive-evidence-registry-empty')).toBeVisible();
  await page.evaluate(() => setAdminAuthenticated(true, { allowRedirect: false }));
  await expect(page.locator('.archive-evidence-registry-add')).toBeVisible();
  await page.locator('.archive-evidence-registry-add').click();
  await expect(page.locator('.archive-evidence-card')).toHaveCount(1);
  await page.locator('[data-evidence-field="name"]').fill('Téléphone saisi');
  await page.locator('[data-evidence-field="name"]').blur();
  await page.locator('.archive-evidence-tag-bank summary').click();
  await expect(page.locator('[data-evidence-tag]')).toHaveCount(17);
  await page.locator('[data-evidence-tag]').nth(0).click();
  await page.locator('.archive-evidence-tag-bank summary').click();
  await page.locator('[data-evidence-tag]').nth(1).click();
  await page.locator('.archive-evidence-tag-bank summary').click();
  await page.locator('[data-evidence-tag]').nth(2).click();
  await expect(page.locator('.archive-evidence-tags .tag')).toHaveCount(3);
  const registryFileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('.archive-evidence-image').click();
  const registryFileChooser = await registryFileChooserPromise;
  await registryFileChooser.setFiles({ name: 'preuve-registre.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64') });
  await expect(page.locator('.archive-evidence-card img')).toHaveAttribute('src', /^data:image\/png;base64,/);
  await page.locator('.archive-evidence-delete').click();
  await expect(page.locator('.archive-evidence-card')).toHaveCount(0);
  await page.evaluate(() => setAdminAuthenticated(false));
  await page.locator('[data-archive-tab="reports"]').click();
  await expect(page.locator('#archive-browser-title')).toHaveText('Toutes les missions');

  await page.locator('.archive-tree-button').filter({ hasText: 'Home Invasion' }).click();
  await expect(page.locator('#archive-browser-title')).toHaveText('Home Invasion');
  await expect(page.locator('.archive-report-row')).toHaveCount(3);

  await page.locator('#archive-search').fill('Dorms');
  await expect(page.locator('.archive-report-row')).toHaveCount(1);
  await page.locator('.archive-report-row').click();
  await expect(page.locator('#archive-side-title')).toHaveText('Dorms');
  await expect(page.locator('.archive-workspace')).toHaveClass(/detail-view/);

  await page.locator('#archive-return').click();
  await expect(page.locator('.archive-workspace')).not.toHaveClass(/detail-view/);
  await page.locator('#archive-search').fill('');
  await page.locator('.archive-tree-button').filter({ hasText: 'Toutes les missions' }).click();
  await page.screenshot({ path: '../assets/archive-reports-list-1440.png', fullPage: true });

  await page.locator('.archive-report-row').first().click();
  await expect(page.locator('#archive-side-title')).toHaveText('Thank You, Come Again');
  await expect.poll(async () => {
    const box = await page.locator('.archive-report').boundingBox();
    return box && { width: Math.round(box.width), height: Math.round(box.height) };
  }).toEqual({ width: 794, height: 1123 });
  await expect(page.locator('.archive-pdf-viewport')).toBeVisible();
  await expect(page.locator('.archive-pdf-viewport > article, .archive-pdf-viewport > section')).toHaveCount(6);
  await expect(page.locator('.archive-page-footer')).toHaveCount(6);
  await expect(page.locator('.archive-page-footer-id').first()).toContainText('LS-2026-');
  await expect(page.locator('#archive-civilians-page-title')).toHaveText('CIVILS ET VICTIMES');
  await expect(page.locator('#archive-suspects-page-title')).toHaveText('SUSPECTS');
  await expect(page.locator('.archive-record-card')).toHaveCount(0);
  await expect(page.locator('.archive-entity-empty')).toHaveCount(3);
  await expect(page.locator('#archive-evidence-strip figure')).toHaveCount(0);
  await expect(page.locator('#archive-analysis-page-title')).toHaveText('CHRONOLOGIE ET NOTES');
  await expect(page.locator('#archive-admin-page-title')).toHaveText('VALIDATION ADMINISTRATIVE');
  await page.screenshot({ path: '../assets/archive-implementation-1440.png', fullPage: true });

  await expect(page.locator('#archive-edit-control')).toBeHidden();
  await page.evaluate(() => setAdminAuthenticated(true, { allowRedirect: false }));
  await expect(page.locator('#archive-edit-control')).toBeVisible();
  await page.locator('#archive-edit-control').click();
  await expect(page.locator('#archive-app')).toHaveClass(/document-editing/);
  await expect(page.locator('#archive-document-editor')).toBeVisible();
  await expect(page.locator('#archive-related-editor')).toBeVisible();
  await page.locator('#archive-related-add').click();
  await expect(page.locator('#archive-mission-list .archive-related-row')).toHaveCount(4);
  await page.locator('#archive-mission-list .archive-related-remove').last().click();
  await expect(page.locator('#archive-mission-list .archive-related-row')).toHaveCount(3);
  await expect(page.locator('#archive-summary')).toHaveAttribute('contenteditable', 'true');
  await page.locator('#archive-summary').fill('Résumé administratif modifié pour validation.');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ronLoreA4DocumentsV1'))).toContain('Résumé administratif modifié');
  await page.locator('[data-document-block="civil"]').click();
  await expect(page.locator('#archive-report-civilians .archive-record-card').first()).toContainText('NOUVEAU CIVIL');
  await page.locator('#archive-report-civilians .archive-record-card strong').fill('Jane Doe');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ronLoreReportPersonRegistryV1'))).toContain('Jane Doe');
  await expect(page.locator('#archive-report-civilians .archive-entity-add-zone')).toBeVisible();
  await page.locator('#archive-report-civilians .archive-record-delete').click();
  await expect(page.locator('#archive-report-civilians .archive-record-card')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ronLoreReportPersonRegistryV1'))).toContain('Jane Doe');
  await page.locator('[data-document-block="evidence"]').click();
  await expect(page.locator('#archive-evidence-strip figure')).toHaveCount(1);
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('#archive-evidence-strip .archive-evidence-media').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles({ name: 'preuve-test.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64') });
  await expect(page.locator('#archive-evidence-strip figure').last().locator('img')).toHaveAttribute('src', /^data:image\/png;base64,/);
  await page.locator('#archive-evidence-strip .archive-record-delete').click();
  await expect(page.locator('#archive-evidence-strip figure')).toHaveCount(0);
  await page.evaluate(() => setAdminAuthenticated(false));
  await expect(page.locator('#archive-edit-control')).toBeHidden();
  await expect(page.locator('#archive-app')).not.toHaveClass(/document-editing/);
  await expect(page.locator('#archive-summary')).not.toHaveAttribute('contenteditable', 'true');

  await page.locator('#archive-print-control').click();
  await expect(page.locator('#archive-print-bg')).toHaveClass(/open/);
  await expect(page.locator('#archive-printer option')).toHaveCount(4);
  await page.screenshot({ path: '../assets/archive-print-dialog-1440.png', fullPage: true });
  await page.locator('#archive-print-form').evaluate(form => form.requestSubmit());
  await expect(page.locator('#archive-print-dialog')).toHaveClass(/print-sent/);
  await expect(page.locator('#archive-print-sent h3')).toHaveText('IMPRESSION ENVOYÉE');
  await expect(page.locator('#archive-print-destination')).toHaveText('LSPD-HQ-PRINT-03');
  await expect(page.locator('#archive-print-job')).toHaveText(/^LS-\d{6}$/);
  await page.screenshot({ path: '../assets/archive-print-sent-1440.png', fullPage: true });
  await page.locator('#archive-print-sent-close').click();
  await expect(page.locator('#archive-print-bg')).not.toHaveClass(/open/);

  await page.locator('#archive-page-control').click();
  await expect(page.locator('#archive-page-control')).toHaveText('5');
  await page.locator('#archive-zoom-control').click();
  await expect(page.locator('#archive-zoom-control')).toHaveText('125%');
  await page.locator('#archive-fit-control').click();
  await expect(page.locator('#archive-zoom-control')).toHaveText('AJUSTÉ');

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#archive-toolbar-export').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^LSPD_ARCHIVE_LS-.+_DIFFUSION-RESTREINTE\.pdf$/);
  const pdfStream = await download.createReadStream();
  const pdfChunks = [];
  for await (const chunk of pdfStream) pdfChunks.push(chunk);
  const exportedPdf = Buffer.concat(pdfChunks).toString('latin1');
  expect(exportedPdf).toContain('/Kids [] /Count 0');
  expect(exportedPdf).not.toMatch(/\/Type \/Page\b/);

  await page.locator('#archive-agent-toggle').click();
  await page.locator('.archive-agent-option').filter({ hasText: 'LORIQUEEE' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-agent-theme', 'light');
  await expect.poll(() => page.locator('[data-archive-tab="reports"]')
    .evaluate(element => getComputedStyle(element, '::after').backgroundColor)).toBe('rgb(115, 83, 38)');
  await page.locator('[data-archive-tab="people"]').click();
  await expect(page.locator('.archive-memorial-row')).toHaveCount(62);
  await expect(page.locator('.archive-memorial-row').filter({ hasText: 'Jane Doe' })).toContainText('Origine · LS-2026-');
  await page.locator('.archive-memorial-row').filter({ hasText: 'Jane Doe' }).click();
  await expect(page.locator('#archive-side-title')).toHaveText('Thank You, Come Again');
  await expect(page.locator('#archive-app')).toHaveClass(/detail-view/);
  const unexpectedErrors = consoleErrors.filter(message => !message.includes('ron-lore-backend.onrender.com') && !message.includes('net::ERR_FAILED'));
  expect(unexpectedErrors).toEqual([]);
});
