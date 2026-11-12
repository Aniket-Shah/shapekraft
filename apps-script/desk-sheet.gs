/**
 * ShapeKraft Quote Desk — Google Sheet store.
 *
 * Setup (5 minutes):
 * 1. Create a Google Sheet called "ShapeKraft Quote Desk".
 * 2. Extensions → Apps Script. Replace everything with this file. Save.
 * 3. Project Settings (gear) → Script Properties → add
 *      DESK_SHEET_TOKEN = <a long random string>
 * 4. Deploy → New deployment → type "Web app"
 *      Execute as: Me · Who has access: Anyone → Deploy → copy the /exec URL.
 * 5. In Vercel set DESK_SHEET_URL = that URL and DESK_SHEET_TOKEN = the same string.
 * After editing this script, use Deploy → Manage deployments → Edit → New version.
 */

const SHEET_NAME = 'Desk';
const COLUMNS = [
  'id', 'receivedAt', 'channel', 'name', 'email', 'phone', 'subject', 'message',
  'intent', 'summary', 'packageLabel', 'currency', 'setup', 'monthly',
  'replySubject', 'replyBody', 'status', 'messageId', 'telegramMessageId', 'updatedAt', 'note',
];
const NUMBERS = ['setup', 'monthly'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(COLUMNS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function findRow_(sh, id) {
  const ids = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
  for (let i = ids.length - 1; i >= 0; i--) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}

function toRecord_(values) {
  const r = {};
  COLUMNS.forEach((c, i) => { r[c] = NUMBERS.indexOf(c) >= 0 ? Number(values[i]) || 0 : String(values[i] ?? ''); });
  return r;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const token = PropertiesService.getScriptProperties().getProperty('DESK_SHEET_TOKEN');
    if (!token || body.token !== token) return json_({ ok: false, error: 'unauthorized' });
    const sh = sheet_();

    if (body.action === 'append') {
      // Prefix "'" stops Sheets from treating text that starts with = + - @ as a formula.
      const safe = (v) => (typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v);
      sh.appendRow(COLUMNS.map((c) => safe(body.record[c] ?? '')));
      return json_({ ok: true });
    }
    if (body.action === 'get') {
      const row = findRow_(sh, body.id);
      if (row < 0) return json_({ ok: true, record: null });
      return json_({ ok: true, record: toRecord_(sh.getRange(row, 1, 1, COLUMNS.length).getValues()[0]) });
    }
    if (body.action === 'update') {
      const row = findRow_(sh, body.id);
      if (row < 0) return json_({ ok: false, error: 'not found' });
      Object.keys(body.fields || {}).forEach((key) => {
        const col = COLUMNS.indexOf(key);
        if (col >= 0) sh.getRange(row, col + 1).setValue(body.fields[key]);
      });
      return json_({ ok: true });
    }
    return json_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
