const { test, expect } = require('@playwright/test');

test('archive UI renders and supports the primary mission flow', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.setViewportSize({ width: 1440, height: 1024 });
  await page.goto('file:///C:/Users/loric/OneDrive/02_Projets/VSCode/RoN_Lore/index.html');
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
  await page.locator('[data-archive-tab="evidence"]').click();
  await expect(page.locator('.archive-evidence-card')).toHaveCount(32);
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
  await page.screenshot({ path: '../assets/archive-implementation-1440.png', fullPage: true });

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
  await expect(page.locator('#archive-page-control')).toHaveText('2');
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
  const unexpectedErrors = consoleErrors.filter(message => !message.includes('ron-lore-backend.onrender.com') && !message.includes('net::ERR_FAILED'));
  expect(unexpectedErrors).toEqual([]);
});
