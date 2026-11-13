# Connect DigiBuzz enquiries to Google Sheets

1. Open the supplied Sheet and choose **Extensions → Apps Script**.
2. Paste `Code.gs`, save, select `setup`, and run it. Authorize your own script. It creates a separate **Enquiries** tab without changing your existing tabs.
3. In **Project Settings → Script properties**, copy the generated `DIGIBUZZ_SECRET` privately.
4. Choose **Deploy → New deployment → Web app**. Execute as **Me**, access **Anyone**. The receiver requires the shared secret, which stays on the website server. Deploy and copy the `/exec` URL (not `/dev`).
5. Add these server-side environment variables in Netlify:
   - `GOOGLE_SHEETS_WEB_APP_URL`: deployed `/exec` URL.
   - `GOOGLE_SHEETS_SHARED_SECRET`: the exact `DIGIBUZZ_SECRET` value.
   - `SITE_URL`: the full deployed site origin, e.g. `https://digibuzzmarketing.in`.
6. Deploy the updated website. Submit a clearly labelled test enquiry and verify one row appears in **Enquiries** and the browser shows success. Remove the test row afterwards if desired.

For local testing, put the same variables in `.env.local` and restart the server. Never commit secrets. After changing Apps Script, edit its deployment to use a new version.

The receiver checks a shared secret, preserves text instead of evaluating spreadsheet formulas, serializes concurrent writes, and deduplicates retries by submission ID. The website validates fields and only confirms success after the receiver acknowledges that same ID. A failed submission retains the visitor's answers.

Google references: https://developers.google.com/apps-script/guides/web and https://developers.google.com/apps-script/guides/content
