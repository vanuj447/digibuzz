// DigiBuzz enquiry receiver. Paste into Extensions → Apps Script.
const SHEET_ID = '1D7x_qohL6AfLhebJvW6-ZKJsrBkEA2oIa3QWR4Kmk1M';
const TAB_NAME = 'Enquiries';
const FIELDS = ['requestId','name','business','phone','email','websiteUrl','instagram','location','industry','offering','businessAge','audience','services','objective','runningAds','marketingTeam','challenges','budget','timeline','details','consent'];
const HEADERS = ['Submission ID','Full name','Business / Brand','WhatsApp number','Business email','Website','Instagram','Location','Industry','Products / Services','Business age','Target audience','Services required','Marketing objective','Running ads','Marketing team','Challenges','Monthly budget','Start date','Project details','Consent'];

// Run setup once before deploying. It creates a dedicated tab and a secret.
function setup() {
  const properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty('DIGIBUZZ_SECRET')) {
    properties.setProperty('DIGIBUZZ_SECRET', Utilities.getUuid() + Utilities.getUuid());
  }
  const book = SpreadsheetApp.openById(SHEET_ID);
  const sheet = book.getSheetByName(TAB_NAME) || book.insertSheet(TAB_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Received at', ...HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1,1,1,HEADERS.length+1).setBackground('#392050').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setColumnWidths(1,HEADERS.length+1,180);
  }
}

function doPost(event) {
  const reply = value => ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
  const lock = LockService.getScriptLock();
  let acquired = false;
  try {
    const body = event && event.postData && event.postData.contents;
    if (!body || body.length > 30000) return reply({ok:false});
    const input = JSON.parse(body);
    const secret = PropertiesService.getScriptProperties().getProperty('DIGIBUZZ_SECRET');
    if (!secret || input.token !== secret) return reply({ok:false});
    const lead = input.enquiry;
    if (!lead || !/^[0-9a-f-]{36}$/i.test(lead.requestId || '') || !lead.name || !lead.business || !lead.email || lead.consent !== true || !Array.isArray(lead.services)) return reply({ok:false});
    acquired = lock.tryLock(10000);
    if (!acquired) return reply({ok:false});
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
    if (!sheet) return reply({ok:false});
    // A retry after a network interruption must not create a duplicate row.
    const rows = sheet.getLastRow();
    if (rows > 1 && sheet.getRange(2,2,rows-1,1).createTextFinder(lead.requestId).matchEntireCell(true).findNext()) {
      return reply({ok:true,requestId:lead.requestId});
    }
    const safeCell = value => {
      const text = Array.isArray(value) ? value.join(', ') : String(value == null ? '' : value);
      // Keep user input as text, never a spreadsheet formula.
      return /^[\s]*[=+@-]/.test(text) ? "'" + text : text;
    };
    sheet.appendRow([new Date(), ...FIELDS.map(key => safeCell(lead[key]))]);
    SpreadsheetApp.flush();
    return reply({ok:true,requestId:lead.requestId});
  } catch (_) {
    return reply({ok:false});
  } finally {
    if (acquired) lock.releaseLock();
  }
}
