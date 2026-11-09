# ScoutAI Phase 0: Safe Backup & Baseline Report

**Execution Timestamp:** 2026-11-09 14:45 IST  
**Environment / OS:** Windows (PowerShell)  
**Project Path:** `C:\Users\kartik\.gemini\antigravity\scratch\scoutai`  
**Live Site URL:** `https://k39139215-gif.github.io/scoutai`  

---

## 1. Initial State Recording

| Item | Recorded Value |
|---|---|
| **Remote URL** | `https://github.com/k39139215-gif/scoutai.git` |
| **Initial Working Branch** | `main` |
| **Deployed HEAD SHA** | `32600478a132d15dd40baaf46c5553a80d7b5b87` |
| **Commit Message** | `feat(studio): add column presets, bidirectional Kanban progression, and live neural audit trail` |
| **GitHub Pages Source** | Branch `origin/gh-pages`, root directory `/` |
| **gh-pages Commit** | `89d4f7d11562e83af2683a648b46acbc72f1ecdf` (*Deploy v2.5 with column presets, bidirectional Kanban, and live neural audit trail*) |
| **Uncommitted Working Changes** | Staged & committed to branch `backup/pre-redesign-wip` (commit SHA `37711ed`) |
| **Redesign Working Branch** | `redesign/ui-polish` (branched from deployed commit `3260047`) |

---

## 2. Git Tagging and Remote Backup Branches

The following immutable tag and backup branches were created and pushed to `origin`:

1. **Immutable Annotated Git Tag:**
   - Tag Name: `pre-redesign-20261109`
   - Tag Message: `"Baseline before ScoutAI UI redesign and polish"`
   - Tag SHA: `de0fce02420d91a6f030106e57b5f14e3c435645`
   - Pointing to Commit: `32600478a132d15dd40baaf46c5553a80d7b5b87`
   - Pushed: `git push origin pre-redesign-20261109` (Verified)

2. **Pre-Redesign Clean Branch:**
   - Branch Name: `backup/pre-redesign`
   - Target Commit: `32600478a132d15dd40baaf46c5553a80d7b5b87`
   - Pushed: `git push origin backup/pre-redesign` (Verified)

3. **Pre-Redesign WIP Branch:**
   - Branch Name: `backup/pre-redesign-wip`
   - Target Commit: `37711ed` (Preserved uncommitted changes in `src/views/TalentStudioView.tsx` and `tests/studio.test.js`)
   - Pushed: `git push origin backup/pre-redesign-wip` (Verified)

---

## 3. Out-of-Repo Zip Copies

Independent zip archives were generated and placed **outside** the project folder in `C:\Users\kartik\.gemini\antigravity\scratch\scoutai_backups_20261109\`:

| Archive Name | Full Path | File Size | Contents |
|---|---|---|---|
| **Source Working Tree Archive** | `C:\Users\kartik\.gemini\antigravity\scratch\scoutai_backups_20261109\scoutai-source-pre-redesign-20261109.zip` | 13,358,225 bytes (12.74 MB) | Full project tree at tag `pre-redesign-20261109` including `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `src/`, `public/`, `tests/`, excluding `node_modules` and build output. |
| **Deployed Build Output Archive** | `C:\Users\kartik\.gemini\antigravity\scratch\scoutai_backups_20261109\scoutai-deployed-gh-pages-20261109.zip` | 12,599,856 bytes (12.02 MB) | Complete files served on GitHub Pages (`origin/gh-pages`), including `index.html`, `assets/`, `references/`, `.nojekyll`, and `favicon.svg`. |

---

## 4. Backup Verification Test

To verify recovery fidelity from tag `pre-redesign-20261109`:
1. Cloned tag into a clean external directory:
   ```powershell
   git clone --branch pre-redesign-20261109 --depth 1 https://github.com/k39139215-gif/scoutai.git C:\Users\kartik\.gemini\antigravity\scratch\scoutai-backup-verify-temp
   ```
2. Executed dependency installation:
   ```powershell
   npm ci
   ```
   *Result:* Added 28 packages, 0 errors.
3. Executed build:
   ```powershell
   npm run build
   ```
   *Result:* TypeScript and Vite build completed successfully in 1.14s:
   - `dist/index.html` (0.95 kB)
   - `dist/assets/index-BmFaDVCt.css` (12.79 kB)
   - `dist/assets/index-CZOz6rJS.js` (604.75 kB)
   *(Exact asset hashes matched the deployed live site)*.
4. Executed preview server & verified HTTP response:
   - Preview port: `4173`
   - HTTP Status: `200 OK`
   - Content verified: ScoutAI root HTML document served cleanly.

---

## 5. Visual Baseline & State Snapshot

Automated visual baseline captured using Playwright across both desktop (1440x900) and mobile (390x844) viewports for all 14 application views, stored in `/baseline/` (outside `src`):

### Desktop Captures (1440x900)
- `baseline/desktop/01-dashboard.png` (170 kB)
- `baseline/desktop/02-job-requisitions.png` (187 kB)
- `baseline/desktop/03-candidates-directory.png` (187 kB)
- `baseline/desktop/04-talent-studio.png` (210 kB)
- `baseline/desktop/05-candidate-matching.png` (174 kB)
- `baseline/desktop/06-outreach-cadence.png` (187 kB)
- `baseline/desktop/07-interviews-schedule.png` (114 kB)
- `baseline/desktop/08-recruitment-tasks.png` (132 kB)
- `baseline/desktop/09-ai-audit-trail.png` (150 kB)
- `baseline/desktop/10-pipeline-analytics.png` (153 kB)
- `baseline/desktop/11-client-accounts.png` (150 kB)
- `baseline/desktop/12-data-compliance-gdpr.png` (144 kB)
- `baseline/desktop/13-security-access.png` (185 kB)
- `baseline/desktop/14-system-settings.png` (95 kB)

### Mobile Captures (390x844)
- `baseline/mobile/01-dashboard.png` (53 kB)
- `baseline/mobile/02-job-requisitions.png` (86 kB)
- `baseline/mobile/03-candidates-directory.png` (62 kB)
- `baseline/mobile/04-talent-studio.png` (73 kB)
- `baseline/mobile/05-candidate-matching.png` (69 kB)
- `baseline/mobile/06-outreach-cadence.png` (71 kB)
- `baseline/mobile/07-interviews-schedule.png` (72 kB)
- `baseline/mobile/08-recruitment-tasks.png` (57 kB)
- `baseline/mobile/09-ai-audit-trail.png` (77 kB)
- `baseline/mobile/10-pipeline-analytics.png` (59 kB)
- `baseline/mobile/11-client-accounts.png` (65 kB)
- `baseline/mobile/12-data-compliance-gdpr.png` (67 kB)
- `baseline/mobile/13-security-access.png` (69 kB)
- `baseline/mobile/14-system-settings.png` (56 kB)

### Exported Demo State
- Saved to: `baseline/demo-data-state.json` (29.5 kB)
- Keys preserved:
  - `scoutai_prototype_store_v1_jobs`
  - `scoutai_prototype_store_v1_candidates`
  - `scoutai_prototype_store_v1_outreach`
  - `scoutai_prototype_store_v1_interviews`
  - `scoutai_prototype_store_v1_tasks`
  - `scoutai_prototype_store_v1_aiActivity`
  - `scoutai_prototype_store_v1_clients`
  - `scoutai_prototype_store_v1_privacyRequests`
  - `scoutai_prototype_store_v1_securityAudit`
  - `scoutai_prototype_store_v1_settings`

---

## 6. Rollback Procedures

If an immediate rollback to the pre-redesign baseline is required at any time, execute the following commands:

### A. Restore Local Working Tree from Tag
```powershell
cd C:\Users\kartik\.gemini\antigravity\scratch\scoutai
git fetch origin
# To reset working branch back to baseline tag:
git checkout pre-redesign-20261109
# Or reset redesign/ui-polish back to baseline tag:
git checkout redesign/ui-polish
git reset --hard pre-redesign-20261109
```

### B. Redeploy Original Pre-Redesign Build to GitHub Pages
If the live GitHub Pages site needs to be restored to the pre-redesign build:
```powershell
cd C:\Users\kartik\.gemini\antigravity\scratch\scoutai

# Option 1: Using the archived deployed zip
$archive = "C:\Users\kartik\.gemini\antigravity\scratch\scoutai_backups_20261109\scoutai-deployed-gh-pages-20261109.zip"
$tempRestore = "C:\Users\kartik\.gemini\antigravity\scratch\restore-gh-pages"
Expand-Archive -Path $archive -DestinationPath $tempRestore -Force
git checkout gh-pages
# Copy extracted files over gh-pages tree, commit, and push:
Copy-Item -Path "$tempRestore\*" -Destination . -Recurse -Force
git add -A
git commit -m "rollback: restore pre-redesign gh-pages build"
git push origin gh-pages

# Option 2: Direct reset of gh-pages to previous commit 89d4f7d
git checkout gh-pages
git reset --hard 89d4f7d11562e83af2683a648b46acbc72f1ecdf
git push --force origin gh-pages
```

### C. Restore Demo Data / LocalStorage
To restore the browser demo data to the initial baseline state:
1. Open the ScoutAI application in your browser.
2. Open Developer Tools (F12) -> Console.
3. Either:
   - Run: `localStorage.clear(); location.reload();` (re-initializes to pristine baseline demo defaults)
   - Or paste the contents of `baseline/demo-data-state.json` via:
     ```javascript
     const state = /* paste JSON from baseline/demo-data-state.json */;
     Object.entries(state).forEach(([k, v]) => localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)));
     location.reload();
     ```
