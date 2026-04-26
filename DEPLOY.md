# Deploy Guide

## Current app state

This project can be deployed as a Node web service right now.

The server already supports:

- `PORT` from the deployment platform
- `HOST` override
- static asset serving
- cookie-based login

## Important data note

The app currently stores all users, predictions, and results in:

`data/store.json`

That works well on your local machine, but many free hosts use an ephemeral filesystem.
On those hosts, file changes can disappear after restart, redeploy, or idle spin-down.

## Best deployment fit

### 1. Render Free Web Service

Good for:

- quick public test deployment
- free `onrender.com` URL
- simple Node deployment

Limits for this app:

- free services spin down on idle
- local filesystem is ephemeral
- `data/store.json` is not reliable long-term

Use this if you want a free public demo and can accept temporary or resettable data.

### 2. Railway Trial / Low-cost

Good for:

- easier always-on testing
- more server-like deployment

Limits for this app:

- not truly permanently free
- you should still move away from file storage for reliability

## Render deploy steps

1. Push this folder to GitHub.
2. Create a new Render Web Service from that repo.
3. Render should detect:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Deploy.
5. Share the generated `*.onrender.com` URL.

## Recommended next step for real public use

Before long-term public release, replace `data/store.json` with a real database.

Recommended path:

- free/cheap Postgres
- keep the same UI
- move users, predictions, bracket, settings, and results into DB tables

That will make the app safe for real deployment on platforms with ephemeral filesystems.
