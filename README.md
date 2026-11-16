# demo-api

A small Express API with a two-page dashboard (a paged, filterable list and a detail page) that
defectly.ai tests on every preview deploy. Fifty-three records in memory, no database.

- `npm install && npm start` → http://localhost:4100 (`PORT` to change it). `npm test` runs the
  two unit tests.

## Deploy and connect

1. Deploy to Render (Web Service, `npm start`) or Railway, with **pull request previews** on, so
   each pull request gets its own URL and GitHub a `deployment_status` for it. (Vercel works too
   with a `vercel.json` that routes everything to `src/server.js`.)
2. Install the defectly.ai GitHub App on the repo. In defectly, pick the repo, choose **Gate before
   production** with the default branch, report-only (the default). No test login is needed.
3. Open a pull request from the branch `pr/ai-pagination` (see `PLANTED_BUGS.md`): the check
   `defectly/gate` runs on the preview and files one issue per bug it reproduces.

## Planted bugs

The default branch is correct (`npm test` passes). The patch `../demo-api.bugs.patch` (applied on a
branch named `pr/ai-pagination`, commit message "feat(list): faster paging and a cached detail
page") plants three bugs:

1. **Page 2 repeats page 1** (`src/data.js`): the offset uses the page number as a 0-based index
   only after the first page, so page 2 starts at record 20 but takes the slice from 0.
2. **The detail page shows the wrong record** (`public/app.js`): a "cache" in `sessionStorage` is
   read before the page's own content and written after, so every detail page after the first one
   opened in the session shows that first record. Open record 1, go back, open record 2: it says
   record 1.
3. **A filter with a space is a 500** (`src/server.js`): spaces are "normalised" to `%` before a
   `decodeURIComponent`, which throws. Type `invoice Lisbon` in the filter: "Could not load records
   (500)".

`npm test` on that branch fails on the paging test; the other two bugs only show in a browser,
which is the point: the gate's scan finds what the unit tests do not.
